/* ========================================
   MORPHYFOUNDRY TYPE TESTERS
======================================== */


const testerUnits =
  document.querySelectorAll(".tester-unit");

const mobileTesterQuery =
  window.matchMedia("(max-width: 650px)");

const compactTesterQuery =
  window.matchMedia("(max-width: 900px)");


document.querySelectorAll("[data-fill-repeats]").forEach(
  function (tester) {
    const originalText = tester.textContent.trim();
    const repeatCount = Number(tester.dataset.fillRepeats);
    const targetLength = Math.round(
      originalText.length * repeatCount
    );

    tester.textContent =
      (originalText + " ")
        .repeat(Math.ceil(repeatCount))
        .slice(0, targetLength);
  }
);


document.querySelectorAll(".tester").forEach(
  function (tester) {
    const desktopText = tester.textContent;

    function applyResponsiveTesterContent() {
      if (mobileTesterQuery.matches) {
        if (tester.dataset.mobileText) {
          tester.textContent = tester.dataset.mobileText;
          return;
        }

        const mobileContentRatio =
          tester.closest(".tester-unit").matches(":nth-child(6)")
            ? 0.2
            : 0.5;

        tester.textContent = desktopText.slice(
          0,
          Math.ceil(desktopText.length * mobileContentRatio)
        );
      } else {
        tester.textContent = desktopText;
      }
    }

    applyResponsiveTesterContent();
    mobileTesterQuery.addEventListener(
      "change",
      applyResponsiveTesterContent
    );
  }
);


testerUnits.forEach(
  function (unit) {

    const tester =
      unit.querySelector(".tester");

    const sizeSlider =
      unit.querySelector('[data-control="size"]');

    const weightSlider =
      unit.querySelector('[data-control="weight"]');

    const trackingSlider =
      unit.querySelector('[data-control="tracking"]');

    const sizeValue =
      unit.querySelector('[data-value="size"]');

    const weightValue =
      unit.querySelector('[data-value="weight"]');

    const trackingValue =
      unit.querySelector('[data-value="tracking"]');


    function applyTesterSize(requestedSize) {
      let renderedSize = Number(requestedSize);

      const testerStyle = window.getComputedStyle(tester);
      const horizontalPadding =
        parseFloat(testerStyle.paddingLeft) +
        parseFloat(testerStyle.paddingRight);
      const availableWidth = Math.max(
        1,
        unit.clientWidth - horizontalPadding
      );
      const scale = Math.min(1, availableWidth / 1500);
      let minimumSize = 24;

      if (tester.classList.contains("tester-small")) {
        minimumSize = 28;
      }

      if (tester.classList.contains("tester-micro")) {
        minimumSize = 14;
      }

      renderedSize = Math.min(
        Number(requestedSize),
        Math.max(minimumSize, renderedSize * scale)
      );

      if (
        tester.classList.contains("tester-large") ||
        tester.classList.contains("tester-medium")
      ) {
        renderedSize = Math.min(
          renderedSize,
          availableWidth / 9
        );
      }

      renderedSize = Math.round(renderedSize * 10) / 10;
      tester.style.fontSize = renderedSize + "px";
      sizeValue.textContent = renderedSize + " px";
    }


    applyTesterSize(sizeSlider.value);

    if (weightSlider) {
      tester.style.fontWeight =
        weightSlider.value;

      tester.style.fontVariationSettings =
        `"wght" ${weightSlider.value}`;
    }

    tester.style.letterSpacing =
      trackingSlider.value + "px";


    sizeSlider.addEventListener(
      "input",
      function () {
        applyTesterSize(this.value);

      }
    );


    compactTesterQuery.addEventListener(
      "change",
      function () {
        applyTesterSize(sizeSlider.value);
      }
    );


    window.addEventListener(
      "resize",
      function () {
        applyTesterSize(sizeSlider.value);
      }
    );


    if (weightSlider) {
      weightSlider.addEventListener(
        "input",
        function () {

          tester.style.fontWeight =
            this.value;

          tester.style.fontVariationSettings =
            `"wght" ${this.value}`;

          weightValue.textContent =
            this.value;

        }
      );
    }


    trackingSlider.addEventListener(
      "input",
      function () {

        tester.style.letterSpacing =
          this.value + "px";

        trackingValue.textContent =
          this.value;

      }
    );

  }
);


/* ========================================
   CHARACTER SET PREVIEW
======================================== */

const characterPreview =
  document.getElementById("character-preview-value");

const characterCells =
  document.querySelectorAll(".character-grid span");

const characterCanvas =
  document.getElementById("character-preview-canvas");


function drawCharacterPreview(character) {
  const previewBox =
    characterCanvas.getBoundingClientRect();

  const capLine =
    document.querySelector(".metric-cap i").getBoundingClientRect();

  const baseline =
    document.querySelector(".metric-baseline i").getBoundingClientRect();

  const pixelRatio = window.devicePixelRatio || 1;
  const context = characterCanvas.getContext("2d");

  characterCanvas.width =
    Math.round(previewBox.width * pixelRatio);

  characterCanvas.height =
    Math.round(previewBox.height * pixelRatio);

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, previewBox.width, previewBox.height);

  const fontFamily =
    getComputedStyle(document.body).fontFamily;

  context.font =
    `400 1000px ${fontFamily}`;

  const referenceA = context.measureText("A");
  const capToBaseline = baseline.top - capLine.top;
  const fontSize =
    1000 * capToBaseline / referenceA.actualBoundingBoxAscent;

  context.font =
    `400 ${fontSize}px ${fontFamily}`;

  const xMeasurement = context.measureText("x");
  const xLine = document.querySelector(".metric-x");
  const xLineRule = xLine.querySelector("i").getBoundingClientRect();
  const xLineBox = xLine.getBoundingClientRect();
  const ruleOffset = xLineRule.top - xLineBox.top;
  const xTop =
    baseline.top - previewBox.top -
    xMeasurement.actualBoundingBoxAscent;

  xLine.style.top =
    (xTop - ruleOffset) + "px";

  context.fillStyle =
    getComputedStyle(document.body).color;

  context.textAlign = "center";
  context.textBaseline = "alphabetic";

  context.fillText(
    character,
    previewBox.width / 2,
    baseline.top - previewBox.top
  );
}


function selectCharacter(cell) {
  characterCells.forEach(function (item) {
    item.classList.remove("is-selected");
  });

  cell.classList.add("is-selected");
  characterPreview.textContent = cell.textContent;
  drawCharacterPreview(cell.textContent);

  const codePoint = cell.textContent.codePointAt(0);
  const unicodeValue =
    "U+" + codePoint.toString(16).toUpperCase().padStart(4, "0");

  document.getElementById("character-unicode").textContent =
    unicodeValue;

  document.getElementById("character-code-value").textContent =
    cell.textContent;
}


characterCells.forEach(function (cell) {
  cell.tabIndex = 0;

  cell.addEventListener("mouseenter", function () {
    selectCharacter(cell);
  });

  cell.addEventListener("focus", function () {
    selectCharacter(cell);
  });

  cell.addEventListener("click", function () {
    selectCharacter(cell);
  });
});


if (characterCells.length) {
  selectCharacter(characterCells[0]);

  document.fonts.ready.then(function () {
    drawCharacterPreview(characterPreview.textContent);
  });
}


window.addEventListener("resize", function () {
  drawCharacterPreview(characterPreview.textContent);
});


/* ========================================
   KERNING LAB
======================================== */

const kerningLab =
  document.querySelector(".kerning-lab");


if (kerningLab) {
  const kerningSource =
    document.getElementById("kerning-source");

  const kerningGlyphs =
    document.getElementById("kerning-glyphs");

  const kerningTracking =
    document.getElementById("kerning-tracking");

  const kerningCanvas =
    document.createElement("canvas");

  const kerningContext =
    kerningCanvas.getContext("2d");


  function renderKerningLab() {
    const weight = 400;
    const tracking = Number(kerningTracking.value);
    const fontFamily = getComputedStyle(document.body).fontFamily;
    const mobileKerning = window.innerWidth <= 650;
    const kerningFontSize = (mobileKerning
      ? Math.max(64, Math.min(96, window.innerWidth * 0.22))
      : Math.max(110, Math.min(270, window.innerWidth * 0.15))) * 0.7197;

    kerningLab.style.setProperty("--kerning-weight", weight);
    kerningLab.style.setProperty("--kerning-tracking", tracking);
    kerningLab.style.setProperty(
      "--kerning-font-size",
      Math.round(kerningFontSize * 10) / 10
    );

    document.getElementById("kerning-tracking-value").textContent =
      tracking;

    kerningContext.font =
      `${weight} 1000px ${fontFamily}`;
    kerningContext.fontKerning = "normal";

    kerningGlyphs.replaceChildren();

    Array.from(kerningSource.value).forEach(function (character) {
      const measuredWidth = Math.max(
        120,
        Math.round(kerningContext.measureText(character).width + tracking)
      );
      const cellWidth = Math.max(
        mobileKerning ? 42 : 64,
        measuredWidth / 1000 * kerningFontSize
      );

      const cell = document.createElement("div");
      const value = document.createElement("span");
      const glyph = document.createElement("strong");

      cell.className = "kerning-glyph";
      value.className = "kerning-glyph-value";
      glyph.className = "kerning-glyph-character";

      cell.style.setProperty(
        "--kerning-cell-width",
        Math.round(cellWidth * 10) / 10
      );
      value.textContent = measuredWidth;
      glyph.textContent = character === " " ? "·" : character;

      cell.append(value, glyph);
      kerningGlyphs.append(cell);
    });
  }


  kerningSource.addEventListener("input", renderKerningLab);
  kerningTracking.addEventListener("input", renderKerningLab);
  window.addEventListener("resize", renderKerningLab);

  document.fonts.ready.then(renderKerningLab);
}




document.querySelectorAll(".type-scale-text").forEach(function (block) {
  block.addEventListener("paste", function (event) {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, text);
  });
});


/* ========================================
   TYPE SPECIMEN SLIDER
   Edit this array to change the slider's words -- each entry's "layout"
   picks one of the hand-designed compositions in style.css (.slide-*).
======================================== */

const TYPE_SLIDER_SLIDES = [
  { layout: "bleed", text: "Vintage£24?" },
];

const typeSliderSection = document.querySelector("#type-slider");
const typeSliderTrack = document.querySelector("#type-slider-track");

if (typeSliderSection && typeSliderTrack) {

  function makeSlideParagraph(text, className) {
    const p = document.createElement("p");
    if (className) {
      p.className = className;
    }
    p.textContent = text;
    return p;
  }

  function buildSlide(slide) {
    const article = document.createElement("article");
    article.className = "type-slider-slide slide-" + slide.layout;
    article.setAttribute("aria-roledescription", "slide");

    if (slide.inverse) {
      article.classList.add("type-slider-slide-inverse");
    }

    if (slide.layout === "stack") {
      article.append(
        makeSlideParagraph(slide.kicker, "slide-stack-kicker"),
        makeSlideParagraph(slide.hero, "slide-stack-hero"),
        makeSlideParagraph(slide.meta, "slide-stack-meta")
      );
    } else if (slide.layout === "repeat") {
      const count = slide.count || 3;
      for (let i = 0; i < count; i++) {
        article.append(makeSlideParagraph(slide.text));
      }
    } else if (slide.layout === "contrast") {
      article.append(
        makeSlideParagraph(slide.text, "slide-contrast-small"),
        makeSlideParagraph(slide.text, "slide-contrast-large")
      );
    } else {
      article.append(makeSlideParagraph(slide.text));
    }

    return article;
  }

  TYPE_SLIDER_SLIDES.forEach(function (slide) {
    typeSliderTrack.append(buildSlide(slide));
  });
}




/* ========================================
   SECTION REORDER PANEL
   Lets you drag-and-drop the page's main sections into a new order.
   The order is saved to localStorage so it survives a reload.
======================================== */

(function () {
  const main = document.querySelector("main");
  if (!main) return;

  const ORDER_STORAGE_KEY = "formae-section-order";
  const VISIBILITY_STORAGE_KEY = "formae-section-hidden";

  const sections = Array.from(main.querySelectorAll(":scope > section"));
  const originalOrder = [];

  sections.forEach(function (section, index) {
    const key = "sec-" + index;
    section.dataset.sectionKey = key;
    originalOrder.push(key);
  });

  function deriveSectionLabel(section) {
    const titleEl = section.querySelector(".section-title, h1, h2, h3");
    if (titleEl && titleEl.textContent.trim()) {
      return titleEl.textContent.trim();
    }

    if (section.getAttribute("aria-label")) {
      return section.getAttribute("aria-label");
    }

    const labelledBy = section.getAttribute("aria-labelledby");
    if (labelledBy) {
      const ref = document.getElementById(labelledBy);
      if (ref && ref.textContent.trim()) {
        return ref.textContent.trim();
      }
    }

    const kicker = section.querySelector(
      "[class*='kicker'], .specimen-text, .tester-title"
    );
    if (kicker && kicker.textContent.trim()) {
      return kicker.textContent.trim();
    }

    const firstClass = (section.className || "").split(" ")[0] || "Section";
    return firstClass
      .replace(/-/g, " ")
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  const sectionLabels = {};
  sections.forEach(function (section) {
    sectionLabels[section.dataset.sectionKey] = deriveSectionLabel(section);
  });

  function applyOrder(order) {
    order.forEach(function (key) {
      const section = main.querySelector(
        ':scope > section[data-section-key="' + key + '"]'
      );
      if (section) {
        main.appendChild(section);
      }
    });
  }

  function currentOrder() {
    return Array.from(
      main.querySelectorAll(":scope > section")
    ).map(function (section) {
      return section.dataset.sectionKey;
    });
  }

  function loadSavedOrder() {
    try {
      const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length === originalOrder.length &&
        parsed.every(function (key) { return originalOrder.includes(key); })
      ) {
        return parsed;
      }
    } catch (error) {
      /* ignore malformed storage */
    }
    return null;
  }

  const savedOrder = loadSavedOrder();
  if (savedOrder) {
    applyOrder(savedOrder);
  }

  /* ---- Visibility (Photoshop-style eye toggle) ---- */

  function loadHiddenKeys() {
    try {
      const raw = window.localStorage.getItem(VISIBILITY_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(function (key) {
          return originalOrder.includes(key);
        });
      }
    } catch (error) {
      /* ignore malformed storage */
    }
    return [];
  }

  const hiddenKeys = new Set(loadHiddenKeys());

  function applyVisibility() {
    sections.forEach(function (section) {
      section.hidden = hiddenKeys.has(section.dataset.sectionKey);
    });
  }

  function saveHiddenKeys() {
    window.localStorage.setItem(
      VISIBILITY_STORAGE_KEY,
      JSON.stringify(Array.from(hiddenKeys))
    );
  }

  applyVisibility();

  /* ---- Panel UI ---- */

  const panel = document.createElement("div");
  panel.className = "section-reorder-panel";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "section-reorder-toggle";
  toggle.textContent = "⇅ Reorder sections";
  panel.appendChild(toggle);

  const body = document.createElement("div");
  body.className = "section-reorder-body";
  body.hidden = true;

  const heading = document.createElement("div");
  heading.className = "section-reorder-heading";
  heading.textContent = "Drag ⠿ to reorder — ⌘-click or Shift-click to select several";
  body.appendChild(heading);

  const list = document.createElement("ul");
  list.className = "section-reorder-list";
  body.appendChild(list);

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "section-reorder-reset";
  resetButton.textContent = "Reset order";
  body.appendChild(resetButton);

  panel.appendChild(body);
  document.body.appendChild(panel);

  toggle.addEventListener("click", function () {
    body.hidden = !body.hidden;
  });

  const selectedKeys = new Set();
  let lastClickedKey = null;

  function refreshSelectionState() {
    Array.from(list.children).forEach(function (item) {
      item.classList.toggle(
        "section-reorder-item-selected",
        selectedKeys.has(item.dataset.sectionKey)
      );
    });
  }

  function buildList() {
    list.innerHTML = "";
    currentOrder().forEach(function (key) {
      const item = document.createElement("li");
      item.className = "section-reorder-item";
      item.dataset.sectionKey = key;

      /* Only this small handle is draggable -- not the whole row -- so an
         ordinary click/scroll near the list can never start an accidental
         native drag and silently rewrite the saved order. */
      const handle = document.createElement("span");
      handle.className = "section-reorder-handle";
      handle.draggable = true;
      handle.setAttribute("aria-hidden", "true");
      handle.textContent = "⠿";
      item.appendChild(handle);

      const label = document.createElement("span");
      label.className = "section-reorder-label";
      label.textContent = sectionLabels[key] || key;

      /* Ctrl/Cmd-click toggles this row in/out of a multi-selection;
         Shift-click selects the whole range since the last-clicked row;
         a plain click collapses the selection back down to just this row.
         Any of these rows' sections can then be dragged (via any of their
         handles) together as one group. */
      label.addEventListener("click", function (event) {
        if (event.shiftKey && lastClickedKey) {
          const keys = Array.from(list.children).map(function (el) {
            return el.dataset.sectionKey;
          });
          const fromIndex = keys.indexOf(lastClickedKey);
          const toIndex = keys.indexOf(key);
          if (fromIndex !== -1 && toIndex !== -1) {
            const start = Math.min(fromIndex, toIndex);
            const end = Math.max(fromIndex, toIndex);
            keys.slice(start, end + 1).forEach(function (rangeKey) {
              selectedKeys.add(rangeKey);
            });
          }
        } else if (event.ctrlKey || event.metaKey) {
          if (selectedKeys.has(key)) {
            selectedKeys.delete(key);
          } else {
            selectedKeys.add(key);
          }
          lastClickedKey = key;
        } else {
          selectedKeys.clear();
          selectedKeys.add(key);
          lastClickedKey = key;
        }
        refreshSelectionState();
      });

      item.appendChild(label);

      /* Photoshop-style layer visibility toggle: hides the section on the
         page without deleting anything, so this is safe to use for
         planning/reviewing layout options. */
      const eyeButton = document.createElement("button");
      eyeButton.type = "button";
      eyeButton.className = "section-reorder-eye";
      eyeButton.textContent = "👁";

      function refreshEyeState() {
        const isHidden = hiddenKeys.has(key);
        eyeButton.classList.toggle("section-reorder-eye-hidden", isHidden);
        eyeButton.setAttribute(
          "aria-label",
          isHidden ? "Show section" : "Hide section"
        );
        item.classList.toggle("section-reorder-item-hidden", isHidden);
      }

      eyeButton.addEventListener("click", function () {
        if (hiddenKeys.has(key)) {
          hiddenKeys.delete(key);
        } else {
          hiddenKeys.add(key);
        }
        applyVisibility();
        saveHiddenKeys();
        refreshEyeState();
      });

      refreshEyeState();
      item.appendChild(eyeButton);

      list.appendChild(item);
    });
  }

  buildList();

  /* Normally just the one row being dragged; if that row is part of a
     multi-selection (Ctrl/Cmd-click), the whole selection moves together
     as a group, in their existing relative order. */
  let draggedItems = [];

  list.addEventListener("dragstart", function (event) {
    if (!event.target.closest(".section-reorder-handle")) return;
    const item = event.target.closest(".section-reorder-item");
    if (!item) return;

    const key = item.dataset.sectionKey;
    if (!selectedKeys.has(key) || selectedKeys.size <= 1) {
      selectedKeys.clear();
      selectedKeys.add(key);
      refreshSelectionState();
    }

    draggedItems = Array.from(list.children).filter(function (el) {
      return selectedKeys.has(el.dataset.sectionKey);
    });
    draggedItems.forEach(function (el) {
      el.classList.add("section-reorder-item-dragging");
    });
    event.dataTransfer.effectAllowed = "move";
  });

  list.addEventListener("dragend", function () {
    draggedItems.forEach(function (el) {
      el.classList.remove("section-reorder-item-dragging");
    });
    draggedItems = [];

    const newOrder = Array.from(list.children).map(function (item) {
      return item.dataset.sectionKey;
    });
    applyOrder(newOrder);
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(newOrder));
  });

  list.addEventListener("dragover", function (event) {
    event.preventDefault();
    if (!draggedItems.length) return;

    const target = event.target.closest(".section-reorder-item");
    if (!target || draggedItems.includes(target)) return;

    const targetRect = target.getBoundingClientRect();
    const isAfter = event.clientY > targetRect.top + targetRect.height / 2;
    const anchor = isAfter ? target.nextSibling : target;

    draggedItems.forEach(function (el) {
      list.insertBefore(el, anchor);
    });
  });

  resetButton.addEventListener("click", function () {
    window.localStorage.removeItem(ORDER_STORAGE_KEY);
    applyOrder(originalOrder);
    buildList();
  });
})();


/* ========================================
   LIGATURE SHOWCASE -- CURSOR FOCUS EFFECT
   The permanently blurred/atmospheric words (styled in CSS) get a
   second, sharp, aria-hidden copy on top, revealed only through a soft
   circular mask that follows the pointer with eased inertia. Only the
   mask position is animated -- the two adjustable-speed constants
   below are the "easily adjustable variables" for follow/release speed
   the CSS comment above .ligature-showcase-zoomed refers to; blur
   amount, focus radius and softness are the CSS custom properties on
   that same selector.
======================================== */

(function () {
  const section = document.querySelector(".ligature-showcase-zoomed");
  if (!section) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  // The reduced-motion fallback (lighter static blur, no pointer
  // tracking) is handled entirely in CSS -- just skip building the
  // interactive overlay so nothing here animates.
  if (reducedMotion) return;

  const words = Array.from(
    section.querySelectorAll(".ligature-showcase-word")
  );
  if (!words.length) return;

  const overlay = document.createElement("div");
  overlay.className = "ligature-focus-overlay";
  overlay.setAttribute("aria-hidden", "true");
  words.forEach(function (word) {
    overlay.appendChild(word.cloneNode(true));
  });
  section.appendChild(overlay);

  // How quickly the focus circle catches up to the pointer each frame
  // (0-1: higher = snappier/less lag, lower = more soft inertia).
  const FOCUS_LAG = 0.14;
  // How quickly it eases back to rest once the pointer leaves --
  // slower than FOCUS_LAG so the release reads as slow and elegant.
  const FOCUS_RELEASE_LAG = 0.05;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let hasPosition = false;
  let isHovering = false;
  let rafId = null;

  function setTargetFromPoint(clientX, clientY) {
    const rect = section.getBoundingClientRect();
    targetX = clientX - rect.left;
    targetY = clientY - rect.top;
    if (!hasPosition) {
      // First contact: snap straight there instead of easing in from
      // the (0,0) default, so the circle doesn't visibly swoop in
      // from a corner.
      currentX = targetX;
      currentY = targetY;
      hasPosition = true;
    }
    ensureLoop();
  }

  function ensureLoop() {
    if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function tick() {
    const lag = isHovering ? FOCUS_LAG : FOCUS_RELEASE_LAG;
    currentX += (targetX - currentX) * lag;
    currentY += (targetY - currentY) * lag;

    overlay.style.setProperty("--focus-x", currentX + "px");
    overlay.style.setProperty("--focus-y", currentY + "px");

    const settled =
      Math.abs(targetX - currentX) < 0.5 &&
      Math.abs(targetY - currentY) < 0.5;

    if (isHovering || !settled) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  section.addEventListener("pointerenter", function (event) {
    if (event.pointerType === "touch") return;
    isHovering = true;
    overlay.classList.add("is-active");
    setTargetFromPoint(event.clientX, event.clientY);
  });

  section.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch") return;
    setTargetFromPoint(event.clientX, event.clientY);
  });

  section.addEventListener("pointerleave", function (event) {
    if (event.pointerType === "touch") return;
    isHovering = false;
    overlay.classList.remove("is-active");
    ensureLoop();
  });

  // Touch: sharpen under the finger while it's actually on the
  // section; release (slow fade back to blur) on lift.
  section.addEventListener(
    "touchstart",
    function (event) {
      const touch = event.touches[0];
      if (!touch) return;
      isHovering = true;
      overlay.classList.add("is-active");
      setTargetFromPoint(touch.clientX, touch.clientY);
    },
    { passive: true }
  );

  section.addEventListener(
    "touchmove",
    function (event) {
      const touch = event.touches[0];
      if (!touch) return;
      setTargetFromPoint(touch.clientX, touch.clientY);
    },
    { passive: true }
  );

  section.addEventListener("touchend", function () {
    isHovering = false;
    overlay.classList.remove("is-active");
    ensureLoop();
  });
})();
