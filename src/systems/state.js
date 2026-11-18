// 게임 상태 객체 (CLAUDE.md 6장)
// 게임 진행에 필요한 값은 전부 여기 하나에 모은다. ⑤단계에서 이 객체만 Firebase와 동기화한다.
// 다른 코드는 이 값을 직접 바꾸지 말고 systems/ 의 함수(inventory.js, puzzles.js)를 통해 바꾼다.
import { spawn, listDoors, findRoomAt } from '../data/rooms.js';
import { INTERACTIONS } from '../data/puzzles.js';

export const state = {
  player: {
    x: spawn.x,
    z: spawn.z,
    yawDeg: spawn.yawDeg,
    roomId: findRoomAt(spawn.x)?.id ?? null,
  },
  // 문 상태: { 문id: { open: 열렸는지 } }
  doors: {},
  // 물건 상태: { 물건id: { hidden: 안 보임, solved: 풀림, taken: 주움 } }
  props: {},
  // 팀 공용 인벤토리: 아이템 id 목록
  inventory: [],
  // 지금 손에 든 아이템 (개인 선택이라 동기화하지 않을 예정)
  selectedItem: null,
};

for (const door of listDoors()) {
  state.doors[door.id] = { open: door.open };
}
for (const [id, def] of Object.entries(INTERACTIONS)) {
  state.props[id] = { hidden: !!def.hidden, solved: false, taken: false };
}
