
chars = [
  # https://github.com/possan/sublime_unicode_nbsp/blob/master/sublime_unicode_nbsp.py
  '\x82', # High code comma
  '\x84', # High code double comma
  '\x85', # Tripple dot
  '\x88', # High carat
  '\x91', # Forward single quote
  '\x92', # Reverse single quote
  '\x93', # Forward double quote
  '\x94', # Reverse double quote
  '\x95', # <control> Message Waiting
  '\x96', # High hyphen
  '\x97', # Double hyphen
  '\x99', # <control>
  '\xA0', # No-break space
  '\xA6', # Split vertical bar
  '\xAB', # Double less than
  '\xBB', # Double greater than
  '\xBC', # one quarter
  '\xBD', # one half
  '\xBE', # three quarters
  '\xBF', # c-single quote
  '\xA8', # modifier - under curve
  '\xB1', # modifier - under line

  # https://www.cs.tut.fi/~jkorpela/chars/spaces.html
  #'\u00A0', # no-break space
  '\u1680', # ogham space mark
  '\u180E', # mongolian vowel separator
  '\u2000', # en quad
  '\u2001', # em quad
  '\u2002', # en space
  '\u2003', # em space
  '\u2004', # three-per-em space
  '\u2005', # four-per-em space
  '\u2006', # six-per-em space
  '\u2007', # figure space
  '\u2008', # punctuation space
  '\u2009', # thin space
  '\u200A', # hair space
  '\u200B', # zero width space
  '\u200D', # zero width joiner
  '\u202F', # narrow no-break space
  '\u205F', # medium mathematical space
  '\u3000', # ideographic space
  '\uFEFF', # zero width no-break space

  # others
  '\u037E',  # greek question mark
  '\u0000',  # <control>
  '\u0011',  # <control>
  '\u0012',  # <control>
  '\u0013',  # <control>
  '\u0014',  # <control>
  '\u001B',  # <control>
  '\u0080',  # <control>
  '\u0090',  # <control>
  '\u009B',  # <control>
  '\u009F',  # <control>
  '\u01C0',  # latin letter dental click
  '\u2223',  # divides
]

charRegExp = '[' + chars.join('') + ']'

module.exports = HighlightBadChars =

  activate: (state) ->
    @decorations = []
    badchars = new RegExp(charRegExp, 'g')

    console.log 'highlight-bad-chars activate.'
    atom.workspace.observeTextEditors (editor) =>
      editor.onDidChange =>
        d.getMarker().destroy() for d in @decorations
        @decorations = []

        editor.scan badchars, (obj) =>
          mark = editor.markBufferRange(obj.range, {persistent: false})
          @decorations.push editor.decorateMarker mark, {type: 'highlight', class: 'highlight-bad-chars'}
