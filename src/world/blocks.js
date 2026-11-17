// 블록(상자) 만들기 공통 도구. 같은 색은 재질을 한 번만 만들어 다시 쓴다.
import * as THREE from 'three';

const materials = new Map();
const unitBox = new THREE.BoxGeometry(1, 1, 1); // 크기 1짜리 상자를 늘려서 쓴다

export function material(color) {
  if (!materials.has(color)) {
    materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.85 }));
  }
  return materials.get(color);
}

// 이 높이보다 아래에서 시작하는 물건만 플레이어를 막는다 (문 위 상인방 등은 안 막음)
export const BLOCK_BELOW = 1.8;

// 상자 하나를 만들어 parent에 붙인다.
// center: 월드 좌표 [x, y, z] (상자 한가운데), size: [x, y, z] 크기
// colliders 배열을 주면 충돌 상자(바닥에서 본 사각형)도 등록한다.
export function addBox(parent, { center, size, color, colliders = null, id = null }) {
  const mesh = new THREE.Mesh(unitBox, material(color));
  mesh.position.set(center[0], center[1], center[2]);
  mesh.scale.set(size[0], size[1], size[2]);
  parent.add(mesh);

  const bottom = center[1] - size[1] / 2;
  if (colliders && bottom < BLOCK_BELOW) {
    colliders.push({
      id,
      minX: center[0] - size[0] / 2,
      maxX: center[0] + size[0] / 2,
      minZ: center[2] - size[2] / 2,
      maxZ: center[2] + size[2] / 2,
    });
  }
  return mesh;
}
