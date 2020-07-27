---
title: Daily Practice
order: 1
tags: practice
date: 2020-07-27
---

{% timer time=5, pid="main", timerid="main", controls=false %}
{% videoRecorder time=30 %}

<!-- markdownlint-disable MD013 -->

{% activityList timerid='main', pid="daily" %}

- {% activity time=2 %} **Finger warm up**
- {% activity %} **Rythmn** - [Funky Town](/tunes/funky-town/) - upbeats
- {% activity %} **Fretboard** - All strings, order = CoF {% metronome bpm=60, pid="dp2" %} {% randomNote text="Start", pid="dp3" %}
- {% activity %} **Scales** - Play & name: maj, rel minor {% randomNote text="Scale", pid="dp4" %}
- {% activity %} **Chords** - Play & name: triads on 1 6 4 5 (same scale)
- {% activity %} **Ear training** - C, F, G: Do Fa So La Do
- {% activity %} **Improvisation** - play 3 patterns, a few lines each
- {% activity %} **Reading** - p14-18 pitch, rhythm, together {% randomNumber text="Etude", min=1, max=8, pid="dp5"  %}
- {% activity %} **Tune** - [Autumn Leaves](/tunes/autumn-leaves) - iReal play whole/half notes, transcribe 1st 16 bars of head, write 1st 5th half notes
- {% activity %} **Tune** - [Lady](/tunes/lady) - transcribe and learn last few parts
- {% activity %} **Tune** - [The Thrill is Gone](/tunes/the-thrill-is-gone) - with metronome on 2 & 4, {% metronome bpm=35, pid="dp6" %}

{% endactivityList %}

<!-- markdownlint-enable MD013 -->
