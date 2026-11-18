// 5. 마지막 방 12×12 — 방 안 좌표 x -6~6, z -6~6
// 벽 안쪽 면: ±5.9. 중앙 통로 z ±0.75는 비워 둔다.
const PEDESTALS = [[-1.5, -3], [1.5, -3], [-1.5, 3], [1.5, 3]];

export default {
  id: 'final',
  name: '5. 마지막 방',
  width: 12, depth: 12, height: 3.5,
  floorColor: 0x55555f, wallColor: 0x77778a,
  westDoor: { id: 'door_bowl_final', open: true },
  eastDoor: { id: 'door_exit', open: false }, // 출구 (닫힘)
  furniture: [
    ...PEDESTALS.flatMap(([x, z], i) => [
      { id: `final_pedestal_${i + 1}`, type: 'pedestal', pos: [x, z], size: [0.5, 1.0, 0.5] },
      { id: `final_spot_${i + 1}`, type: 'light', pos: [x, z], y: 3.3, size: [0.25, 0.2, 0.25] },
      // 상징 패널: 북쪽 받침대는 북벽, 남쪽 받침대는 남벽
      { id: `final_icon_panel_${i + 1}`, type: 'panel', pos: [x, z < 0 ? -5.885 : 5.885], y: 1.2, size: [0.8, 0.8, 0.03] },
    ]),
    { id: 'final_exit_sign', type: 'sign', pos: [5.875, 0], y: 2.3, size: [0.05, 0.2, 0.6] },
    { id: 'final_status_board', type: 'board', pos: [5.875, 0], y: 2.7, size: [0.05, 0.4, 1.2] },
    { id: 'final_floor_mark', type: 'mark', color: 0x8e7cc3, pos: [0, 0], size: [4.0, 0.01, 4.0], collide: false },
  ],
};
