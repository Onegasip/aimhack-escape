// 화면 위에 겹치는 글자들: 시작 안내판, 개발용 좌표 표시
import { findRoomAt } from '../data/rooms.js';

const SHOW_DEBUG = true; // 개발용 좌표 표시. 끄려면 false

export function createHud(controls) {
  const style = document.createElement('style');
  style.textContent = `
    #start {
      position: fixed; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 12px;
      background: rgba(0, 0, 0, 0.6); color: #fff; cursor: pointer;
      font-family: system-ui, sans-serif; user-select: none;
    }
    #start h1 { margin: 0; font-size: 36px; }
    #start p { margin: 0; opacity: 0.85; }
    #debug {
      position: fixed; top: 8px; left: 8px; padding: 6px 10px;
      background: rgba(0, 0, 0, 0.5); color: #fff; border-radius: 4px;
      font: 13px/1.5 ui-monospace, Consolas, monospace; pointer-events: none;
      white-space: pre;
    }
  `;
  document.head.appendChild(style);

  const start = document.createElement('div');
  start.id = 'start';
  start.innerHTML = `
    <h1>에임핵 방탈출</h1>
    <p>화면을 클릭하면 시작</p>
    <p>W A S D 이동 · 마우스 시점 · Esc 멈춤</p>`;
  document.body.appendChild(start);

  start.addEventListener('click', () => controls.lock());
  controls.addEventListener('lock', () => (start.style.display = 'none'));
  controls.addEventListener('unlock', () => (start.style.display = 'flex'));

  let debug = null;
  if (SHOW_DEBUG) {
    debug = document.createElement('div');
    debug.id = 'debug';
    document.body.appendChild(debug);
  }

  return {
    update(player) {
      if (!debug) return;
      const room = findRoomAt(player.x); // 걷기 전(시작 화면)에도 맞는 방 이름이 나오게 x로 직접 찾는다
      const localX = room ? player.x - room.cx : 0;
      debug.textContent =
        `${room ? room.name : '(방 밖)'}\n` +
        `월드  x ${player.x.toFixed(2)}  z ${player.z.toFixed(2)}\n` +
        `방 안 x ${localX.toFixed(2)}  z ${player.z.toFixed(2)}  (rooms.js pos 기준)`;
    },
  };
}
