// 3. MT 숙소 (펜션 단체룸) 18×15 — 방 안 좌표 x -9~9, z -7.5~7.5
// 벽 안쪽 면: 서 x -8.9, 동 x 8.9, 북 z -7.4, 남 z 7.4. 중앙 통로 z ±0.75는 비워 둔다.
// 북동 블록: 침실 x 3.1~6.4 / 화장실 x 6.5~8.9, z -7.4~-4.6 / 세탁실 x 6.5~8.9, z -4.5~-1.6
// 남쪽 z 4.5 통유리 너머는 테라스 (z 4.6~7.4)
export default {
  id: 'mt',
  name: '3. MT 숙소',
  width: 18, depth: 15, height: 3,
  floorColor: 0xa8865c, wallColor: 0xefe6d8,
  westDoor: { id: 'door_ps_mt', open: true },
  lights: [[-4.5, -2], [4.5, -2], [0, 6]], // 큰 방 + 테라스
  walls: [
    { id: 'mt_block_west', from: [3.05, -7.4], to: [3.05, -1.55] },
    {
      id: 'mt_block_south', from: [3.0, -1.55], to: [8.9, -1.55],
      openings: [
        { id: 'door_mt_bedroom', at: 4.45, width: 0.9, height: 2.1, open: true },
        { id: 'door_mt_laundry', at: 7.75, width: 0.9, height: 2.1, open: true },
      ],
    },
    { id: 'mt_bed_bath_wall', from: [6.45, -7.4], to: [6.45, -1.6] },
    {
      id: 'mt_bath_laundry_wall', from: [6.5, -4.55], to: [8.9, -4.55],
      openings: [{ id: 'door_mt_bath', at: 7.5, width: 0.9, height: 2.1, open: true }],
    },
    // 테라스 통유리 (열린 칸 x 2.0~3.2)
    { id: 'mt_glass_wall', from: [-8.9, 4.5], to: [8.9, 4.5], height: 2.2, glass: true, openings: [{ at: 2.6, width: 1.2, height: 2.2 }] },
    // 통유리 위 벽 (2.2~3m)
    { id: 'mt_glass_header', from: [-8.9, 4.5], to: [8.9, 4.5], height: 0.8, y0: 2.2 },
  ],
  furniture: [
    // A 현관
    { id: 'mt_entry_floor', type: 'mark', color: 0x9e9e9e, pos: [-8.0, 0], size: [2.0, 0.02, 3.0], collide: false },
    { id: 'mt_shoe_rack', type: 'cabinet', pos: [-8.725, 1.8], size: [0.35, 1.1, 1.0] },
    { id: 'mt_boiler_ctrl', type: 'prop', pos: [-8.885, -1.3], y: 1.34, size: [0.03, 0.12, 0.12] },

    // B 주방 (북서)
    { id: 'mt_sink', type: 'cabinet', pos: [-6.8, -7.1], size: [2.4, 0.9, 0.6] },
    { id: 'mt_upper_cabinet', type: 'cabinet', pos: [-6.8, -7.225], y: 1.5, size: [2.4, 0.7, 0.35] },
    { id: 'mt_stove_base', type: 'cabinet', pos: [-5.3, -7.1], size: [0.6, 0.9, 0.6] },
    { id: 'mt_stove', type: 'stove', pos: [-5.3, -7.15], y: 0.9, size: [0.6, 0.1, 0.5] },
    { id: 'mt_hood', type: 'appliance', pos: [-5.3, -7.15], y: 1.7, size: [0.6, 0.4, 0.5] },
    { id: 'mt_fridge', type: 'fridge', pos: [-4.1, -7.025], size: [0.8, 1.8, 0.75] },
    { id: 'mt_kitchen_rack', type: 'shelf', pos: [-8.7, -5.5], size: [0.4, 1.2, 0.6] },
    { id: 'mt_microwave', type: 'appliance', pos: [-8.7, -5.5], y: 1.2, size: [0.38, 0.3, 0.5] },
    { id: 'mt_rice_cooker', type: 'appliance', pos: [-7.6, -7.1], y: 0.9, size: [0.3, 0.25, 0.3] },
    { id: 'mt_kettle', type: 'appliance', pos: [-6.2, -7.1], y: 0.9, size: [0.18, 0.25, 0.18] },
    { id: 'mt_dish_rack', type: 'prop', pos: [-7.0, -7.15], y: 0.9, size: [0.45, 0.3, 0.3] },
    { id: 'mt_table', type: 'table', pos: [-6, -3.5], size: [1.4, 0.75, 0.8] },
    { id: 'mt_chair_1', type: 'chair', pos: [-6.35, -4.15], size: [0.45, 0.9, 0.45] },
    { id: 'mt_chair_2', type: 'chair', pos: [-5.65, -4.15], size: [0.45, 0.9, 0.45] },
    { id: 'mt_chair_3', type: 'chair', pos: [-6.35, -2.85], rotY: 180, size: [0.45, 0.9, 0.45] },
    { id: 'mt_chair_4', type: 'chair', pos: [-5.65, -2.85], rotY: 180, size: [0.45, 0.9, 0.45] },
    { id: 'mt_drink_boxes', type: 'box', pos: [-8.5, -3.0], size: [0.6, 0.5, 0.4] },
    { id: 'mt_trash', type: 'bag', pos: [-8.6, -2.2], size: [0.4, 0.6, 0.4] },

    // C1 큰 방 북쪽: 노래방·TV·좌식 상
    { id: 'mt_karaoke', type: 'machine', pos: [0, -7.15], size: [1.2, 1.1, 0.5] },
    { id: 'mt_speaker_1', type: 'speaker', pos: [-0.95, -7.2], size: [0.35, 0.9, 0.35] },
    { id: 'mt_speaker_2', type: 'speaker', pos: [0.95, -7.2], size: [0.35, 0.9, 0.35] },
    { id: 'mt_mic_1', type: 'prop', pos: [-0.2, -7.15], y: 1.1, size: [0.2, 0.05, 0.05] },
    { id: 'mt_mic_2', type: 'prop', pos: [0.2, -7.15], y: 1.1, size: [0.2, 0.05, 0.05] },
    { id: 'mt_tv', type: 'tv', pos: [0, -7.37], y: 1.475, size: [1.45, 0.85, 0.06] },
    { id: 'mt_ac', type: 'appliance', pos: [2.6, -7.2], size: [0.4, 1.8, 0.35] },
    ...[[-1.2, -4.3], [1.2, -4.3], [0, -3.0]].flatMap(([x, z], i) => [
      { id: `mt_folding_table_${i + 1}`, type: 'low_table', pos: [x, z], size: [1.2, 0.32, 0.6] },
      { id: `mt_table_snacks_${i + 1}`, type: 'prop', color: 0x8d6e63, pos: [x, z], y: 0.32, size: [0.6, 0.15, 0.3], collide: false },
      ...[[-0.35, -0.55], [0.35, -0.55], [-0.35, 0.55], [0.35, 0.55]].map(([dx, dz], j) => (
        { id: `mt_cushion_${i * 4 + j + 1}`, type: 'cushion', pos: [x + dx, z + dz], size: [0.45, 0.08, 0.45], collide: false }
      )),
    ]),

    // C2 큰 방 남쪽: 펼친 요 5채 + 베개, 개어 둔 이불
    ...[[-6.4, 1.95], [-3.7, 1.95], [-6.4, 3.8], [-3.7, 3.8], [-1.0, 3.8]].flatMap(([x, z], i) => [
      { id: `mt_futon_${i + 1}`, type: 'futon', pos: [x, z], size: [2.0, 0.12, 1.0], collide: false },
      { id: `mt_pillow_${i + 1}`, type: 'pillow', pos: [x - 0.75, z], y: 0.12, size: [0.3, 0.12, 0.5], collide: false },
    ]),
    { id: 'mt_futon_stack_1', type: 'futon', pos: [1.2, 1.85], size: [1.0, 0.6, 0.6] },
    { id: 'mt_futon_stack_2', type: 'futon', pos: [1.2, 3.25], size: [1.0, 0.6, 0.6] },

    // F 짐
    { id: 'mt_luggage_1', type: 'bag', color: 0x1565c0, pos: [4.3, 2.4], size: [0.45, 0.7, 0.3] },
    { id: 'mt_luggage_2', type: 'bag', color: 0xc62828, pos: [5.0, 2.4], size: [0.45, 0.7, 0.3] },
    { id: 'mt_luggage_3', type: 'bag', color: 0x2e7d32, pos: [5.7, 2.4], size: [0.45, 0.7, 0.3] },
    { id: 'mt_backpack_1', type: 'bag', pos: [4.3, 3.525], size: [0.35, 0.5, 0.25] },
    { id: 'mt_backpack_2', type: 'bag', pos: [5.0, 3.525], size: [0.35, 0.5, 0.25] },
    { id: 'mt_backpack_3', type: 'bag', pos: [5.7, 3.525], size: [0.35, 0.5, 0.25] },
    { id: 'mt_hanger', type: 'prop', pos: [7.45, 3.2], size: [1.2, 1.6, 0.5] },

    // G 침실
    { id: 'mt_bedding_closet', type: 'closet', pos: [4.5, -7.1], size: [2.0, 2.0, 0.6] },
    { id: 'mt_room_futon_1', type: 'futon', pos: [4.0, -4.2], size: [1.0, 0.12, 2.0], collide: false },
    { id: 'mt_room_futon_2', type: 'futon', pos: [5.4, -4.2], size: [1.0, 0.12, 2.0], collide: false },
    { id: 'mt_room_lamp', type: 'light', pos: [6.1, -6.8], size: [0.3, 1.5, 0.3] },

    // D 화장실
    { id: 'mt_toilet', type: 'toilet', pos: [8.5, -7.0], size: [0.4, 0.75, 0.7] },
    { id: 'mt_basin', type: 'sink', pos: [7.0, -7.175], size: [0.6, 0.85, 0.45] },
    { id: 'mt_mirror', type: 'panel', color: 0xcfd8dc, pos: [7.0, -7.38], y: 1.2, size: [0.5, 0.6, 0.03] },
    { id: 'mt_shower', type: 'prop', glass: true, pos: [8.45, -5.15], size: [0.9, 2.0, 0.9] },
    { id: 'mt_towel', type: 'prop', color: 0xffffff, pos: [6.53, -6.0], y: 1.2, size: [0.03, 0.3, 0.6] },
    { id: 'mt_bath_slippers', type: 'prop', pos: [7.2, -5.0], size: [0.3, 0.03, 0.25], collide: false },

    // H 세탁실
    { id: 'mt_washer', type: 'appliance', pos: [8.55, -3.0], size: [0.6, 0.85, 0.6] },
    { id: 'mt_dryer_rack', type: 'prop', pos: [6.7, -3.5], size: [0.2, 1.0, 1.0] },

    // E 테라스
    { id: 'mt_bbq', type: 'machine', pos: [-3, 6.9], size: [0.9, 1.0, 0.6] },
    { id: 'mt_charcoal', type: 'bag', pos: [-2.2, 7.0], size: [0.4, 0.5, 0.25] },
    // 테이블 세트를 남쪽으로 붙여 유리 쪽에 0.87m 통로 → 서쪽 바베큐까지 갈 수 있음
    { id: 'mt_patio_table', type: 'table', color: 0xeeeeee, pos: [0.5, 6.3], size: [0.8, 0.72, 0.8] },
    { id: 'mt_patio_chair_1', type: 'chair', color: 0xeeeeee, pos: [-0.15, 6.3], rotY: 90, size: [0.45, 0.8, 0.45] },
    { id: 'mt_patio_chair_2', type: 'chair', color: 0xeeeeee, pos: [1.15, 6.3], rotY: -90, size: [0.45, 0.8, 0.45] },
    { id: 'mt_patio_chair_3', type: 'chair', color: 0xeeeeee, pos: [0.5, 5.65], size: [0.45, 0.8, 0.45] },
    { id: 'mt_patio_chair_4', type: 'chair', color: 0xeeeeee, pos: [0.5, 6.95], rotY: 180, size: [0.45, 0.8, 0.45] },
    { id: 'mt_outdoor_light', type: 'light', pos: [0, 6.0], y: 2.3, size: [12, 0.05, 0.05], collide: false },
    // 바깥 느낌: 나무 데크 바닥, 난간, 난간 너머 밤 풍경 (남벽에 붙인 판)
    { id: 'mt_terrace_deck', type: 'mark', color: 0x6d5843, pos: [0, 5.975], size: [17.8, 0.01, 2.75], collide: false },
    { id: 'mt_terrace_rail', type: 'prop', color: 0x3e2723, pos: [0, 7.3], y: 1.0, size: [17.8, 0.06, 0.06] },
    { id: 'mt_night_view', type: 'panel', color: 0x0d1b2a, pos: [0, 7.385], y: 1.06, size: [17.8, 1.94, 0.02] },
  ],
};
