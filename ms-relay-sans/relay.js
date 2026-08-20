const testerText=document.querySelector("#tester-text");
const weightSelect=document.querySelector("#weight-select");
const sizeRange=document.querySelector("#size-range");
const trackingRange=document.querySelector("#tracking-range");
const sizeOutput=document.querySelector("#size-output");
const trackingOutput=document.querySelector("#tracking-output");

function updateTester(){
  testerText.style.fontWeight=weightSelect.value;
  testerText.style.fontSize=sizeRange.value+"px";
  testerText.style.letterSpacing=trackingRange.value+"px";
  sizeOutput.textContent=sizeRange.value+" px";
  trackingOutput.textContent=trackingRange.value;
}

[weightSelect,sizeRange,trackingRange].forEach(control=>control.addEventListener("input",updateTester));
updateTester();
