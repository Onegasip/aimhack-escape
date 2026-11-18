// 화면 가운데 조준점 + E키 원형 게이지 + 대상 이름
const R = 16; // 게이지 원 반지름(px)
const LEN = 2 * Math.PI * R;
let root = null;
let ring = null;
let label = null;

function ensure() {
  if (root) return;
  root = document.createElement('div');
  Object.assign(root.style, {
    position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
    pointerEvents: 'none', textAlign: 'center',
  });
  root.innerHTML = `
    <svg width="40" height="40" viewBox="0 0 40 40" style="display:block;margin:auto">
      <circle cx="20" cy="20" r="2.5" fill="#fff" />
      <circle id="gauge" cx="20" cy="20" r="${R}" fill="none" stroke="#ffd54f" stroke-width="3"
        stroke-dasharray="${LEN}" stroke-dashoffset="${LEN}" transform="rotate(-90 20 20)" />
    </svg>
    <div id="target-label" style="margin-top:6px;padding:3px 8px;border-radius:4px;background:rgba(0,0,0,.55);
      color:#fff;font:13px system-ui,sans-serif;white-space:nowrap;display:none"></div>`;
  document.body.appendChild(root);
  ring = root.querySelector('#gauge');
  label = root.querySelector('#target-label');
}

// name: 조준한 물건 이름 (없으면 null), progress: 0~1 게이지
export function setCrosshair(name, progress) {
  ensure();
  ring.setAttribute('stroke-dashoffset', String(LEN * (1 - progress)));
  if (name) {
    label.textContent = `${name} · E 길게 누르기`;
    label.style.display = 'inline-block';
  } else {
    label.style.display = 'none';
  }
}

export function setCrosshairVisible(visible) {
  ensure();
  root.style.display = visible ? 'block' : 'none';
}
