const express = require('express');
const cors = require('cors');
const { Client } = require("@notionhq/client");

const app = express();
const port = 3001;

// Provided by user
const NOTION_API_KEY = "ntn_W60962876671zXOYqiYKtlhW1IS8ort8H9fAhUekkeF3JY";
const DATABASE_ID = "6b993a15bb2643979ceb382460ed7e77";

const notion = new Client({ auth: NOTION_API_KEY });

app.use(cors());
app.use(express.json());

app.get('/api/projects', async (req, res) => {
    try {
        const PROJECT_DB_ID = "22bc2a12-1ce9-4ff2-8e17-1cf91bcdf3a8";
        const response = await notion.databases.query({
            database_id: PROJECT_DB_ID,
            sorts: [{ property: "현장명", direction: "ascending" }],
        });

        const projects = response.results.map(page => {
            const titleProperty = page.properties["현장명"];
            const name = titleProperty && titleProperty.title[0]
                ? titleProperty.title[0].plain_text
                : "이름 없음";
            return { id: page.id, name: name };
        }).filter(p => p.name !== "이름 없음" && !p.name.includes("템플릿"));

        res.status(200).json({ success: true, projects });
    } catch (error) {
        console.error("Fetch Projects Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/sync-schedule', async (req, res) => {
    const { project, schedules } = req.body;
    console.log(`Syncing project: ${project} with ${schedules.length} rows...`);

    try {
        const results = [];
        for (const item of schedules) {
            const response = await notion.pages.create({
                parent: { database_id: DATABASE_ID },
                properties: {
                    "공정명": { title: [{ text: { content: item.name || "미상의 공정" } }] },
                    "프로젝트": { select: { name: project } },
                    "시작-종료": item.start && item.end ? {
                        date: { start: item.start, end: item.end }
                    } : undefined,
                    "담당자": { rich_text: [{ text: { content: item.inCharge || "" } }] },
                    "비고": { rich_text: [{ text: { content: item.memo || "" } }] }
                }
            });
            results.push(response.id);
        }
        res.status(200).json({ message: "Success", count: results.length });
    } catch (error) {
        console.error("Notion Error:", error.message);
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Local Dev Server running at http://localhost:${port}`);
});
