"use babel";

import config from "./config.js";
import { CompositeDisposable } from "atom";

const characters = {
  controlCharacters: ["\x00-\x08", "\x0B", "\x0C", "\x0E-\x1F", "\x80-\x9F"],
  spaces: [
    " ", // xA0, No-break space
    "᠎", // mongolian vowel separator
    " ", // narrow no-break space
    " ", // medium mathematical space
    "﻿", // zero width no-break space
    "\u2028", // line separator space, can break JS strings
    "\u3000", // ideographic space
    "\\u2000-\\u200F", // quads, em spaces, etc.
    " " // ogham space mark
  ], // TODO: add all "[^\S\r\n\t ]"
  confusables: [
    "ˋ", // U+02CB Modifier Letter Grave Accent
    "│", // box drawings light vertical U+2502
    "ǀ", // latin letter dental click
    "∣", // divides
    "‚", // Low quotation mark - looks like comma
    "˂", // Modifier Letter Left Arrowhead
    "˃", // Modifier Letter Right Arrowhead
    "\\u2010-\\u2015" // en&em dashes etc. (‐, ‑, ‒, and so on)
  ]
};

export default {
  config,
  activeChars: [],
  charRegExp: null,
  subscriptions: null,
  decorations: [],

  activate(state) {
    // console.log("highlight-bad-chars activate");
    // console.log("highlight-bad-chars", state);
    if (state.activeChars) {
      this.activeChars = state.activeChars;
      this.charRegExp = new RegExp("[" + this.activeChars.join("") + "]", "g");
    } else {
      this.refreshActiveChars();
    }

    this.subscriptions = new CompositeDisposable();
    atom.workspace.observeTextEditors(editor => {
      this.subscriptions.add(
        editor.onDidChange(() => this.refreshDecorations(editor))
      );
    });

    const flush = () => {
      this.refreshActiveChars();
      this.refreshDecorations();
    };
    Object.keys(characters).forEach(key =>
      this.subscriptions.add(
        atom.config.onDidChange(`highlight-bad-chars.${key}`, flush)
      )
    );
  },

  refreshActiveChars() {
    this.activeChars = [];
    Object.entries(characters).forEach(([key, values]) => {
      if (atom.config.get(`highlight-bad-chars.${key}`)) {
        this.activeChars = this.activeChars.concat(values);
      }
    });

    console.log('refreshActiveChars', this.activeChars)
    this.charRegExp = new RegExp("[" + this.activeChars.join("") + "]", "g");
  },

  refreshDecorations(editor) {
    this.disposeDecorations();
    if (!editor) {
      return;
    }
    if (this.activeChars.length < 1) {
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

  deactivate() {
    this.disposeDecorations();
    this.subscriptions.dispose();
  },

  serialize() {
    return {
      activeChars: this.activeChars
    };
  }
};
