# Changelog

## v2.0.0 (2019-01-07)

- Switched to using a whitelist of characters (printable Basic Latin)
- The user can augment the whitelist in the settings
- Added prettier and prettier-check in CI

## v1.4.1 (2019-01-07)

- Fixed overly eager highlighting affecting <tab>, LF and CR

## v1.4.0 (2019-01-07)

- Switched language: CoffeeScript -> ES6
- Added settings to choose categories of highlighted characters
- Refactored the character listing, using ranges in places

## v1.3.0 (2019-01-03)

- Merged PR with lighter color and changes to char listing

## History

- **v1.0.0**: Originally forked from `pohjolainen/atom-highlight-nbsp` and initial char listing based on https://github.com/possan/sublime_unicode_nbsp/blob/master/sublime_unicode_nbsp.py
- Bulk of whitespace and control characters added in **v1.0.3**
- From then on, mainly just changes to character sets up until **v1.3.0**
