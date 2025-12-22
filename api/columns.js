import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
// 환경변수 대신 직접 ID 사용 (디버깅용)
const databaseId = 'd116b5df7b380dcb0ebc5e97f6f9332';

export default async function handler(req, res) {
    // 환경변수 확인 (API KEY만)
    if (!process.env.NOTION_API_KEY) {
        return res.status(500).json({
            error: '환경변수가 설정되지 않았습니다.',
            missing: {
                NOTION_API_KEY: true
            }
        });
    }

    try {
        const response = await notion.databases.query({
            database_id: databaseId,
        });

        // 노션의 원본 데이터(results)를 그대로 클라이언트에 보냅니다.
        res.status(200).json(response.results);
    } catch (error) {
        console.error('Notion API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
