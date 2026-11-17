import { defineConfig } from 'vite';

// GitHub Pages 주소가 https://onegasip.github.io/aimhack-escape/ 이므로
// 배포용 빌드(build)일 때만 기본 경로를 '/aimhack-escape/'로 맞춘다.
// 개발 서버(npm run dev)에서는 그냥 '/'를 쓴다.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/aimhack-escape/' : '/',
}));
