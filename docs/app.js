// Renders the shared header, sidebar, and footer from window.KOYO_NAV
// (defined in nav.js), then wires up the theme toggle, keyboard search, and
// the Groq based chat assistant. The same file runs on every page.

(function () {
  "use strict";

  var NAV = window.KOYO_NAV;
  var INDEX = window.KOYO_SEARCH_INDEX || [];

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === "text") {
          node.textContent = attrs[key];
        } else if (key === "html") {
          node.innerHTML = attrs[key];
        } else if (key === "cls") {
          node.className = attrs[key];
        } else {
          node.setAttribute(key, attrs[key]);
        }
      });
    }
    (children || []).forEach(function (child) {
      node.appendChild(child);
    });
    return node;
  }

  var ICONS = {
    search:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.2" y2="16.2"></line></svg>',
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"></circle><line x1="12" y1="2" x2="12" y2="4.5"></line><line x1="12" y1="19.5" x2="12" y2="22"></line><line x1="2" y1="12" x2="4.5" y2="12"></line><line x1="19.5" y1="12" x2="22" y2="12"></line><line x1="4.6" y1="4.6" x2="6.4" y2="6.4"></line><line x1="17.6" y1="17.6" x2="19.4" y2="19.4"></line><line x1="4.6" y1="19.4" x2="6.4" y2="17.6"></line><line x1="17.6" y1="6.4" x2="19.4" y2="4.6"></line></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"></path></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    chat:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l2-5.7a8.4 8.4 0 1 1 16-3.8Z"></path></svg>',
    send: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
    copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  };

  function buildHeader() {
    var header = document.getElementById("site-header");
    if (!header) return;
    header.classList.add("site-header");

    var brand = el("a", {
      href: NAV.brand.href,
      cls: "brand",
      html:
        '<img src="assets/icon.png" alt="Koyo Docs">' +
        '<span>Koyo Docs</span>',
    });

    var navToggle = el("button", {
      type: "button",
      cls: "nav-toggle",
      "aria-label": "Toggle navigation",
      html: ICONS.menu,
    });
    navToggle.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });

    var kbdText = /Mac/i.test(navigator.platform || "") ? "Cmd K" : "Ctrl K";

    var searchButton = el("button", {
      type: "button",
      cls: "search-button",
      "aria-haspopup": "dialog",
      html:
        ICONS.search +
        '<span class="search-label">Search the docs</span>' +
        '<span class="kbd">' + kbdText + '</span>',
    });
    searchButton.addEventListener("click", openSearch);

    var themeBtn = el("button", {
      type: "button",
      cls: "icon-btn",
      "aria-label": "Toggle color theme",
      html: themeIcon(),
    });
    themeBtn.addEventListener("click", function () {
      KoyoTheme.toggle();
      themeBtn.innerHTML = themeIcon();
    });

    var inner = el("div", { cls: "header-inner" }, [
      navToggle,
      brand,
      el("div", { cls: "header-spacer" }),
      searchButton,
      themeBtn,
    ]);

    header.appendChild(inner);
  }

  function themeIcon() {
    return KoyoTheme.current() === "dark" ? ICONS.sun : ICONS.moon;
  }

  function buildSidebar() {
    var nav = document.getElementById("sidebar");
    if (!nav) return;

    var activePage =
      document.body.getAttribute("data-page") || "";

    var groups = NAV.sections.map(function (section) {
      var links = section.links.map(function (link) {
        var href = link.page + ".html";
        var anchor = el("a", {
          href: href,
          cls: link.page === activePage ? "nav-link active" : "nav-link",
          text: link.label,
        });
        return el("li", { cls: "nav-item" }, [anchor]);
      });
      return el("div", { cls: "nav-group" }, [
        el("p", { cls: "nav-label", text: section.label }),
        el("ul", { cls: "nav-list" }, links),
      ]);
    });

    groups.forEach(function (g) {
      nav.appendChild(g);
    });
  }

  function buildFooter() {
    var footer = document.getElementById("site-footer");
    if (!footer) return;
    footer.classList.add("site-footer");
    var inner = el("div", { cls: "footer-inner" }, [
      el(
        "span",
        { text: "Koyo documentation. Static site with search and an assistant." }
      ),
      el(
        "a",
        { href: "index.html", text: "Back to the home page" }
      ),
    ]);
    footer.appendChild(inner);
  }

  // ---- Code chrome (highlighting and copy) ----------------------------

  // highlight.js is vendored at assets/vendor/highlight.min.js so the site
  // keeps working when opened directly from disk. It is loaded lazily and
  // applied to every <pre><code> in the page at once, then re-applied to
  // code blocks that arrive later from the chat assistant.
  var HLJS_SRC = "assets/vendor/highlight.min.js";

  function highlightAllIn(root) {
    if (!window.hljs || !hljs.highlightElement) return;
    var blocks = root.querySelectorAll("pre code");
    blocks.forEach(function (code) {
      if (code.classList.contains("hljs")) return;
      try {
        hljs.highlightElement(code);
      } catch (err) {
        // Never let a highlighting error break the page.
      }
    });
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for contexts where the async clipboard API is unavailable.
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(ta);
    }
    return Promise.resolve();
  }

  function flashCopied(button) {
    button.classList.add("copied");
    button.setAttribute("aria-label", "Copied");
    button.innerHTML = ICONS.check + "<span>Copied</span>";
    window.setTimeout(function () {
      button.classList.remove("copied");
      button.setAttribute("aria-label", "Copy code");
      button.innerHTML = ICONS.copy;
    }, 1600);
  }

  function attachCopyButtons(root) {
    root.querySelectorAll("pre").forEach(function (pre) {
      if (pre.getAttribute("data-copy") === "done") return;
      pre.setAttribute("data-copy", "done");
      var button = el("button", {
        type: "button",
        cls: "copy-btn",
        "aria-label": "Copy code",
        html: ICONS.copy,
      });
      button.addEventListener("click", function () {
        copyTextToClipboard(pre.innerText || pre.textContent || "")
          .then(function () {
            flashCopied(button);
          })
          .catch(function () {
            flashCopied(button);
          });
      });
      pre.appendChild(button);
    });
  }

  function ensureHighlight() {
    if (window.hljs) {
      highlightAllIn(document);
      attachCopyButtons(document);
      return;
    }
    var script = document.createElement("script");
    script.src = HLJS_SRC;
    script.addEventListener("load", function () {
      highlightAllIn(document);
      attachCopyButtons(document);
    });
    script.addEventListener("error", function () {
      // Without highlighting the copy buttons still work.
      attachCopyButtons(document);
    });
    document.head.appendChild(script);
  }

  // ---- Markdown rendering for the assistant ---------------------------

  // A small, safe markdown subset renderer used for assistant messages.
  // Input is HTML-escaped first, so model output can never inject markup.
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderInline(text) {
    var v = escapeHtml(text);
    v = v.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    v = v.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    v = v.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" rel="noopener" target="_blank">$1</a>');
    return v;
  }

  function renderMarkdown(text) {
    var lines = String(text).replace(/\r\n?/g, "\n").split("\n");
    var html = "";
    var paragraph = [];
    var listKind = null;
    var listItems = [];
    var codeLines = null;
    var codeLang = "";

    function isCodeFence(line) {
      return /^```/.test(line) || /^~~~/.test(line);
    }

    function flushParagraph() {
      if (paragraph.length) {
        html += "<p>" + renderInline(paragraph.join(" ")) + "</p>";
        paragraph = [];
      }
    }

    function flushList() {
      if (!listKind) return;
      var tag = listKind === "ol" ? "ol" : "ul";
      var items = listItems.map(function (item) {
        return "<li>" + renderInline(item) + "</li>";
      }).join("");
      html += "<" + tag + ">" + items + "</" + tag + ">";
      listKind = null;
      listItems = [];
    }

    function flushCode() {
      if (codeLines === null) return;
      var lang = codeLang.replace(/[^a-zA-Z0-9_-]/g, "");
      var body = escapeHtml(codeLines.join("\n"));
      html +=
        '<pre><code class="language-' + lang + '">' + body + "</code></pre>";
      codeLines = null;
      codeLang = "";
    }

    lines.forEach(function (line) {
      var trimmed = line;

      if (codeLines !== null) {
        if (isCodeFence(trimmed) && codeLines.length > 0) {
          flushCode();
        }
        if (codeLines !== null) {
          codeLines.push(line);
        }
        return;
      }

      if (isCodeFence(trimmed)) {
        flushParagraph();
        flushList();
        codeLang = trimmed.replace(/^```|^~~~/, "").trim();
        codeLines = [];
        return;
      }

      var heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        flushParagraph();
        flushList();
        var level = Math.min(heading[1].length + 2, 6);
        html += "<h" + level + ">" + renderInline(heading[2]) + "</h" + level + ">";
        return;
      }

      if (!trimmed) {
        flushParagraph();
        flushList();
        return;
      }

      var ordered = trimmed.match(/^\d+\.\s+(.*)$/);
      var unordered = trimmed.match(/^[-*]\s+(.*)$/);
      if (ordered || unordered) {
        flushParagraph();
        var kind = ordered ? "ol" : "ul";
        var item = ordered ? ordered[1] : unordered[1];
        if (listKind !== kind) {
          flushList();
          listKind = kind;
        }
        listItems.push(item);
        return;
      }

      flushList();
      paragraph.push(trimmed);
    });

    flushCode();
    flushParagraph();
    flushList();

    return html || "<p></p>";
  }

  function renderAssistantMessage(node, text) {
    node.innerHTML = renderMarkdown(text);
    highlightAllIn(node);
    attachCopyButtons(node);
  }

  // ---- Search ---------------------------------------------------------

  var searchModal = null;
  var searchInput = null;
  var searchResultsEl = null;
  var searchActiveIndex = -1;
  var searchResults = [];

  function normalize(text) {
    return (text || "").toLowerCase();
  }

  function scoreEntry(queryTokens, entry) {
    var title = normalize(entry.title);
    var section = normalize(entry.section);
    var excerpt = normalize(entry.excerpt);
    var score = 0;
    queryTokens.forEach(function (token) {
      if (!token) return;
      if (title.indexOf(token) === 0) score += 5;
      if (title.indexOf(token) !== -1) score += 3;
      if (section.indexOf(token) !== -1) score += 1.5;
      if (excerpt.indexOf(token) !== -1) score += 0.5;
    });
    return score;
  }

  function runSearch(query) {
    var tokens = normalize(query).split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    return INDEX.map(function (entry) {
        return { entry: entry, score: scoreEntry(tokens, entry) };
      })
      .filter(function (hit) {
        return hit.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score;
      })
      .slice(0, 8)
      .map(function (hit) {
        return hit.entry;
      });
  }

  function renderSearchResults(query) {
    searchResults = runSearch(query);
    searchActiveIndex = searchResults.length ? 0 : -1;
    searchResultsEl.innerHTML = "";
    if (!query.trim()) {
      searchResultsEl.appendChild(
        el("p", { cls: "search-empty", text: "Type to search the documentation." })
      );
      return;
    }
    if (!searchResults.length) {
      searchResultsEl.appendChild(
        el("p", { cls: "search-empty", text: "No results for \"" + query + "\"." })
      );
      return;
    }
    searchResults.forEach(function (entry, index) {
      var meta = entry.section
        ? entry.title + " / " + entry.section
        : entry.title;
      var href = entry.page + ".html" + (entry.id ? "#" + entry.id : "");
      var link = el("a", {
        href: href,
        cls: "search-result" + (index === searchActiveIndex ? " active" : ""),
      });
      link.appendChild(el("div", { cls: "sr-title", text: entry.title }));
      link.appendChild(el("div", { cls: "sr-meta", text: meta }));
      if (entry.excerpt) {
        link.appendChild(
          el("div", { cls: "sr-excerpt", text: entry.excerpt })
        );
      }
      link.addEventListener("mousemove", function () {
        highlightSearchResult(index);
      });
      link.addEventListener("click", function () {
        closeSearch();
      });
      searchResultsEl.appendChild(link);
    });
  }

  function highlightSearchResult(index) {
    searchActiveIndex = index;
    var items = searchResultsEl.querySelectorAll(".search-result");
    items.forEach(function (item, i) {
      item.classList.toggle("active", i === index);
    });
    if (items[index]) {
      items[index].scrollIntoView({ block: "nearest" });
    }
  }

  function openSearch() {
    if (!searchModal) {
      searchModal = buildSearchModal();
      document.body.appendChild(searchModal);
    }
    searchModal.hidden = false;
    searchInput.value = "";
    renderSearchResults("");
    searchInput.focus();
  }

  function closeSearch() {
    if (searchModal) {
      searchModal.hidden = true;
    }
  }

  function buildSearchModal() {
    searchInput = el("input", {
      type: "text",
      cls: "search-input",
      placeholder: "Search the docs, for example \"state\"",
      "aria-label": "Search the documentation",
      autocomplete: "off",
    });
    searchInput.addEventListener("input", function () {
      renderSearchResults(searchInput.value);
    });
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (searchResults.length) {
          highlightSearchResult(
            (searchActiveIndex + 1) % searchResults.length
          );
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (searchResults.length) {
          highlightSearchResult(
            (searchActiveIndex - 1 + searchResults.length) %
              searchResults.length
          );
        }
      } else if (event.key === "Enter") {
        event.preventDefault();
        var active = searchResultsEl.querySelector(".search-result.active");
        if (active) {
          window.location.href = active.getAttribute("href");
        }
      } else if (event.key === "Escape") {
        closeSearch();
      }
    });

    searchResultsEl = el("div", { cls: "search-results" });

    var kbdText = /Mac/i.test(navigator.platform || "") ? "Cmd K" : "Ctrl K";

    var panel = el("div", { cls: "search-panel" }, [
      el("div", { cls: "search-input-row" }, [
        el("span", { html: ICONS.search }),
        searchInput,
        el("button", {
          type: "button",
          cls: "icon-btn",
          "aria-label": "Close search",
          html: ICONS.close,
        }),
      ]),
      searchResultsEl,
      el("div", { cls: "search-hints" }, [
        el("span", { text: "Up / Down: move" }),
        el("span", { text: "Enter: open" }),
        el("span", { text: kbdText + ": reopen" }),
        el("span", { text: "Esc: close" }),
      ]),
    ]);
    panel.querySelector('[aria-label="Close search"]').addEventListener(
      "click",
      closeSearch
    );

    var backdrop = el("div", { cls: "modal-backdrop", hidden: true }, [panel]);
    backdrop.addEventListener("mousedown", function (event) {
      if (event.target === backdrop) {
        closeSearch();
      }
    });
    return backdrop;
  }

  function handleGlobalKeys(event) {
    var meta = event.metaKey || event.ctrlKey;
    if (meta && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
    } else if (event.key === "Escape") {
      closeSearch();
      closeChat();
    }
  }

  // ---- Chat -----------------------------------------------------------

  var chatPanel = null;
  var chatMessages = null;
  var chatInput = null;
  var chatSend = null;

  // config.js is gitignored, so the page never references it in markup.
  // init() appends it as a script tag; a missing file simply leaves the
  // assistant unconfigured. The chat resolves the key lazily at request
  // time, never at startup.
  function currentConfig() {
    return window.KOYO_DOCS_CONFIG || null;
  }

  function isChatConfigured() {
    var cfg = currentConfig();
    return (
      cfg &&
      cfg.groqApiKey &&
      cfg.groqApiKey !== "YOUR_GROQ_API_KEY_HERE"
    );
  }

  // The assistant is grounded by feeding it a short framework overview plus
  // the joined search index entries as context, so answers stay limited to
  // what the documentation actually says rather than general web knowledge.
  function buildSystemPrompt() {
    var overview =
      "Koyo is a Python static-first web framework built on Starlette. " +
      "Pages are Python functions in app/ folders, mapped by file path. " +
      "It ships file based routing, nested layout.py files, an HTML tag " +
      "factory for components, per-page metadata for title, description " +
      "and Open Graph tags, Tailwind integration, vendored htmx for " +
      "interactivity, per-session in-memory state via use_state, a dev " +
      "server with live reload that patches the page in place, a dependency CLI (add, remove, " +
      "install), and a production build that prerenders static routes into " +
      ".koyo/build/site. Full details are in the documentation sections " +
      "below.";

    var context = overview + "\n\n";
    var budget = 25000;
    INDEX.forEach(function (entry) {
      var chunk = "- " + entry.title;
      if (entry.section) {
        chunk += " (" + entry.section + ")";
      }
      var body = entry.body || entry.excerpt;
      if (body) {
        chunk += ": " + body;
      }
      chunk += "\n";
      if (context.length + chunk.length > budget) return;
      context += chunk;
    });

    return (
      "You are the assistant embedded in the Koyo framework documentation. " +
      "Answer questions about Koyo only from the documentation context that " +
      "follows. If the context does not contain the answer, say you do not " +
      "have that information in the docs. You may reproduce example code " +
      "from the context verbatim in fenced code blocks. Keep answers short, " +
      "friendly and accurate. Use markdown for formatting.\n\n" +
      "DOCUMENTATION CONTEXT:\n" +
      context
    );
  }

  function addMessage(role, text) {
    var msg = el("div", { cls: "msg " + role });
    if (role === "assistant") {
      renderAssistantMessage(msg, text);
    } else {
      msg.textContent = text;
    }
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function setChatBusy(busy) {
    chatSend.disabled = busy;
    if (busy) {
      chatSend.setAttribute("aria-busy", "true");
    } else {
      chatSend.removeAttribute("aria-busy");
    }
  }

  function openChat() {
    if (!chatPanel) {
      chatPanel = buildChatPanel();
      document.body.appendChild(chatPanel);
    }
    chatPanel.hidden = false;
    if (isChatConfigured()) {
      chatInput.focus();
    }
  }

  function closeChat() {
    if (chatPanel) {
      chatPanel.hidden = true;
    }
  }

  function buildChatPanel() {
    var header = el("div", { cls: "chat-header" });
    header.appendChild(
      el(
        "span",
        { cls: "chat-title", html: ICONS.chat + " <span>Ask Koyo</span>" }
      )
    );
    if (isChatConfigured()) {
      header.appendChild(
        el("span", { cls: "chat-sub", text: "" })
      );
    }
    var close = el("button", {
      type: "button",
      cls: "icon-btn",
      "aria-label": "Close chat",
      html: ICONS.close,
    });
    close.addEventListener("click", closeChat);
    header.appendChild(close);

    chatMessages = el("div", { cls: "chat-messages" });
    if (!isChatConfigured()) {
      chatMessages.appendChild(
        el("div", {
          cls: "msg banner",
          text:
            "The chat assistant is not configured yet. Copy config.example.js " +
            "to config.js in the docs folder and add your Groq API key.",
        })
      );
      chatMessages.appendChild(
        el("div", {
          cls: "msg banner",
          text: "The search bar above still works without a key.",
        })
      );
    } else {
      addMessage(
        "assistant",
        "Hi, I can answer questions about the Koyo framework from these docs."
      );
    }

    chatInput = el("input", {
      type: "text",
      cls: "chat-input",
      placeholder: "Ask about Koyo",
      "aria-label": "Ask the Koyo assistant",
      autocomplete: "off",
    });
    chatSend = el("button", {
      type: "button",
      cls: "chat-send",
      text: "Send",
    });

    function submit() {
      if (!isChatConfigured() || chatSend.disabled) return;
      var text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = "";
      addMessage("user", text);
      requestAnswer(text);
    }

    chatSend.addEventListener("click", submit);
    chatInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
    });

    var inputRow = el("div", { cls: "chat-input-row" }, [
      chatInput,
      chatSend,
    ]);

    var panel = el(
      "div",
      { cls: "chat-panel", hidden: true, role: "dialog", "aria-label": "Chat" },
      [header, chatMessages, inputRow]
    );
    return panel;
  }

  function requestAnswer(question) {
    var cfg = currentConfig();
    var system = buildSystemPrompt();
    var model = cfg.groqModel || "llama-3.3-70b-versatile";

    setChatBusy(true);
    addMessage("assistant", "Thinking...");

    // Security note: this Groq API key lives in client side JavaScript
    // (window.KOYO_DOCS_CONFIG.groqApiKey) and is visible to anyone who
    // inspects network requests. It is always sent over HTTPS to Groq's own
    // chat completions endpoint. This is a deliberate, accepted tradeoff for
    // a static documentation site with no backend. Do not put a key with
    // broad permissions here; create one with minimal scope instead.
    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cfg.groqApiKey,
      },
      body: JSON.stringify({
        model: model,
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: question },
        ],
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          return response.json().catch(function () {
            return {};
          }).then(function (data) {
            var message =
              (data.error && data.error.message) || "Request failed";
            throw new Error(message);
          });
        }
        return response.json();
      })
      .then(function (data) {
        var content =
          (data.choices &&
            data.choices[0] &&
            data.choices[0].message &&
            data.choices[0].message.content) ||
          "No answer returned.";
        // Replace the temporary "Thinking..." bubble with the real reply.
        var last = chatMessages.lastChild;
        if (last && last.textContent === "Thinking...") {
          chatMessages.removeChild(last);
        }
        addMessage("assistant", content);
      })
      .catch(function (err) {
        var last = chatMessages.lastChild;
        if (last && last.textContent === "Thinking...") {
          chatMessages.removeChild(last);
        }
        addMessage(
          "error",
          "Something went wrong: " + err.message +
          ". Check your Groq key in docs/config.js."
        );
      })
      .then(function () {
        setChatBusy(false);
      });
  }

  function buildChatFab() {
    var fab = el("button", {
      type: "button",
      cls: "chat-fab",
      "aria-label": "Open the Koyo assistant",
      html: ICONS.chat,
    });
    fab.addEventListener("click", function () {
      if (chatPanel && !chatPanel.hidden) {
        closeChat();
      } else {
        openChat();
      }
    });
    document.body.appendChild(fab);
  }

  // ---- Init -----------------------------------------------------------

  function init() {
    buildHeader();
    buildSidebar();
    buildFooter();

    // config.js is gitignored and may not exist on a fresh clone. Load it
    // dynamically so a missing file is a silent no-op (the assistant simply
    // stays unconfigured) instead of a loud 404 console error.
    var cfgScript = document.createElement("script");
    cfgScript.src = "config.js";
    document.head.appendChild(cfgScript);

    ensureHighlight();
    buildChatFab();
    document.addEventListener("keydown", handleGlobalKeys);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();