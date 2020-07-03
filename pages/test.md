---
title: test
date: 2020-05-20
layout: tune.html.njk
permalink: '/{{ page.fileSlug }}/'
---

{% activityList %}

- {% dailyCheck %} **Finger warm up**
- {% dailyCheck %} two

{% endactivityList %}

{% timer pid="test", tid="test" %}

{% metronome bpm=99, pid="zzz" %}
{% randomNumber text="1-3", min=1, max=3, pid='wibble' %}
{% randomNote text="Start", pid="test"%}
