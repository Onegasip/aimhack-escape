// 게임 상태 객체 (CLAUDE.md 6장)
// 게임 진행에 필요한 값은 전부 여기 하나에 모은다. ⑤단계에서 이 객체만 Firebase와 동기화한다.
import { spawn, listDoors, findRoomAt } from '../data/rooms.js';

export const state = {
  player: {
    x: spawn.x,
    z: spawn.z,
    yawDeg: spawn.yawDeg,
    roomId: findRoomAt(spawn.x)?.id ?? null,
  },
  // 문 열림 상태: { 문id: { open: true/false } }
  doors: {},
};

for (const door of listDoors()) {
  state.doors[door.id] = { open: door.open };
}
