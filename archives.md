---
id: 492
title: Archives
layout: post
nav-short: true
guid: 'https://marcusfelling.com/?page_id=492'
---

<div class="archive-filters">
  <button class="tag-filter active" data-filter="all">All</button>
  <button class="tag-filter" data-filter="azure-devops">Azure DevOps</button>
  <button class="tag-filter" data-filter="cicd">CI/CD</button>
  <button class="tag-filter" data-filter="playwright">Playwright</button>
  <button class="tag-filter" data-filter="git">Git</button>
  <button class="tag-filter" data-filter="github-actions">GitHub Actions</button>
  <button class="tag-filter" data-filter="octopus-deploy">Octopus Deploy</button>
  <button class="tag-filter" data-filter="infra-as-code">Infra as Code</button>
  <button class="tag-filter" data-filter="windows">Windows</button>
  <button class="tag-filter" data-filter="vs-code-extensions">VS Code Extensions</button>
  <button class="tag-filter" data-filter="ai">AI</button>
  <button class="tag-filter" data-filter="other">Other</button>
</div>

<p class="archive-count"><span id="visible-count">{{ site.posts | size }}</span> of {{ site.posts | size }} posts</p>

{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for year_group in posts_by_year %}
<section class="archive-year-group">
  <h2 class="archive-year-heading">{{ year_group.name }}</h2>
  <ul class="archive-list">
    {% for post in year_group.items %}
    {% comment %}Build space-separated filter slugs. Normalize Azure Pipelines â†’ azure-devops.{% endcomment %}
    {% assign _tag_slugs = "" %}
    {% for tag in post.tags %}
      {% if tag == "Azure Pipelines" or tag == "Azure DevOps" %}
        {% assign _slug = "azure-devops" %}
      {% elsif tag == "DevOps" %}
        {% assign _slug = "cicd" %}
      {% elsif tag == "GitHub Copilot" %}
        {% assign _slug = "ai" %}
      {% else %}
        {% assign _slug = tag | slugify %}
      {% endif %}
      {% if _tag_slugs == "" %}
        {% assign _tag_slugs = _slug %}
      {% else %}
        {% assign _tag_slugs = _tag_slugs | append: " " | append: _slug %}
      {% endif %}
    {% endfor %}
    {% if _tag_slugs == "" %}{% assign _tag_slugs = "other" %}{% endif %}
    <li class="archive-post-item" data-tags="{{ _tag_slugs }}">
      <a class="archive-post-title" href="{{ post.url }}">{{ post.title }}</a>
      <span class="archive-meta">
        {% for tag in post.tags %}
          {% if tag == "Azure Pipelines" or tag == "Azure DevOps" %}
            {% assign _atag_slug = "azure-devops" %}
          {% elsif tag == "CICD" or tag == "DevOps" %}
            {% assign _atag_slug = "cicd" %}
          {% elsif tag == "GitHub Copilot" %}
            {% assign _atag_slug = "ai" %}
          {% else %}
            {% assign _atag_slug = tag | slugify %}
          {% endif %}
          <span class="archive-tag" data-filter="{{ _atag_slug }}">{{ tag }}</span>
        {% endfor %}
        {% if post.tags.size == 0 %}<span class="archive-tag" data-filter="other">Other</span>{% endif %}
      </span>
    </li>
    {% endfor %}
  </ul>
</section>
{% endfor %}

<p class="archive-empty-state" id="archive-empty">No posts match this filter.</p>

<script>
(function () {
  var filters = document.querySelectorAll('.tag-filter');
  var items   = document.querySelectorAll('.archive-post-item');
  var groups  = document.querySelectorAll('.archive-year-group');
  var countEl = document.getElementById('visible-count');
  var emptyEl = document.getElementById('archive-empty');

  function applyFilter(filter) {
    var visible = 0;

    items.forEach(function (item) {
      var show = filter === 'all' || (' ' + item.dataset.tags + ' ').indexOf(' ' + filter + ' ') !== -1;
      if (show) {
        item.style.display = '';
        item.style.opacity = '1';
        visible++;
      } else {
        item.style.opacity = '0';
        item.style.display = 'none';
      }
    });

    groups.forEach(function (group) {
      var anyVisible = Array.prototype.some.call(
        group.querySelectorAll('.archive-post-item'),
        function (i) { return i.style.display !== 'none'; }
      );
      group.style.display = anyVisible ? '' : 'none';
    });

    countEl.textContent = visible;
    if (emptyEl) emptyEl.classList.toggle('visible', visible === 0);
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      applyFilter(this.dataset.filter);
    });
  });

  document.addEventListener('click', function (e) {
    var tag = e.target.closest('.archive-tag[data-filter]');
    if (!tag) return;
    var slug = tag.dataset.filter;
    var matchBtn = null;
    filters.forEach(function (b) { if (b.dataset.filter === slug) matchBtn = b; });
    if (matchBtn) matchBtn.click();
  });

  function activateFromHash() {
    var hash = window.location.hash.replace('#', '');
    if (!hash) return;
    var matchBtn = null;
    filters.forEach(function (b) {
      if (b.dataset.filter === hash) matchBtn = b;
    });
    if (matchBtn) matchBtn.click();
  }
  activateFromHash();
  window.addEventListener('hashchange', activateFromHash);
}());
</script>
