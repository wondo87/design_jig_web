/**
 * 디자인 지그 웹사이트 - 상담 문의 처리 + 자동 이메일 발송 스크립트
 * 
 * [기능]
 * 1. 고객 문의 접수 → Google Sheets 저장
 * 2. 고객에게 자동으로 설문 링크 이메일 발송 (이름, 연락처, 이메일, 주소 자동 입력)
 */

// ========== 설정 영역 ==========
// 설문지 기본 주소 (viewform 이전까지)
const FORM_BASE_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdcsD1hjKMNezFTaPAZRlKovdRDfCW08cy4VfLHL_LJDcmbVw/viewform';

// 설문지 항목별 ID (자동 입력을 위해 필요)
const ENTRY_IDS = {
    NAME: '2076163714',
    PHONE: '217138793',
    EMAIL: '916215270',
    ADDRESS: '840428259'
};

// 발신자 이름
const SENDER_NAME = '디자인지그';
// ================================

function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        if (sheet.getLastRow() === 0) {
            setupSheet(sheet);
        }

        var data = JSON.parse(e.postData.contents);

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

        sheet.appendRow([
            nextNum,
            new Date(),
            data.name || '',
            data.phone || '',
            data.email || '',
            data.location || '',
            data.message || '',
            '설문발송',
            ''
        ]);

        // ✅ 고객 맞춤형 이메일 발송
        if (data.email) {
            sendSurveyEmail(data);
        }

        return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);

    } finally {
        lock.releaseLock();
    }
}

function sendSurveyEmail(data) {
    var customerName = data.name || '고객';

    // URL 파라미터 생성 (자동 입력)
    // viewform?usp=pp_url&entry.ID=VALUE...
    var params = [
        'usp=pp_url',
        'entry.' + ENTRY_IDS.NAME + '=' + encodeURIComponent(customerName),
        'entry.' + ENTRY_IDS.PHONE + '=' + encodeURIComponent(data.phone || ''),
        'entry.' + ENTRY_IDS.EMAIL + '=' + encodeURIComponent(data.email || ''),
        'entry.' + ENTRY_IDS.ADDRESS + '=' + encodeURIComponent(data.location || '')
    ];

    var finalSurveyUrl = FORM_BASE_URL + '?' + params.join('&');

    var subject = '[디자인지그] 맞춤 상담을 위해 사전 설문 작성을 부탁드립니다';

    var htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Noto Sans KR', -apple-system, sans-serif; line-height: 1.75; color: #333; letter-spacing: -0.02em; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px; line-height: 1.6; }
        a { color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #1a1a1a; font-weight: bold; transition: opacity 0.2s; }
        a:hover { opacity: 0.7; }
    </style>
</head>
<body>
    <div class="container">
        <p><strong>DESIGN JIG</strong></p>
        <br>
        <p>안녕하세요, <strong>${customerName}</strong> 님.<br>
        디자인지그에 문의해 주셔서 감사합니다.</p>
        <br>
        <p>디자인지그는<br>
        공간을 단순히 꾸미는 것이 아니라,<br>
        그 공간에서 살아갈 분의 생활 방식과 기준을<br>
        먼저 이해하는 것에서 설계를 시작합니다.</p>
        <br>
        <p>보다 정확한 상담을 위해<br>
        간단한 사전 설문을 요청드립니다.<br>
        설문 내용을 바탕으로 공간의 방향과 우선순위를 정리한 후,<br>
        그에 맞는 상담을 진행해 드리겠습니다.</p>
        <br>
        <p>아래 링크를 클릭하시면 <strong>기본 정보가 자동으로 입력되어 있습니다.</strong></p>
        <p>
            <a href="${finalSurveyUrl}">▶ 사전 설문 작성하기</a><br>
            (약 2~3분 소요)
        </p>
        <br>
        <p>설문 작성 후 확인되는 대로<br>
        순차적으로 연락드리겠습니다.</p>
        <br>
        <p>감사합니다.</p>
        <br>
        <p>디자인지그 드림</p>
        
        <div class="footer">
            <strong style="color: #1a1a1a; font-size: 13px;">DESIGN JIG</strong><br>
            기본이 탄탄해야 아름다움도 오래갑니다.<br>
            designjig.com
        </div>
    </div>
</body>
</html>
    `;

    var plainTextBody = `
DESIGN JIG

안녕하세요, ${customerName} 님.
디자인지그에 문의해 주셔서 감사합니다.

디자인지그는
공간을 단순히 꾸미는 것이 아니라,
그 공간에서 살아갈 분의 생활 방식과 기준을
먼저 이해하는 것에서 설계를 시작합니다.

보다 정확한 상담을 위해
간단한 사전 설문을 요청드립니다.
설문 내용을 바탕으로 공간의 방향과 우선순위를 정리한 후,
그에 맞는 상담을 진행해 드리겠습니다.

아래 링크를 클릭하시면 기본 정보가 자동으로 입력되어 있습니다.

▶ 사전 설문 작성하기
${finalSurveyUrl}
(약 2~3분 소요)

설문 작성 후 확인되는 대로
순차적으로 연락드리겠습니다.

감사합니다.

디자인지그 드림

────────────────
DESIGN JIG
기본이 탄탄해야 아름다움도 오래갑니다.
designjig.com
    `;

    try {
        MailApp.sendEmail({
            to: data.email,
            subject: subject,
            body: plainTextBody,
            htmlBody: htmlBody,
            name: SENDER_NAME
        });
        console.log('이메일 발송 성공: ' + data.email);
    } catch (error) {
        console.log('이메일 발송 실패: ' + error.toString());
    }
}

function setupSheet(sheet) {
    var headers = ['No.', '접수일시', '이름', '연락처', '이메일', '현장주소', '문의내용', '상담상태', '상담 예약 날짜'];
    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4a7c59');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');

    sheet.setColumnWidth(1, 50);
    sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 80);
    sheet.setColumnWidth(4, 120);
    sheet.setColumnWidth(5, 180);
    sheet.setColumnWidth(6, 200);
    sheet.setColumnWidth(7, 250);
    sheet.setColumnWidth(8, 100);
    sheet.setColumnWidth(9, 120);

    sheet.getRange(1, 1, 1, headers.length).createFilter();
}

function doGet(e) {
    try {
        var spreadsheet = SpreadsheetApp.openById('1Yp9UjY37PlBgXdyC2_acwfa8prxo7yD_VKAOcnIQQVw');
        var sheet = spreadsheet.getActiveSheet();
        var data = sheet.getDataRange().getValues();

        var rows = data.slice(1);

        var result = rows.map(function (row, index) {
            return {
                no: row[0] || index + 1,
                date: row[1] || '',
                name: row[2] || '',
                phone: row[3] || '',
                email: row[4] || '',
                location: row[5] || '',
                message: row[6] || '',
                status: row[7] || '신규문의',
                note: row[8] || ''
            };
        });

        result.reverse();

        return ContentService.createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
