// 가구를 rooms.js 데이터대로 만든다. 지금은 블록, 나중에 .glb 모델로 바꾼다.
// 다른 코드는 getFurniture('cafe_table_1')처럼 id로만 가구를 찾는다.
// → 모델을 바꿀 때 이 파일만 고치면 되고, id와 위치는 그대로 유지된다.
import * as THREE from 'three';
import { rooms } from '../data/rooms.js';
import { addBox, BLOCK_BELOW } from './blocks.js';

// 종류별 기본 색 (임시 블록용)
const TYPE_COLORS = {
  table: 0x8b5a2b,
  chair: 0x5c3b1e,
  shelf: 0x6b4a2f,
  counter: 0x7a7a85,
  terminal: 0x2d6cdf,
  tvstand: 0x333333,
  tv: 0x111111,
  sofa: 0x3b4a8a,
  fridge: 0xe8e8e8,
  futon: 0xd9c7a7,
  toilet: 0xf7f7f7,
  sink: 0xdfe6ea,
  lane: 0xd8b47a,
  pindeck: 0xeeeeee,
  pedestal: 0x9a8f7a,
  sign: 0x22aa44,
};

// id → { def: rooms.js 데이터, roomId, object: THREE.Group }
const registry = new Map();

export function getFurniture(id) {
  return registry.get(id);
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
      group.position.set(x, y, z);
      group.rotation.y = THREE.MathUtils.degToRad(rotY);
      addBox(group, {
        center: [0, h / 2, 0],
        size: [w, h, d],
        color: item.color ?? TYPE_COLORS[item.type] ?? 0xaaaaaa,
      });
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
