// 1. 보드게임 카페 15×15 — 방 안 좌표 x -7.5~7.5, z -7.5~7.5
// 벽 안쪽 면: ±7.4. 중앙 통로 z ±0.75는 비워 둔다.

// 테이블 + 의자를 한 번에 만든다. chairs: 의자 자리 [x, z] (테이블 가운데 기준)
function tableSet(id, type, pos, size, chairs) {
  const items = [{ id, type, pos, size }];
  chairs.forEach(([dx, dz], i) => {
    // 등받이가 테이블 반대쪽을 보게 회전 (북쪽 의자 0, 남쪽 180, 서쪽 90, 동쪽 -90)
    const rotY = dz < 0 ? 0 : dz > 0 ? 180 : dx < 0 ? 90 : -90;
    items.push({ id: `${id}_chair_${i + 1}`, type: 'chair', pos: [pos[0] + dx, pos[1] + dz], rotY, size: [0.45, 0.9, 0.45] });
  });
  // 테이블 위 매트와 좌석 번호
  items.push({ id: `${id}_mat`, type: 'prop', color: 0x2e5e3a, pos, y: size[1], size: [size[0] - 0.1, 0.005, size[2] - 0.1], collide: false });
  items.push({ id: `${id}_seat_no`, type: 'sign', pos: [pos[0] - size[0] / 2 + 0.12, pos[1]], y: size[1], size: [0.1, 0.12, 0.05] });
  return items;
}
const FOUR = [[-0.3, -0.6], [0.3, -0.6], [-0.3, 0.6], [0.3, 0.6]]; // 4인: 남북에 2개씩
const SIX = [[-0.6, -0.65], [0, -0.65], [0.6, -0.65], [-0.6, 0.65], [0, 0.65], [0.6, 0.65]];
const TWO = [[-0.55, 0], [0.55, 0]]; // 2인: 동서(좌우) 착석
const T4 = [1.2, 0.75, 0.8];

export default {
  id: 'cafe',
  name: '1. 보드게임 카페',
  width: 15, depth: 15, height: 3,
  floorColor: 0x9c6b43, wallColor: 0xe6d3b3,
  westDoor: { id: 'door_lobby_cafe', open: true },
  furniture: [
    // A 카운터
    { id: 'cafe_counter', type: 'counter', pos: [-5, -3.5], size: [2.0, 1.05, 0.7] },
    { id: 'cafe_drink_prep', type: 'cabinet', pos: [-7.1, -3.5], size: [0.6, 0.9, 1.8] },
    { id: 'cafe_coffee_machine', type: 'appliance', pos: [-7.1, -3.9], y: 0.9, size: [0.4, 0.45, 0.4] },
    { id: 'cafe_price_board', type: 'board', pos: [-7.39, -5.5], y: 1.3, size: [0.02, 0.6, 0.9] },
    { id: 'cafe_menu_board', type: 'board', pos: [-5, -3.5], y: 2.0, size: [1.5, 0.6, 0.02] },
    { id: 'cafe_hot_games', type: 'shelf', pos: [-5, -4.875], size: [1.0, 1.2, 0.35] },
    { id: 'cafe_extinguisher', type: 'extinguisher', pos: [-6.4, -2.4], size: [0.15, 0.5, 0.15] },

    // B 게임 진열 벽 (북벽 12m 연속)
    ...[-5, -3, -1, 1, 3, 5].flatMap((x, i) => [
      { id: `cafe_game_shelf_${i + 1}`, type: 'shelf', pos: [x, -7.2], size: [2.0, 2.2, 0.4] },
      { id: `cafe_genre_sign_${i + 1}`, type: 'sign', pos: [x, -7.05], y: 2.25, size: [0.4, 0.15, 0.02] },
    ]),
    { id: 'cafe_pick_stand', type: 'shelf', color: 0xc0392b, pos: [6.95, -6.8], size: [0.5, 1.0, 1.2] },

    // C 좌석
    ...tableSet('cafe_table4_1', 'table', [-2, -3.3], T4, FOUR),
    ...tableSet('cafe_table4_2', 'table', [1.5, -3.3], T4, FOUR),
    ...tableSet('cafe_table4_3', 'table', [-2, 3.3], T4, FOUR),
    ...tableSet('cafe_table4_4', 'table', [1.5, 3.3], T4, FOUR),
    ...tableSet('cafe_table4_booth', 'table', [4.8, 3.3], T4, FOUR),
    { id: 'cafe_booth_partition_1', type: 'panel', pos: [4.05, 3.3], size: [0.05, 1.4, 1.8] },
    { id: 'cafe_booth_partition_2', type: 'panel', pos: [5.55, 3.3], size: [0.05, 1.4, 1.8] },
    ...tableSet('cafe_table6', 'table', [4.8, -3.3], [1.8, 0.75, 0.9], SIX),
    ...tableSet('cafe_table2_1', 'table', [-1, 5.6], [0.7, 0.75, 0.7], TWO),
    ...tableSet('cafe_table2_2', 'table', [1.8, 5.6], [0.7, 0.75, 0.7], TWO),
    // 테이블 위: 태블릿·호출벨·노는 중인 게임
    { id: 'cafe_order_tab_1', type: 'monitor', pos: [-1.6, -3.5], y: 0.75, size: [0.25, 0.18, 0.15] },
    { id: 'cafe_order_tab_2', type: 'monitor', pos: [1.9, -3.5], y: 0.75, size: [0.25, 0.18, 0.15] },
    { id: 'cafe_order_tab_3', type: 'monitor', pos: [-1.6, 3.1], y: 0.75, size: [0.25, 0.18, 0.15] },
    { id: 'cafe_order_tab_4', type: 'monitor', pos: [1.9, 3.1], y: 0.75, size: [0.25, 0.18, 0.15] },
    { id: 'cafe_call_bell_1', type: 'prop', pos: [5.2, 3.1], y: 0.75, size: [0.07, 0.04, 0.07] },
    { id: 'cafe_call_bell_2', type: 'prop', pos: [5.5, -3.5], y: 0.75, size: [0.07, 0.04, 0.07] },
    { id: 'cafe_call_bell_3', type: 'prop', pos: [-0.8, 5.75], y: 0.75, size: [0.07, 0.04, 0.07] },
    { id: 'cafe_call_bell_4', type: 'prop', pos: [2.0, 5.75], y: 0.75, size: [0.07, 0.04, 0.07] },
    { id: 'cafe_table_props_1', type: 'game', pos: [-2, -3.3], y: 0.755, size: [0.5, 0.05, 0.4], collide: false },
    { id: 'cafe_table_props_2', type: 'game', pos: [1.5, 3.3], y: 0.755, size: [0.5, 0.05, 0.4], collide: false },
    { id: 'cafe_table_props_3', type: 'game', pos: [4.8, -3.3], y: 0.755, size: [0.7, 0.05, 0.5], collide: false },
    { id: 'cafe_table_props_4', type: 'game', pos: [4.8, 3.3], y: 0.755, size: [0.5, 0.05, 0.4], collide: false },
    // 펜던트 조명 (테이블마다)
    ...[[-2, -3.3], [1.5, -3.3], [-2, 3.3], [1.5, 3.3], [4.8, 3.3], [4.8, -3.3], [-1, 5.6], [1.8, 5.6]].map(([x, z], i) => (
      { id: `cafe_pendant_${i + 1}`, type: 'light', pos: [x, z], y: 2.2, size: [0.4, 0.3, 0.4] }
    )),

    // D 셀프바 (남서쪽)
    { id: 'cafe_selfbar', type: 'cabinet', pos: [-7.1, 5], size: [0.6, 0.9, 2.0] },
    { id: 'cafe_water', type: 'appliance', pos: [-7.1, 4.5], y: 0.9, size: [0.35, 0.5, 0.4] },
    { id: 'cafe_cup_disp', type: 'prop', pos: [-7.1, 5.5], y: 0.9, size: [0.3, 0.3, 0.3] },
    { id: 'cafe_fridge', type: 'fridge', pos: [-6.0, 7.075], size: [0.65, 1.9, 0.65] },
    { id: 'cafe_snack_rack', type: 'shelf', pos: [-4.9, 7.2], size: [0.8, 1.5, 0.4] },
    { id: 'cafe_recycle', type: 'box', pos: [-3.7, 7.2], size: [0.9, 0.8, 0.4] },

    // E 기타
    { id: 'cafe_return_shelf', type: 'shelf', pos: [7.2, 5.5], size: [0.4, 1.0, 1.2] },
    { id: 'cafe_coat_rack', type: 'prop', pos: [7.35, 2.0], y: 1.6, size: [0.1, 0.2, 1.5] },
    { id: 'cafe_rule_board', type: 'board', color: 0xf5f5f5, pos: [7.375, -4.5], y: 0.95, size: [0.05, 0.9, 1.2] },
    { id: 'cafe_clock', type: 'prop', pos: [-7.375, 2.5], y: 2.0, size: [0.05, 0.35, 0.35] },
    { id: 'cafe_ac', type: 'appliance', pos: [0, 0], y: 2.75, size: [0.8, 0.25, 0.8] },
    { id: 'cafe_plant_1', type: 'plant', pos: [7.0, -1.6], size: [0.5, 1.4, 0.5] },
    { id: 'cafe_plant_2', type: 'plant', pos: [-7.0, 1.6], size: [0.5, 1.4, 0.5] },
  ],
};
