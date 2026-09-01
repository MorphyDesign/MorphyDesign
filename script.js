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
