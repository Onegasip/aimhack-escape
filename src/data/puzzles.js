// 퍼즐 정답과 보상 정의 (CLAUDE.md 8장)
// 물건의 위치·크기는 src/data/rooms/방이름.js, "이 물건을 E로 쓰면 무슨 일이 생기는지"는 여기에 적는다.
// 퍼즐·상호작용 코드는 id로만 물건을 찾는다.
//
// type 종류
//   examine : 조사하면 text를 보여 준다
//   pickup  : 주우면 item이 인벤토리에 들어가고 물건이 사라진다
//   lock    : 숫자 자물쇠. code를 맞히면 onSolve 실행
//   door    : 문. needs(아이템 id)가 있으면 그 아이템을 들고 써야 열린다
// onSolve / 보상
//   text: 보여 줄 문장, reveal: [보이게 할 물건 id], openDoors: [열 문 id]
// hidden: true → 처음에는 안 보이는 물건 (reveal로 나타남)

// 아이템 (팀 공용 인벤토리에 들어가는 것)
export const ITEMS = {
  test_key: { name: '카페 문 열쇠', color: '#d4af37' },
};

// 상호작용 (──── ③단계 테스트용: 로비 ────)
export const INTERACTIONS = {
  lobby_counter: {
    name: '안내 카운터',
    type: 'examine',
    text: '카운터 위에 작은 상자가 있다. 메모: "비밀번호는 1부터 차례대로"',
  },
  lobby_notice: {
    name: '주의사항 안내판',
    type: 'examine',
    text: '1. 소지품은 사물함에  2. 힌트는 팀당 3번  3. 즐겁게 탈출하세요!',
  },
  lobby_test_box: {
    name: '자물쇠 상자',
    type: 'lock',
    code: '1234',
    onSolve: { text: '딸깍! 상자가 열렸다. 안에 열쇠가 있다.', reveal: ['lobby_test_key'] },
  },
  lobby_test_key: {
    name: '열쇠',
    type: 'pickup',
    item: 'test_key',
    hidden: true,
  },
  door_lobby_cafe: {
    name: '보드게임 카페 문',
    type: 'door',
    needs: 'test_key',
    lockedText: '잠겨 있다. 열쇠가 필요하다. (I 키로 인벤토리에서 열쇠를 골라 사용)',
    consume: true, // 문을 열면 열쇠는 없어진다
  },
};
