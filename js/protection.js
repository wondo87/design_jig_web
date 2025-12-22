/**
 * Content Protection Script
 * 
 * 기능:
 * 1. 우클릭 방지
 * 2. 텍스트 선택/복사 방지
 * 3. 개발자 도구(F12) 방지
 * 4. 인쇄(Ctrl+P) 방지
 * 
 * 예외:
 * - localStorage에 'isAdmin'이 'true'로 설정된 경우 모든 제한 해제
 */

(function () {
    // 관리자 여부 확인
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    // 관리자면 아무 제한 없이 종료
    if (isAdmin) {
        console.log('DesignJig Admin Mode Active: Content Protection Disabled');
        // 관리자임을 알리는 작은 표시 (선택사항)
        // const badge = document.createElement('div');
        // badge.style.position = 'fixed';
        // badge.style.bottom = '10px';
        // badge.style.left = '10px';
        // badge.style.padding = '5px 10px';
        // badge.style.background = 'rgba(0,0,0,0.5)';
        // badge.style.color = '#fff';
        // badge.style.fontSize = '10px';
        // badge.style.borderRadius = '5px';
        // badge.style.zIndex = '9999';
        // badge.innerText = 'Admin Mode';
        // document.body.appendChild(badge);
        return;
    }

    // --- 비관리자 제한 적용 ---

    // 1. 우클릭 방지
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        // alert('콘텐츠 보호를 위해 마우스 우클릭이 제한됩니다.');
    });

    // 2. 드래그/선택 방지 (CSS 주입)
    const style = document.createElement('style');
    style.innerHTML = `
        body {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        /* 인쇄 시 화면 숨김 */
        @media print {
            body { 
                display: none !important; 
            }
            html::after {
                content: "이 페이지는 인쇄할 수 없습니다.";
                display: block;
                padding: 20px;
                text-align: center;
                font-size: 20px;
            }
        }
    `;
    document.head.appendChild(style);

    // 3. 키보드 단축키 방지 (복사, 인쇄, 개발자도구 등)
    document.addEventListener('keydown', function (e) {
        // F12 (개발자 도구)
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        // Ctrl(Cmd) 키 조합
        if (e.ctrlKey || e.metaKey) {
            const key = e.key.toUpperCase();

            // C (복사), P (인쇄), S (저장), U (소스보기), A (전체선택)
            if (['C', 'P', 'S', 'U', 'A'].includes(key)) {
                e.preventDefault();
                return false;
            }

            // Shift 키 조합 (개발자 도구 Ctrl+Shift+I / C / J)
            if (e.shiftKey && ['I', 'C', 'J'].includes(key)) {
                e.preventDefault();
                return false;
            }
        }
    });

    console.log('Content Protection Active');
})();
