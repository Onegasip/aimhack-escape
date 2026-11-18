// 화면 아래쪽에 잠깐 뜨는 안내 문장 (조사 결과, "잠겨 있다" 등)
let box = null;
let timer = null;

function ensure() {
  if (box) return;
  box = document.createElement('div');
  box.id = 'message';
  Object.assign(box.style, {
    position: 'fixed', left: '50%', bottom: '12%', transform: 'translateX(-50%)',
    maxWidth: '70vw', padding: '10px 18px', borderRadius: '6px',
    background: 'rgba(0,0,0,0.7)', color: '#fff', font: '16px/1.5 system-ui, sans-serif',
    textAlign: 'center', pointerEvents: 'none', display: 'none',
  });
  document.body.appendChild(box);
}

export function showMessage(text, seconds = 3.5) {
  ensure();
  box.textContent = text;
  box.style.display = 'block';
  clearTimeout(timer);
  timer = setTimeout(() => (box.style.display = 'none'), seconds * 1000);
}
