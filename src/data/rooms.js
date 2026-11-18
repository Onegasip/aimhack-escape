// ─────────────────────────────────────────────────────────────
// 방·문·가구 데이터 모음 (CLAUDE.md 5장, 7장 / 오브젝트목록.md)
// 방마다 내용은 src/data/rooms/방이름.js 에 있다. 여기서는 순서대로 모아서 이어 붙인다.
// 숫자만 바꾸면 게임에 반영된다.
//
// 좌표 규칙 (방 파일 공통)
//   - 1 = 1m. x+ = 동쪽, z+ = 남쪽, z- = 북쪽, y+ = 위
//   - 방은 아래 순서대로 x+ 방향에 자동으로 이어 붙는다. (width를 바꾸면 뒤 방들이 알아서 밀린다)
//   - 모든 방은 z = 0을 중심으로 남북 대칭
//   - 가구 pos: [x, z] = "방 한가운데"를 (0, 0)으로 한 좌표. y는 바닥에서 띄울 높이 (안 쓰면 0)
//   - 가구 size: [폭(x), 높이(y), 깊이(z)]
//   - 가구 rotY: 회전(도). 0 / 90 / 180 / 270만 쓴다
//   - collide: false 이면 밟고 지나갈 수 있다 (요, 볼링 레인처럼 납작한 것)
//   - glass: true 이면 유리 재질
//   - 가구 색은 furniture.js의 종류(type)별 기본색. color를 적으면 그 색으로 바뀐다
//   - 안쪽 벽 walls: from/to = 벽 양 끝 [x, z] (벽 두께의 가운데 선), height, thickness,
//     glass(전체 유리), glassTop(윗부분 유리 높이), y0(벽 시작 높이), openings: [{ at, width, height, id, open }]
//     openings에 id가 있으면 문틀이 있는 문, 없으면 그냥 뚫린 구멍
//   - lights: [[x, z], ...] 천장 조명 위치 (안 쓰면 방 가운데 하나)
// ─────────────────────────────────────────────────────────────
import lobby from './rooms/lobby.js';
import cafe from './rooms/cafe.js';
import ps from './rooms/ps.js';
import mt from './rooms/mt.js';
import bowl from './rooms/bowl.js';
import final from './rooms/final.js';

export const WALL_T = 0.1; // 벽 두께. 방과 방 사이는 양쪽 방 벽이 붙어서 0.2m
export const DOOR = { width: 1.4, height: 2.2 }; // 기본 문 크기
export const PLAYER = { eyeHeight: 1.6, radius: 0.3, speed: 3.5 };

// 시작 위치 (월드 좌표). yawDeg: 바라보는 방향 0 = 북쪽, -90 = 동쪽, 90 = 서쪽, 180 = 남쪽
export const spawn = { x: 2, z: 0, yawDeg: -90 };

export const rooms = [lobby, cafe, ps, mt, bowl, final];

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

// 모든 문(문틀 있는 것)을 월드 좌표와 함께 한 목록으로 돌려준다.
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
      const axis = wall.from[0] === wall.to[0] ? 'z' : 'x';
      for (const op of wall.openings ?? []) {
        if (!op.id) continue; // 문틀 없는 구멍은 문 목록에 안 넣는다
        const x = axis === 'z' ? room.cx + wall.from[0] : room.cx + op.at;
        const z = axis === 'z' ? op.at : wall.from[1];
        list.push({ ...DOOR, ...op, x, z, axis });
      }
    }
  });
  return list;
}

// 월드 x 좌표로 지금 어느 방에 있는지 찾기
export function findRoomAt(x) {
  return rooms.find((r) => x >= r.x0 && x < r.x1) ?? null;
}
