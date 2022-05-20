const wrapperRef = document.querySelector(".wrapper");
const panelRef = document.querySelector(".panel");

let stepCount = 0;
let sizeBox;
let inputSizeBoxRef;
let outputSizeBoxRef;
let startBtnRef;

window.addEventListener("DOMContentLoaded", onResizeWindow, { once: true });
window.addEventListener("resize", onResizeWindow);

function onResizeWindow(e) {
  wrapperRef.style.height = "600px";
  wrapperRef.style.width = "600px";
  panelRef.style.width = "600px";

  wrapperRef.style.height = window.getComputedStyle(wrapperRef).width;
  wrapperRef.style.width = window.getComputedStyle(wrapperRef).height;
  panelRef.style.width = window.getComputedStyle(wrapperRef).height;
}

createStartGameMarkup();
function createStartGameMarkup() {
  const startMarkup = `<div class="start-wrapper">
        <p class="size-box-text">
          ВВЕДИТЕ РАЗМЕР КОРОБКИ <br />
          ОТ 3 ДО 10
        </p>
        <input
          class="size-box-input"
          type="number"
          name="sizeTable"
          min="2"
          max="10"
        />
        <p class="size-box-text-output">&nbsp;</p>
        <button class="start-game" disabled type="button">Начать игру</button>
      </div>`;

  wrapperRef.innerHTML = startMarkup;

  getRefs();
}

function getRefs() {
  inputSizeBoxRef = document.querySelector(".size-box-input");
  outputSizeBoxRef = document.querySelector(".size-box-text-output");
  startBtnRef = document.querySelector(".start-game");

  inputSizeBoxRef.addEventListener("input", onInputSizeBox);
  startBtnRef.addEventListener("click", onStartBtn, { once: true });
}

function onInputSizeBox() {
  const userInput = inputSizeBoxRef.value;
  const numberUserInput = Number(userInput);

  inputSizeBoxRef.classList.remove("invalid");
  inputSizeBoxRef.classList.remove("valid");

  startBtnRef.disabled = true;

  sizeBox = 0;

  if (numberUserInput >= 3 && numberUserInput <= 10) {
    inputSizeBoxRef.classList.add("valid");

    outputSizeBoxRef.textContent = `ВАША КОРОБКА РАЗМЕРОМ ${userInput} x ${userInput}`;

    sizeBox = numberUserInput;

    startBtnRef.disabled = false;
  } else {
    inputSizeBoxRef.classList.add("invalid");

    outputSizeBoxRef.textContent = `РАЗМЕР ДОЛЖЕН БЫТЬ ОТ 3 ДО 10`;
  }
}

function onStartBtn() {
  renderBox();
  getRefsRefreshBtn();
  inputSizeBoxRef.removeEventListener("input", onInputSizeBox);
  wrapperRef.addEventListener("click", onWrapperClick);
}

function createBoxItemsMarkup(amount) {
  let boxItems = [];

  for (let i = 1; i <= amount ** 2; i += 1) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.textContent = `${i}`;
    box.style.width = `calc(100% / ${amount})`;
    box.style.height = `calc(100% / ${amount})`;
    box.dataset.count = `${i}`;

    boxItems.push(box);
  }
  boxItems[boxItems.length - 1].classList.add("empty");
  boxItems[boxItems.length - 1].textContent = "";

  const withoutLast = boxItems.slice(0, boxItems.length - 1);

  randomSort(withoutLast);

  return [...withoutLast, boxItems[boxItems.length - 1]];
}

function createPanelMarkup() {
  return `<div class="stepcount">ХОДОВ: <span>0</span></div>
  <div class="refresh"><a class="refresh-btn">НАЧАТЬ ЗАНОВО</a></div>`;
}

function randomSort(boxItems) {
  boxItems.sort(() => Math.round(Math.random() * (10 + 10) - 10));
}

function renderBox() {
  wrapperRef.innerHTML = "";
  wrapperRef.append(...createBoxItemsMarkup(sizeBox));
  panelRef.insertAdjacentHTML("beforeend", createPanelMarkup());
}

function onWrapperClick(e) {
  if (
    !e.target.classList.contains("box") ||
    e.target.classList.contains("empty")
  ) {
    return;
  }

  swapBox(e);
  checkSuccess();
}

function swapBox(e) {
  const boxEmptyRef = document.querySelector(".box.empty");
  const target = e.target;
  const boxItems = target.parentNode.children;
  const targetWidth = target.clientWidth + target.clientWidth / 2;

  const targetCoords = target.getBoundingClientRect();
  const boxEmptyCoords = boxEmptyRef.getBoundingClientRect();

  const targetIndex = [...boxItems].reduce((acc, el, index) => {
    if (el === target) {
      return index;
    }
    return acc;
  }, 0);

  if (
    (Math.abs(targetCoords.x - boxEmptyCoords.x) < targetWidth &&
      targetCoords.y === boxEmptyCoords.y) ||
    (Math.abs(targetCoords.y - boxEmptyCoords.y) < targetWidth &&
      targetCoords.x === boxEmptyCoords.x)
  ) {
    stepCounter();
    const oldEl = target.parentNode.replaceChild(target, boxEmptyRef);

    if (boxItems[targetIndex]) {
      boxItems[targetIndex].before(oldEl);
    } else {
      target.parentNode.append(oldEl);
    }
  }
}

function stepCounter() {
  const outputStepCountRef = document.querySelector(".stepcount span");

  stepCount += 1;

  outputStepCountRef.textContent = stepCount;
}

let refreshBtnRef;

function getRefsRefreshBtn() {
  refreshBtnRef = document.querySelector(".refresh-btn");

  refreshBtnRef.addEventListener("click", onRefreshBtn);
}

function onRefreshBtn() {
  onPlayAgainBtn();
  refreshBtnRef?.removeEventListener("click", onRefreshBtn);
  panelRef.innerHTML = "";
}

function checkSuccess() {
  const boxItemRef = document.querySelectorAll(".box");

  const isSuccess = [...boxItemRef].every(
    (el, i) => el.dataset.count === String(i + 1)
  );

  const isSuccessReverse = [...boxItemRef]
    .reverse()
    .every((el, i) => el.dataset.count === String(i + 1));

  if (isSuccess || isSuccessReverse) {
    createFinishScreenMarkup();
    wrapperRef.removeEventListener("click", onWrapperClick);
  }
}

let playAgainBtnRef;

function createFinishScreenMarkup() {
  const finishScreen = `
    <div class="finish-screen">
      <p class="succes-text">УСПЕХ! <span>КОЛИЧЕСТВО ХОДОВ:</span> ${stepCount}</p>
      <a class="again">Играть снова</a>
    </div>
`;

  wrapperRef.innerHTML = finishScreen;
  panelRef.innerHTML = "";

  getBtnRef();
}

function getBtnRef() {
  playAgainBtnRef = document.querySelector(".again");

  playAgainBtnRef.addEventListener("click", onPlayAgainBtn);
}

function onPlayAgainBtn() {
  stepCount = 0;
  createStartGameMarkup();

  playAgainBtnRef?.removeEventListener("click", onPlayAgainBtn);
}

// Для разработки

// const sort = document.querySelector("#sort");

// sort.addEventListener("click", () => {
//   const sort = [...wrapperRef.children].sort(
//     (a, b) => a.dataset.count - b.dataset.count
//   );
//   wrapperRef.innerHTML = "";

//   wrapperRef.append(...sort);
// });
