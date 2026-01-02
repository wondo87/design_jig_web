/**
 * 디자인 지그 웹사이트 - 상담 문의 처리 스크립트 (간소화 버전)
 * 
 * [설치 방법]
 * 1. 구글 스프레드시트에서 '확장 프로그램' -> 'Apps Script' 메뉴 클릭
 * 2. 기존 코드를 지우고 이 코드를 전부 복사해서 붙여넣기
 * 3. '배포' -> '새 배포' 클릭
 * 4. 유형 선택: '웹 앱'
 * 5. 다음 사용자 등을 대신하여 실행: '나(자신)'
 * 6. 액세스 권한이 있는 사용자: '모든 사용자'
 * 7. '배포' 버튼 클릭 후 생성된 '웹 앱 URL'을 복사
 * 8. 복사한 URL을 quote.html 파일의 GOOGLE_SCRIPT_URL 변수 값으로 넣으세요.
 * 
 * [현재 폼 필드]
 * - 이름 (name) *필수
 * - 연락처 (phone) *필수
 * - 이메일 (email) *필수
 * - 공사위치 (location)
 * - 나머지 필드는 n8n 자동화로 설문 발송 후 수집 예정
 */

// 데이터 저장 (POST 요청)
function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // 헤더가 없으면 생성 + 스타일 적용
        if (sheet.getLastRow() === 0) {
            setupSheet(sheet);
        }

        var data = JSON.parse(e.postData.contents);

        // 순차 번호 계산: 마지막 No. 값 + 1
        var lastRow = sheet.getLastRow();
        var nextNum = 1;
        if (lastRow > 1) {
            var lastNum = sheet.getRange(lastRow, 1).getValue();
            if (typeof lastNum === 'number') {
                nextNum = lastNum + 1;
            } else {
                nextNum = lastRow;
            }
        }

        // 데이터 행 추가 (간소화된 폼에 맞게 수정)
        sheet.appendRow([
            nextNum,                          // No.
            new Date(),                       // 접수일시
            data.name || '',                  // 이름
            data.phone || '',                 // 연락처
            data.email || '',                 // 이메일
            data.type || '',                  // 공사유형 (빈 값 - 설문으로 수집)
            data.size || '',                  // 예상평수 (빈 값 - 설문으로 수집)
            data.location || '',              // 공사위치
            data.budget || '',                // 예산 (빈 값 - 설문으로 수집)
            data.message || '설문 링크 발송 예정',  // 문의내용
            ''                                // 상담 예약 날짜
        ]);

        return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);

    } finally {
        lock.releaseLock();
    }
}

// 시트 초기 설정 (헤더 + 스타일)
function setupSheet(sheet) {
    var headers = ['No.', '접수일시', '이름', '연락처', '이메일', '공사유형', '예상평수', '공사위치', '예산', '문의내용', '상담 예약 날짜'];
    sheet.appendRow(headers);

    // 헤더 스타일 적용
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4a7c59');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');

    // 열 너비 조정
    sheet.setColumnWidth(1, 50);   // No.
    sheet.setColumnWidth(2, 150);  // 접수일시
    sheet.setColumnWidth(3, 80);   // 이름
    sheet.setColumnWidth(4, 120);  // 연락처
    sheet.setColumnWidth(5, 180);  // 이메일
    sheet.setColumnWidth(6, 100);  // 공사유형
    sheet.setColumnWidth(7, 80);   // 예상평수
    sheet.setColumnWidth(8, 200);  // 공사위치
    sheet.setColumnWidth(9, 120);  // 예산
    sheet.setColumnWidth(10, 250); // 문의내용
    sheet.setColumnWidth(11, 120); // 상담 예약 날짜

    // 필터 적용
    sheet.getRange(1, 1, 1, headers.length).createFilter();
}

// 데이터 읽기 (GET 요청) - admin 페이지용
function doGet(e) {
    try {
        var spreadsheet = SpreadsheetApp.openById('1Yp9UjY37PlBgXdyC2_acwfa8prxo7yD_VKAOcnIQQVw');
        var sheet = spreadsheet.getActiveSheet();
        var data = sheet.getDataRange().getValues();

        // 헤더 제외하고 데이터만
        var headers = data[0];
        var rows = data.slice(1);

        var result = rows.map(function (row, index) {
            return {
                no: row[0] || index + 1,
                date: row[1] || '',
                name: row[2] || '',
                phone: row[3] || '',
                email: row[4] || '',
                type: row[5] || '',
                size: row[6] || '',
                location: row[7] || '',
                budget: row[8] || '',
                message: row[9] || '',
                note: row[10] || ''
            };
        });

        // 최신순 정렬
        result.reverse();

        return ContentService.createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
