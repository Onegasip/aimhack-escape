// E키 길게 누르기 + 조준 대상 찾기 (CLAUDE.md 4장)
// - 화면 가운데 조준점이 2m 안의 물건을 가리킬 때만 쓸 수 있다
// - E를 1.5초 누르면 실행. 키를 떼거나, 움직이거나, 조준이 벗어나면 처음부터
import * as THREE from 'three';
import { canInteract, interactionName, interact } from './puzzles.js';
import { rooms, findRoomAt } from '../data/rooms.js';
import { furnitureInRoom } from '../world/furniture.js';
import { setCrosshair } from '../ui/crosshair.js';

const HOLD_TIME = 1.5; // 초
const RANGE = 2.0; // m

const raycaster = new THREE.Raycaster();
raycaster.far = RANGE;
const CENTER = new THREE.Vector2(0, 0);

let eDown = false;
let needRelease = false; // 한 번 실행한 뒤에는 E를 뗐다 다시 눌러야 함
let progress = 0;
let lastTarget = null;

window.addEventListener('keydown', (e) => {
  // 게임 중(마우스 잠금 상태)에 새로 누른 E만 받는다
  if (e.code === 'KeyE' && !e.repeat && document.pointerLockElement) eDown = true;
});
document.addEventListener('pointerlockchange', () => {
  if (!document.pointerLockElement) eDown = false; // 잠금이 풀리면 E 눌림 초기화
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyE') {
    eDown = false;
    needRelease = false;
    progress = 0; // 떼는 순간 게이지 초기화 (다음 프레임 전에 다시 눌러도 처음부터)
  }
});
window.addEventListener('blur', () => (eDown = false));

// 조준 계산 대상: 지금 방 + 양옆 방의 벽·가구 + 모든 문 (게임 전체를 매 프레임 검사하지 않게)
const candidateCache = new Map();
function candidates(scene, x) {
  const room = findRoomAt(x);
  if (!room) return scene.children;
  if (!candidateCache.has(room.id)) {
    const i = rooms.indexOf(room);
    const near = rooms.slice(Math.max(0, i - 1), i + 2);
    const list = [];
    for (const r of near) {
      const shell = scene.getObjectByName(`room_${r.id}`);
      if (shell) list.push(shell);
      list.push(...furnitureInRoom(r.id));
    }
    list.push(...scene.children.filter((o) => o.name.startsWith('door_')));
    candidateCache.set(room.id, list);
  }
  return candidateCache.get(room.id);
}

// 조준점이 가리키는 물건 id 찾기. 벽이나 다른 물건이 앞에 있으면 그 뒤는 못 고른다.
function findTarget(camera, scene) {
  raycaster.setFromCamera(CENTER, camera);
  for (const hit of raycaster.intersectObjects(candidates(scene, camera.position.x), true)) {
    if (!hit.object.isMesh || !isShown(hit.object)) continue;
    const id = idOf(hit.object);
    return id && canInteract(id) ? id : null; // 처음 맞은 보이는 물체만 본다
  }
  return null;
}

// 부모 중 하나라도 숨겨져 있으면 안 보이는 것
function isShown(obj) {
  for (let o = obj; o; o = o.parent) if (!o.visible) return false;
  return true;
}

function idOf(obj) {
  for (let o = obj; o; o = o.parent) {
    if (o.userData.doorId) return o.userData.doorId;
    if (o.userData.furnitureId) return o.userData.furnitureId;
  }
  return null;
}

// 매 프레임 호출. active: 포인터가 잠겨 있고 창이 안 열려 있을 때만 true
export function updateInteraction(dt, camera, scene, keys, active) {
  const target = active ? findTarget(camera, scene) : null;
  const moving = keys.forward || keys.back || keys.left || keys.right;

  if (!target || target !== lastTarget || !eDown || moving || needRelease) {
    progress = 0;
  } else {
    progress += dt / HOLD_TIME;
    if (progress >= 1) {
      progress = 0;
      needRelease = true;
      interact(target);
    }
  }
  lastTarget = target;
  setCrosshair(target ? interactionName(target) : null, progress);
}
