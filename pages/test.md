---
title: test
date: 2020-05-20
layout: tune.html.njk
permalink: '/{{ page.fileSlug }}/'
---

{% activityList %}

- {% dailyCheck %} **one**
- {% dailyCheck %} two

{% endactivityList %}

{% timer pid="test", tid="test" %}
{% activityCheck classes="task-list-item-checkbox", timerid="test" %}

{% metronome bpm=99, pid="zzz" %}
{% randomNumber text="1-3", min=1, max=3, pid='wibble' %}
{% randomNumber text="1-4", min=1, max=4  %}
{% randomNumber text="1-5", min=1, max=5  %}
{% randomNote %}
