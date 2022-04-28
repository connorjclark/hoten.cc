---
title: Connor Clark
layout: default
pagination:
  data: collections.post
  size: 2000 # totally punting
  reverse: true
  alias: posts
---

<style>
  article h3 {
    display: inline;
  }

  article span {
    float: right;
  }

  .pages p {
    display: inline-block;
  }

  blockquote:before {
    color: #ccc;
    content: open-quote;
    font-size: 4em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
  }
</style>

# Connor Clark
  
Hi, I'm Connor. I work on web performance tooling on Chrome (Lighthouse). I sometimes write about stuff, mostly web development.

Also, I'm working on a [game](/gridia).

## Upcoming Thoughts

* Playing Chrome Dino Runner in Chrome DevTools
* HTML Source Maps

## Recent Thoughts

{% for post in posts %}
{% if post.data.hidden != true %}
  <article>
    <h3>
      <a href="{{ post.url | url }}">{{ post.data.title }}</a>
    </h3>
    <span>
      {{ post.date | dateReadable }}
    </span>
    <blockquote>
      {% excerpt post %}
    </blockquote>
  </article>
{% endif %}
{% endfor %}
