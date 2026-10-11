import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_HH,
  OBSTACLE_HW,
  OBSTACLE_SPIN_RATE,
  OBSTACLE_SWAY_AMP,
  OBSTACLE_SWAY_PERIOD,
  PAUSE_ITEMS,
  PADDLE_HALF,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  SPEED_CAP,
  SPEED_MULT,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";
export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";
export type Mode = "solo" | "versus";
export type Side = "left" | "right";
export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}
export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}
export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}
export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}
export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
  readonly theta: number;
}
export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];
  readonly obstacleClock: number;
  readonly obstacleClockRunning: boolean;
  readonly simTime: number;
  readonly muted: boolean;
}
export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}
export interface Snapshot {
  readonly version: number;
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: CaromState["score"];
  readonly winner: Side | null;
  readonly muted: boolean;
  readonly paddles: CaromState["paddles"];
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball: (BallState & { readonly speed: number }) | null;
  readonly obstacles: readonly ObstacleState[];
  readonly obstacleClock: number;
  readonly obstacleClockRunning: boolean;
  readonly simTime: number;
}
export interface CaromDebugApi {
  readonly version: number;
  snapshot(s: DeepReadonly<CaromState>): Snapshot;
  menuItemRect(s: DeepReadonly<CaromState>, i: number): Rect | null;
  clearWorld(s: DeepReadonly<CaromState>): CaromState;
  spawnBall(s: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(s: DeepReadonly<CaromState>, i: number): CaromState;
  reset(s: DeepReadonly<CaromState>): CaromState;
  reconcile(s: DeepReadonly<CaromState>): CaromState;
  setScreen(s: DeepReadonly<CaromState>, v: Screen): CaromState;
  setMode(s: DeepReadonly<CaromState>, v: Mode): CaromState;
  setMenuIndex(s: DeepReadonly<CaromState>, v: number): CaromState;
  setTitleIndex(s: DeepReadonly<CaromState>, v: number): CaromState;
  setResumeScreen(
    s: DeepReadonly<CaromState>,
    v: "countdown" | "playing",
  ): CaromState;
  setScore(s: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(s: DeepReadonly<CaromState>, v: Side | null): CaromState;
  setReceiver(s: DeepReadonly<CaromState>, v: Side): CaromState;
  setPaddleCy(s: DeepReadonly<CaromState>, side: Side, v: number): CaromState;
  setPaddleVy(s: DeepReadonly<CaromState>, side: Side, v: number): CaromState;
  setPaddleDriven(
    s: DeepReadonly<CaromState>,
    side: Side,
    v: boolean,
  ): CaromState;
  setBallPosition(
    s: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    s: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(s: DeepReadonly<CaromState>, v: number): CaromState;
  setBallHeld(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  setBallHoldTimer(s: DeepReadonly<CaromState>, v: number): CaromState;
  setBallServeSign(s: DeepReadonly<CaromState>, v: 1 | -1): CaromState;
  drawBallServeSign(s: DeepReadonly<CaromState>): CaromState;
  setAiTracking(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  setAiMovement(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  setMuted(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  setObstacleClock(s: DeepReadonly<CaromState>, v: number): CaromState;
  setObstacleClockRunning(s: DeepReadonly<CaromState>, v: boolean): CaromState;
}
export const BACKGROUND = "#08111f";
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const pose = (i: number, t: number): ObstacleState => ({
  index: i,
  cx: OBSTACLE_CENTERS[i]!.x,
  cy:
    OBSTACLE_CENTERS[i]!.y +
    (i === 0 ? 1 : -1) *
      OBSTACLE_SWAY_AMP *
      Math.sin((2 * Math.PI * t) / OBSTACLE_SWAY_PERIOD),
  theta: OBSTACLE_SPIN_RATE * t,
});
const sign = (): 1 | -1 => (Math.random() < 0.5 ? 1 : -1);
const parked = (serveSign = sign()): BallState => ({
  x: FIELD_CX,
  y: FIELD_CY,
  vx: 0,
  vy: 0,
  spin: 0,
  held: true,
  holdTimer: HOLD_TIME,
  serveSign,
  trail: [],
});
const initial = (muted = false): CaromState => ({
  screen: "title",
  mode: "solo",
  menuIndex: 0,
  titleIndex: 0,
  resumeScreen: "playing",
  score: { p1: 0, p2: 0 },
  winner: null,
  paddles: {
    left: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
    right: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
  },
  ai: { tracking: true, movement: true },
  receiver: "left",
  ball: parked(),
  obstacles: [pose(0, 0), pose(1, 0)],
  obstacleClock: 0,
  obstacleClockRunning: true,
  simTime: 0,
  muted,
});
const items = (s: DeepReadonly<CaromState>): readonly string[] =>
  s.screen === "title"
    ? TITLE_ITEMS
    : s.screen === "paused"
      ? PAUSE_ITEMS
      : s.screen === "matchover"
        ? ["PLAY AGAIN", "MENU"]
        : s.screen === "howto"
          ? ["BACK TO MENU"]
          : [];
const rect = (i: number): Rect => ({ x: 440, y: 390 + i * 68, w: 400, h: 54 });
const makeDebug = (): CaromDebugApi => ({
  version: CAROM_DEBUG_VERSION,
  snapshot: (s) => ({
    ...s,
    version: CAROM_DEBUG_VERSION,
    ball: s.ball
      ? { ...s.ball, speed: Math.hypot(s.ball.vx, s.ball.vy) }
      : null,
  }),
  menuItemRect: (s, i) => (i >= 0 && i < items(s).length ? rect(i) : null),
  clearWorld: (s) => ({ ...s, ball: null, obstacles: [] }),
  spawnBall: (s) => ({ ...s, ball: parked() }),
  spawnObstacle: (s, i) => {
    if (i !== 0 && i !== 1) throw Error(`invalid obstacle ${i}`);
    return {
      ...s,
      obstacles: [
        ...s.obstacles.filter((o) => o.index !== i),
        pose(i, s.obstacleClock),
      ].sort((a, b) => a.index - b.index),
    };
  },
  reset: (s) => ({
    ...initial(s.muted),
    titleIndex: s.titleIndex,
    menuIndex: s.titleIndex,
    simTime: s.simTime,
  }),
  reconcile: (s) => ({
    ...s,
    obstacles: s.obstacles.map((o) => pose(o.index, s.obstacleClock)),
  }),
  setScreen: (s, v) => ({ ...s, screen: v }),
  setMode: (s, v) => ({ ...s, mode: v }),
  setMenuIndex: (s, v) => ({ ...s, menuIndex: v }),
  setTitleIndex: (s, v) => ({ ...s, titleIndex: v }),
  setResumeScreen: (s, v) => ({ ...s, resumeScreen: v }),
  setScore: (s, p1, p2) => ({ ...s, score: { p1, p2 } }),
  setWinner: (s, v) => ({ ...s, winner: v }),
  setReceiver: (s, v) => ({ ...s, receiver: v }),
  setPaddleCy: (s, side, v) => ({
    ...s,
    paddles: { ...s.paddles, [side]: { ...s.paddles[side], cy: v } },
  }),
  setPaddleVy: (s, side, v) => ({
    ...s,
    paddles: { ...s.paddles, [side]: { ...s.paddles[side], drivenVy: v } },
  }),
  setPaddleDriven: (s, side, v) => ({
    ...s,
    paddles: { ...s.paddles, [side]: { ...s.paddles[side], driven: v } },
  }),
  setBallPosition: (s, x, y) => ({ ...s, ball: needBall(s, { x, y }) }),
  setBallVelocity: (s, vx, vy) => ({ ...s, ball: needBall(s, { vx, vy }) }),
  setBallSpin: (s, spin) => ({ ...s, ball: needBall(s, { spin }) }),
  setBallHeld: (s, held) => ({ ...s, ball: needBall(s, { held }) }),
  setBallHoldTimer: (s, holdTimer) => ({
    ...s,
    ball: needBall(s, { holdTimer }),
  }),
  setBallServeSign: (s, serveSign) => ({
    ...s,
    ball: needBall(s, { serveSign }),
  }),
  drawBallServeSign: (s) => ({
    ...s,
    ball: needBall(s, { serveSign: sign() }),
  }),
  setAiTracking: (s, v) => ({ ...s, ai: { ...s.ai, tracking: v } }),
  setAiMovement: (s, v) => ({ ...s, ai: { ...s.ai, movement: v } }),
  setMuted: (s, v) => ({ ...s, muted: v }),
  setObstacleClock: (s, v) => ({
    ...s,
    obstacleClock: v,
    obstacles: s.obstacles.map((o) => pose(o.index, v)),
  }),
  setObstacleClockRunning: (s, v) => ({ ...s, obstacleClockRunning: v }),
});
function needBall(
  s: DeepReadonly<CaromState>,
  patch: Partial<BallState>,
): BallState {
  if (!s.ball) throw Error("no ball on field");
  return { ...s.ball, ...patch };
}
function start(s: DeepReadonly<CaromState>, mode = s.mode): CaromState {
  return {
    ...s,
    screen: "countdown",
    mode,
    resumeScreen: "playing",
    menuIndex: 0,
    score: { p1: 0, p2: 0 },
    winner: null,
    receiver: "left",
    ball: parked(),
    paddles: {
      left: { ...s.paddles.left, cy: FIELD_CY, vy: 0 },
      right: { ...s.paddles.right, cy: FIELD_CY, vy: 0 },
    },
    obstacleClock: 0,
    obstacleClockRunning: true,
    obstacles: [pose(0, 0), pose(1, 0)],
  };
}
function integrate(p: PaddleState, vy: number, dt: number): PaddleState {
  const cy = clamp(p.cy + vy * dt, PADDLE_MIN_CY, PADDLE_MAX_CY);
  return { ...p, cy, vy: dt > 0 && cy !== p.cy ? (cy - p.cy) / dt : vy };
}
export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>) {
    for (const a of ACTIONS) api.input.register(a, { keys: [...BINDINGS[a]] });
    api.audio.define(CUES.paddleHit, {
      wave: "square",
      freq: 520,
      freqTo: 260,
      durationMs: 65,
      gain: 0.12,
    });
    api.audio.define(CUES.wallBounce, {
      freq: 300,
      freqTo: 180,
      durationMs: 55,
      gain: 0.1,
    });
    api.audio.define(CUES.obstacleBounce, {
      wave: "triangle",
      freq: 400,
      freqTo: 240,
      durationMs: 70,
      gain: 0.12,
    });
    api.audio.define(CUES.score, {
      wave: "sine",
      freq: 740,
      freqTo: 420,
      durationMs: 180,
      gain: 0.18,
    });
    for (const [n, f] of Object.entries({
      screen: (s: DeepReadonly<CaromState>) => s.screen,
      mode: (s: DeepReadonly<CaromState>) => s.mode,
      score: (s: DeepReadonly<CaromState>) => `${s.score.p1} : ${s.score.p2}`,
      ball: (s: DeepReadonly<CaromState>) =>
        s.ball
          ? `${s.ball.x.toFixed(0)},${s.ball.y.toFixed(0)} v${Math.hypot(s.ball.vx, s.ball.vy).toFixed(0)} s${s.ball.spin.toFixed(0)}`
          : "none",
      p1: (s: DeepReadonly<CaromState>) =>
        `${s.paddles.left.cy.toFixed(0)} v${s.paddles.left.vy.toFixed(0)}`,
      p2: (s: DeepReadonly<CaromState>) =>
        `${s.paddles.right.cy.toFixed(0)} v${s.paddles.right.vy.toFixed(0)}`,
    }))
      api.diagnostics.register(n, f);
    return [initial(), makeDebug()];
  },
  update(state, api: UpdateApi, dt) {
    let s: CaromState = {
      ...state,
      simTime: state.simTime + dt,
      muted: api.audio.muted(),
    };
    if (api.input.pressed("mute")) {
      api.audio.setMuted(!s.muted);
      s = { ...s, muted: !s.muted };
    }
    const edges = {
      up: api.input.pressed("p1-up") || api.input.pressed("p2-up"),
      down: api.input.pressed("p1-down") || api.input.pressed("p2-down"),
      confirm: api.input.pressed("confirm"),
      back: api.input.pressed("back"),
      pause: api.input.pressed("pause"),
    };
    const count = items(s).length;
    const activate = (): void => {};
    void activate;
    if (["title", "howto", "paused", "matchover"].includes(s.screen)) {
      const move = edges.up ? -1 : edges.down ? 1 : 0;
      if (s.screen === "paused" && (edges.pause || edges.back))
        s = { ...s, screen: s.resumeScreen };
      else if (s.screen === "howto" && (edges.confirm || edges.back))
        s = { ...s, screen: "title", menuIndex: s.titleIndex };
      else if (s.screen === "matchover" && edges.back)
        s = {
          ...initial(s.muted),
          titleIndex: s.titleIndex,
          menuIndex: s.titleIndex,
          simTime: s.simTime,
        };
      else if (s.screen === "title" && move)
        s = { ...s, menuIndex: (s.menuIndex + move + count) % count };
      else if ((s.screen === "paused" || s.screen === "matchover") && move)
        s = { ...s, menuIndex: (s.menuIndex + move + count) % count };
      else if (edges.confirm) {
        if (s.screen === "title") {
          s = { ...s, titleIndex: s.menuIndex };
          if (s.menuIndex === 0) s = start(s, "solo");
          else if (s.menuIndex === 1) s = start(s, "versus");
          else s = { ...s, screen: "howto", menuIndex: 0 };
        } else if (s.screen === "paused") {
          if (s.menuIndex === 0) s = { ...s, screen: s.resumeScreen };
          else if (s.menuIndex === 1) s = start(s);
          else
            s = {
              ...initial(s.muted),
              titleIndex: s.titleIndex,
              menuIndex: s.titleIndex,
              simTime: s.simTime,
            };
        } else if (s.screen === "matchover") {
          if (s.menuIndex === 0) s = start(s);
          else
            s = {
              ...initial(s.muted),
              titleIndex: s.titleIndex,
              menuIndex: s.titleIndex,
              simTime: s.simTime,
            };
        }
      }
    }
    const ptr = api.input.pointer(),
      samples = api.input.pointerSamples().filter((p) => p.primary);
    if (s.screen !== "countdown" && s.screen !== "playing") {
      const hover = (x: number, y: number) => {
        const i = items(s).findIndex((_, n) => {
          const r = rect(n);
          return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
        });
        if (i >= 0) s = { ...s, menuIndex: i };
      };
      hover(ptr.x, ptr.y);
      for (const p of samples) hover(p.x, p.y);
      if (api.input.pointerPressed())
        for (const p of samples)
          if (p.buttons.includes("primary")) hover(p.x, p.y);
      if (api.input.pointerReleased()) for (const p of samples) hover(p.x, p.y);
    }
    if ((s.screen === "countdown" || s.screen === "playing") && edges.pause) {
      s = { ...s, resumeScreen: s.screen, screen: "paused", menuIndex: 0 };
    }
    if (s.screen !== "countdown" && s.screen !== "playing") return s;
    const axis = (up: string, down: string) =>
      api.input.value(down) - api.input.value(up);
    let left = s.paddles.left,
      right = s.paddles.right;
    if (left.driven) left = integrate(left, left.drivenVy, dt);
    else
      left = integrate(
        left,
        axis("p1-up", s.mode === "solo" ? "p1-down" : "p1-down") *
          PADDLE_SPEED +
          (s.mode === "solo" ? axis("p2-up", "p2-down") : 0) * PADDLE_SPEED,
        dt,
      );
    if (right.driven) right = integrate(right, right.drivenVy, dt);
    else if (s.mode === "versus")
      right = integrate(right, axis("p2-up", "p2-down") * PADDLE_SPEED, dt);
    else if (s.ai.movement) {
      let target = AI_HOME_Y,
        dead = AI_HOME_DEADZONE;
      if (s.screen === "playing" && s.ai.tracking && s.ball && s.ball.vx > 0) {
        target = s.ball.y - s.ball.vy * AI_REACT;
        dead = AI_DEADZONE;
      }
      const diff = target - right.cy;
      right = integrate(
        right,
        Math.abs(diff) <= dead
          ? 0
          : Math.sign(diff) *
              Math.min(AI_SPEED, dt > 0 ? Math.abs(diff) / dt : AI_SPEED),
        dt,
      );
    } else right = integrate(right, 0, dt);
    s = { ...s, paddles: { left, right } };
    if (!s.ball)
      return {
        ...s,
        obstacleClock: s.obstacleClockRunning
          ? s.obstacleClock + dt
          : s.obstacleClock,
        obstacles: s.obstacles.map((o) =>
          pose(
            o.index,
            s.obstacleClockRunning ? s.obstacleClock + dt : s.obstacleClock,
          ),
        ),
      };
    let b = { ...s.ball };
    if (s.screen === "countdown") {
      const timer = Math.max(0, b.holdTimer - dt);
      if (timer <= 0) {
        b = {
          ...b,
          held: false,
          holdTimer: 0,
          vx:
            (s.receiver === "left" ? -1 : 1) *
            SERVE_SPEED *
            Math.cos(SERVE_ANGLE),
          vy: b.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
          trail: [],
        };
        s = { ...s, screen: "playing" };
      } else b = { ...b, holdTimer: timer };
    }
    if (s.screen === "playing" && !b.held) {
      let hitWall = false,
        hitPad = false,
        hitObs = false;
      const speed = Math.hypot(b.vx, b.vy),
        n = Math.max(1, Math.ceil((speed * dt) / MAX_SUBSTEP)),
        h = dt / n;
      for (let k = 0; k < n; k++) {
        const sp = Math.hypot(b.vx, b.vy);
        if (sp) {
          const a = (b.spin / sp) * h,
            c = Math.cos(a),
            q = Math.sin(a);
          [b.vx, b.vy] = [b.vx * c - b.vy * q, b.vx * q + b.vy * c];
        }
        b.spin *= Math.pow(0.5, h / SPIN_HALFLIFE);
        b.x += b.vx * h;
        b.y += b.vy * h;
        if (b.y - BALL_R < 0 && b.vy < 0) {
          b.y = BALL_R;
          b.vy = -b.vy;
          hitWall = true;
        } else if (b.y + BALL_R > FIELD_H && b.vy > 0) {
          b.y = FIELD_H - BALL_R;
          b.vy = -b.vy;
          hitWall = true;
        }
        for (const side of ["left", "right"] as const) {
          const p = s.paddles[side],
            x0 = side === "left" ? P1_X0 : P2_X0,
            x1 = side === "left" ? P1_X1 : P2_X1;
          if (
            b.x > x0 - BALL_R &&
            b.x < x1 + BALL_R &&
            b.y > p.cy - PADDLE_HALF - BALL_R &&
            b.y < p.cy + PADDLE_HALF + BALL_R
          ) {
            const ds = [
                b.x - (x0 - BALL_R),
                x1 + BALL_R - b.x,
                b.y - (p.cy - PADDLE_HALF - BALL_R),
                p.cy + PADDLE_HALF + BALL_R - b.y,
              ],
              m = Math.min(...ds),
              face = ds.indexOf(m);
            if (face < 2) {
              const speed2 = Math.min(
                  Math.hypot(b.vx, b.vy) * SPEED_MULT,
                  SPEED_CAP,
                ),
                theta =
                  clamp((b.y - p.cy) / PADDLE_HALF, -1, 1) * MAX_BOUNCE_ANGLE,
                dir = side === "left" ? 1 : -1;
              b.vx = dir * speed2 * Math.cos(theta);
              b.vy = speed2 * Math.sin(theta);
              b.spin = clamp(
                b.spin + p.vy * SPIN_FROM_PADDLE,
                -SPIN_CLAMP,
                SPIN_CLAMP,
              );
              b.x = side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R;
              hitPad = true;
            } else {
              b.y =
                face === 2
                  ? p.cy - PADDLE_HALF - BALL_R
                  : p.cy + PADDLE_HALF + BALL_R;
              if ((face === 2 && b.vy > 0) || (face === 3 && b.vy < 0))
                b.vy = -b.vy;
              hitWall = true;
            }
          }
        }
        for (const o of s.obstacles) {
          const dx = b.x - o.cx,
            dy = b.y - o.cy,
            c = Math.cos(o.theta),
            q = Math.sin(o.theta),
            lx = dx * c + dy * q,
            ly = -dx * q + dy * c,
            qx = clamp(lx, -OBSTACLE_HW, OBSTACLE_HW),
            qy = clamp(ly, -OBSTACLE_HH, OBSTACLE_HH),
            ex = lx - qx,
            ey = ly - qy,
            d = Math.hypot(ex, ey);
          if (d < BALL_R) {
            let nx: number, ny: number;
            if (d > 0) {
              nx = ex / d;
              ny = ey / d;
            } else if (
              OBSTACLE_HW - Math.abs(lx) <
              OBSTACLE_HH - Math.abs(ly)
            ) {
              nx = Math.sign(lx) || 1;
              ny = 0;
            } else {
              nx = 0;
              ny = Math.sign(ly) || 1;
            }
            const wx = nx * c - ny * q,
              wy = nx * q + ny * c,
              dot = b.vx * wx + b.vy * wy;
            if (dot < 0) {
              b.vx -= 2 * dot * wx;
              b.vy -= 2 * dot * wy;
            }
            b.x =
              o.cx +
              (qx + nx * (BALL_R + 0.01)) * c -
              (qy + ny * (BALL_R + 0.01)) * q;
            b.y =
              o.cy +
              (qx + nx * (BALL_R + 0.01)) * q +
              (qy + ny * (BALL_R + 0.01)) * c;
            hitObs = true;
          }
        }
      }
      if (hitWall) api.audio.play(CUES.wallBounce);
      if (hitPad) api.audio.play(CUES.paddleHit);
      if (hitObs) api.audio.play(CUES.obstacleBounce);
    }
    const clock = s.obstacleClockRunning
      ? s.obstacleClock + dt
      : s.obstacleClock;
    let trail = b.trail;
    if (s.screen === "countdown" || s.screen === "playing") {
      trail = [...trail, { x: b.x, y: b.y, t: s.simTime }].filter(
        (t) => s.simTime - t.t <= TRAIL_TIME,
      );
    }
    b = { ...b, trail };
    s = {
      ...s,
      ball: b,
      obstacleClock: clock,
      obstacles: s.obstacles.map((o) => pose(o.index, clock)),
    };
    if (
      s.screen === "playing" &&
      s.ball &&
      (s.ball.x - BALL_R > FIELD_W || s.ball.x + BALL_R < 0)
    ) {
      const scorer = s.ball.x > FIELD_CX ? "p1" : "p2",
        score = { ...s.score, [scorer]: s.score[scorer] + 1 };
      api.audio.play(CUES.score);
      const won =
        scorer === "p1"
          ? score.p1 >= WIN_SCORE && score.p1 - score.p2 >= WIN_LEAD
          : score.p2 >= WIN_SCORE && score.p2 - score.p1 >= WIN_LEAD;
      if (won)
        s = {
          ...s,
          score,
          winner: scorer === "p1" ? "left" : "right",
          screen: "matchover",
          menuIndex: 0,
        };
      else
        s = {
          ...s,
          score,
          receiver: scorer === "p1" ? "right" : "left",
          ball: parked(),
          screen: "countdown",
        };
    }
    return s;
  },
  render(s, api: RenderApi) {
    const c = api.ctx;
    c.fillStyle = "#0d1b2c";
    c.fillRect(0, 0, FIELD_W, FIELD_H);
    c.strokeStyle = "rgba(115,182,214,.25)";
    c.lineWidth = 2;
    c.setLineDash([10, 15]);
    c.beginPath();
    c.moveTo(NET_X, 24);
    c.lineTo(NET_X, FIELD_H - 24);
    c.stroke();
    c.setLineDash([]);
    for (const o of s.obstacles) {
      c.save();
      c.translate(o.cx, o.cy);
      c.rotate(o.theta);
      c.fillStyle = "#e8a34a";
      c.shadowColor = "#e8a34a";
      c.shadowBlur = 16;
      c.beginPath();
      c.roundRect(-10, -70, 20, 140, 10);
      c.fill();
      c.restore();
    }
    for (const [side, p] of [
      ["left", s.paddles.left],
      ["right", s.paddles.right],
    ] as const) {
      c.fillStyle = side === "left" ? "#56e0cb" : "#ec6e9b";
      c.shadowColor = c.fillStyle;
      c.shadowBlur = 18;
      c.beginPath();
      c.roundRect(
        side === "left" ? P1_X0 : P2_X0,
        p.cy - PADDLE_HALF,
        16,
        110,
        8,
      );
      c.fill();
    }
    c.shadowBlur = 0;
    if (s.ball) {
      for (let i = 1; i < s.ball.trail.length; i++) {
        const a = s.ball.trail[i - 1]!,
          b = s.ball.trail[i]!;
        c.strokeStyle = `rgba(255,255,255,${(i / s.ball.trail.length) * 0.42})`;
        c.lineWidth = 2 + (i / s.ball.trail.length) * 5;
        c.beginPath();
        c.moveTo(a.x, a.y);
        c.lineTo(b.x, b.y);
        c.stroke();
      }
      c.fillStyle = "#f7f6ee";
      c.shadowColor = "#fff";
      c.shadowBlur = 22;
      c.beginPath();
      c.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2);
      c.fill();
      c.shadowBlur = 0;
    }
    c.textAlign = "center";
    c.fillStyle = "#f2f7fb";
    c.font = "700 48px system-ui";
    if (
      s.screen === "playing" ||
      s.screen === "countdown" ||
      s.screen === "paused" ||
      s.screen === "matchover"
    ) {
      c.fillStyle = "rgba(255,255,255,.78)";
      c.font = "700 44px system-ui";
      c.fillText(String(s.score.p1), 560, 72);
      c.fillText(String(s.score.p2), 720, 72);
      c.font = "600 14px system-ui";
      c.fillStyle = "#9eb4c5";
      c.fillText(
        s.mode === "solo" ? "SOLO • FIRST TO 11" : "VERSUS • FIRST TO 11",
        FIELD_CX,
        106,
      );
    }
    if (s.screen === "title") {
      c.fillStyle = "#f5f6f3";
      c.font = "900 100px system-ui";
      c.fillText(TITLE_TEXT, FIELD_CX, 230);
      c.fillStyle = "#8faabc";
      c.font = "500 19px system-ui";
      c.fillText("BANK THE FIELD. BEND THE RALLY.", FIELD_CX, 278);
      drawMenu(c, items(s), s.menuIndex);
      c.font = "14px system-ui";
      c.fillStyle = "#72889a";
      c.fillText("W / S OR ↑ / ↓ TO MOVE   •   ENTER TO SELECT", FIELD_CX, 635);
    } else if (s.screen === "howto") {
      c.fillStyle = "#f6f6f1";
      c.font = "800 54px system-ui";
      c.fillText("HOW TO PLAY", FIELD_CX, 165);
      c.font = "20px system-ui";
      c.fillStyle = "#b7c8d3";
      [
        "W / S move left paddle • Arrow keys move right",
        "Move as the ball hits to add spin and curve its flight.",
        "Bank shots off the rotating obstacles to beat your rival.",
        "P or Esc pauses • M toggles sound",
      ].forEach((t, i) => c.fillText(t, FIELD_CX, 245 + i * 40));
      drawMenu(c, items(s), s.menuIndex);
    } else if (s.screen === "countdown") {
      c.fillStyle = "#fff";
      c.font = "800 30px system-ui";
      c.fillText("GET READY", FIELD_CX, FIELD_CY - 50);
    } else if (s.screen === "paused") {
      overlay(c);
      c.fillStyle = "#fff";
      c.font = "800 54px system-ui";
      c.fillText("PAUSED", FIELD_CX, 260);
      drawMenu(c, items(s), s.menuIndex);
    } else if (s.screen === "matchover") {
      overlay(c);
      c.fillStyle = "#fff";
      c.font = "800 48px system-ui";
      c.fillText(
        `${s.winner === "left" ? "PLAYER ONE" : "PLAYER TWO"} WINS`,
        FIELD_CX,
        240,
      );
      drawMenu(c, items(s), s.menuIndex);
    }
  },
};
function overlay(c: CanvasRenderingContext2D) {
  c.fillStyle = "rgba(4,10,19,.74)";
  c.fillRect(0, 0, FIELD_W, FIELD_H);
}
function drawMenu(
  c: CanvasRenderingContext2D,
  list: readonly string[],
  selected: number,
) {
  list.forEach((label, i) => {
    const r = rect(i);
    c.fillStyle = i === selected ? "#56e0cb" : "rgba(195,213,224,.74)";
    if (i === selected) {
      c.fillStyle = "rgba(86,224,203,.12)";
      c.beginPath();
      c.roundRect(r.x, r.y, r.w, r.h, 12);
      c.fill();
      c.strokeStyle = "#56e0cb";
      c.lineWidth = 1.5;
      c.stroke();
      c.fillStyle = "#70f0d8";
    } else c.fillStyle = "#b1c1cb";
    c.font = `${i === selected ? 750 : 600} 20px system-ui`;
    c.textAlign = "center";
    c.fillText(label, FIELD_CX, r.y + 35);
  });
}
