// 4. 볼링장 34×30 — 방 안 좌표 x -17~17, z -15~15
// 벽 안쪽 면: 서 x -16.9, 동 x 16.9, 북 z -14.9, 남 z 14.9. 중앙 통로 z ±0.75는 비워 둔다.
// 레인 6개를 동서 방향으로 북쪽에 배치. 핀세터 서쪽, 어프로치 동쪽 → 공은 동→서로 던진다.
// 파울라인 x 5.5, 헤드핀 중심 x -12.79 (파울라인에서 18.29m), 핀덱 서쪽 끝 x -13.7

const FOUL = 5.5;
const LANE_W = 1.54; // 레인 표면 1.05 + 거터
const CAP = 0.15; // 레인 사이 칸막이 폭
// 레인 가운데 z: 북쪽 벽(-14.9)부터 [캡, 레인, 캡, 레인 ...] 순서로 쌓는다
const LANE_Z = Array.from({ length: 6 }, (_, i) => -14.9 + CAP + LANE_W / 2 + i * (LANE_W + CAP));
// 짝 레인(1-2, 3-4, 5-6) 사이 = 볼 리턴·대기석 가운데
const PAIR_Z = [0, 1, 2].map((p) => (LANE_Z[p * 2] + LANE_Z[p * 2 + 1]) / 2);

const lanes = LANE_Z.flatMap((z, i) => {
  const n = i + 1;
  return [
    { id: `bowl_lane_${n}`, type: 'lane', pos: [(-13.7 + FOUL) / 2, z], size: [FOUL + 13.7, 0.05, LANE_W], collide: false },
    { id: `bowl_approach_${n}`, type: 'approach', pos: [FOUL + 4.57 / 2, z], size: [4.57, 0.05, LANE_W], collide: false },
    { id: `bowl_foul_line_${n}`, type: 'mark', color: 0x111111, pos: [FOUL, z], size: [0.05, 0.052, LANE_W], collide: false },
    { id: `bowl_pins_${n}`, type: 'pins', pos: [-13.25, z], size: [0.9, 0.38, 0.9] },
    { id: `bowl_pinsetter_${n}`, type: 'pinsetter', pos: [-14.6, z], size: [1.8, 2.5, 1.5] },
    { id: `bowl_monitor_${n}`, type: 'monitor', pos: [9.5, z], y: 2.5, size: [0.1, 0.6, 1.0] },
    { id: `bowl_lane_number_${n}`, type: 'sign', pos: [9.5, z], y: 3.15, size: [0.02, 0.3, 0.3] },
  ];
});

// 레인 사이 캡 7개 (북쪽 벽 쪽부터)
const cappings = Array.from({ length: 7 }, (_, i) => ({
  id: `bowl_capping_${i + 1}`, type: 'capping',
  pos: [(-13.7 + FOUL + 4.57) / 2, -14.9 + CAP / 2 + i * (LANE_W + CAP)],
  size: [13.7 + FOUL + 4.57, 0.1, CAP], collide: false,
}));

// 짝 레인마다: 볼 리턴, 점수 콘솔, ㄷ자 소파, 테이블
const bowlerAreas = PAIR_Z.flatMap((z, i) => {
  const n = i + 1;
  return [
    { id: `bowl_ball_return_${n}`, type: 'ball_return', pos: [10.4, z], size: [0.6, 0.8, 0.9] },
    { id: `bowl_console_${n}`, type: 'terminal', pos: [11.6, z], size: [0.2, 1.1, 0.5] },
    // 레인을 보고 앉음 → 등받이 동쪽 (rotY -90, 크기는 회전 전 기준)
    { id: `bowl_settee_${n}`, type: 'settee', pos: [13.3, z], rotY: -90, size: [2.55, 0.85, 1.6] },
    { id: `bowl_settee_table_${n}`, type: 'low_table', pos: [12.0, z + 0.9], size: [0.5, 0.7, 0.8] },
  ];
});

// 하우스볼 랙 4개 (동벽)
const ballRacks = [-13, -10.3, -7.6, -4.9].map((z, i) => (
  { id: `bowl_ball_rack_${i + 1}`, type: 'ball_rack', pos: [16.65, z], size: [0.5, 1.1, 2.0] }
));

// 스탠딩 테이블 4개 + 의자 2개씩
const highTables = [[4.5, 5.5], [6.5, 5.5], [8.5, 5.5], [6.5, 7.8]].flatMap(([x, z], i) => [
  { id: `bowl_high_table_${i + 1}`, type: 'table', pos: [x, z], size: [0.6, 1.05, 0.6] },
  { id: `bowl_high_stool_${i * 2 + 1}`, type: 'stool', pos: [x, z - 0.55], size: [0.35, 0.75, 0.35] },
  { id: `bowl_high_stool_${i * 2 + 2}`, type: 'stool', pos: [x, z + 0.55], size: [0.35, 0.75, 0.35] },
]);

export default {
  id: 'bowl',
  name: '4. 볼링장',
  width: 34, depth: 30, height: 4,
  floorColor: 0x3a3a4a, wallColor: 0x2e2e40,
  westDoor: { id: 'door_mt_bowl', open: true },
  lights: [[-8, -8], [8, -8], [-8, 7], [8, 7]], // 큰 방이라 조명 4개
  walls: [
    // 핀세터 뒤 정비통로를 가리는 벽
    { id: 'bowl_pinsetter_wall', from: [-15.55, -14.9], to: [-15.55, -4.5] },
    // 레인 남쪽 가벽 (높이 1m)
    { id: 'bowl_lane_wall', from: [-15.5, -4.5], to: [10.1, -4.5], height: 1.0, thickness: 0.15 },
  ],
  furniture: [
    ...lanes,
    ...cappings,
    { id: 'bowl_masking', type: 'panel', color: 0x1e3a8a, pos: [-13.7, -9.75], y: 1.5, size: [0.1, 1.2, 10.3] },
    // 파울라인 너머(레인 위)로는 못 걸어가게 하는 보이지 않는 막
    { id: 'bowl_foul_barrier', type: 'mark', hidden: true, pos: [FOUL, -9.725], size: [0.1, 1.0, 10.35] },
    ...bowlerAreas,
    ...ballRacks,

    // A 프런트·볼링화 (남서)
    { id: 'bowl_front_desk', type: 'counter', pos: [-13, 3], size: [4.0, 1.1, 0.8] },
    { id: 'bowl_front_pos_1', type: 'monitor', pos: [-14, 3], y: 1.1, size: [0.4, 0.4, 0.3] },
    { id: 'bowl_front_pos_2', type: 'monitor', pos: [-12, 3], y: 1.1, size: [0.4, 0.4, 0.3] },
    { id: 'bowl_shoe_shelf_1', type: 'shelf', color: 0x5d4037, pos: [-16.7, 3.0], size: [0.4, 2.0, 2.0] },
    { id: 'bowl_shoe_shelf_2', type: 'shelf', color: 0x5d4037, pos: [-16.7, 5.3], size: [0.4, 2.0, 2.0] },
    { id: 'bowl_shoe_sanitizer', type: 'machine', pos: [-10, 2], size: [0.6, 1.6, 0.5] },
    { id: 'bowl_price_board', type: 'board', pos: [-16.875, 7.5], y: 1.3, size: [0.05, 1.0, 2.0] },

    // F 사물함·벤치·트로피
    { id: 'bowl_locker', type: 'cabinet', pos: [-7.8, 5.5], size: [2.4, 1.8, 0.45] },
    { id: 'bowl_bench_1', type: 'bench', pos: [-8, 3], size: [1.8, 0.45, 0.4] },
    { id: 'bowl_bench_2', type: 'bench', pos: [-5.35, 3], size: [1.8, 0.45, 0.4] },
    { id: 'bowl_trophy', type: 'cabinet', glass: true, pos: [-2.85, 3], size: [1.5, 1.9, 0.45] },
    { id: 'bowl_trophy_items', type: 'prop', color: 0xd4af37, pos: [-2.85, 3], y: 0.9, size: [1.2, 0.35, 0.25], collide: false },

    // B 매점 (남동)
    ...highTables,
    { id: 'bowl_snack_counter', type: 'counter', pos: [13, 12.1], size: [3.0, 1.1, 0.7] },
    { id: 'bowl_coffee', type: 'appliance', pos: [12, 12.1], y: 1.1, size: [0.4, 0.5, 0.4] },
    { id: 'bowl_snack_menu', type: 'board', pos: [13, 14.89], y: 1.8, size: [2.0, 0.8, 0.02] },
    { id: 'bowl_snack_fridge_1', type: 'fridge', pos: [14.875, 14.575], size: [0.65, 1.9, 0.65] },
    { id: 'bowl_snack_fridge_2', type: 'fridge', pos: [16.375, 14.575], size: [0.65, 1.9, 0.65] },

    // E 프로샵 (남서)
    { id: 'bowl_proshop_case_1', type: 'cabinet', glass: true, pos: [-14, 10.5], size: [1.5, 1.0, 0.5] },
    { id: 'bowl_proshop_case_2', type: 'cabinet', glass: true, pos: [-11.5, 10.5], size: [1.5, 1.0, 0.5] },
    { id: 'bowl_proshop_shelf', type: 'shelf', pos: [-15, 14.7], size: [2.0, 1.8, 0.4] },
    { id: 'bowl_drill', type: 'machine', pos: [-11, 13.5], size: [0.8, 1.7, 0.8] },

    // G 아케이드
    { id: 'bowl_arcade_1', type: 'machine', color: 0xe91e63, pos: [-4.65, 14.4], size: [0.8, 1.9, 0.9] },
    { id: 'bowl_arcade_2', type: 'machine', color: 0x3f51b5, pos: [-3, 14.4], size: [0.8, 1.9, 0.9] },
    { id: 'bowl_arcade_3', type: 'machine', color: 0x009688, pos: [-1.35, 14.4], size: [0.8, 1.9, 0.9] },
    { id: 'bowl_arcade_hoop', type: 'machine', color: 0xff9800, pos: [0.6, 13.6], size: [1.2, 2.6, 2.6] },

    // 기타
    { id: 'bowl_restroom_door_1', type: 'door', pos: [4.5, 14.875], size: [0.9, 2.1, 0.05] },
    { id: 'bowl_restroom_door_2', type: 'door', pos: [6.5, 14.875], size: [0.9, 2.1, 0.05] },
    ...[[-8, -9], [0, -9], [-8, 8], [8, 8]].map(([x, z], i) => (
      { id: `bowl_ceiling_truss_${i + 1}`, type: 'capping', pos: [x, z], y: 3.6, size: [6, 0.2, 0.2], collide: false }
    )),
  ],
};
