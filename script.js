/* ========================================
   MORPHYFOUNDRY TYPE TESTER
======================================== */


const tester =
  document.getElementById("tester-text");


const sizeSlider =
  document.getElementById("font-size");


const weightSlider =
  document.getElementById("font-weight");


const trackingSlider =
  document.getElementById("tracking");


const sizeValue =
  document.getElementById("font-size-value");


const weightValue =
  document.getElementById("font-weight-value");


const trackingValue =
  document.getElementById("tracking-value");



/* ========================================
   FONT SIZE
======================================== */

sizeSlider.addEventListener(
  "input",
  function () {

    const value =
      this.value;

    tester.style.fontSize =
      value + "px";

    sizeValue.textContent =
      value + " px";

  }
);



/* ========================================
   FONT WEIGHT
======================================== */

weightSlider.addEventListener(
  "input",
  function () {

    const value =
      this.value;

    tester.style.fontWeight =
      value;

    tester.style.fontVariationSettings =
      `"wght" ${value}`;

    weightValue.textContent =
      value;

  }
);



/* ========================================
   TRACKING
======================================== */

trackingSlider.addEventListener(
  "input",
  function () {

    const value =
      this.value;

    tester.style.letterSpacing =
      value + "px";

    trackingValue.textContent =
      value;

  }
);
