"use babel";

export default {
  whitelist: {
    order: 0,
    title: "Whitelist characters",
    type: "object",
    properties: {
      characters: {
        title: "Add characters to the default whitelist",
        description:
          "Characters outside the printable characters in the [Basic Latin block](https://en.wiktionary.org/wiki/Appendix:Unicode/Basic_Latin) (aka. ASCII range) you do **not** want highlighted. This is added to a regex character set `[^abc]`.<br/><br/>Example: `åäöÅÄÖ€`",
        type: "string",
        default: ""
      }
    }
  }
  // observeMode: {
  //   title: "Watch mode",
  //   description: "(Needs editor reload) Choose how the highlighter watches for changes in the file. `onDidChange` is the most resource hungry, as it updates right away as a file is opened and whenever it is changed. `onDidStopChanging` does not update when a file is opened and waits for a pause in the file changes. `(none)` means the highlighter does not activate automatically.",
  //   type: "string",
  //   default: "onDidChange",
  //   enum: ["onDidChange", "onDidStopChanging", "(none)"]
  // }
};
