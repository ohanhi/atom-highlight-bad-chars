"use babel";

import config from "./config.js";
import { CompositeDisposable } from "atom";

const characters = {
  controlCharacters: ["\x00-\x08", "\x0B", "\x0C", "\x0E-\x1F", "\x80-\x9F"],
  // Non-standard spaces:
  // import sys
  // import re
  // print(str(
  //    [chr(c) for c in range(sys.maxunicode)
  //     if re.match(r'^[^\S\r\n\t ]$', chr(c))] +
  //    ['\u180E', '\u200B', '\u200C', '\u200D', '\u2060', '\uFEFF']
  //    # https://en.wikipedia.org/wiki/Whitespace_character
  // ).replace("'", '"'))
  spaces: [
    "\x0b", "\x0c", "\x1c", "\x1d", "\x1e", "\x1f", "\x85", "\xa0", "\u1680",
    "\u2000", "\u2001", "\u2002", "\u2003", "\u2004", "\u2005", "\u2006",
    "\u2007", "\u2008", "\u2009", "\u200a", "\u2028", "\u2029", "\u202f",
    "\u205f", "\u3000", "\u180e", "\u200b", "\u200c", "\u200d", "\u2060",
    "\ufeff"],
  // SugarTeX confusables and dashes:
  confusables: [
    "ˋ", // modifier letter grave accent U+02CB
    "│", // box drawings light vertical U+2502
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
