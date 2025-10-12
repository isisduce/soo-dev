$(function(){

  /* 로그인화면 비밀번호 토글 */
  $('.toggle-pw').click(function(){
    // Toggle Icon Shape
    $(this).toggleClass('open-eye');
    $(this).toggleClass('close-eye');
    // Toggle Input Type
    var inputType = $(this).parent().children('input').attr('type');
    if(inputType == 'password'){
      $(this).parent().children('input').attr('type', 'text');
    }else{
      $(this).parent().children('input').attr('type', 'password');
    };
  });


  /* table tbody tr 클릭 시 active 클래스 활성화 */
  $('table tbody tr').click(function(){
    $('table tbody tr').removeClass('active');
    $(this).addClass('active');
  });


  /* select박스 커스텀 */
  $('.select-area .select-toggle').on('click', function (e) {
    e.stopPropagation(); // 문서 클릭 이벤트 막기
    const $selectArea = $(this).closest('.select-area');
    $('.select-area .select-box').not($selectArea.find('.select-box')).hide(); // 다른 셀렉트 닫기
    $selectArea.find('.select-box').toggle();
  });
  // 항목 클릭 시 선택 반영
  $('.select-area .select-box a').on('click', function (e) {
    e.preventDefault();

    const selectedText = $(this).text();
    const $selectArea = $(this).closest('.select-area');

    $selectArea.find('.select-txt').text(selectedText); // 선택된 텍스트 표시
    $selectArea.find('.select-box a').removeClass('active'); // 기존 active 제거
    $(this).addClass('active'); // 선택된 항목에 active 추가
    $selectArea.find('.select-box').hide(); // 선택 후 드롭다운 닫기
  });
  // 셀렉트 외부 클릭 시 드롭다운 닫기
  $(document).on('click', function () {
    $('.select-area .select-box').hide();
  });


  /* 공개기간 선택 active 클래스 활성화 */
  $('.regi-period-select li a').click(function(){
    $('.regi-period-select li a').removeClass('active');
    $(this).addClass('active');
  });


  /* table drag & touch scroll */
  const container = document.querySelector('.table-area');
  if (container) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // 마우스 이벤트
    container.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    container.addEventListener('mouseleave', () => {
      isDown = false;
    });
    container.addEventListener('mouseup', () => {
      isDown = false;
    });
    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });

    // 터치 이벤트
    let isTouching = false;
    let touchStartX = 0;
    let touchScrollLeft = 0;
    container.addEventListener('touchstart', (e) => {
      isTouching = true;
      touchStartX = e.touches[0].pageX - container.offsetLeft;
      touchScrollLeft = container.scrollLeft;
    });
    container.addEventListener('touchmove', (e) => {
      if (!isTouching) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - touchStartX) * 1.5;
      container.scrollLeft = touchScrollLeft - walk;
    });
    container.addEventListener('touchend', () => {
      isTouching = false;
    });
  }


  /* my-list-button-group active 클래스 활성화 */
  $('.my-list-button-group a').click(function(){
    $('.my-list-button-group a').removeClass('active');
    $(this).addClass('active');
  });


  /* 글자수 표시 */
  document.querySelectorAll('.promise-input-area textarea').forEach(textarea => {
    const counter = textarea.parentElement.querySelector('em');
  
    // 초기값 반영
    counter.textContent = textarea.value.length;
  
    // 입력 시 업데이트
    textarea.addEventListener('input', () => {
      counter.textContent = textarea.value.length;
    });
  });


  /* 모바일 하단 메뉴 바 active 클래스 */
  $('.mo-menu-bar a').click(function(){
    $('.mo-menu-bar a').removeClass('active');
    $(this).addClass('active');
  });

  
  /* 공약입력 그룹 drag & drop */
  const promiseArea1 = document.querySelector('.promise-input-area');
  Sortable.create(promiseArea1, {
    animation: 150,
    handle: '.btn-list',
    draggable: '> div',
  });
  const promiseArea2 = document.querySelector('.promise-input-area01');
  Sortable.create(promiseArea2, {
    animation: 150,
    handle: '.btn-list',
    draggable: '> div',
  });
  const promiseArea3 = document.querySelector('.promise-input-area02');
  Sortable.create(promiseArea3, {
    animation: 150,
    handle: '.btn-list',
    draggable: '> div',
  });





});