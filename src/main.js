// 게임 시작점: 씬(무대), 카메라(눈), 렌더러(그리는 도구)를 만들고 매 프레임 화면을 그린다.
import * as THREE from 'three';
import { PLAYER } from './data/rooms.js';
import { state } from './systems/state.js';
import { buildRooms } from './world/roomBuilder.js';
import { buildFurniture } from './world/furniture.js';
import { createControls } from './player/controls.js';
import { updatePlayer } from './player/player.js';
import { createHud } from './ui/hud.js';

// 1) 렌더러: 3D 장면을 화면(canvas)에 그려 준다.
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 고해상도 화면에서 너무 무거워지지 않게 최대 2배
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2) 씬: 물건, 조명을 올려 두는 무대
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101014);
scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.4)); // 전체를 은은하게 밝히는 빛

// 3) 카메라: 플레이어의 눈 (눈높이 1.6m)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 200);
camera.rotation.order = 'YXZ'; // 좌우 회전 먼저, 그다음 위아래 (1인칭 시점 표준)
camera.rotation.y = THREE.MathUtils.degToRad(state.player.yawDeg);
camera.position.set(state.player.x, PLAYER.eyeHeight, state.player.z);

// 4) 방과 가구 만들기. colliders = 플레이어를 막는 사각형 목록
const colliders = [];
buildRooms(scene, colliders);
buildFurniture(scene, colliders);

// 5) 조작과 화면 글자
const { controls, keys } = createControls(camera, renderer.domElement);
const hud = createHud(controls);

// 6) 창 크기가 바뀌면 카메라 비율과 화면 크기를 다시 맞춘다.
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 브라우저 확대/다른 모니터로 옮겼을 때 대비
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 7) 렌더 루프: 매 프레임 이동 → 화면 그리기
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  // 프레임 사이 시간(초). 탭을 오래 비웠다 돌아와도 벽을 뚫지 않게 최대 0.05초로 자른다.
  const dt = Math.min(clock.getDelta(), 0.05);
  if (controls.isLocked) updatePlayer(dt, camera, keys, colliders);
  hud.update(state.player);
  renderer.render(scene, camera);
});
