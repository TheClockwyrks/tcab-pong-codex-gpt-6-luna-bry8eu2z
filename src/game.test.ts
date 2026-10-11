import { describe, expect, it } from "vitest";
import { game } from "./game";
import type { CaromState } from "./game";
import type { UpdateApi } from "@clockwyrks/simple-2d";

const setup = async () => {
  const sources: Array<(state: CaromState) => string | number | boolean> = [];
  const init = {
    input: { register: () => undefined, layout: () => null },
    audio: { define: () => undefined, load: async () => new ArrayBuffer(0) },
    assets: {
      loadImage: async () => ({}),
      loadAudio: async () => ({}),
      load: async () => new Blob(),
      resolve: (path: string) => path,
    },
    diagnostics: {
      register: (
        _name: string,
        source: (state: CaromState) => string | number | boolean,
      ) => sources.push(source),
    },
    events: {},
    viewport: () => ({}),
  };
  return await game.initialize(init as never);
};
const api = {
  input: {
    value: () => 0,
    pressed: () => false,
    pointer: () => ({
      x: -1,
      y: -1,
      down: false,
      device: "mouse",
      buttons: [],
    }),
    pointerSamples: () => [],
    pointerContacts: () => [],
    pointerPressed: () => false,
    pointerReleased: () => false,
    wheel: () => ({ x: 0, y: 0 }),
  },
  audio: {
    play: () => undefined,
    muted: () => false,
    setMuted: () => undefined,
  },
} as unknown as UpdateApi;

describe("Carom state and simulation", () => {
  it("starts complete and exposes pure poses through the debug surface", async () => {
    const [state, debug] = await setup();
    const changed = debug.setBallVelocity(state, 300, 40);
    expect(state.ball?.vx).toBe(0);
    expect(debug.snapshot(changed).ball?.speed).toBeCloseTo(
      Math.hypot(300, 40),
    );
    expect(debug.snapshot(state).screen).toBe("title");
    expect(debug.menuItemRect(state, 0)).not.toBeNull();
  });

  it("serves after the countdown and advances a rally from simulation time", async () => {
    const [initial, debug] = await setup();
    let state = debug.setScreen(initial, "countdown");
    state = debug.setBallHoldTimer(state, 0.02);
    state = game.update(state, api, 0.02);
    expect(state.screen).toBe("playing");
    expect(state.ball?.held).toBe(false);
    const x = state.ball?.x ?? 0;
    state = game.update(state, api, 0.016);
    expect(state.ball?.x).not.toBe(x);
    expect(state.simTime).toBeCloseTo(0.036);
  });
});
