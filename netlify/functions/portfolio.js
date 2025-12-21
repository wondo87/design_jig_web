{\rtf1\ansi\ansicpg949\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 export async function handler() \{\
  try \{\
    const response = await fetch(\
      `https://api.notion.com/v1/databases/$\{process.env.NOTION_DATABASE_ID\}/query`,\
      \{\
        method: "POST",\
        headers: \{\
          "Authorization": `Bearer $\{process.env.NOTION_API_KEY\}`,\
          "Notion-Version": "2022-06-28",\
          "Content-Type": "application/json"\
        \},\
        body: JSON.stringify(\{\
          sorts: [\
            \{ property: "order", direction: "ascending" \}\
          ]\
        \})\
      \}\
    );\
\
    const data = await response.json();\
\
    return \{\
      statusCode: 200,\
      body: JSON.stringify(data.results)\
    \};\
  \} catch (error) \{\
    return \{\
      statusCode: 500,\
      body: JSON.stringify(\{ error: error.message \})\
    \};\
  \}\
\}}