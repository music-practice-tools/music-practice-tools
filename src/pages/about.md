---
layout: page.html.njk
permalink: /about/
title: About
templateClass: tmpl-about
eleventyNavigation:
  key: About
  order: 10
---

Steve's interactive music practice journal. An experiment to help with practicing and remote music lessons with [James Rintoul](https://www.facebook.com/james.rintoul) and courses with [Musical U](https://www.musical-u.com/).

Built using the following technology 'jamstack':

- 11ty with nunjucks and markdown
- alpinejs
- tonejs
- tonal
- abcjs
- the wonderful web platform
- nodejs, eslint and prettier
- hosting by Netlify
- editing with VS Code
- Windows

Find out more or host your own on GitHub at [GitHub](https://github.com/music-practice-tools/music-practice-tools).

Here's an example tune page source:

{% raw %}

    ---
    title: Brown Eyed Girl
    artist: Van Morrison
    key: G
    meter: 4/4
    tempo: 1/4=145
    rhythm: Pop

    ---

    ## Dots

    {%- abc title, artist, key, meter, tempo, rhythm -%}
    |:EF|"G"G2z3GB2|"C"c2zde2f2|"G"gz3c^c2|"D"d2zEzFzF:|
    {%- endabc -%}

    ## Structure

    - {% seekVideo "00:03" %} Intro
    - {% seekVideo "00:18" %} Verse
    - {% seekVideo "00:56" %} Verse
    - {% seekVideo "01:36" %} Chorus
    - {% seekVideo "01:52" %} Middle 8
    - {% seekVideo "02:04" %} Verse
    - {% seekVideo "02:42" %} Chorus

    @[youtube](kqXSBe-qMGo)

{% endraw %}

and an excerpt from the Daily activity page:

{% raw %}

    - [ ] **Fretboard** - all notes: CoF, all strings {% metronome 60 %}
    - [ ] **Scale** - play and name: maj and rel min x 3 {% randomNote "Scale" %}

{% endraw %}

More music tech stuff on my [blog](http://blog.fullmeasure.uk/).

Steve Lee
[OpenDirective](https://www.opendirective.com/)
