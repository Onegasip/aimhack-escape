// 방 껍데기(바닥, 천장, 벽, 문틀, 닫힌 문, 조명)를 방 데이터대로 만든다.
import * as THREE from 'three';
import { rooms, WALL_T, DOOR, listDoors } from '../data/rooms.js';
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
  const doorById = new Map(doors.map((d) => [d.id, d]));
  // 바깥 벽의 문 구멍: 남북으로 뻗은 벽이라 구멍 위치는 z
  const perimeterHole = (door) => door && [{ center: doorById.get(door.id).z, ...pick(doorById.get(door.id)) }];

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
      openings: perimeterHole(room.westDoor),
    });
    addWall(group, colliders, {
      ...wall, axis: 'z', fixed: room.x1 - WALL_T / 2, from: -halfD, to: halfD,
      openings: perimeterHole(next?.westDoor ?? room.eastDoor),
    });

    // 방 안쪽 벽 (부스 칸막이, 화장실, 유리벽 등). 좌표는 방 가운데 기준
    for (const w of room.walls ?? []) {
      const axis = w.from[0] === w.to[0] ? 'z' : 'x';
      const fixed = axis === 'z' ? room.cx + w.from[0] : w.from[1];
      const a = axis === 'z' ? w.from[1] : room.cx + w.from[0];
      const b = axis === 'z' ? w.to[1] : room.cx + w.to[0];
      const openings = (w.openings ?? []).map((op) => ({
        center: axis === 'z' ? op.at : room.cx + op.at,
        width: op.width,
        height: op.height ?? DOOR.height,
      }));
      addWall(group, colliders, {
        axis, fixed, from: Math.min(a, b), to: Math.max(a, b),
        height: w.height ?? room.height,
        thickness: w.thickness ?? WALL_T,
        color: w.color ?? room.wallColor,
        glass: w.glass ?? false,
        glassTop: w.glassTop ?? 0,
        base: w.y0 ?? 0,
        openings,
      });
    }

  });

  for (const door of doors) buildDoor(scene, colliders, door);

  // 조명 풀: 전구 몇 개만 만들어 두고, 플레이어가 있는 방으로 옮겨 쓴다.
  // (방마다 전구를 다 켜 두면 화면의 모든 점이 모든 전구를 계산해서 느려진다)
  for (let i = 0; i < LIGHT_POOL; i++) {
    const light = new THREE.PointLight(0xfff1dd, 0, 1, 1);
    scene.add(light);
    lightPool.push(light);
  }
}

const LIGHT_POOL = 4; // 한 방에 쓰는 조명 최대 개수 (볼링장 4개)
const lightPool = [];
let litRoomId = null;

// 매 프레임 호출: 플레이어가 다른 방에 들어가면 조명을 그 방 위치로 옮긴다.
// 전구 개수는 그대로 두고 밝기만 0으로 끄기 때문에 화면이 다시 준비(셰이더 재컴파일)되지 않는다.
export function updateRoomLights(room) {
  if (!room || room.id === litRoomId) return;
  litRoomId = room.id;
  const spots = room.lights ?? [[0, 0]]; // 기본은 방 가운데 하나
  const reach = Math.max(room.width, room.depth) * (spots.length > 1 ? 0.6 : 1.1);
  lightPool.forEach((light, i) => {
    const spot = spots[i];
    light.intensity = spot ? 6 : 0;
    light.distance = reach;
    if (spot) light.position.set(room.cx + spot[0], room.height - 0.8, spot[1]); // 천장에 너무 붙이면 밝은 얼룩
  });
}

const pick = (d) => ({ width: d.width, height: d.height });

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
// openings(구멍)가 있으면 [벽 | 구멍 | 벽 ...]으로 나누고 구멍 위는 상인방으로 막는다.
// glass: 벽 전체가 유리. glassTop: 벽 윗부분 이만큼(m)만 유리 (부스 칸막이)
// base: 벽이 시작하는 높이 (통유리 위 벽처럼 공중에 뜬 벽)
function addWall(group, colliders, { axis, fixed, from, to, height, color, thickness = WALL_T, glass = false, glassTop = 0, base = 0, openings = [] }) {
  const top = base + height;
  const pieces = []; // [시작, 끝, 아래 y, 위 y]
  let cursor = from;
  for (const op of [...openings].sort((p, q) => p.center - q.center)) {
    const left = op.center - op.width / 2;
    const right = op.center + op.width / 2;
    pieces.push([cursor, left, base, top], [left, right, base + op.height, top]);
    cursor = right;
  }
  pieces.push([cursor, to, base, top]);

  const solidTop = glass ? base : top - glassTop; // 이 높이 위는 유리
  for (const [a, b, y0, y1] of pieces) {
    if (b - a <= 0.001 || y1 - y0 <= 0.001) continue;
    // 한 조각을 [불투명 부분, 유리 부분]으로 나눈다
    const parts = [
      [y0, Math.min(y1, solidTop), false],
      [Math.max(y0, solidTop), y1, true],
    ];
    for (const [p0, p1, isGlass] of parts) {
      if (p1 - p0 <= 0.001) continue;
      const mid = (a + b) / 2;
      const len = b - a;
      const center = axis === 'x' ? [mid, (p0 + p1) / 2, fixed] : [fixed, (p0 + p1) / 2, mid];
      const size = axis === 'x' ? [len, p1 - p0, thickness] : [thickness, p1 - p0, len];
      addBox(group, { center, size, color, colliders, glass: isGlass });
    }
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
