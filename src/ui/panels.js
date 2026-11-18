// 창(자물쇠 입력창, 인벤토리)이 열려 있는지 관리한다.
// 창이 열리면 마우스 잠금을 풀어 클릭할 수 있게 하고, 닫히면 다시 잠근다.
let controls = null;
let openName = null;
const closeHandlers = new Map();

export function initPanels(pointerControls) {
  controls = pointerControls;
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && openName) closePanel(false); // Esc: 닫고 시작 안내판으로
  });
}

export function isPanelOpen() {
  return openName !== null;
}

// name: 창 이름, onClose: 닫힐 때 화면에서 지우는 함수
export function openPanel(name, onClose) {
  if (openName) closePanel(false);
  openName = name;
  closeHandlers.set(name, onClose);
  controls?.unlock();
}

// relock: true면 닫으면서 바로 게임으로 복귀 (버튼 클릭·키 입력처럼 사용자 동작일 때만 가능)
export function closePanel(relock = true) {
  if (!openName) return;
  const name = openName;
  openName = null;
  closeHandlers.get(name)?.();
  // 시작 안내판을 먼저 띄워 두고, 다시 잠그기에 성공하면(lock 이벤트) hud.js가 안내판을 숨긴다.
  // 브라우저가 다시 잠그기를 거절해도 안내판을 클릭해서 돌아올 수 있다.
  document.getElementById('start').style.display = 'flex';
  if (relock) controls?.lock();
}
