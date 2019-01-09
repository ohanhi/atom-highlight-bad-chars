"use babel";

import config from "./config.js";
import { CompositeDisposable } from "atom";

const characters = {
  controlCharacters: ["\x00-\x08", "\x0B", "\x0C", "\x0E-\x1F", "\x80-\x9F"],

  spaces: [
    // Non-standard whitespace chars:
    // import sys; import re; print(str(
    //    [chr(c) for c in range(sys.maxunicode)
    //     if re.match(r'^[^\S\r\n\t ]$', chr(c))]
    // ).replace("'", '"'))
    "\x0b", "\x0c", "\x1c", "\x1d", "\x1e", "\x1f", "\x85", "\xa0", "\u1680",
    "\u2000", "\u2001", "\u2002", "\u2003", "\u2004", "\u2005", "\u2006",
    "\u2007", "\u2008", "\u2009", "\u200a", "\u2028", "\u2029", "\u202f",
    "\u205f", "\u3000",

    // https://en.wikipedia.org/wiki/Whitespace_character
    "\u180e", "\u200b", "\u200c", "\u200d", "\u2060", "\ufeff"
  ],

  confusables: [
    // SugarTeX:
    "\u02cb", // modifier letter grave accent ˋ
    "\u2502", // box drawings light vertical │

    // Autoreplacements (like from markdown-it typographer):
    "\u201c", // left double quotation mark “
    "\u201d", // right double quotation mark ”
    "\u2018", // left single quotation mark ‘
    "\u2019", // right single quotation mark ’
    "\xab", // left-pointing double angle quotation mark «
    "\xbb", // right-pointing double angle quotation mark »
    "\u2039", // single left-pointing angle quotation mark ‹
    "\u203a", // single right-pointing angle quotation mark ›
    "\u201e", // double low-9 quotation mark „
    "\u201a", // single low-9 quotation mark ‚
    "\xa9", // copyright sign ©
    "\xae", // registered sign ®
  ],

  dashes: [
    // https://en.wikipedia.org/wiki/Hyphen
    "\xad", // soft hyphen U+00AD
    "\u058a", // armenian hyphen ֊
    "\u1806", // mongolian todo soft hyphen ᠆
    "\ufe63", // small hyphen-minus ﹣
    "\uff0d", // fullwidth hyphen-minus －
    "\u2043", // hyphen bullet ⁃
    "\u2010", // hyphen ‐
    "\u2011", // non-breaking hyphen ‑

    // https://en.wikipedia.org/wiki/Dash
    "\u2212", // minus sign −
    "\u23af", // horizontal line extension ⎯
    "\u23e4", // straightness ⏤
    "\u2500", // box drawings light horizontal ─
    "\u2796", // heavy minus sign ➖
    "\u2e3a", // two-em dash ⸺
    "\u2e3b", // three-em dash ⸻
    "\ud800\udd91", // roman uncia sign 𐆑
    "\u2012", // figure dash ‒
    "\u2013", // en dash –
    "\u2014", // em dash —
    "\u2015" // horizontal bar ―
  ]
};

export default {
  config,
  activeChars: [],
  charRegExp: null,
  subscriptions: null,
  decorations: [],

  activate(state) {
    // console.log("highlight-bad-chars-bl activate");
    // console.log("highlight-bad-chars-bl", state);
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
        atom.config.onDidChange(`highlight-bad-chars-bl.${key}`, flush)
      )
    );
  },

  refreshActiveChars() {
    this.activeChars = [];
    Object.entries(characters).forEach(([key, values]) => {
      if (atom.config.get(`highlight-bad-chars-bl.${key}`)) {
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
          class: "highlight-bad-chars-bl"
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
