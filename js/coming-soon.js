/* Coming Soon Popup */
(function() {
    // 오늘 날짜 키 생성
    const today = new Date().toISOString().split('T')[0];
    const popupKey = 'designjig_popup_dismissed_' + today;

    // 오늘 이미 닫았는지 확인
    if (localStorage.getItem(popupKey)) {
        return;
    }

    // 팝업 HTML 생성
    const popupHTML = `
        <div id="comingSoonPopup" class="coming-soon-overlay">
            <div class="coming-soon-modal">
                <button class="coming-soon-close" onclick="closeComingSoonPopup()">&times;</button>
                <div class="coming-soon-image">
                    <img src="/coming-soon.png" alt="Coming Soon" onerror="this.style.display='none'">
                </div>
                <div class="coming-soon-content">
                    <div class="coming-soon-badge">COMING SOON</div>
                    <h2>2025년 2월<br>그랜드 오픈</h2>
                    <p>디자인 지그가 더 완벽한 모습으로<br>여러분을 찾아갑니다.</p>
                    <div class="coming-soon-info">
                        <span>🏠 프리미엄 인테리어</span>
                        <span>✨ 맞춤형 시공</span>
                        <span>🎯 합리적인 가격</span>
                    </div>
                </div>
                <div class="coming-soon-footer">
                    <label class="coming-soon-checkbox">
                        <input type="checkbox" id="dontShowToday">
                        <span>오늘 하루 이 창을 열지 않음</span>
                    </label>
                    <button class="coming-soon-btn" onclick="closeComingSoonPopup()">확인</button>
                </div>
            </div>
        </div>
    `;

    // 팝업 스타일
    const popupStyle = `
        <style>
            .coming-soon-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .coming-soon-modal {
                background: #fff;
                border-radius: 20px;
                max-width: 420px;
                width: 90%;
                overflow: hidden;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
                position: relative;
                animation: slideUp 0.4s ease;
            }

            .coming-soon-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 36px;
                height: 36px;
                border: none;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                font-size: 24px;
                color: #666;
                cursor: pointer;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .coming-soon-close:hover {
                background: #fff;
                color: #333;
                transform: rotate(90deg);
            }

            .coming-soon-image {
                width: 100%;
                height: 160px;
                overflow: hidden;
                background: linear-gradient(135deg, #f5f5f0 0%, #e8e4dc 100%);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .coming-soon-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .coming-soon-content {
                padding: 30px 30px 20px;
                text-align: center;
            }

            .coming-soon-badge {
                display: inline-block;
                background: linear-gradient(135deg, #B4956F 0%, #9a7d5a 100%);
                color: #fff;
                font-size: 11px;
                font-weight: 600;
                padding: 6px 16px;
                border-radius: 20px;
                margin-bottom: 20px;
                letter-spacing: 1px;
            }

            .coming-soon-content h2 {
                font-size: 28px;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 15px;
                line-height: 1.3;
            }

            .coming-soon-content p {
                color: #666;
                font-size: 15px;
                line-height: 1.6;
                margin-bottom: 20px;
            }

            .coming-soon-info {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
            }

            .coming-soon-info span {
                background: #f8f8f8;
                padding: 8px 14px;
                border-radius: 8px;
                font-size: 13px;
                color: #555;
            }

            .coming-soon-footer {
                padding: 20px 30px 25px;
                background: #fafafa;
                border-top: 1px solid #eee;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }

            .coming-soon-checkbox {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-size: 13px;
                color: #888;
            }

            .coming-soon-checkbox input {
                width: 16px;
                height: 16px;
                cursor: pointer;
                accent-color: #B4956F;
            }

            .coming-soon-btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
                color: #fff;
                border: none;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }

            .coming-soon-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            }

            @media (max-width: 480px) {
                .coming-soon-modal {
                    margin: 15px;
                    width: calc(100% - 30px);
                }

                .coming-soon-content {
                    padding: 25px 20px 15px;
                }

                .coming-soon-content h2 {
                    font-size: 24px;
                }

                .coming-soon-footer {
                    padding: 15px 20px 20px;
                }
            }
        </style>
    `;

    // DOM에 추가
    document.body.insertAdjacentHTML('beforeend', popupStyle + popupHTML);

    // 팝업 닫기 함수 (전역)
    window.closeComingSoonPopup = function() {
        const checkbox = document.getElementById('dontShowToday');
        if (checkbox && checkbox.checked) {
            localStorage.setItem(popupKey, 'true');
        }
        const popup = document.getElementById('comingSoonPopup');
        if (popup) {
            popup.style.animation = 'fadeIn 0.2s ease reverse';
            setTimeout(() => popup.remove(), 200);
        }
    };

    // ESC 키로 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeComingSoonPopup();
        }
    });

    // 오버레이 클릭 시 닫기
    document.getElementById('comingSoonPopup').addEventListener('click', function(e) {
        if (e.target === this) {
            closeComingSoonPopup();
        }
    });
})();
