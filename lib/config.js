"use babel";

export default {
  spaces: {
    order: 0,
    title: "Highlight non-standard space characters",
    description:
      "Characters representing more obscure spaces, such as the No-break space ` `.",
    type: "boolean",
    default: true
  },
  confusables: {
    order: 1,
    title: "Highlight confusable characters",
    description:
      "Characters that can be confused with standard chars. There should be a reason why they happen: autoreplacements or they are used somewhere.",
    type: "boolean",
    default: true
  },
  dashes: {
    order: 2,
    title: "Highlight non-standard dashes and hyphens",
    description:
      "Non-standard dashes and hyphens. For example figure dash `‒` vs. hyphen `-`.",
    type: "boolean",
    default: true
  },
  controlCharacters: {
    order: 3,
    title: "Highlight control characters",
    description: "These are mostly relics from ASCII times.",
    type: "boolean",
    default: true
  }
  // observeMode: {
  //   title: "Watch mode",
  //   description: "(Needs editor reload) Choose how the highlighter watches for changes in the file. `onDidChange` is the most resource hungry, as it updates right away as a file is opened and whenever it is changed. `onDidStopChanging` does not update when a file is opened and waits for a pause in the file changes. `(none)` means the highlighter does not activate automatically.",
  //   type: "string",
  //   default: "onDidChange",
  //   enum: ["onDidChange", "onDidStopChanging", "(none)"]
  // }
};
