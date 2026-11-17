// 키보드(WASD)와 마우스(시점 회전) 조작.
// PointerLockControls는 Three.js 안에 들어 있는 도구라 따로 설치할 필요가 없다.
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// e.code는 키보드 "자리" 기준이라 한글 입력 상태에서도 W/A/S/D가 똑같이 잡힌다.
const KEY_MAP = { KeyW: 'forward', KeyS: 'back', KeyA: 'left', KeyD: 'right' };

export function createControls(camera, domElement) {
  const controls = new PointerLockControls(camera, domElement);
  const keys = { forward: false, back: false, left: false, right: false };

  const reset = () => {
    for (const k in keys) keys[k] = false;
  };

  window.addEventListener('keydown', (e) => {
    if (KEY_MAP[e.code]) keys[KEY_MAP[e.code]] = true;
  });
  window.addEventListener('keyup', (e) => {
    if (KEY_MAP[e.code]) keys[KEY_MAP[e.code]] = false;
  });
  // 창을 벗어나거나 Esc로 잠금이 풀리면 키가 눌린 채로 남지 않게 초기화
  window.addEventListener('blur', reset);
  controls.addEventListener('unlock', reset);

  return { controls, keys };
}
