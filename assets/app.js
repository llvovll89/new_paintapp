// dom
const ops = document.querySelectorAll('.ops');
const allTollBtn = document.querySelectorAll('.paint_tool');
const checkedColor = document.querySelector('.check_color');
const colorItems = document.querySelectorAll('.colors .op');
const colorPick = document.querySelector('.color-pick');
const clearBtn = document.querySelector('.clear_btn');
const savePaint = document.querySelector('.save_paint');
// right_canvas 영역
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
// brush & erasor range
const brushSize = document.querySelector('.brush_size');
const erasorSlide = document.querySelector('.erasor_slide');

let prevX;
let prevY;
let snShot;
let brushWd = 5;
let erasorWd = 10;
let colorSelect = '#000';
let isDrawing = false;
let select = 'brush';

window.addEventListener('load', () => {
  // canvas offset width-height 값을 가져오므로 drawItem 마우스 포인터에 정확한 위치 넘기기
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  canvasBG();
});

const canvasBG = () => {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width , canvas.height);
    ctx.fillStyle = colorSelect;
}

brushSize.addEventListener('change', (e) => {
  brushWd = e.target.value;
});

erasorSlide.addEventListener('change', (e) => {
  erasorWd = e.target.value;
});

clearBtn.addEventListener('click', (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasBG();
});

// 저장버튼 이벤트
savePaint.addEventListener('click', () => {
    const imgLink = document.createElement('a');
    imgLink.download = `${Date.now()}.jpg`;
    imgLink.href = canvas.toDataURL();
    imgLink.click();
})

colorPick.addEventListener('change', () => {
  colorPick.parentElement.style.background = colorPick.value;
  colorPick.parentElement.click();
});

const drawingGo = (e) => {
  isDrawing = true;

  prevX = e.offsetX;
  prevY = e.offsetY;

  // 새로운 경로(선) 그리기
  ctx.beginPath();

  // 선 굵기
  ctx.lineWidth = brushWd;
  ctx.strokeStyle = colorSelect;
  ctx.fillStyle = colorSelect;

  snShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawRect = (e) => {
  // strokeRect = 테두리만 있는 사각형
  // fliiRect = 색 채워진 사각형
  if (!checkedColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevX - e.offsetX,
      prevY - e.offsetY
    );
  }
  ctx.fillRect(e.offsetX, e.offsetY, prevX - e.offsetX, prevY - e.offsetY);
};

const drawCircle = (e) => {
  // 선 초기화
  ctx.beginPath();
  // Math.sqrt = 제곱근 Math.pow = 제곱근 반환
  let radius = Math.sqrt(
    Math.pow(prevX - e.offsetX, 2) + (Math.pow(prevY - e.offsetY), 2)
  );
  // arc (x, y , 반지름 , 시작각도 , 마지막각도)
  //  시작각도: 0, 마지막각도: 2 * Math.PI 로 설정하면 360도의 원이 그려진다.
  ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI);
  // 컬러 체크시 - 꽉찬 동그라미
  checkedColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTrianGle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  // lineTo = 직선경로 선 추가
  ctx.lineTo(e.offsetX, e.offsetY);
  // 하위 선 추가 (선 - 좌/우 + 아래)
  ctx.lineTo(prevX * 2 - e.offsetX, e.offsetY);
  // 남은 한 선 까지
  ctx.closePath();
  checkedColor.checked ? ctx.fill() : ctx.stroke();
};

const goingErasor = (e) => {
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineWidth = erasorWd;
  ctx.stroke();
};

const drawItem = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snShot, 0, 0);

  // option &  paint_tool Slected 조건문
  switch (select) {
    case 'brush':
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;

    case 'rect':
      drawRect(e);
      break;

    case 'circle':
      drawCircle(e);
      break;

    case 'triangle':
      drawTrianGle(e);
      break;

    case 'erasor':
      goingErasor(e);
      break;

    case 'piker-color':
      break;
  }
};

// Mouse_evnet
canvas.addEventListener('mousedown', drawingGo);
canvas.addEventListener('mousemove', drawItem);
canvas.addEventListener('mouseup', () => (isDrawing = false));

// color 그룹
colorItems.forEach((color) => {
  color.addEventListener('click', () => {
    document.querySelector('.slected').classList.remove('slected');
    color.classList.add('slected');

    // window.getComputedStyle(color) = color 의 css 속성값 가져오기
    // getPropertyValue('background') = color 의 background 요소 선택
    colorSelect = window
      .getComputedStyle(color)
      .getPropertyValue('background-color');
  });
});

// option 그룹
allTollBtn.forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelector('.active').classList.remove('active');
    item.classList.add('active');
    select = item.id;
  });
});
