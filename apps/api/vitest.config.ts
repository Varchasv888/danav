import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Every file builds its own businesses against the shared dev database; with the route sweeps
    // running beside them, setting up can take longer than the 10-second default on a laptop.
    hookTimeout: 60_000,
    // A test that signs up a business, syncs and checks the result can pass 5 seconds when the whole suite runs at once.
    testTimeout: 20_000,
  },
});
