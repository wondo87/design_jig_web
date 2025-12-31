import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 환경변수 확인
    if (!process.env.NOTION_API_KEY) {
        return res.status(500).json({
            success: false,
            message: 'NOTION_API_KEY 환경변수가 설정되지 않았습니다.'
        });
    }

    const DATABASE_ID = process.env.NOTION_SCHEDULE_ID || '6b993a15bb2643979ceb382460ed7e77';

    const { project, schedules } = req.body;

    if (!project || !schedules || !Array.isArray(schedules)) {
        return res.status(400).json({
            success: false,
            message: 'project와 schedules 배열이 필요합니다.'
        });
    }

    try {
        let successCount = 0;

        for (const schedule of schedules) {
            const properties = {
                "공정명": {
                    title: [{ text: { content: schedule.name || '' } }]
                },
                "담당자": {
                    rich_text: [{ text: { content: schedule.inCharge || '' } }]
                },
                "프로젝트": {
                    rich_text: [{ text: { content: project } }]
                }
            };

            // 날짜가 있을 경우에만 추가
            if (schedule.start) {
                properties["시작일"] = {
                    date: {
                        start: schedule.start,
                        end: schedule.end || null
                    }
                };
            }

            await notion.pages.create({
                parent: { database_id: DATABASE_ID },
                properties: properties
            });

            successCount++;
        }

        return res.status(200).json({
            success: true,
            message: `${successCount}개의 스케줄이 노션에 등록되었습니다.`,
            count: successCount
        });

    } catch (error) {
        console.error('Notion Sync Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || '노션 동기화 중 오류가 발생했습니다.',
            details: error.body || null
        });
    }
}
