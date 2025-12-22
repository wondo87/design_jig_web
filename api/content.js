import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Page ID is required' });
    }

    try {
        const response = await notion.blocks.children.list({
            block_id: id,
            page_size: 100, // 최대 100개 블록 가져오기
        });

        res.status(200).json(response.results);
    } catch (error) {
        console.error('Notion Content API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
