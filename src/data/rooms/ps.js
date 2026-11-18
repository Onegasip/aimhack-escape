// 2. 닌텐도·플스방 17×11.5 — 방 안 좌표 x -8.5~8.5, z -5.75~5.75
// 벽 안쪽 면: 서 x -8.4, 동 x 8.4, 북 z -5.65, 남 z 5.65
// 복도 z -1.5~1.5 (폭 3m). 부스 앞벽 z ±1.55, 부스 안쪽 깊이 4m, 안쪽 폭 3.3m.
// 부스 출입구 = 앞벽 동쪽 끝 1.0m 구멍. 소파는 서쪽에 붙임.

// 부스 안쪽 x 범위 [a, b]
const NORTH_BOOTHS = [[-5.5, -2.2], [-2.1, 1.2], [1.3, 4.6], [4.7, 8.0]]; // 부스 1~4
const SOUTH_BOOTHS = [[-4.9, -1.6], [-1.5, 1.8]]; // 부스 5~6
const WALL = 0.1;

// 부스 하나에 들어가는 물건. side = -1(북쪽 부스) / +1(남쪽 부스)
function booth(n, [a, b], side) {
  const cx = (a + b) / 2;
  const back = side * 5.65; // 부스 안쪽 벽(TV 쪽) 면
  const z = (d) => side * d; // 복도에서 d만큼 떨어진 z
  const p = `ps_booth${n}`;
  return [
    { id: `${p}_tv_stand`, type: 'tvstand', pos: [cx, back - side * 0.2], size: [1.4, 0.45, 0.4] },
    { id: `${p}_console`, type: 'console', pos: [cx + 0.4, back - side * 0.2], y: 0.45, size: [0.4, 0.1, 0.3] },
    { id: `${p}_tv`, type: 'tv', pos: [cx, back - side * 0.03], y: 0.925, size: [1.25, 0.75, 0.06] },
    // 소파는 TV를 보고 앉음 → 등받이는 복도 쪽 (북쪽 부스는 남쪽 = rotY 180)
    { id: `${p}_sofa`, type: 'sofa', pos: [a + 0.9, z(2.1)], rotY: side < 0 ? 180 : 0, size: [1.8, 0.85, 0.85] },
    // 낮은 테이블: 소파와 0.8m 띄워 앞을 지나갈 수 있게
    { id: `${p}_low_table`, type: 'low_table', pos: [a + 0.9, z(3.6)], size: [0.9, 0.4, 0.5] },
    { id: `${p}_pad_1`, type: 'pad', pos: [a + 0.6, z(3.6)], y: 0.4, size: [0.16, 0.06, 0.1] },
    { id: `${p}_pad_2`, type: 'pad', pos: [a + 0.9, z(3.6)], y: 0.4, size: [0.16, 0.06, 0.1] },
    { id: `${p}_pad_3`, type: 'pad', pos: [a + 1.2, z(3.6)], y: 0.4, size: [0.16, 0.06, 0.1] },
    { id: `${p}_snacks`, type: 'prop', color: 0xf4a261, pos: [a + 0.9, z(3.75)], y: 0.4, size: [0.3, 0.1, 0.15] },
    { id: `${p}_call_btn`, type: 'prop', color: 0xe63946, pos: [a + 0.02, z(3.0)], y: 0.96, size: [0.02, 0.08, 0.08] },
    { id: `${p}_hook`, type: 'prop', pos: [a + 0.03, z(2.4)], y: 1.55, size: [0.03, 0.1, 0.05] },
    { id: `${p}_bin`, type: 'box', pos: [b - 0.2, back - side * 0.25], size: [0.25, 0.35, 0.25] },
    { id: `${p}_sign`, type: 'sign', pos: [cx, z(1.47)], y: 1.3, size: [0.4, 0.3, 0.02] },
    // 미닫이문: 출입구 바로 옆 벽 안쪽에 열린 채로 겹쳐 있음
    { id: `${p}_door`, type: 'door', pos: [b - 1.5, z(1.62)], size: [1.0, 2.1, 0.03], collide: false },
  ];
}

// 부스 앞벽: 부스마다 동쪽 끝에 1.0m 출입구
const frontWall = (id, booths, zLine, x0, x1) => ({
  id, from: [x0, zLine], to: [x1, zLine], height: 2.4, glassTop: 0.6,
  openings: booths.map(([, b]) => ({ at: b - 0.5, width: 1.0, height: 2.1 })),
});
// 부스 칸막이 (남북으로 뻗음)
const partitions = (prefix, xs, z0, z1) =>
  xs.map((x, i) => ({ id: `${prefix}_${i + 1}`, from: [x, z0], to: [x, z1], height: 2.4, glassTop: 0.6 }));

export default {
  id: 'ps',
  name: '2. 닌텐도·플스방',
  width: 17, depth: 11.5, height: 3,
  floorColor: 0x2b2d42, wallColor: 0x4a4e69,
  westDoor: { id: 'door_cafe_ps', open: true },
  lights: [[-6, 0], [-2, 0], [2, 0], [6, 0]], // 부스가 어두워서 복도를 따라 4개
  walls: [
    frontWall('ps_front_n', NORTH_BOOTHS, -1.55, -5.6, 8.1),
    frontWall('ps_front_s', SOUTH_BOOTHS, 1.55, -5.0, 1.9),
    ...partitions('ps_part_n', [-5.55, -2.15, 1.25, 4.65, 8.05], -5.65, -1.6),
    ...partitions('ps_part_s', [-4.95, -1.55, 1.85], 1.6, 5.65),
  ],
  furniture: [
    // A 카운터 (북서)
    // 카운터 양옆 0.8m 통로 → 직원 공간·뒤 수납장에 들어갈 수 있음
    { id: 'ps_counter', type: 'counter', pos: [-6.97, -3.0], size: [1.2, 1.05, 0.6] },
    { id: 'ps_counter_monitor', type: 'monitor', pos: [-7.25, -3.0], y: 1.05, size: [0.5, 0.35, 0.15] },
    { id: 'ps_counter_back', type: 'cabinet', pos: [-7, -5.45], size: [2.0, 1.0, 0.4] },
    { id: 'ps_pad_dock', type: 'console', pos: [-7, -5.45], y: 1.0, size: [0.8, 0.4, 0.3] },
    { id: 'ps_price_board', type: 'board', pos: [-8.39, -3.5], y: 1.3, size: [0.02, 0.6, 0.9] },
    { id: 'ps_headset_rack', type: 'prop', pos: [-8.3, -2.0], y: 1.15, size: [0.2, 0.5, 0.6] },
    { id: 'ps_poster_1', type: 'poster', pos: [-7.5, -5.63], y: 1.4, size: [0.6, 0.9, 0.03] },
    { id: 'ps_poster_2', type: 'poster', pos: [-6.5, -5.63], y: 1.4, size: [0.6, 0.9, 0.03] },

    // A2 타이틀 벽 (남서)
    { id: 'ps_title_wall_1', type: 'shelf', color: 0x3d3d5c, pos: [-7.55, 5.5], size: [1.5, 2.0, 0.3] },
    { id: 'ps_title_wall_2', type: 'shelf', color: 0x3d3d5c, pos: [-6.05, 5.5], size: [1.5, 2.0, 0.3] },
    { id: 'ps_switch_dock', type: 'cabinet', pos: [-7.8, 3.5], size: [0.8, 0.9, 0.4] },
    { id: 'ps_poster_3', type: 'poster', pos: [-8.385, 2.5], y: 1.2, size: [0.03, 0.9, 0.6] },

    // 부스 1~6
    ...NORTH_BOOTHS.flatMap((r, i) => booth(i + 1, r, -1)),
    ...SOUTH_BOOTHS.flatMap((r, i) => booth(i + 5, r, 1)),

    // C 간식 코너 (x 1.9~5.4)
    { id: 'ps_snack_counter', type: 'cabinet', pos: [2.9, 5.35], size: [1.8, 0.9, 0.6] },
    { id: 'ps_ramen_cooker', type: 'appliance', pos: [2.4, 5.35], y: 0.9, size: [0.4, 0.45, 0.45] },
    { id: 'ps_hot_water', type: 'appliance', pos: [3.0, 5.35], y: 0.9, size: [0.3, 0.5, 0.35] },
    { id: 'ps_microwave', type: 'appliance', pos: [3.5, 5.35], y: 0.9, size: [0.5, 0.3, 0.38] },
    { id: 'ps_drink_fridge', type: 'fridge', pos: [5.075, 4.075], size: [0.65, 1.9, 0.65] },
    { id: 'ps_snack_shelf', type: 'shelf', pos: [5.0, 5.45], size: [1.0, 1.6, 0.4] },
    { id: 'ps_high_table', type: 'table', pos: [2.85, 3.0], size: [0.6, 1.05, 0.6] },
    { id: 'ps_high_stool_1', type: 'stool', pos: [2.85, 2.45], size: [0.35, 0.75, 0.35] },
    { id: 'ps_high_stool_2', type: 'stool', pos: [2.85, 3.55], size: [0.35, 0.75, 0.35] },
    { id: 'ps_poster_4', type: 'poster', pos: [4.0, 5.63], y: 1.6, size: [0.6, 0.9, 0.03] },

    // D 레이싱·파티 (x 5.4~8.4)
    { id: 'ps_racing_rig', type: 'machine', pos: [6.85, 5.25], size: [1.4, 1.1, 0.7] },
    { id: 'ps_party_tv', type: 'tv', pos: [8.37, 3.2], y: 1.025, size: [0.06, 0.75, 1.25] },
    { id: 'ps_beanbag_1', type: 'beanbag', pos: [4.35, 2.6], size: [0.8, 0.6, 0.8] },
    { id: 'ps_beanbag_2', type: 'beanbag', pos: [6.0, 2.6], size: [0.8, 0.6, 0.8] },
    { id: 'ps_beanbag_3', type: 'beanbag', pos: [7.65, 2.6], size: [0.8, 0.6, 0.8] },

    // 복도 천장 LED
    { id: 'ps_led', type: 'light', color: 0x7b2ff7, pos: [0, 0], y: 2.9, size: [16, 0.05, 0.1], collide: false },
  ],
};
