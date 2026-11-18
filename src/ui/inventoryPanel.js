// 인벤토리 창 (I 키) + 오른쪽 아래 "손에 든 아이템" 표시
// 창에서 아이템을 클릭하면 손에 든다. 든 채로 장치·문에 E를 길게 누르면 사용된다.
import { ITEMS } from '../data/puzzles.js';
import { state } from '../systems/state.js';
import { selectItem, onInventoryChange } from '../systems/inventory.js';
import { openPanel, closePanel, isPanelOpen } from './panels.js';

let root = null;
let held = null;

const css = `
  #inv { position:fixed; inset:0; display:none; align-items:center; justify-content:center;
    background:rgba(0,0,0,.5); font-family:system-ui,sans-serif; color:#fff; }
  #inv .box { background:#2b2b33; padding:20px 24px; border-radius:10px; min-width:320px; }
  #inv h2 { margin:0 0 4px; font-size:18px; }
  #inv p { margin:0 0 14px; font-size:13px; opacity:.75; }
  #inv .grid { display:grid; grid-template-columns:repeat(4, 72px); gap:8px; }
  #inv .slot { height:72px; border-radius:6px; background:#111; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:6px; font-size:11px; cursor:pointer; border:2px solid transparent; }
  #inv .slot.sel { border-color:#ffd54f; }
  #inv .slot .icon { width:28px; height:14px; border-radius:3px; }
  #inv .empty { grid-column:1/-1; opacity:.6; font-size:13px; padding:10px 0; }
  #held { position:fixed; right:16px; bottom:16px; padding:6px 12px; border-radius:6px;
    background:rgba(0,0,0,.55); color:#fff; font:13px system-ui,sans-serif; pointer-events:none; display:none; }
`;

export function initInventoryPanel(controls) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  root = document.createElement('div');
  root.id = 'inv';
  document.body.appendChild(root);
  held = document.createElement('div');
  held.id = 'held';
  document.body.appendChild(held);

  window.addEventListener('keydown', (e) => {
    if (e.code !== 'KeyI' || e.repeat) return; // 꾹 누를 때 자동 반복은 무시
    if (root.style.display === 'flex') closePanel(true);
    else if (controls.isLocked && !isPanelOpen()) open();
  });
  onInventoryChange(render);
  render();
}

function open() {
  root.style.display = 'flex';
  render();
  openPanel('inventory', () => (root.style.display = 'none'));
}

function render() {
  const items = state.inventory;
  root.innerHTML = `
    <div class="box">
      <h2>인벤토리 (팀 공용)</h2>
      <p>아이템을 클릭하면 손에 든다. 든 채로 장치에 E를 길게 누르면 사용. I 키로 닫기</p>
      <div class="grid">${items.length === 0 ? '<div class="empty">아직 아무것도 없다.</div>' : items.map((id) => `
        <div class="slot ${state.selectedItem === id ? 'sel' : ''}" data-id="${id}">
          <div class="icon" style="background:${ITEMS[id].color}"></div>${ITEMS[id].name}
        </div>`).join('')}
      </div>
    </div>`;
  root.querySelectorAll('.slot').forEach((s) => (s.onclick = () => selectItem(s.dataset.id)));

  const sel = state.selectedItem && ITEMS[state.selectedItem];
  held.textContent = sel ? `손에 든 것: ${sel.name}` : '';
  held.style.display = sel ? 'block' : 'none';
}
