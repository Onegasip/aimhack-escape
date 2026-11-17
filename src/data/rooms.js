// ─────────────────────────────────────────────────────────────
// 방·문·가구 데이터 (CLAUDE.md 5장, 7장)
// 방 크기, 문, 가구는 전부 여기서만 고친다. 숫자만 바꾸면 게임에 반영된다.
//
// 좌표 규칙
//   - 1 = 1m. x+ = 동쪽, z+ = 남쪽, z- = 북쪽, y+ = 위
//   - 방은 아래 순서대로 x+ 방향에 자동으로 이어 붙는다. (width를 바꾸면 뒤 방들이 알아서 밀린다)
//   - 모든 방은 z = 0을 중심으로 남북 대칭
//   - 가구 pos: [x, z] = "방 한가운데"를 (0, 0)으로 한 좌표. y는 바닥에서 띄울 높이 (안 쓰면 0)
//   - 가구 size: [폭(x), 높이(y), 깊이(z)]
//   - 가구 rotY: 회전(도). 0 / 90 / 180 / 270만 쓴다
//   - collide: false 이면 밟고 지나갈 수 있다 (이불, 볼링 레인처럼 납작한 것)
//   - 가구 색은 furniture.js의 종류(type)별 기본색. color를 적으면 그 색으로 바뀐다
// ─────────────────────────────────────────────────────────────

export const WALL_T = 0.1; // 벽 두께. 방과 방 사이는 양쪽 방 벽이 붙어서 0.2m
export const DOOR = { width: 1.4, height: 2.2 }; // 기본 문 크기
export const PLAYER = { eyeHeight: 1.6, radius: 0.3, speed: 3.5 };

// 시작 위치 (월드 좌표). yawDeg: 바라보는 방향 0 = 북쪽, -90 = 동쪽, 90 = 서쪽, 180 = 남쪽
export const spawn = { x: 2, z: 0, yawDeg: -90 };

export const rooms = [
  {
    id: 'lobby',
    name: '로비 (튜토리얼)',
    width: 15, depth: 12, height: 3,
    floorColor: 0x8a8178, wallColor: 0xd8d2c8,
    westDoor: { id: 'door_entrance', open: false }, // 밖으로 나가는 입구 (닫힘)
    furniture: [
      { id: 'lobby_counter', type: 'counter', pos: [1, -4], size: [3, 1.1, 0.8] },
      { id: 'lobby_terminal', type: 'terminal', pos: [6.6, 1.6], size: [0.4, 1.3, 0.3] },
    ],
  },
  {
    id: 'cafe',
    name: '1. 보드게임 카페',
    width: 15, depth: 15, height: 3,
    floorColor: 0x9c6b43, wallColor: 0xe6d3b3,
    westDoor: { id: 'door_lobby_cafe', open: true },
    furniture: [
      { id: 'cafe_table_1', type: 'table', pos: [-3, -3], size: [1.2, 0.75, 1.2] },
      { id: 'cafe_table_2', type: 'table', pos: [3, -3], size: [1.2, 0.75, 1.2] },
      { id: 'cafe_table_3', type: 'table', pos: [-3, 3], size: [1.2, 0.75, 1.2] },
      { id: 'cafe_table_4', type: 'table', pos: [3, 3], size: [1.2, 0.75, 1.2] },
      // 의자: 테이블마다 동서남북 4개
      { id: 'cafe_chair_1', type: 'chair', pos: [-3, -3.95], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_2', type: 'chair', pos: [-3, -2.05], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_3', type: 'chair', pos: [-3.95, -3], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_4', type: 'chair', pos: [-2.05, -3], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_5', type: 'chair', pos: [3, -3.95], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_6', type: 'chair', pos: [3, -2.05], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_7', type: 'chair', pos: [2.05, -3], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_8', type: 'chair', pos: [3.95, -3], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_9', type: 'chair', pos: [-3, 2.05], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_10', type: 'chair', pos: [-3, 3.95], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_11', type: 'chair', pos: [-3.95, 3], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_12', type: 'chair', pos: [-2.05, 3], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_13', type: 'chair', pos: [3, 2.05], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_14', type: 'chair', pos: [3, 3.95], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_15', type: 'chair', pos: [2.05, 3], size: [0.45, 0.9, 0.45] },
      { id: 'cafe_chair_16', type: 'chair', pos: [3.95, 3], size: [0.45, 0.9, 0.45] },
      // 보드게임 선반: 북쪽 벽
      { id: 'cafe_shelf_1', type: 'shelf', pos: [-4.5, -7.15], size: [2.4, 2.0, 0.4] },
      { id: 'cafe_shelf_2', type: 'shelf', pos: [0, -7.15], size: [2.4, 2.0, 0.4] },
      { id: 'cafe_shelf_3', type: 'shelf', pos: [4.5, -7.15], size: [2.4, 2.0, 0.4] },
    ],
  },
  {
    id: 'ps',
    name: '2. 닌텐도·플스방',
    width: 15, depth: 15, height: 3,
    floorColor: 0x2b2d42, wallColor: 0x4a4e69,
    westDoor: { id: 'door_cafe_ps', open: true },
    furniture: [
      { id: 'ps_tvstand_1', type: 'tvstand', pos: [-3.5, -7.15], size: [1.8, 0.5, 0.45] },
      { id: 'ps_tvstand_2', type: 'tvstand', pos: [3.5, -7.15], size: [1.8, 0.5, 0.45] },
      { id: 'ps_tv_1', type: 'tv', pos: [-3.5, -7.2], y: 0.5, size: [1.6, 0.95, 0.08] },
      { id: 'ps_tv_2', type: 'tv', pos: [3.5, -7.2], y: 0.5, size: [1.6, 0.95, 0.08] },
      { id: 'ps_sofa_1', type: 'sofa', pos: [-3.5, -3], size: [2.2, 0.85, 0.9] },
      { id: 'ps_sofa_2', type: 'sofa', pos: [3.5, -3], size: [2.2, 0.85, 0.9] },
      { id: 'ps_shelf_1', type: 'shelf', pos: [-4, 7.15], size: [2.0, 2.0, 0.4] },
      { id: 'ps_shelf_2', type: 'shelf', pos: [4, 7.15], size: [2.0, 2.0, 0.4] },
    ],
  },
  {
    id: 'mt',
    name: '3. MT 숙소',
    width: 18, depth: 15, height: 3,
    floorColor: 0xa8865c, wallColor: 0xefe6d8,
    westDoor: { id: 'door_ps_mt', open: true },
    // 방 안쪽 벽: 북동쪽 구석 화장실 (4.5 × 5m). from/to = 벽 양 끝 [x, z], door.at = 문 가운데 위치
    walls: [
      { id: 'mt_toilet_wall_w', from: [4.5, -7.5], to: [4.5, -2.5],
        door: { id: 'door_mt_toilet', at: -5, width: 0.9, height: 2.1, open: true } },
      { id: 'mt_toilet_wall_s', from: [4.5, -2.5], to: [9, -2.5] },
    ],
    furniture: [
      { id: 'mt_fridge', type: 'fridge', pos: [-8.45, -7.0], size: [0.8, 1.8, 0.75] },
      { id: 'mt_table', type: 'table', pos: [-4, -4], size: [1.8, 0.75, 0.9] },
      { id: 'mt_chair_1', type: 'chair', pos: [-4.45, -4.75], size: [0.45, 0.9, 0.45] },
      { id: 'mt_chair_2', type: 'chair', pos: [-3.55, -4.75], size: [0.45, 0.9, 0.45] },
      { id: 'mt_chair_3', type: 'chair', pos: [-4.45, -3.25], size: [0.45, 0.9, 0.45] },
      { id: 'mt_chair_4', type: 'chair', pos: [-3.55, -3.25], size: [0.45, 0.9, 0.45] },
      { id: 'mt_futon_1', type: 'futon', pos: [-2.25, 5.3], size: [1.0, 0.12, 2.0], collide: false },
      { id: 'mt_futon_2', type: 'futon', pos: [-0.75, 5.3], size: [1.0, 0.12, 2.0], collide: false },
      { id: 'mt_futon_3', type: 'futon', pos: [0.75, 5.3], size: [1.0, 0.12, 2.0], collide: false },
      { id: 'mt_futon_4', type: 'futon', pos: [2.25, 5.3], size: [1.0, 0.12, 2.0], collide: false },
      // 화장실 칸 안
      { id: 'mt_toilet', type: 'toilet', pos: [8.5, -6.8], size: [0.7, 0.45, 0.45] },
      { id: 'mt_sink', type: 'sink', pos: [8.65, -4.2], size: [0.45, 0.85, 0.6] },
    ],
  },
  {
    id: 'bowl',
    name: '4. 볼링장',
    width: 27, depth: 30, height: 4,
    floorColor: 0x3a3a4a, wallColor: 0x2e2e40,
    westDoor: { id: 'door_mt_bowl', open: true },
    furniture: [
      // 레인 6개: 북쪽(핀) ↔ 남쪽(던지는 곳) 방향
      { id: 'bowl_lane_1', type: 'lane', pos: [-3.75, -8.2], size: [1.5, 0.05, 13.4], collide: false },
      { id: 'bowl_lane_2', type: 'lane', pos: [-2.25, -8.2], size: [1.5, 0.05, 13.4], collide: false },
      { id: 'bowl_lane_3', type: 'lane', pos: [-0.75, -8.2], size: [1.5, 0.05, 13.4], collide: false },
      { id: 'bowl_lane_4', type: 'lane', pos: [0.75, -8.2], size: [1.5, 0.05, 13.4], collide: false },
      { id: 'bowl_lane_5', type: 'lane', pos: [2.25, -8.2], size: [1.5, 0.05, 13.4], collide: false },
      { id: 'bowl_lane_6', type: 'lane', pos: [3.75, -8.2], size: [1.5, 0.05, 13.4], collide: false },
      // 레인 끝 핀 자리
      { id: 'bowl_pins_1', type: 'pindeck', pos: [-3.75, -14.3], size: [1.4, 0.5, 1.0] },
      { id: 'bowl_pins_2', type: 'pindeck', pos: [-2.25, -14.3], size: [1.4, 0.5, 1.0] },
      { id: 'bowl_pins_3', type: 'pindeck', pos: [-0.75, -14.3], size: [1.4, 0.5, 1.0] },
      { id: 'bowl_pins_4', type: 'pindeck', pos: [0.75, -14.3], size: [1.4, 0.5, 1.0] },
      { id: 'bowl_pins_5', type: 'pindeck', pos: [2.25, -14.3], size: [1.4, 0.5, 1.0] },
      { id: 'bowl_pins_6', type: 'pindeck', pos: [3.75, -14.3], size: [1.4, 0.5, 1.0] },
      { id: 'bowl_counter', type: 'counter', pos: [-8, 10], size: [4, 1.1, 0.8] },
      // 대기 의자: 레인마다 하나
      { id: 'bowl_chair_1', type: 'chair', pos: [-3.75, 2.5], size: [0.5, 0.45, 0.5] },
      { id: 'bowl_chair_2', type: 'chair', pos: [-2.25, 2.5], size: [0.5, 0.45, 0.5] },
      { id: 'bowl_chair_3', type: 'chair', pos: [-0.75, 2.5], size: [0.5, 0.45, 0.5] },
      { id: 'bowl_chair_4', type: 'chair', pos: [0.75, 2.5], size: [0.5, 0.45, 0.5] },
      { id: 'bowl_chair_5', type: 'chair', pos: [2.25, 2.5], size: [0.5, 0.45, 0.5] },
      { id: 'bowl_chair_6', type: 'chair', pos: [3.75, 2.5], size: [0.5, 0.45, 0.5] },
    ],
  },
  {
    id: 'final',
    name: '5. 마지막 방',
    width: 12, depth: 12, height: 3.5,
    floorColor: 0x55555f, wallColor: 0x77778a,
    westDoor: { id: 'door_bowl_final', open: true },
    eastDoor: { id: 'door_exit', open: false }, // 출구 (닫힘)
    furniture: [
      { id: 'final_pedestal_1', type: 'pedestal', pos: [-2.25, -2.5], size: [0.5, 1.0, 0.5] },
      { id: 'final_pedestal_2', type: 'pedestal', pos: [-0.75, -2.5], size: [0.5, 1.0, 0.5] },
      { id: 'final_pedestal_3', type: 'pedestal', pos: [0.75, -2.5], size: [0.5, 1.0, 0.5] },
      { id: 'final_pedestal_4', type: 'pedestal', pos: [2.25, -2.5], size: [0.5, 1.0, 0.5] },
      { id: 'final_exit_sign', type: 'sign', pos: [5.85, 0], y: 2.4, size: [0.05, 0.3, 0.8] },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 아래는 자동 계산 (고칠 필요 없음)
// ─────────────────────────────────────────────────────────────

// 방마다 x 시작(x0)·끝(x1)·가운데(cx)를 순서대로 계산
let cursor = 0;
for (const room of rooms) {
  room.x0 = cursor;
  room.x1 = cursor + room.width;
  room.cx = cursor + room.width / 2;
  cursor = room.x1;
}

// 모든 문을 월드 좌표와 함께 한 목록으로 돌려준다.
// axis: 문이 박힌 벽이 뻗은 방향 ('z' = 남북으로 뻗은 벽, 'x' = 동서로 뻗은 벽)
export function listDoors() {
  const list = [];
  const last = rooms.length - 1;
  rooms.forEach((room, i) => {
    if (room.westDoor) {
      const x = i === 0 ? room.x0 + WALL_T / 2 : room.x0; // 방 사이 문은 두 벽 한가운데
      list.push({ ...DOOR, z: 0, ...room.westDoor, x, axis: 'z' });
    }
    if (room.eastDoor) {
      const x = i === last ? room.x1 - WALL_T / 2 : room.x1;
      list.push({ ...DOOR, z: 0, ...room.eastDoor, x, axis: 'z' });
    }
    for (const wall of room.walls ?? []) {
      if (!wall.door) continue;
      const axis = wall.from[0] === wall.to[0] ? 'z' : 'x';
      const x = axis === 'z' ? room.cx + wall.from[0] : room.cx + wall.door.at;
      const z = axis === 'z' ? wall.door.at : wall.from[1];
      list.push({ ...DOOR, ...wall.door, x, z, axis });
    }
  });
  return list;
}

// 월드 x 좌표로 지금 어느 방에 있는지 찾기
export function findRoomAt(x) {
  return rooms.find((r) => x >= r.x0 && x < r.x1) ?? null;
}
