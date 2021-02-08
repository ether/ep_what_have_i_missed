![Publish Status](https://github.com/ether/ep_what_have_i_missed/workflows/Node.js%20Package/badge.svg) ![Backend Tests Status](https://github.com/ether/ep_what_have_i_missed/workflows/Backend%20tests/badge.svg)

## What have I missed while being away from a pad?  

This plugin aids to help authors that have been absent from a pad to be able to "quickly" catch up with what's been changed since they were last present.

When an author revisits an old pad they are presented a message saying "Since you were last here there have been XX changes to this pad.  Review the changes"

The author is initially presented with a differential snapshot of the changes since they were last present.  

If this is not sufficient and the author wants additional information then a link to the timeslider(including their previous position) is available.

## Views

 1. Atomic: Link to timeslider at point author was last present on the pad.  Useful for full timeline of events.
 1. Differential(default): A "diff" view shows a comparison of before/after line-by-line.  Useful for a quick snap shot of what has changed from point A to Z but does not include steps on the way through and also does not include who has changed what.  For further analysis the Atomic / timeslider view can be used.

# Security consideration
The plugin stores the last revision an author was present on a pad in their browser cookies.  This means the padId is present in their browser cookies.

[![Travis (.org)](https://img.shields.io/travis/JohnMcLear/ep_what_have_i_missed)](https://travis-ci.org/github/JohnMcLear/ep_what_have_i_missed)

# Installing

Option 1.

Use the ``/admin`` interface, search for ``ep_what_have_i_missed`` and click Install

Option 2.
```
npm install ep_what_have_i_missed
```

Option 3.
```
cd your_etherpad_install/node_modules
git clone https://github.com/JohnMcLear/ep_what_have_i_missed
```

# Bug Reports

Please submit bug reports or patches at https://github.com/JohnMcLear/ep_what_have_i_missed/issues

# Todo
- [ ] Stats
- [ ] Full test coverage
