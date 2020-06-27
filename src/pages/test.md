---
title: test
date: 2020-05-20
layout: tune.html.njk
permalink: '/{{ page.fileSlug }}/'
---

{% metronome 60, null, null, null, "test" %}
{% randomNumber "1-3", 1, 3,'wibble' %}
{% randomNumber "1-4", 1, 4  %}
{% randomNumber "1-5", 1, 5  %}
{% randomNote %}
