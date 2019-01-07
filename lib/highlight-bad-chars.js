"use babel";

import config from "./config.js";
import { CompositeDisposable } from "atom";

const whitelist = [
  "\x09", // Tab
  "\x0A", // LF
  "\x0D", // CR
  "\x20-\x7E" // Standard printable characters
];

export default {
  config,
  userWhitelist: "",
  charRegExp: null,
  subscriptions: null,
  decorations: [],

  activate(state) {
    this.log("highlight-bad-chars activating");
    this.refreshRegExp(state.userWhitelist);

    // unset old config
    atom.config.unset("highlight-bad-chars.confusables");
    atom.config.unset("highlight-bad-chars.controlCharacters");
    atom.config.unset("highlight-bad-chars.spaces");

    this.subscriptions = new CompositeDisposable();

    atom.workspace.observeTextEditors(editor => {
      this.subscriptions.add(
        editor.onDidChange(() => this.refreshDecorations(editor))
      );
    });

    this.subscriptions.add(
      atom.config.onDidChange(
        "highlight-bad-chars.whitelist.characters",
        ({ newValue }) => {
          this.refreshRegExp(newValue);
          this.refreshDecorations();
        }
      )
    );
  },

  refreshRegExp(userWhitelist) {
    const old = this.userWhitelist;
    this.userWhitelist =
      typeof userWhitelist === "string"
        ? userWhitelist
        : atom.config.get("highlight-bad-chars.whitelist.characters");
    this.log("userWhitelist changed", { old, new: this.userWhitelist });
    this.charRegExp = new RegExp(
      `[^${whitelist.join("")}${this.userWhitelist}]+`,
      "g"
    );
  },

  refreshDecorations(editor) {
    this.disposeDecorations();
    if (!editor) {
      return;
    }
    editor.scan(this.charRegExp, obj => {
      mark = editor.markBufferRange(obj.range);
      this.decorations.push(
        editor.decorateMarker(mark, {
          type: "highlight",
          class: "highlight-bad-chars"
        })
      );
    });
  },

  disposeDecorations() {
    this.decorations.forEach(d => d.getMarker().destroy());
    this.decorations = [];
  },

  log(...args) {
    atom.config.get("highlight-bad-chars.debug.logging") &&
      console.log(...args);
  },

  deactivate() {
    this.disposeDecorations();
    this.subscriptions.dispose();
  },

  serialize() {
    return {
      userWhitelist: this.userWhitelist
    };
  }
};
