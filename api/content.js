import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Page ID is required' });
    }

    try {
        let allBlocks = [];
        let cursor = undefined;
        let hasMore = true;

        // 페이지네이션으로 모든 블록 가져오기
        while (hasMore) {
            const response = await notion.blocks.children.list({
                block_id: id,
                page_size: 100,
                start_cursor: cursor,
            });

            allBlocks = allBlocks.concat(response.results);
            hasMore = response.has_more;
            cursor = response.next_cursor;
        }

        res.status(200).json(allBlocks);
    } catch (error) {
        console.error('Notion Content API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
