// 0. 로비 (방탈출 카페 대기실) 15×12 — 방 안 좌표 x -7.5~7.5, z -6~6
// 벽 안쪽 면: 북 z -5.9, 남 z 5.9, 서 x -7.4, 동 x 7.4. 중앙 통로 z ±0.75는 비워 둔다.
export default {
  id: 'lobby',
  name: '로비 (튜토리얼)',
  width: 15, depth: 12, height: 3,
  floorColor: 0x8a8178, wallColor: 0xd8d2c8,
  westDoor: { id: 'door_entrance', open: false }, // 밖으로 나가는 입구 (닫힘)
  furniture: [
    // A 접수
    { id: 'lobby_counter', type: 'counter', pos: [-4.5, -3.35], size: [3.0, 1.1, 0.7] },
    { id: 'lobby_counter_l', type: 'counter', pos: [-5.65, -2.4], size: [0.7, 1.1, 1.2] },
    { id: 'lobby_pos', type: 'monitor', pos: [-4.0, -3.35], y: 1.1, size: [0.4, 0.4, 0.3] },
    { id: 'lobby_cctv_1', type: 'monitor', pos: [-5.0, -3.45], y: 1.1, size: [0.5, 0.35, 0.15] },
    { id: 'lobby_cctv_2', type: 'monitor', pos: [-3.3, -3.45], y: 1.1, size: [0.5, 0.35, 0.15] },
    { id: 'lobby_staff_chair', type: 'chair', pos: [-3.5, -4.8], size: [0.5, 0.9, 0.5] },
    { id: 'lobby_back_shelf', type: 'shelf', pos: [-5, -5.7], size: [2.0, 1.8, 0.4] },
    { id: 'lobby_bracelet_tray', type: 'prop', pos: [-5.65, -2.6], y: 1.1, size: [0.3, 0.1, 0.2] },
    { id: 'lobby_brochure', type: 'prop', pos: [-5.65, -2.0], y: 1.1, size: [0.3, 0.4, 0.15] },
    { id: 'lobby_extinguisher', type: 'extinguisher', pos: [-2.7, -4.6], size: [0.15, 0.5, 0.15] },
    { id: 'lobby_briefing_mark', type: 'mark', pos: [-1.5, -3], size: [1.5, 0.01, 1.5], collide: false },

    // B 대기
    { id: 'lobby_sofa_1', type: 'sofa', pos: [-6.55, 3.5], rotY: 90, size: [2.0, 0.85, 0.9] }, // 등받이 서쪽
    { id: 'lobby_sofa_2', type: 'sofa', pos: [-3.15, 3.5], rotY: -90, size: [2.0, 0.85, 0.9] }, // 등받이 동쪽
    { id: 'lobby_coffee_table', type: 'low_table', pos: [-4.85, 3.5], size: [0.6, 0.45, 1.2] },
    { id: 'lobby_water', type: 'appliance', pos: [-7.2, 1.6], size: [0.35, 1.3, 0.45] },
    { id: 'lobby_umbrella', type: 'prop', pos: [-7.2, -1.2], size: [0.3, 0.6, 0.3] },
    { id: 'lobby_plant_1', type: 'plant', pos: [-7, 5.6], size: [0.5, 1.4, 0.5] },
    { id: 'lobby_plant_2', type: 'plant', pos: [7, -5.5], size: [0.5, 1.4, 0.5] },
    { id: 'lobby_plant_3', type: 'plant', pos: [-0.5, 5.5], size: [0.5, 1.4, 0.5] },

    // C 테마 홍보 벽 (북벽)
    { id: 'lobby_poster_1', type: 'poster', pos: [0.3, -5.885], y: 1.15, size: [0.6, 0.9, 0.03] },
    { id: 'lobby_poster_2', type: 'poster', pos: [1.3, -5.885], y: 1.15, size: [0.6, 0.9, 0.03] },
    { id: 'lobby_poster_3', type: 'poster', pos: [3.7, -5.885], y: 1.15, size: [0.6, 0.9, 0.03] },
    { id: 'lobby_poster_4', type: 'poster', pos: [4.7, -5.885], y: 1.15, size: [0.6, 0.9, 0.03] },
    { id: 'lobby_theme_tv', type: 'tv', pos: [2.5, -5.87], y: 1.325, size: [1.25, 0.75, 0.06] },
    { id: 'lobby_photozone', type: 'panel', pos: [6.4, -5.85], size: [2.0, 2.4, 0.1] },

    // D 사물함·준비 (남벽)
    { id: 'lobby_locker', type: 'cabinet', pos: [1.2, 5.675], size: [2.4, 1.8, 0.45] },
    { id: 'lobby_bench', type: 'bench', pos: [1.2, 4.3], size: [1.5, 0.45, 0.4] },
    { id: 'lobby_slipper_shelf', type: 'shelf', pos: [3.0, 5.75], size: [0.8, 0.9, 0.3] },
    { id: 'lobby_coatrack_1', type: 'prop', color: 0x4e342e, pos: [-1.8, 5.4], size: [0.12, 1.8, 0.12] },
    { id: 'lobby_coatrack_2', type: 'prop', color: 0x4e342e, pos: [-0.65, 4.2], size: [0.12, 1.8, 0.12] },
    { id: 'lobby_fake_door_staff', type: 'door', pos: [4.5, 5.875], size: [0.9, 2.1, 0.05] },
    { id: 'lobby_fake_door_wc', type: 'door', pos: [6.3, 5.875], size: [0.9, 2.1, 0.05] },

    // E 입장 게이트 (동쪽)
    { id: 'lobby_notice', type: 'board', pos: [7.39, -2.5], y: 0.95, size: [0.02, 1.1, 0.8] },
    { id: 'lobby_terminal', type: 'terminal', pos: [7.2, 1.8], size: [0.4, 1.3, 0.3] },
    { id: 'lobby_exit_sign', type: 'sign', pos: [-7.375, 0], y: 2.325, size: [0.05, 0.15, 0.35] },
  ],
};
