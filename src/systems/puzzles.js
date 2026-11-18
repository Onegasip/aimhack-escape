// 퍼즐 진행: E키로 물건을 썼을 때 무슨 일이 생기는지 처리한다.
// 무엇을 하는지는 data/puzzles.js의 INTERACTIONS에 적혀 있고, 여기는 그걸 실행만 한다.
import { INTERACTIONS, ITEMS } from '../data/puzzles.js';
import { state } from './state.js';
import { addItem, removeItem } from './inventory.js';
import { setFurnitureVisible } from '../world/furniture.js';
import { openDoorMesh } from '../world/roomBuilder.js';
import { showMessage } from '../ui/message.js';
import { openLockPanel } from '../ui/lockPanel.js';

// 조준점에 이 물건이 걸렸을 때 E로 쓸 수 있는지 (화면에 "E 길게" 안내를 띄울지)
export function canInteract(id) {
  if (state.doors[id]) return !state.doors[id].open; // 닫힌 문은 언제나 조사 가능
  const def = INTERACTIONS[id];
  if (!def) return false;
  const p = state.props[id];
  return !p.hidden && !p.taken;
}

export function interactionName(id) {
  return INTERACTIONS[id]?.name ?? (state.doors[id] ? '문' : '');
}

// E를 1.5초 다 눌렀을 때 호출
export function interact(id) {
  if (state.doors[id]) return useDoor(id);
  const def = INTERACTIONS[id];
  if (!def) return;

  if (def.type === 'examine') showMessage(def.text);
  else if (def.type === 'pickup') pickUp(id, def);
  else if (def.type === 'lock') {
    if (state.props[id].solved) showMessage('이미 열려 있다.');
    else openLockPanel(def.name, def.code.length, (input) => tryCode(id, def, input));
  }
}

function pickUp(id, def) {
  state.props[id].taken = true;
  setFurnitureVisible(id, false);
  addItem(def.item);
  showMessage(`${ITEMS[def.item].name}을(를) 주웠다. (I: 인벤토리)`);
}

// 자물쇠 입력창에서 확인을 누르면 호출. 맞으면 true
function tryCode(id, def, input) {
  if (input !== def.code) return false;
  state.props[id].solved = true;
  applyReward(def.onSolve);
  return true;
}

function useDoor(id) {
  if (state.doors[id].open) return;
  const def = INTERACTIONS[id];
  if (def?.needs && state.selectedItem === def.needs) {
    if (def.consume) removeItem(def.needs);
    openDoor(id);
    showMessage('문이 열렸다!');
  } else {
    showMessage(def?.lockedText ?? '잠겨 있다.');
  }
}

export function openDoor(id) {
  state.doors[id].open = true;
  openDoorMesh(id);
}

function applyReward(reward = {}) {
  if (reward.text) showMessage(reward.text);
  for (const id of reward.reveal ?? []) {
    state.props[id].hidden = false;
    setFurnitureVisible(id, true);
  }
  for (const id of reward.openDoors ?? []) openDoor(id);
}
