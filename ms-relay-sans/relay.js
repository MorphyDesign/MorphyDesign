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

const kerningLab=document.querySelector(".kerning-lab");
const kerningSource=document.querySelector("#kerning-source");
const kerningGlyphs=document.querySelector("#kerning-glyphs");
const kerningWeight=document.querySelector("#kerning-weight");
const kerningSize=document.querySelector("#kerning-size");
const kerningTracking=document.querySelector("#kerning-tracking");
const kerningCanvas=document.createElement("canvas");
const kerningContext=kerningCanvas.getContext("2d");

function renderKerning(){
  const weight=Number(kerningWeight.value);
  const size=Number(kerningSize.value);
  const tracking=Number(kerningTracking.value);
  kerningLab.style.setProperty("--k-weight",weight);
  kerningLab.style.setProperty("--k-size",size);
  kerningLab.style.setProperty("--k-tracking",tracking);
  document.querySelector("#kerning-weight-output").textContent=weight;
  document.querySelector("#kerning-size-output").textContent=size;
  document.querySelector("#kerning-tracking-output").textContent=tracking;
  kerningContext.font=weight+" 1000px Relay";
  kerningContext.fontKerning="normal";
  kerningGlyphs.replaceChildren();
  const characters=Array.from(kerningSource.value);
  characters.forEach((character,index)=>{
    const cell=document.createElement("div");
    const value=document.createElement("span");
    const glyph=document.createElement("strong");
    cell.className="kerning-glyph";
    value.className="kerning-glyph-value";
    glyph.className="kerning-glyph-character";
    glyph.textContent=character===" "?"·":character;
    const measuredWidth=Math.round(kerningContext.measureText(character).width);
    const width=Math.max(22,measuredWidth/1000*size+tracking);
    cell.style.width=width+"px";
    if(index>0){
      const previous=characters[index-1];
      const pairWidth=kerningContext.measureText(previous+character).width;
      const previousWidth=kerningContext.measureText(previous).width;
      const pairAdjustment=(pairWidth-previousWidth-measuredWidth)/1000*size;
      cell.style.marginLeft=pairAdjustment+"px";
    }
    value.textContent=measuredWidth;
    cell.append(value,glyph);
    kerningGlyphs.append(cell);
  });
}

[kerningSource,kerningWeight,kerningSize,kerningTracking].forEach(control=>control.addEventListener("input",renderKerning));
document.fonts.ready.then(renderKerning);

const pictogramCells=document.querySelectorAll(".pictogram-grid span");

pictogramCells.forEach(cell=>cell.addEventListener("click",()=>{
  pictogramCells.forEach(item=>item.classList.remove("is-active"));
  cell.classList.add("is-active");
}));

const characterPreview=document.querySelector("#character-preview-value");
const characterCells=document.querySelectorAll(".character-grid span");
const characterUnicode=document.querySelector("#character-unicode");
const characterCodeValue=document.querySelector("#character-code-value");
const characterCanvas=document.querySelector("#character-preview-canvas");

function drawCharacter(character){
  const previewBox=characterCanvas.getBoundingClientRect();
  const capLine=document.querySelector(".metric-cap i").getBoundingClientRect();
  const baseline=document.querySelector(".metric-baseline i").getBoundingClientRect();
  const pixelRatio=window.devicePixelRatio||1;
  const context=characterCanvas.getContext("2d");

  characterCanvas.width=Math.round(previewBox.width*pixelRatio);
  characterCanvas.height=Math.round(previewBox.height*pixelRatio);
  context.setTransform(pixelRatio,0,0,pixelRatio,0,0);
  context.clearRect(0,0,previewBox.width,previewBox.height);
  context.font='400 1000px "Relay"';

  const referenceA=context.measureText("A");
  const capToBaseline=baseline.top-capLine.top;
  const fontSize=1000*capToBaseline/referenceA.actualBoundingBoxAscent;
  context.font='400 '+fontSize+'px "Relay"';

  const xMeasurement=context.measureText("x");
  const xLine=document.querySelector(".metric-x");
  const xLineRule=xLine.querySelector("i").getBoundingClientRect();
  const xLineBox=xLine.getBoundingClientRect();
  const ruleOffset=xLineRule.top-xLineBox.top;
  const xTop=baseline.top-previewBox.top-xMeasurement.actualBoundingBoxAscent;
  xLine.style.top=(xTop-ruleOffset)+"px";

  context.fillStyle=getComputedStyle(document.body).color;
  context.textAlign="center";
  context.textBaseline="alphabetic";
  context.fillText(character,previewBox.width/2,baseline.top-previewBox.top);
}

function selectCharacter(cell){
  characterCells.forEach(item=>item.classList.remove("is-selected"));
  cell.classList.add("is-selected");
  characterPreview.textContent=cell.textContent;
  drawCharacter(cell.textContent);
  characterCodeValue.textContent=cell.textContent;
  characterUnicode.textContent="U+"+cell.textContent.codePointAt(0).toString(16).toUpperCase().padStart(4,"0");
}

characterCells.forEach(cell=>{
  cell.tabIndex=0;
  cell.addEventListener("mouseenter",()=>selectCharacter(cell));
  cell.addEventListener("focus",()=>selectCharacter(cell));
  cell.addEventListener("click",()=>selectCharacter(cell));
});

if(characterCells.length){
  document.fonts.load('400 100px "Relay"').then(()=>{
    selectCharacter(characterCells[0]);
  });
}
window.addEventListener("resize",()=>drawCharacter(characterPreview.textContent));

const relayCycle=document.querySelector(".relay-pictogram-cycle");
const relayCycleSymbol=document.querySelector("#relay-cycle-symbol");
const relayCycleCode=document.querySelector("#relay-cycle-code");
const relayCycleGlyphs=[
  ["\uE02E","U+E02E"],["\uE008","U+E008"],["\uE02C","U+E02C"],["↑","U+2191"],
  ["❷","U+2777"],["\uE02D","U+E02D"],["④","U+2463"],["\uE014","U+E014"],
  ["🅖","U+1F156"],["\uE02F","U+E02F"],["↗","U+2197"],["⮊","U+2B8A"]
];
let relayCycleIndex=0;

function advanceRelayPictogram(){
  if(!relayCycle)return;
  relayCycle.classList.add("is-changing");
  window.setTimeout(()=>{
    relayCycleIndex=(relayCycleIndex+1)%relayCycleGlyphs.length;
    const [symbol,code]=relayCycleGlyphs[relayCycleIndex];
    relayCycleSymbol.textContent=symbol;
    relayCycleCode.textContent=code;
    relayCycle.classList.remove("is-changing");
  },200);
}

window.setInterval(advanceRelayPictogram,1800);

const relayWeightStudy=document.querySelector(".relay-layered-r");
const relayWeightButtons=document.querySelectorAll("[data-r-weight]");

function setRelayStudyWeight(button){
  relayWeightStudy.style.fontWeight=button.dataset.rWeight;
  relayWeightButtons.forEach(item=>item.classList.toggle("is-active",item===button));
}

relayWeightButtons.forEach(button=>{
  button.addEventListener("mouseenter",()=>setRelayStudyWeight(button));
  button.addEventListener("focus",()=>setRelayStudyWeight(button));
  button.addEventListener("click",()=>setRelayStudyWeight(button));
});

const relayArrowCanvas=document.querySelector("#relay-rotating-arrow-canvas");

function drawCenteredRelayArrow(){
  if(!relayArrowCanvas)return;
  const cssSize=parseFloat(getComputedStyle(relayArrowCanvas).width);
  const pixelRatio=window.devicePixelRatio||1;
  relayArrowCanvas.width=Math.round(cssSize*pixelRatio);
  relayArrowCanvas.height=Math.round(cssSize*pixelRatio);
  const context=relayArrowCanvas.getContext("2d");
  context.setTransform(pixelRatio,0,0,pixelRatio,0,0);
  context.clearRect(0,0,cssSize,cssSize);
  const fontSize=cssSize*.88;
  context.font="900 "+fontSize+'px "Relay"';
  const metrics=context.measureText("⮉");
  const inkWidth=metrics.actualBoundingBoxLeft+metrics.actualBoundingBoxRight;
  const inkHeight=metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent;
  const x=(cssSize-inkWidth)/2+metrics.actualBoundingBoxLeft;
  const y=(cssSize-inkHeight)/2+metrics.actualBoundingBoxAscent;
  context.fillStyle=getComputedStyle(document.body).color;
  context.fillText("⮉",x,y);
}

document.fonts.load('900 100px "Relay"').then(drawCenteredRelayArrow);
window.addEventListener("resize",drawCenteredRelayArrow);

document.querySelectorAll(".wayfinding-copy").forEach(section=>{
  const walker=document.createTreeWalker(section,NodeFilter.SHOW_TEXT);
  const textNodes=[];
  while(walker.nextNode())textNodes.push(walker.currentNode);
  textNodes.forEach(node=>{
    node.nodeValue=node.nodeValue.replace(/fi/gi,match=>match[0]+"\u200C"+match.slice(1));
  });
});
