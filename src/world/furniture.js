// 가구를 방 데이터대로 만든다. 지금은 블록, 나중에 .glb 모델로 바꾼다.
// 다른 코드는 getFurniture('cafe_table4_1')처럼 id로만 가구를 찾는다.
// → 모델을 바꿀 때 이 파일만 고치면 되고, id와 위치는 그대로 유지된다.
import * as THREE from 'three';
import { rooms } from '../data/rooms.js';
import { state } from '../systems/state.js';
import { addBox, BLOCK_BELOW } from './blocks.js';

// 종류별 기본 색 (임시 블록용). 목록에 없는 종류는 회색
const TYPE_COLORS = {
  // 나무 가구
  table: 0x8b5a2b, low_table: 0x9a6b3c, chair: 0x5c3b1e, stool: 0x4a4a4a, shelf: 0x6b4a2f,
  counter: 0x7a7a85, cabinet: 0xc9b89a, bench: 0x6e5038, closet: 0xb59870,
  // 소파·천
  sofa: 0x3b4a8a, cushion: 0xc0504d, futon: 0xd9c7a7, pillow: 0xf2efe6, beanbag: 0xe07b39,
  // 가전·화면
  tv: 0x111111, monitor: 0x1a1a1a, tvstand: 0x333333, console: 0x222222, pad: 0x2b2b2b,
  fridge: 0xe8e8e8, appliance: 0xd5d5d5, machine: 0x5b6470, terminal: 0x2d6cdf, speaker: 0x262626,
  // 벽·안내물
  poster: 0xb23a48, board: 0x2f4f4f, sign: 0x22aa44, panel: 0x34495e, door: 0x7a5232, mark: 0xf2c94c,
  // 위생·주방
  toilet: 0xf7f7f7, sink: 0xdfe6ea, stove: 0x333333,
  // 볼링
  lane: 0xd8b47a, approach: 0xe3c693, pins: 0xeeeeee, pinsetter: 0x2c2c34, capping: 0x3a3a3a,
  ball_rack: 0x8e44ad, ball_return: 0x34495e, settee: 0xc0392b,
  // 기타
  plant: 0x2e7d32, prop: 0x9e9e9e, box: 0xa1887f, bag: 0x455a64, game: 0x7e57c2,
  pedestal: 0x9a8f7a, light: 0xfff3c4, extinguisher: 0xd32f2f,
};

// 의자·소파는 상자 하나 대신 [앉는 부분 + 등받이]로 만든다.
// 등받이는 기본으로 북쪽(-z)에 붙는다. 다른 쪽이면 방 데이터에 rotY를 준다
// (rotY 180 = 등받이 남쪽, 90 = 서쪽, -90 = 동쪽).
const SEATS = {
  chair: { seat: 0.45, back: 0.06 },
  stool: null,
  sofa: { seat: 0.42, back: 0.22 },
  settee: { seat: 0.42, back: 0.25 },
};

function buildBlock(group, item, w, h, d) {
  if (item.hidden) return; // 보이지 않는 막 (충돌만 있음)
  const color = item.color ?? TYPE_COLORS[item.type] ?? 0xaaaaaa;
  const seat = SEATS[item.type];
  if (!seat || h <= seat.seat + 0.05) {
    addBox(group, { center: [0, h / 2, 0], size: [w, h, d], color, glass: item.glass ?? false });
    return;
  }
  addBox(group, { center: [0, seat.seat / 2, 0], size: [w, seat.seat, d], color });
  addBox(group, { center: [0, h / 2, -d / 2 + seat.back / 2], size: [w, h, seat.back], color });
}

// id → { def: 방 데이터, roomId, object: THREE.Group }
const registry = new Map();

export function getFurniture(id) {
  return registry.get(id);
}

// 그 방에 있는 가구 Group 목록 (조준 계산을 가까운 방만 하려고)
export function furnitureInRoom(roomId) {
  const list = [];
  for (const entry of registry.values()) if (entry.roomId === roomId) list.push(entry.object);
  return list;
}

// 물건 보이기/숨기기 (상자에서 열쇠가 나타나거나, 주워서 사라질 때)
export function setFurnitureVisible(id, visible) {
  const entry = registry.get(id);
  if (entry) entry.object.visible = visible;
}

export function buildFurniture(scene, colliders) {
  for (const room of rooms) {
    for (const item of room.furniture ?? []) {
      if (registry.has(item.id)) console.warn(`가구 id가 겹쳐요: ${item.id}`);

      const [w, h, d] = item.size;
      const x = room.cx + item.pos[0];
      const z = item.pos[1];
      const y = item.y ?? 0;
      const rotY = item.rotY ?? 0;

      // 가구 하나 = Group 하나. 나중에 블록 대신 .glb 모델을 이 Group 안에 넣으면 된다.
      const group = new THREE.Group();
      group.name = item.id;
      group.userData.furnitureId = item.id; // 조준했을 때 어느 물건인지 알 수 있게
      group.visible = !state.props[item.id]?.hidden;
      group.position.set(x, y, z);
      group.rotation.y = THREE.MathUtils.degToRad(rotY);
      buildBlock(group, item, w, h, d);
      scene.add(group);
      registry.set(item.id, { def: item, roomId: room.id, object: group });

      // 충돌: 90도 / 270도 회전이면 가로·세로가 바뀐다
      if (item.collide !== false && y < BLOCK_BELOW) {
        const turned = Math.abs(rotY % 180) === 90;
        const fw = turned ? d : w;
        const fd = turned ? w : d;
        colliders.push({ id: item.id, minX: x - fw / 2, maxX: x + fw / 2, minZ: z - fd / 2, maxZ: z + fd / 2 });
      }
    }
  }
}
