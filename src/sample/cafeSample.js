// 실사 모델 미리보기 페이지 (sample.html). 본 게임과 따로 돈다.
// Blender에서 조명까지 이미지로 구워 둔 .glb를 불러와서, 게임과 같은 걷기·충돌 코드로 걸어 본다.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PLAYER } from '../data/rooms.js';
import { state } from '../systems/state.js';
import { createControls } from '../player/controls.js';
import { updatePlayer } from '../player/player.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 100);
camera.rotation.order = 'YXZ';

// 시작 위치: 방 남동쪽 구석에서 테이블·선반 쪽을 바라봄
state.player.x = 2.4;
state.player.z = 2.3;
camera.rotation.y = THREE.MathUtils.degToRad(34);
camera.position.set(state.player.x, PLAYER.eyeHeight, state.player.z);

// 충돌 사각형 (Blender에서 잰 가구 크기, 바닥에서 본 x·z 범위)
const colliders = [
  { minX: -3.2, maxX: -2.92, minZ: -3.2, maxZ: 3.2 }, // 서쪽 벽 (문 포함)
  { minX: 2.92, maxX: 3.2, minZ: -3.2, maxZ: 3.2 }, // 동쪽 벽
  { minX: -3.2, maxX: 3.2, minZ: -3.2, maxZ: -2.92 }, // 북쪽 벽
  { minX: -3.2, maxX: 3.2, minZ: 2.92, maxZ: 3.2 }, // 남쪽 벽
  { minX: 0.0, maxX: 1.2, minZ: -1.0, maxZ: 0.2 }, // 테이블
  { minX: -0.91, maxX: 1.51, minZ: -2.95, maxZ: -2.55 }, // 선반
  { minX: 0.35, maxX: 0.85, minZ: 0.26, maxZ: 0.74 }, // 의자들
  { minX: 0.38, maxX: 0.82, minZ: -1.39, maxZ: -0.97 },
  { minX: -0.39, maxX: 0.03, minZ: -0.62, maxZ: -0.18 },
  { minX: 1.17, maxX: 1.59, minZ: -0.62, maxZ: -0.18 },
];

// 모델 불러오기. 조명은 이미 텍스처에 구워져 있으므로 빛 계산 없는 MeshBasicMaterial로 바꾼다.
const msg = document.getElementById('msg');
new GLTFLoader().load(
  `${import.meta.env.BASE_URL}models/samples/cafe_sample.glb`,
  (gltf) => {
    gltf.scene.traverse((obj) => {
      if (obj.isMesh) {
        const map = obj.material.map ?? obj.material.emissiveMap;
        obj.material = new THREE.MeshBasicMaterial({ map });
      }
    });
    scene.add(gltf.scene);
    msg.textContent = '화면을 클릭하면 시작';
  },
  undefined,
  (err) => {
    msg.textContent = '모델을 불러오지 못했어요 (콘솔 확인)';
    console.error(err);
  },
);

const { controls, keys } = createControls(camera, renderer.domElement);
const start = document.getElementById('start');
start.addEventListener('click', () => controls.lock());
controls.addEventListener('lock', () => (start.style.display = 'none'));
controls.addEventListener('unlock', () => (start.style.display = 'flex'));

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (controls.isLocked) updatePlayer(dt, camera, keys, colliders);
  renderer.render(scene, camera);
});
