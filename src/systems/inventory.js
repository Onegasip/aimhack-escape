// 팀 공용 인벤토리. 아이템은 state.inventory(아이템 id 목록)에 들어간다.
// 화면(인벤토리 창, 손에 든 아이템 표시)은 onInventoryChange로 바뀐 것을 듣고 다시 그린다.
import { state } from './state.js';

const listeners = [];
export function onInventoryChange(fn) {
  listeners.push(fn);
}
const notify = () => listeners.forEach((fn) => fn());

export function addItem(itemId) {
  if (!state.inventory.includes(itemId)) state.inventory.push(itemId);
  notify();
}

export function removeItem(itemId) {
  state.inventory = state.inventory.filter((id) => id !== itemId);
  if (state.selectedItem === itemId) state.selectedItem = null;
  notify();
}

// 같은 아이템을 다시 고르면 내려놓기(선택 해제)
export function selectItem(itemId) {
  state.selectedItem = state.selectedItem === itemId ? null : itemId;
  notify();
}
