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
          tester.closest(".tester-unit").matches(":nth-child(7)")
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
}


if (characterPreview) {
  window.addEventListener("resize", function () {
    drawCharacterPreview(characterPreview.textContent);
  });
}


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

  const kerningWeight =
    document.getElementById("kerning-weight");

  const kerningOptical =
    document.getElementById("kerning-optical");

  const kerningTracking =
    document.getElementById("kerning-tracking");

  const kerningCanvas =
    document.createElement("canvas");

  const kerningContext =
    kerningCanvas.getContext("2d");


  function renderKerningLab() {
    const weight = Number(kerningWeight.value);
    const optical = Number(kerningOptical.value);
    const tracking = Number(kerningTracking.value);
    const fontFamily = getComputedStyle(document.body).fontFamily;
    const mobileKerning = window.innerWidth <= 650;
    const kerningFontSize = mobileKerning
      ? Math.max(64, Math.min(96, window.innerWidth * 0.22))
      : Math.max(110, Math.min(270, window.innerWidth * 0.15));

    kerningLab.style.setProperty("--kerning-weight", weight);
    kerningLab.style.setProperty("--kerning-optical", optical);
    kerningLab.style.setProperty("--kerning-tracking", tracking);
    kerningLab.style.setProperty(
      "--kerning-font-size",
      Math.round(kerningFontSize * 10) / 10
    );

    document.getElementById("kerning-weight-value").textContent =
      weight;
    document.getElementById("kerning-optical-value").textContent =
      optical;
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
  kerningWeight.addEventListener("input", renderKerningLab);
  kerningOptical.addEventListener("input", renderKerningLab);
  kerningTracking.addEventListener("input", renderKerningLab);
  window.addEventListener("resize", renderKerningLab);

  document.fonts.ready.then(renderKerningLab);
}


/* ========================================
   INTERACTIVE VARIABLE FOOTER
======================================== */

const variableFooter =
  document.querySelector(".variable-footer");

const footerVariableWord =
  document.querySelector(".footer-variable-word");

const footerAxisValue =
  document.querySelector(".footer-axis-value");


if (variableFooter && footerVariableWord) {
  let footerFrame;

  variableFooter.addEventListener("pointermove", function (event) {
    const bounds = variableFooter.getBoundingClientRect();
    const horizontal = Math.max(
      0,
      Math.min(1, (event.clientX - bounds.left) / bounds.width)
    );
    const vertical = Math.max(
      0,
      Math.min(1, (event.clientY - bounds.top) / bounds.height)
    );
    const weight = Math.round(100 + horizontal * 800);
    const slant = Math.round(-10 + vertical * 10);

    cancelAnimationFrame(footerFrame);
    footerFrame = requestAnimationFrame(function () {
      footerVariableWord.style.fontWeight = weight;
      footerVariableWord.style.fontVariationSettings =
        `"wght" ${weight}, "slnt" ${slant}`;

      if (footerAxisValue) {
        footerAxisValue.textContent =
          `Weight ${weight} / Slant ${slant}`;
      }
    });
  });
}


/* ========================================
   DISPLAY TYPEWRITER
======================================== */

document.querySelectorAll("[data-typewriter-text]").forEach(
  function (typewriterText) {
  const fullTypewriterText =
    typewriterText.dataset.typewriterText;

  const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion) {
    let typewriterPosition = 0;
    let correctionIndex = 0;
    const correctionPoints = [
      Math.max(4, Math.round(fullTypewriterText.length * 0.38)),
      Math.max(8, Math.round(fullTypewriterText.length * 0.76))
    ];

    typewriterText.textContent = "";

    function typeForward() {
      typewriterPosition += 1;
      typewriterText.textContent =
        fullTypewriterText.slice(0, typewriterPosition);

      if (
        correctionIndex < correctionPoints.length &&
        typewriterPosition === correctionPoints[correctionIndex]
      ) {
        correctionIndex += 1;
        window.setTimeout(function () {
          eraseCorrection(3);
        }, 280);
        return;
      }

      if (typewriterPosition < fullTypewriterText.length) {
        window.setTimeout(typeForward, 75 + Math.random() * 90);
      } else {
        window.setTimeout(eraseAll, 1600);
      }
    }

    function eraseCorrection(remaining) {
      typewriterPosition -= 1;
      typewriterText.textContent =
        fullTypewriterText.slice(0, typewriterPosition);

      if (remaining > 1) {
        window.setTimeout(function () {
          eraseCorrection(remaining - 1);
        }, 75);
      } else {
        window.setTimeout(typeForward, 350);
      }
    }

    function eraseAll() {
      typewriterPosition -= 1;
      typewriterText.textContent =
        fullTypewriterText.slice(0, typewriterPosition);

      if (typewriterPosition > 0) {
        window.setTimeout(eraseAll, 38);
      } else {
        correctionIndex = 0;
        window.setTimeout(typeForward, 650);
      }
    }

    window.setTimeout(typeForward, 500);
  }
  }
);

const typefaceIntroSection = document.querySelector(".typeface-intro");
const glyphConstructionSection = document.querySelector("#construction");

if (typefaceIntroSection && glyphConstructionSection) {
  typefaceIntroSection.insertAdjacentElement("afterend", glyphConstructionSection);
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
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter(function (key) {
            return originalOrder.includes(key);
          });
        }
      }
    } catch (error) {
      /* ignore malformed storage */
    }

    // No saved preference yet (e.g. a fresh export/artifact with its own
    // empty localStorage) -- seed from whatever sections already carry a
    // `hidden` attribute in the markup itself, so a baked-in hidden state
    // isn't silently reset to "all visible" on first load.
    return sections
      .filter(function (section) {
        return section.hidden;
      })
      .map(function (section) {
        return section.dataset.sectionKey;
      });
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
   DESIGN MODE
   Dev-only inspector: click an element to see and edit its
   margin/padding/font-size live, then Copy CSS to grab the exact
   values as text. Toggle button bottom-left; state persists in
   localStorage so a refresh doesn't lose the on/off state.
======================================== */
(function () {
  const STORAGE_KEY = "formae-design-mode";
  const OVERRIDES_KEY = "formae-design-mode-overrides";
  const SIDES = ["Top", "Right", "Bottom", "Left"];

  let active = window.localStorage.getItem(STORAGE_KEY) === "1";
  let selectedEl = null;
  let hoverEl = null;

  // Every edit made in the panel (margin/padding/font-size/text) is
  // recorded here, keyed by the element's selector, and reapplied on
  // every load -- otherwise a refresh would silently discard whatever
  // was adjusted, since it only ever lived as an inline style.
  function loadOverrides() {
    try {
      const raw = window.localStorage.getItem(OVERRIDES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function saveOverrides(map) {
    try {
      window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(map));
    } catch (error) {
      /* storage full or unavailable -- edits just won't persist */
    }
  }

  function recordOverride(el, prop, value) {
    const selector = describeSelector(el);
    const map = loadOverrides();
    if (!map[selector]) map[selector] = {};
    map[selector][prop] = value;
    saveOverrides(map);
  }

  function applyStoredOverrides() {
    const map = loadOverrides();
    Object.keys(map).forEach(function (selector) {
      let matches;
      try {
        matches = document.querySelectorAll(selector);
      } catch (error) {
        return;
      }
      matches.forEach(function (el) {
        Object.keys(map[selector]).forEach(function (prop) {
          const value = map[selector][prop];
          if (prop === "text") {
            el.textContent = value;
          } else {
            el.style[prop] = value;
          }
        });
      });
    });
  }

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "design-mode-toggle";
  toggleBtn.textContent = "Design Mode";
  document.body.appendChild(toggleBtn);

  const hoverOutline = document.createElement("div");
  hoverOutline.className = "design-mode-outline design-mode-outline-hover";
  hoverOutline.hidden = true;
  document.body.appendChild(hoverOutline);

  const selectOutline = document.createElement("div");
  selectOutline.className = "design-mode-outline design-mode-outline-selected";
  selectOutline.hidden = true;
  document.body.appendChild(selectOutline);

  const panel = document.createElement("div");
  panel.className = "design-mode-panel";
  panel.hidden = true;
  document.body.appendChild(panel);

  function positionOutline(box, rect) {
    box.style.left = rect.left + window.scrollX + "px";
    box.style.top = rect.top + window.scrollY + "px";
    box.style.width = rect.width + "px";
    box.style.height = rect.height + "px";
  }

  // An element's own getBoundingClientRect() is the full line-height
  // box, which is taller than the visible letters (the invisible
  // leading above/below the glyphs). A Range over the element's text
  // hugs the actual rendered ink much more closely, so use that for
  // the on-screen outline of text leaves -- the box model fields in
  // the panel still act on the real element, only the highlight
  // rectangle is ink-based.
  function getVisualRect(el) {
    if (el.children.length === 0 && el.textContent.trim()) {
      try {
        const range = document.createRange();
        range.selectNodeContents(el);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) return rect;
      } catch (error) {
        /* fall through to the element's own rect */
      }
    }
    return el.getBoundingClientRect();
  }

  // Clicking/hovering a padded area around some text should target the
  // text itself, not the box built around it -- walk down through
  // children looking for the deepest one that directly owns a text
  // node, so selection lands on the actual copy rather than its
  // wrapper's empty padding space.
  function findTextLeaf(el) {
    while (el && el.children && el.children.length > 0) {
      let next = null;
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        const hasOwnText = Array.prototype.some.call(
          child.childNodes,
          function (node) {
            return node.nodeType === 3 && node.textContent.trim();
          }
        );
        if (hasOwnText) {
          next = child;
          break;
        }
      }
      if (!next) break;
      el = next;
    }
    return el;
  }

  function describeSelector(el) {
    if (el.id) return "#" + el.id;
    if (typeof el.className === "string" && el.className.trim()) {
      return "." + el.className.trim().split(/\s+/).join(".");
    }
    return el.tagName.toLowerCase();
  }

  function refreshSelectedOutline() {
    if (selectedEl) {
      positionOutline(selectOutline, getVisualRect(selectedEl));
    }
  }

  function addBoxGroup(container, label, prop, el) {
    const cs = window.getComputedStyle(el);

    const group = document.createElement("div");
    group.className = "design-mode-group";

    const groupLabel = document.createElement("div");
    groupLabel.className = "design-mode-group-label";
    groupLabel.textContent = label;
    group.appendChild(groupLabel);

    const row = document.createElement("div");
    row.className = "design-mode-row";

    SIDES.forEach(function (side) {
      const fullProp = prop + "-" + side.toLowerCase();

      const wrap = document.createElement("label");
      wrap.className = "design-mode-field";

      const span = document.createElement("span");
      span.textContent = side.charAt(0);
      wrap.appendChild(span);

      const input = document.createElement("input");
      input.type = "number";
      input.value = Math.round(parseFloat(cs[fullProp]) || 0);
      input.addEventListener("input", function () {
        el.style[fullProp] = input.value + "px";
        recordOverride(el, fullProp, input.value + "px");
        refreshSelectedOutline();
      });

      wrap.appendChild(input);
      row.appendChild(wrap);
    });

    group.appendChild(row);
    container.appendChild(group);
  }

  function buildPanel(el) {
    const selector = describeSelector(el);
    const cs = window.getComputedStyle(el);

    panel.innerHTML = "";

    const title = document.createElement("div");
    title.className = "design-mode-panel-title";
    title.textContent = selector;
    panel.appendChild(title);

    if (el.children.length === 0 && el.textContent.trim()) {
      const textGroup = document.createElement("div");
      textGroup.className = "design-mode-group";

      const textLabel = document.createElement("div");
      textLabel.className = "design-mode-group-label";
      textLabel.textContent = "Text";
      textGroup.appendChild(textLabel);

      const textInput = document.createElement("textarea");
      textInput.className = "design-mode-text";
      textInput.value = el.textContent;
      textInput.rows = 2;
      textInput.addEventListener("input", function () {
        el.textContent = textInput.value;
        recordOverride(el, "text", textInput.value);
        refreshSelectedOutline();
      });
      textGroup.appendChild(textInput);
      panel.appendChild(textGroup);
    }

    addBoxGroup(panel, "Margin (T R B L)", "margin", el);
    addBoxGroup(panel, "Padding (T R B L)", "padding", el);

    const parent = el.parentElement;
    if (parent && parent !== document.body) {
      const parentTitle = document.createElement("div");
      parentTitle.className = "design-mode-panel-subtitle";
      parentTitle.textContent = "Parent: " + describeSelector(parent);
      panel.appendChild(parentTitle);

      addBoxGroup(panel, "Parent padding (T R B L)", "padding", parent);
    }

    const fontGroup = document.createElement("div");
    fontGroup.className = "design-mode-group";

    const fontLabel = document.createElement("div");
    fontLabel.className = "design-mode-group-label";
    fontLabel.textContent = "Font size (px)";
    fontGroup.appendChild(fontLabel);

    const fontInput = document.createElement("input");
    fontInput.type = "number";
    fontInput.value = Math.round(parseFloat(cs.fontSize) || 0);
    fontInput.addEventListener("input", function () {
      el.style.fontSize = fontInput.value + "px";
      recordOverride(el, "fontSize", fontInput.value + "px");
      refreshSelectedOutline();
    });
    fontGroup.appendChild(fontInput);
    panel.appendChild(fontGroup);

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "design-mode-copy";
    copyBtn.textContent = "Copy CSS";
    copyBtn.addEventListener("click", function () {
      const inline = el.getAttribute("style") || "";
      const declarations = inline
        .split(";")
        .map(function (part) {
          return part.trim();
        })
        .filter(Boolean)
        .map(function (part) {
          const pieces = part.split(":");
          const prop = pieces[0].trim();
          const value = pieces.slice(1).join(":").trim();
          return "  " + prop + ": " + value + ";";
        })
        .join("\n");

      const css = selector + " {\n" + declarations + "\n}";

      navigator.clipboard.writeText(css).then(function () {
        copyBtn.textContent = "Copied!";
        window.setTimeout(function () {
          copyBtn.textContent = "Copy CSS";
        }, 1200);
      });
    });
    panel.appendChild(copyBtn);

    panel.hidden = false;
  }

  function setActive(next) {
    active = next;
    window.localStorage.setItem(STORAGE_KEY, active ? "1" : "0");
    document.body.classList.toggle("design-mode-active", active);
    toggleBtn.classList.toggle("is-on", active);

    if (!active) {
      hoverOutline.hidden = true;
      selectOutline.hidden = true;
      panel.hidden = true;
      selectedEl = null;
      hoverEl = null;
    }
  }

  toggleBtn.addEventListener("click", function () {
    setActive(!active);
  });

  document.addEventListener("mousemove", function (event) {
    if (!active) return;
    if (
      panel.contains(event.target) ||
      event.target === toggleBtn ||
      event.target === selectedEl
    ) {
      hoverOutline.hidden = true;
      return;
    }

    const el = findTextLeaf(event.target);
    if (el === hoverEl) return;
    hoverEl = el;

    hoverOutline.hidden = false;
    positionOutline(hoverOutline, getVisualRect(el));
  });

  document.addEventListener(
    "click",
    function (event) {
      if (!active) return;
      if (panel.contains(event.target) || event.target === toggleBtn) return;

      event.preventDefault();
      event.stopPropagation();

      selectedEl = findTextLeaf(event.target);
      selectOutline.hidden = false;
      positionOutline(selectOutline, getVisualRect(selectedEl));
      buildPanel(selectedEl);
    },
    true
  );

  window.addEventListener("scroll", function () {
    if (!active) return;
    if (hoverEl && !hoverOutline.hidden) {
      positionOutline(hoverOutline, getVisualRect(hoverEl));
    }
    refreshSelectedOutline();
  });

  window.addEventListener("resize", function () {
    if (!active) return;
    if (hoverEl && !hoverOutline.hidden) {
      positionOutline(hoverOutline, getVisualRect(hoverEl));
    }
    refreshSelectedOutline();
  });

  applyStoredOverrides();
  setActive(active);
})();
