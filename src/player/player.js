// 플레이어 이동과 충돌.
// 플레이어를 바닥에서 본 "반지름 0.3m 원"으로 보고, 벽·가구는 "사각형"으로 본다.
// 원이 사각형에 파고들면 파고든 만큼 바깥으로 밀어낸다 → 벽에 비스듬히 부딪히면 벽을 따라 미끄러진다.
import * as THREE from 'three';
import { PLAYER, findRoomAt } from '../data/rooms.js';
import { state } from '../systems/state.js';

const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

export function updatePlayer(dt, camera, keys, colliders) {
  // 카메라가 보는 방향에서 위아래 성분을 빼서 "바닥 기준 앞쪽"을 구한다
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();
  right.crossVectors(forward, UP); // 앞쪽 × 위쪽 = 오른쪽

  const ahead = (keys.forward ? 1 : 0) - (keys.back ? 1 : 0);
  const side = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);

  const pos = state.player;
  if (ahead !== 0 || side !== 0) {
    let mx = forward.x * ahead + right.x * side;
    let mz = forward.z * ahead + right.z * side;
    const len = Math.hypot(mx, mz); // 대각선으로 가도 빨라지지 않게 길이를 1로 맞춤
    mx = (mx / len) * PLAYER.speed * dt;
    mz = (mz / len) * PLAYER.speed * dt;
    pos.x += mx;
    pos.z += mz;
    resolveCollisions(pos, PLAYER.radius, colliders);
  }

  camera.position.set(pos.x, PLAYER.eyeHeight, pos.z);
  pos.yawDeg = THREE.MathUtils.radToDeg(Math.atan2(-forward.x, -forward.z));
  pos.roomId = findRoomAt(pos.x)?.id ?? null;
}

// p: {x, z}를 colliders 바깥으로 밀어낸다. 모서리에 끼는 경우를 위해 몇 번 반복한다.
export function resolveCollisions(p, r, colliders) {
  for (let iter = 0; iter < 4; iter++) {
    let pushed = false;
    for (const b of colliders) {
      // 사각형 위에서 원 중심과 가장 가까운 점
      const cx = Math.min(Math.max(p.x, b.minX), b.maxX);
      const cz = Math.min(Math.max(p.z, b.minZ), b.maxZ);
      const dx = p.x - cx;
      const dz = p.z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 >= r * r) continue;

      if (d2 > 1e-10) {
        // 원이 사각형 테두리에 파고듦 → 가장 가까운 점 반대쪽으로 밀기
        const d = Math.sqrt(d2);
        p.x += (dx / d) * (r - d);
        p.z += (dz / d) * (r - d);
      } else {
        // 원 중심이 사각형 안에 들어옴 → 가장 가까운 변 쪽으로 빼내기
        const outs = [
          [p.x - b.minX, () => (p.x = b.minX - r)],
          [b.maxX - p.x, () => (p.x = b.maxX + r)],
          [p.z - b.minZ, () => (p.z = b.minZ - r)],
          [b.maxZ - p.z, () => (p.z = b.maxZ + r)],
        ];
        outs.sort((a, c) => a[0] - c[0])[0][1]();
      }
      pushed = true;
    }
    if (!pushed) break;
  }
}
