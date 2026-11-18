// 숫자 자물쇠 입력창: 자리마다 ▲▼로 숫자를 돌리고 [열기]를 누른다.
// 키보드 숫자·Enter도 된다. Esc로 닫기.
import { openPanel, closePanel } from './panels.js';
import { showMessage } from './message.js';

let root = null;
let digits = [];
let cursor = 0;
let submit = null;

const css = `
  #lock { position:fixed; inset:0; display:none; align-items:center; justify-content:center;
    background:rgba(0,0,0,.55); font-family:system-ui,sans-serif; color:#fff; }
  #lock .box { background:#2b2b33; padding:24px 28px; border-radius:10px; text-align:center; min-width:260px; }
  #lock h2 { margin:0 0 16px; font-size:18px; }
  #lock .dials { display:flex; gap:10px; justify-content:center; }
  #lock .dial { display:flex; flex-direction:column; align-items:center; gap:4px; }
  #lock .num { width:44px; height:54px; display:flex; align-items:center; justify-content:center;
    font-size:30px; background:#111; border-radius:6px; border:2px solid transparent; }
  #lock .num.cur { border-color:#ffd54f; }
  #lock button { font-size:15px; padding:4px 12px; border:0; border-radius:5px; cursor:pointer; }
  #lock .row { margin-top:18px; display:flex; gap:10px; justify-content:center; }
  #lock .open { background:#ffd54f; }
  #lock.shake .box { animation: shake .3s; }
  @keyframes shake { 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
`;

function ensure() {
  if (root) return;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  root = document.createElement('div');
  root.id = 'lock';
  document.body.appendChild(root);

  window.addEventListener('keydown', (e) => {
    if (root.style.display !== 'flex') return;
    if (/^Digit\d$|^Enter$|^Arrow/.test(e.code)) e.preventDefault(); // 버튼이 같이 눌리지 않게
    if (/^Digit\d$/.test(e.code)) {
      digits[cursor] = Number(e.code.slice(5));
      cursor = (cursor + 1) % digits.length;
      render();
    } else if (e.code === 'Enter') trySubmit();
    else if (e.code === 'ArrowLeft') { cursor = (cursor + digits.length - 1) % digits.length; render(); }
    else if (e.code === 'ArrowRight') { cursor = (cursor + 1) % digits.length; render(); }
  });
}

// title: 자물쇠 이름, length: 자릿수, onSubmit(입력 문자열) → 맞으면 true
export function openLockPanel(title, length, onSubmit) {
  ensure();
  digits = Array(length).fill(0);
  cursor = 0;
  submit = onSubmit;
  root.innerHTML = `
    <div class="box">
      <h2>${title}</h2>
      <div class="dials">${digits.map((_, i) => `
        <div class="dial">
          <button data-up="${i}">▲</button><div class="num" data-i="${i}"></div><button data-down="${i}">▼</button>
        </div>`).join('')}
      </div>
      <div class="row"><button class="open">열기</button><button class="cancel">닫기</button></div>
    </div>`;
  root.querySelectorAll('[data-up]').forEach((b) => (b.onclick = () => turn(+b.dataset.up, 1)));
  root.querySelectorAll('[data-down]').forEach((b) => (b.onclick = () => turn(+b.dataset.down, -1)));
  root.querySelectorAll('.num').forEach((n) => (n.onclick = () => { cursor = +n.dataset.i; render(); }));
  root.querySelector('.open').onclick = trySubmit;
  root.querySelector('.cancel').onclick = () => closePanel(true);
  render();
  root.style.display = 'flex';
  openPanel('lock', () => (root.style.display = 'none'));
}

function turn(i, delta) {
  digits[i] = (digits[i] + delta + 10) % 10;
  cursor = i;
  render();
}

function render() {
  root.querySelectorAll('.num').forEach((n, i) => {
    n.textContent = digits[i];
    n.classList.toggle('cur', i === cursor);
  });
}

function trySubmit() {
  if (submit(digits.join(''))) {
    closePanel(true);
  } else {
    root.classList.remove('shake');
    void root.offsetWidth; // 애니메이션 다시 시작
    root.classList.add('shake');
    showMessage('틀렸다. 자물쇠가 꿈쩍도 안 한다.', 2);
  }
}
