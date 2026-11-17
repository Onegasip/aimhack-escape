// 방 껍데기(바닥, 천장, 벽, 문틀, 닫힌 문, 조명)를 rooms.js 데이터대로 만든다.
import * as THREE from 'three';
import { rooms, WALL_T, listDoors } from '../data/rooms.js';
import { state } from '../systems/state.js';
import { addBox } from './blocks.js';

const FRAME_COLOR = 0x5a3e2b;
const DOOR_COLOR = 0x7a5232;

// 문 id → 닫힌 문짝 mesh (③단계에서 문 열기에 쓴다)
const doorPanels = new Map();
export function getDoorPanel(id) {
  return doorPanels.get(id);
}

export function buildRooms(scene, colliders) {
  const doors = listDoors();

  rooms.forEach((room, i) => {
    const group = new THREE.Group();
    group.name = `room_${room.id}`;
    scene.add(group);

    buildFloorAndCeiling(group, room);

    const halfD = room.depth / 2;
    const wall = { height: room.height, color: room.wallColor };
    const next = rooms[i + 1];

    // 북쪽·남쪽 벽 (동서로 뻗음). 벽은 방 테두리 안쪽에 두께 WALL_T로 둔다.
    addWall(group, colliders, { ...wall, axis: 'x', fixed: -halfD + WALL_T / 2, from: room.x0, to: room.x1 });
    addWall(group, colliders, { ...wall, axis: 'x', fixed: halfD - WALL_T / 2, from: room.x0, to: room.x1 });
    // 서쪽·동쪽 벽 (남북으로 뻗음). 문이 있으면 구멍을 낸다.
    addWall(group, colliders, {
      ...wall, axis: 'z', fixed: room.x0 + WALL_T / 2, from: -halfD, to: halfD,
      door: room.westDoor && doorInfo(doors, room.westDoor.id),
    });
    const eastDoor = next?.westDoor ?? room.eastDoor;
    addWall(group, colliders, {
      ...wall, axis: 'z', fixed: room.x1 - WALL_T / 2, from: -halfD, to: halfD,
      door: eastDoor && doorInfo(doors, eastDoor.id),
    });

    // 방 안쪽 벽 (MT 숙소 화장실 등). 좌표는 방 가운데 기준
    for (const w of room.walls ?? []) {
      const axis = w.from[0] === w.to[0] ? 'z' : 'x';
      const fixed = axis === 'z' ? room.cx + w.from[0] : w.from[1];
      const a = axis === 'z' ? w.from[1] : room.cx + w.from[0];
      const b = axis === 'z' ? w.to[1] : room.cx + w.to[0];
      addWall(group, colliders, {
        ...wall, axis, fixed, from: Math.min(a, b), to: Math.max(a, b),
        door: w.door && doorInfo(doors, w.door.id),
      });
    }

    // 조명: 방 가운데 천장 근처에 하나
    const light = new THREE.PointLight(0xfff1dd, 6, Math.max(room.width, room.depth) * 1.1, 1);
    light.position.set(room.cx, room.height - 0.8, 0); // 천장에 너무 붙이면 천장에 밝은 얼룩이 생긴다
    group.add(light);
  });

  for (const door of doors) buildDoor(scene, colliders, door);
}

function doorInfo(doors, id) {
  const d = doors.find((x) => x.id === id);
  // 벽 구멍 위치: 남북 벽이면 z, 동서 벽이면 x
  return { center: d.axis === 'z' ? d.z : d.x, width: d.width, height: d.height };
}

function buildFloorAndCeiling(group, room) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(room.width, room.depth),
    new THREE.MeshStandardMaterial({ color: room.floorColor, roughness: 0.9 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(room.cx, 0, 0);
  group.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(room.width, room.depth),
    new THREE.MeshStandardMaterial({ color: room.ceilingColor ?? 0xf2f0ec, roughness: 0.95 }),
  );
  ceiling.rotation.x = Math.PI / 2; // 아래를 보게 뒤집기
  ceiling.position.set(room.cx, room.height, 0);
  group.add(ceiling);
}

// 벽 하나 만들기. axis 방향으로 from~to만큼 뻗고, 다른 축 좌표는 fixed.
// door가 있으면 [벽 | 구멍 | 벽] + 구멍 위 상인방으로 나눈다.
function addWall(group, colliders, { axis, fixed, from, to, height, color, door }) {
  const pieces = []; // [시작, 끝, 아래 y, 위 y]
  if (door) {
    const left = door.center - door.width / 2;
    const right = door.center + door.width / 2;
    pieces.push([from, left, 0, height], [right, to, 0, height], [left, right, door.height, height]);
  } else {
    pieces.push([from, to, 0, height]);
  }

  for (const [a, b, y0, y1] of pieces) {
    if (b - a <= 0.001 || y1 - y0 <= 0.001) continue;
    const mid = (a + b) / 2;
    const len = b - a;
    const center = axis === 'x' ? [mid, (y0 + y1) / 2, fixed] : [fixed, (y0 + y1) / 2, mid];
    const size = axis === 'x' ? [len, y1 - y0, WALL_T] : [WALL_T, y1 - y0, len];
    addBox(group, { center, size, color, colliders });
  }
}

// 문틀(기둥 2개 + 위 가로대)과, 닫혀 있으면 문짝
function buildDoor(scene, colliders, door) {
  const group = new THREE.Group();
  group.name = door.id;
  scene.add(group);

  const depth = WALL_T * 2 + 0.1; // 양쪽 벽보다 살짝 두껍게
  const post = 0.08;
  const { width: w, height: h } = door;
  // 문이 박힌 벽 방향에 맞춰 [가로, 세로] 크기와 위치를 바꿔 준다
  const place = (along, y, sizeAlong, sizeY, thick) =>
    door.axis === 'z'
      ? { center: [door.x, y, door.z + along], size: [thick, sizeY, sizeAlong] }
      : { center: [door.x + along, y, door.z], size: [sizeAlong, sizeY, thick] };

  addBox(group, { ...place(-(w / 2 + post / 2), h / 2, post, h, depth), color: FRAME_COLOR, colliders });
  addBox(group, { ...place(w / 2 + post / 2, h / 2, post, h, depth), color: FRAME_COLOR, colliders });
  addBox(group, { ...place(0, h + post / 2, w + post * 2, post, depth), color: FRAME_COLOR });

  if (!state.doors[door.id]?.open) {
    const panel = addBox(group, { ...place(0, h / 2, w, h, 0.06), color: DOOR_COLOR, colliders, id: door.id });
    doorPanels.set(door.id, panel);
  }
}
