import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 하위 블록을 재귀적으로 가져오는 함수
async function getBlockWithChildren(blockId) {
    let allBlocks = [];
    let cursor = undefined;
    let hasMore = true;

    while (hasMore) {
        const response = await notion.blocks.children.list({
            block_id: blockId,
            page_size: 100,
            start_cursor: cursor,
        });

        for (const block of response.results) {
            // 하위 블록이 있는 경우 재귀적으로 가져오기
            if (block.has_children) {
                const children = await getBlockWithChildren(block.id);
                block.children = children;
            }
            allBlocks.push(block);
        }

        hasMore = response.has_more;
        cursor = response.next_cursor;
    }

    return allBlocks;
}

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Page ID is required' });
    }

    try {
        const allBlocks = await getBlockWithChildren(id);
        res.status(200).json(allBlocks);
    } catch (error) {
        console.error('Notion Content API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
