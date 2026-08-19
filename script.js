/* ========================================
   MORPHYFOUNDRY TYPE TESTERS
======================================== */


const testerUnits =
  document.querySelectorAll(".tester-unit");


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


    sizeSlider.addEventListener(
      "input",
      function () {

        tester.style.fontSize =
          this.value + "px";

        sizeValue.textContent =
          this.value + " px";

      }
    );


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
