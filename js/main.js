(function () {
  "use strict";

  var site = window.SITE;
  var app = document.getElementById("app");
  var page = document.body.dataset.page;
  var params = new URLSearchParams(window.location.search);
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- helpers ---------- */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      var value = attrs[key];
      if (value === null || value === undefined || value === false) return;
      if (key === "text") node.textContent = value;
      else if (key === "html") node.innerHTML = value;
      else if (key === "class") node.className = value;
      else if (key === "style") Object.assign(node.style, value);
      else node.setAttribute(key, value === true ? "" : value);
    });
    (children || []).forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  // Text that slides to a second label on hover (ABOUT -> CONTACT).
  function swap(label, hoverLabel) {
    return el("span", { class: "swap" }, [
      el("span", { text: label }),
      el("span", { text: hoverLabel || label, "aria-hidden": "true" }),
    ]);
  }

  function category(slug) {
    return site.categories.find(function (c) { return c.slug === slug; }) || null;
  }

  function projectsIn(slug) {
    return site.projects.filter(function (p) { return !slug || p.category === slug; });
  }

  function src(project, image) {
    return "images/" + project.slug + "/" + image.src;
  }

  function isLandscape(image) {
    return image.w && image.h && image.w > image.h;
  }

  // <img> that fades in once loaded and reserves its space beforehand.
  function picture(url, alt, image, eager) {
    var img = el("img", {
      src: url,
      alt: alt,
      class: "fade",
      loading: eager ? "eager" : "lazy",
      decoding: "async",
    });
    if (image && image.w && image.h) img.style.aspectRatio = image.w + " / " + image.h;
    function done() { img.classList.add("is-loaded"); }
    if (img.complete && img.naturalWidth) done();
    else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
    return img;
  }

  function storage(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  // Shrinks or grows a single line of text until it is `ratio` of the viewport wide.
  function fitWidth(node, ratio) {
    function fit() {
      node.style.fontSize = "100px";
      var width = node.getBoundingClientRect().width || 1;
      var target = window.innerWidth * (window.innerWidth < 700 ? Math.max(ratio, 0.72) : ratio);
      node.style.fontSize = Math.min(100 * target / width, window.innerHeight * 0.3) + "px";
    }
    fit();
    if (document.fonts) document.fonts.ready.then(fit);
    window.addEventListener("resize", fit);
  }

  function setTitle(title) {
    document.title = title ? title + " — " + site.name : site.name + " — " + site.role;
  }

  /* ---------- shared chrome ---------- */

  function topbar(left, right) {
    var bar = el("header", { class: "topbar mono" }, [
      el("div", { class: "topbar__left" }, [left]),
      el("a", { class: "topbar__name", href: "index.html", "aria-label": site.name + ", home" }, [swap(site.name, "Homepage")]),
      el("div", { class: "topbar__right" }, [right]),
    ]);
    document.body.insertBefore(bar, app);
  }

  function bottomnav(current) {
    var items = [{ href: "work.html", label: "Overview", key: "overview" }]
      .concat(site.categories.map(function (c) {
        return { href: "work.html?c=" + c.slug, label: c.title, key: c.slug };
      }));
    var aside = [
      { href: "projects.html", label: "Projects", key: "projects" },
      { href: "info.html", label: "Info", key: "info" },
    ];

    function link(item, cls) {
      return el("a", {
        class: cls,
        href: item.href,
        "aria-current": item.key === current ? "page" : null,
        text: item.label,
      });
    }

    var menu = el("div", { class: "menu", id: "menu", hidden: true, role: "dialog", "aria-modal": "true", "aria-label": "Menu" },
      [el("a", { href: "index.html", text: "Home" })]
        .concat(items.concat(aside).map(function (item) { return link(item); }))
        .concat([el("button", { type: "button", class: "pill", text: "Close" })]));

    var menuButton = el("button", {
      type: "button",
      class: "pill bottomnav__menu",
      "aria-expanded": "false",
      "aria-controls": "menu",
      text: "Menu",
    });

    var nav = el("nav", { class: "bottomnav", "aria-label": "Main" }, [
      el("div", { class: "bottomnav__group" }, items.map(function (item) { return link(item, "pill"); })),
      el("div", { class: "bottomnav__group" }, aside.map(function (item) { return link(item, "pill"); })),
      menuButton,
    ]);

    function toggle(open) {
      menu.hidden = !open;
      menuButton.setAttribute("aria-expanded", String(open));
      document.documentElement.classList.toggle("is-locked", open);
      (open ? menu.querySelector("a") : menuButton).focus();
    }
    menuButton.addEventListener("click", function () { toggle(true); });
    menu.querySelector("button").addEventListener("click", function () { toggle(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) toggle(false);
    });

    document.body.appendChild(nav);
    document.body.appendChild(menu);
  }

  /* ---------- home ---------- */

  function renderHome() {
    setTitle();
    var lines = site.nameLines && site.nameLines.length ? site.nameLines : site.name.split(" ");
    var half = Math.ceil(lines.length / 2);

    var name = el("h1", { class: "home__name" }, lines.map(function (line, i) {
      return el("span", { "data-half": i < half ? "top" : "bottom", text: line });
    }));
    name.setAttribute("aria-label", site.name);

    var previews = el("div", { class: "home__previews", "aria-hidden": "true" });

    function pill(slug) {
      var c = category(slug);
      if (!c) return null;
      var link = el("a", { class: "pill", href: "work.html?c=" + c.slug, text: c.title + " Works" });
      if (canHover) {
        link.addEventListener("mouseenter", function () { open(c.slug); });
        link.addEventListener("mouseleave", close);
      }
      link.addEventListener("focus", function () { open(c.slug); });
      link.addEventListener("blur", close);
      return link;
    }

    // Splits the name and shows three photos from the hovered category.
    function open(slug) {
      previews.innerHTML = "";
      var images = [];
      projectsIn(slug).forEach(function (p) {
        p.images.forEach(function (image) { images.push({ project: p, image: image }); });
      });
      images.slice(0, 3).forEach(function (item) {
        previews.appendChild(el("img", { src: src(item.project, item.image), alt: "" }));
      });
      home.classList.add("is-open");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { previews.classList.add("is-visible"); });
      });
    }
    function close() {
      home.classList.remove("is-open");
      previews.classList.remove("is-visible");
    }

    var home = el("section", { class: "home" }, [
      previews,
      name,
      el("div", { class: "home__pills" }, [pill(site.home.left), pill(site.home.right)]),
      el("nav", { class: "home__links mono", "aria-label": "Main" }, [
        el("a", { href: "work.html" }, [swap("Overview", "Images")]),
        el("a", { href: "projects.html" }, [swap("Projects", "Stories")]),
        el("a", { href: "info.html" }, [swap("Info", "Contact")]),
      ]),
    ]);
    app.appendChild(home);
    topbar(null, null);
  }

  /* ---------- work: image grid of a category ---------- */

  function renderWork() {
    var current = category(params.get("c"));
    var heading = current ? current.title : site.name;
    setTitle(current ? current.title : "Overview");

    var items = [];
    projectsIn(current && current.slug).forEach(function (project) {
      project.images.forEach(function (image, i) {
        items.push({ project: project, image: image, index: i });
      });
    });
    // On the overview, alternate projects so one story doesn't fill the screen.
    if (!current) {
      items.sort(function (a, b) { return a.index - b.index; });
    }

    var title = el("h1", { text: heading });
    var grid = el("div", { class: "work__grid", "data-size": "m" });

    items.forEach(function (item, n) {
      var tile = el("div", { class: "tile" }, [
        el("button", {
          type: "button",
          class: "tile__open",
          "aria-label": "Enlarge " + item.project.title + ", image " + (item.index + 1),
          "aria-expanded": "false",
          style: { display: "block", width: "100%" },
        }, [picture(src(item.project, item.image), item.project.title, item.image, n < 8)]),
        el("a", {
          class: "tile__label",
          href: "project.html?p=" + item.project.slug,
          tabindex: "-1",
          text: item.project.title + " →",
        }),
      ]);
      tile.querySelector("button").addEventListener("click", function () { expand(tile); });
      grid.appendChild(tile);
    });

    // Clicking a photo enlarges it in place.
    function expand(tile) {
      var opening = !tile.classList.contains("is-expanded");
      function apply() {
        grid.querySelectorAll(".tile.is-expanded").forEach(function (t) {
          t.classList.remove("is-expanded");
          t.querySelector("button").setAttribute("aria-expanded", "false");
          t.querySelector(".tile__label").setAttribute("tabindex", "-1");
        });
        if (opening) {
          tile.classList.add("is-expanded");
          tile.querySelector("button").setAttribute("aria-expanded", "true");
          tile.querySelector(".tile__label").removeAttribute("tabindex");
        }
      }
      if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        grid.querySelectorAll(".tile").forEach(function (t, i) { t.style.viewTransitionName = "tile-" + i; });
        document.startViewTransition(apply).finished.then(function () {
          grid.querySelectorAll(".tile").forEach(function (t) { t.style.viewTransitionName = ""; });
        });
      } else apply();
      if (opening) {
        setTimeout(function () { tile.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 350);
      }
    }

    document.addEventListener("keydown", function (e) {
      var open = grid.querySelector(".tile.is-expanded");
      if (e.key === "Escape" && open) expand(open);
    });

    // S / M / L density switch
    var sizes = el("div", { role: "group", "aria-label": "Image size" }, ["s", "m", "l"].map(function (size) {
      return el("button", { type: "button", "data-size": size, "aria-pressed": "false", text: size.toUpperCase() });
    }));
    function setSize(size) {
      grid.dataset.size = size;
      sizes.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.size === size));
      });
      storage("portfolio-size", size);
    }
    sizes.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (b) setSize(b.dataset.size);
    });
    setSize(["s", "m", "l"].indexOf(storage("portfolio-size")) > -1 ? storage("portfolio-size") : "m");

    app.appendChild(el("section", { class: "work" }, [
      el("div", { class: "work__title", "aria-hidden": "false" }, [title]),
      grid,
    ]));
    fitWidth(title, 0.52);

    topbar(el("span", { text: "Scroll to discover" }), sizes);
    bottomnav(current ? current.slug : "overview");
  }

  /* ---------- projects index ---------- */

  function renderProjects() {
    setTitle("Projects");
    var list = el("section", { class: "projects", "aria-label": "Projects" });
    site.projects.forEach(function (project, i) {
      var cover = project.images[0];
      list.appendChild(el("a", { class: "card", href: "project.html?p=" + project.slug }, [
        el("div", { class: "card__media" }, [picture(src(project, cover), "", cover, i < 4)]),
        el("p", { class: "card__meta" }, [
          el("span", { text: project.title }),
          el("span", { text: "View project" }),
        ]),
      ]));
    });
    app.appendChild(list);
    topbar(el("span", { text: site.projects.length + " Projects" }), null);
    bottomnav("projects");
  }

  /* ---------- single project ---------- */

  function renderProject() {
    var position = site.projects.findIndex(function (p) { return p.slug === params.get("p"); });
    if (position === -1) {
      setTitle("Not found");
      app.appendChild(el("section", { class: "not-found" }, [
        el("p", { class: "mono", text: "This project does not exist." }),
        el("a", { class: "pill", href: "projects.html", text: "All projects" }),
      ]));
      topbar(null, null);
      bottomnav("projects");
      return;
    }

    var project = site.projects[position];
    var next = site.projects[(position + 1) % site.projects.length];
    var c = category(project.category);
    setTitle(project.title);

    var lightbox = createLightbox(project);

    var hero = el("button", { type: "button", class: "p-hero", "aria-label": "Open " + project.title + " full screen" }, [
      picture(src(project, project.images[0]), project.title, null, true),
      el("h1", { text: project.title }),
    ]);
    hero.addEventListener("click", function () { lightbox.open(0, hero); });

    var details = [["Client", project.client], ["Category", c && c.title], ["Year", project.year]]
      .concat(project.credits || [])
      .filter(function (row) { return row[1]; });

    var info = el("section", { class: "p-info" }, [
      el("p", { class: "p-info__text", text: project.description || "" }),
      el("dl", { class: "p-info__details mono" }, details.map(function (row) {
        return el("div", {}, [el("dt", { text: row[0] }), el("dd", { text: row[1] })]);
      })),
    ]);

    // Landscapes take the full width; portraits sit in pairs, and a portrait
    // without a partner is centred on its own.
    var gallery = el("section", { class: "p-gallery", "aria-label": "Images" });
    var rest = project.images.slice(1);
    for (var i = 0; i < rest.length; i++) {
      var image = rest[i];
      var cls = "frame";
      if (isLandscape(image) || !image.w) cls += " is-wide";
      else if (!rest[i + 1] || isLandscape(rest[i + 1]) || !rest[i + 1].w) cls += " is-single";
      else {
        gallery.appendChild(frame(image, i + 1, cls));
        i++;
        image = rest[i];
      }
      gallery.appendChild(frame(image, i + 1, cls));
    }

    function frame(image, index, cls) {
      var button = el("button", { type: "button", class: cls, "aria-label": "Open image " + (index + 1) + " full screen" }, [
        picture(src(project, image), project.title + " — image " + (index + 1), image, false),
      ]);
      button.addEventListener("click", function () { lightbox.open(index, button); });
      return button;
    }

    var nextLink = el("a", { class: "p-next", href: "project.html?p=" + next.slug }, [
      el("span", { class: "mono", text: "Next project" }),
      el("span", { class: "p-next__title", text: next.title }),
      el("img", { src: src(next, next.images[0]), alt: "", loading: "lazy" }),
    ]);

    app.appendChild(hero);
    app.appendChild(info);
    app.appendChild(gallery);
    app.appendChild(nextLink);

    topbar(
      el("span", { text: (c ? c.title + ", " : "") + project.year }),
      el("span", { text: project.images.length + " Images" })
    );
    bottomnav(project.category);
  }

  /* ---------- lightbox ---------- */

  function createLightbox(project) {
    var icons = {
      close: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13"/></svg>',
      prev: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1L3 7l6 6"/></svg>',
      next: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1l6 6-6 6"/></svg>',
    };
    var img = el("img", { alt: "" });
    var count = el("p", { class: "lightbox__count mono", "aria-live": "polite" });
    var closeBtn = el("button", { type: "button", class: "lightbox__btn lightbox__close", "aria-label": "Close", html: icons.close });
    var prevBtn = el("button", { type: "button", class: "lightbox__btn lightbox__prev", "aria-label": "Previous image", html: icons.prev });
    var nextBtn = el("button", { type: "button", class: "lightbox__btn lightbox__next", "aria-label": "Next image", html: icons.next });
    var root = el("div", { class: "lightbox", role: "dialog", "aria-modal": "true", "aria-label": project.title, hidden: true },
      [img, count, closeBtn, prevBtn, nextBtn]);
    document.body.appendChild(root);

    var total = project.images.length;
    var current = 0;
    var opener = null;

    function show(i) {
      current = (i + total) % total;
      img.src = src(project, project.images[current]);
      img.alt = project.title + " — image " + (current + 1);
      count.textContent = String(current + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
      [current + 1, current - 1].forEach(function (n) {
        new Image().src = src(project, project.images[(n + total) % total]);
      });
    }

    function open(i, trigger) {
      opener = trigger;
      show(i);
      root.hidden = false;
      document.documentElement.classList.add("is-locked");
      closeBtn.focus();
    }

    function close() {
      root.hidden = true;
      document.documentElement.classList.remove("is-locked");
      if (opener) opener.focus();
    }

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () { show(current - 1); });
    nextBtn.addEventListener("click", function () { show(current + 1); });
    root.addEventListener("click", function (e) { if (e.target === root) close(); });

    document.addEventListener("keydown", function (e) {
      if (root.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
      else if (e.key === "Tab") {
        var focusables = [closeBtn, prevBtn, nextBtn];
        var at = focusables.indexOf(document.activeElement);
        e.preventDefault();
        focusables[(at + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length].focus();
      }
    });

    var startX = null;
    root.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    });

    return { open: open };
  }

  /* ---------- info ---------- */

  function renderInfo() {
    setTitle("Info");
    var info = site.info;

    function list(items) {
      return el("ul", {}, items.map(function (item) {
        return item instanceof Node ? item : el("li", { text: item });
      }));
    }

    var contact = [
      el("li", {}, [el("a", { href: "mailto:" + site.email, text: site.email })]),
      site.phone ? el("li", {}, [el("a", { href: "tel:" + site.phone.replace(/[^+\d]/g, ""), text: site.phone })]) : null,
      el("li", { class: "gap" }, [el("a", { href: site.instagram, target: "_blank", rel: "noopener", text: "Instagram" })]),
      el("li", { class: "gap muted", text: site.location }),
    ].filter(Boolean);

    var agencies = [];
    (info.representation || []).forEach(function (r, i) {
      agencies.push(el("li", { class: i ? "gap muted" : "muted", text: r.label }));
      agencies.push(el("li", { text: r.name }));
      agencies.push(el("li", {}, [el("a", { href: "mailto:" + r.email, text: r.email })]));
      if (r.phone) agencies.push(el("li", { text: r.phone }));
    });

    app.appendChild(el("section", { class: "info" }, [
      el("h1", { class: "info__statement", text: info.statement }),
      el("div", { class: "info__grid" }, [
        info.portrait ? el("figure", { class: "info__portrait viewfinder" }, [
          picture(info.portrait.src, "Portrait of " + site.name, info.portrait, true),
        ]) : null,
        el("section", { class: "info__block info__clients" }, [
          el("h2", { class: "mono", text: "Selected clients" }),
          list(info.clients || []),
        ]),
        el("section", { class: "info__block info__contact" }, [
          el("h2", { class: "mono", text: "Get in touch" }),
          list(contact),
          agencies.length ? el("h2", { class: "mono", text: "Representation", style: { marginTop: "40px" } }) : null,
          agencies.length ? list(agencies) : null,
        ]),
      ]),
    ]));

    topbar(el("span", { text: site.role + ", " + site.location }), null);
    bottomnav("info");
  }

  /* ---------- boot ---------- */

  ({
    home: renderHome,
    work: renderWork,
    projects: renderProjects,
    project: renderProject,
    info: renderInfo,
  }[page] || renderHome)();
})();
