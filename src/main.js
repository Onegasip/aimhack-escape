// 게임 시작점: 씬(무대), 카메라(눈), 렌더러(그리는 도구)를 만들고 매 프레임 화면을 그린다.
import * as THREE from 'three';

// 1) 렌더러: 3D 장면을 화면(canvas)에 그려 준다.
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 고해상도 화면에서 너무 무거워지지 않게 최대 2배
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2) 씬: 물건, 조명을 올려 두는 무대
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202028);

// 3) 카메라: 플레이어의 눈. 시야각 75도, 눈높이 1.6m (CLAUDE.md 3장)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 1.6, 5);
camera.lookAt(0, 0, 0);

// 4) 확인용 바닥과 조명 (②단계에서 진짜 방으로 바뀐다)
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0x888888 }),
);
floor.rotation.x = -Math.PI / 2; // 평면을 눕혀서 바닥으로
scene.add(floor);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5)); // 하늘/땅 은은한 빛
const sun = new THREE.DirectionalLight(0xffffff, 1.5); // 한 방향에서 오는 빛
sun.position.set(3, 5, 2);
scene.add(sun);

// 5) 창 크기가 바뀌면 카메라 비율과 화면 크기를 다시 맞춘다.
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 브라우저 확대/다른 모니터로 옮겼을 때 대비
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 6) 렌더 루프: 매 프레임(약 1/60초마다) 화면을 다시 그린다.
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
