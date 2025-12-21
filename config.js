// ============================================
// 디자인지그 외부 서비스 연동 설정
// ============================================
// 이 파일의 값들을 각 서비스 가입 후 입력하세요
// ============================================

const CONFIG = {
    // ----------------------------------------
    // 1. Cloudinary 설정 (이미지 저장)
    // https://cloudinary.com 가입 후 Dashboard에서 확인
    // ----------------------------------------
    CLOUDINARY: {
        CLOUD_NAME: 'YOUR_CLOUD_NAME',      // 예: 'designjig'
        // 이미지 URL 형식: https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/...
    },

    // ----------------------------------------
    // 2. Notion 설정 (칼럼 글)
    // https://www.notion.so/my-integrations 에서 API 키 생성
    // ----------------------------------------
    NOTION: {
        API_KEY: 'YOUR_NOTION_API_KEY',     // secret_xxxx... 형식
        COLUMNS_DB_ID: 'YOUR_DATABASE_ID',  // 칼럼 데이터베이스 ID (32자리)
        // 데이터베이스 ID는 Notion URL에서 확인:
        // https://notion.so/xxxxx?v=yyyyy 에서 xxxxx 부분
    },

    // ----------------------------------------
    // 3. Google Sheets 설정 (고객/견적 관리)
    // https://console.cloud.google.com 에서 API 키 생성
    // ----------------------------------------
    GOOGLE_SHEETS: {
        API_KEY: 'YOUR_GOOGLE_API_KEY',
        SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',
        // 스프레드시트 ID는 URL에서 확인:
        // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
        
        // 시트 이름
        SHEETS: {
            CUSTOMERS: '고객관리',
            ESTIMATES: '견적서',
            CONTRACTS: '계약서'
        }
    }
};

// 설정 완료 여부 확인
function checkConfig() {
    const issues = [];
    
    if (CONFIG.CLOUDINARY.CLOUD_NAME === 'YOUR_CLOUD_NAME') {
        issues.push('Cloudinary 설정이 필요합니다');
    }
    if (CONFIG.NOTION.API_KEY === 'YOUR_NOTION_API_KEY') {
        issues.push('Notion API 키 설정이 필요합니다');
    }
    if (CONFIG.GOOGLE_SHEETS.API_KEY === 'YOUR_GOOGLE_API_KEY') {
        issues.push('Google Sheets API 키 설정이 필요합니다');
    }
    
    return issues;
}
