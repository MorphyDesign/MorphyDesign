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


/* Position the decorative pointing hand flush against the actual
   rendered right edge of "Cork" -- it can't be a fixed offset since
   the word's width changes with the responsive font-size. */
const corkWord = document.querySelector(".text-sample-hero-6x");
const corkHand = document.querySelector(".text-sample-hand");

function positionCorkHand() {
  if (!corkWord || !corkHand) {
    return;
  }
  const box = corkWord.closest(".text-sample");
  const boxRect = box.getBoundingClientRect();
  // corkWord is a block-level flex item, so its own getBoundingClientRect()
  // spans the full flex-item width, not the visible text -- wrap the text
  // node in a Range to get the tight box around the rendered glyphs.
  const range = document.createRange();
  range.selectNodeContents(corkWord);
  const textRect = range.getBoundingClientRect();
  corkHand.style.left = (textRect.right - boxRect.left) + "px";
}

if (corkWord && corkHand) {
  document.fonts.ready.then(positionCorkHand);
  window.addEventListener("resize", positionCorkHand);
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
  heading.textContent = "Move sections with ↑ ↓";
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

  /* Reordering is button-driven (not native drag-and-drop): every move is
     a single deliberate click that immediately commits, so there is no
     drag gesture that can misfire, get lost, or silently snap back. */
  function commitOrder() {
    const newOrder = Array.from(list.children).map(function (item) {
      return item.dataset.sectionKey;
    });
    applyOrder(newOrder);
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(newOrder));
  }

  function buildList() {
    list.innerHTML = "";
    currentOrder().forEach(function (key) {
      const item = document.createElement("li");
      item.className = "section-reorder-item";
      item.dataset.sectionKey = key;

      const label = document.createElement("span");
      label.className = "section-reorder-label";
      label.textContent = sectionLabels[key] || key;
      item.appendChild(label);

      const moveButtons = document.createElement("span");
      moveButtons.className = "section-reorder-move-buttons";

      const upButton = document.createElement("button");
      upButton.type = "button";
      upButton.className = "section-reorder-move";
      upButton.setAttribute("aria-label", "Move up");
      upButton.textContent = "↑";
      upButton.addEventListener("click", function () {
        const prev = item.previousElementSibling;
        if (prev) {
          list.insertBefore(item, prev);
          commitOrder();
        }
      });
      moveButtons.appendChild(upButton);

      const downButton = document.createElement("button");
      downButton.type = "button";
      downButton.className = "section-reorder-move";
      downButton.setAttribute("aria-label", "Move down");
      downButton.textContent = "↓";
      downButton.addEventListener("click", function () {
        const next = item.nextElementSibling;
        if (next) {
          list.insertBefore(next, item);
          commitOrder();
        }
      });
      moveButtons.appendChild(downButton);

      item.appendChild(moveButtons);
      list.appendChild(item);
    });
  }

  buildList();

  resetButton.addEventListener("click", function () {
    window.localStorage.removeItem(ORDER_STORAGE_KEY);
    applyOrder(originalOrder);
    buildList();
  });
})();
