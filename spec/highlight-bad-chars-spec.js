"use babel";

import HighlightBadChars from "../lib/highlight-bad-chars";

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("HighlightBadChars", () => {
  let workspaceElement, activationPromise;

  describe("when the test suite is run", () => {
    it("has some actual tests", () => {
      expect(false).toBe(true);
    });
  });
});
