---
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
</style>

# Connor Clark
  
Hi, I'm Connor. I work on web performance tooling on Chrome (Lighthouse). I sometimes write about stuff, mostly web development.

Also, I'm working on a [game](/gridia).

## Upcoming Thoughts

* Running Chrome Dino Runner in Chrome DevTools
* You Don't Know Chrome DevTools
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
