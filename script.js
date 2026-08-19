/* ========================================
   MORPHYFOUNDRY TYPE TESTERS
======================================== */


const testerUnits =
  document.querySelectorAll(".tester-unit");


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


    tester.style.fontSize =
      sizeSlider.value + "px";

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

        tester.style.fontSize =
          this.value + "px";

        sizeValue.textContent =
          this.value + " px";

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
