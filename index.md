---
layout: default
title: Home
---

{% assign featured_post = site.posts | where: "featured", true | first %}
<section class="home-intro" aria-labelledby="home-heading">
  <p class="eyebrow">Software engineering / ideas that last</p>
  <h1 id="home-heading">Building with intention.</h1>
  <p>Notes on engineering, AI, and the principles that keep good software grounded.</p>
</section>

{% if featured_post %}
<section class="featured" aria-labelledby="featured-heading">
  <div class="section-heading">
    <p class="eyebrow">01 / Featured writing</p>
    <h2 id="featured-heading">The latest perspective</h2>
  </div>
  <article class="featured-card">
    <a class="featured-card__image" href="{{ featured_post.url | relative_url }}" aria-label="Read {{ featured_post.title | escape }}">
      <img src="{{ featured_post.card_image | relative_url }}" alt="{{ featured_post.card_image_alt | escape }}" width="{{ featured_post.card_image_width }}" height="{{ featured_post.card_image_height }}">
    </a>
    <div class="featured-card__content">
      <p class="eyebrow">{{ featured_post.card_category | escape }} <span aria-hidden="true">/</span> {{ featured_post.date | date: "%b %d, %Y" }}</p>
      <h3><a href="{{ featured_post.url | relative_url }}">{{ featured_post.title | escape }}</a></h3>
      <p>{{ featured_post.card_summary | escape }}</p>
      <a class="text-link" href="{{ featured_post.url | relative_url }}">Read the article <span aria-hidden="true">↗</span></a>
    </div>
  </article>
</section>
{% endif %}

<section class="archive" aria-labelledby="archive-heading">
  <div class="section-heading">
    <p class="eyebrow">02 / Archive</p>
    <h2 id="archive-heading">More from the blog</h2>
  </div>
  <ul class="archive-list">
    {% for post in site.posts %}
      {% unless post.featured %}
      <li>
        <article>
          <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: "%b %d, %Y" }}</time>
          <h3><a href="{{ post.url | relative_url }}">{{ post.title | escape }} <span aria-hidden="true">↗</span></a></h3>
        </article>
      </li>
      {% endunless %}
    {% endfor %}
  </ul>
</section>
