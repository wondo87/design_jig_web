// Netlify Function: Notion 포트폴리오 데이터 가져오기
// 경로: /.netlify/functions/portfolio

const NOTION_API_KEY = 'ntn_W60962876671zXOYqiYKtlhW1IS8ort8H9fAhUekkeF3JY';
const DATABASE_ID = '2d016b5df7b380d2a974c5f07b6ebf82';

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // OPTIONS 요청 처리 (CORS)
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Notion API 호출
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Notion API Error:', errorData);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: 'Notion API 오류', details: errorData })
            };
        }

        const data = await response.json();
        
        // Notion API 원본 형식 그대로 반환
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
