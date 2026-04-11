import { run, get } from "./dbClient.js";
import { migrate } from "./migrate.js";

async function seed() {
    await migrate();

    const result = await get<{count: number}>("SELECT COUNT(*) as count FROM posts;");
    if (result && result.count > 0) {
        console.log(`База вже містить дані. Сідінг скасовано.`);
        return; 
    }

    const now = new Date().toISOString();
    const userResult = await run(`
        INSERT INTO Users (email, name, date) 
        VALUES ('test@example.com', 'Іван', '${now}')
    `);

    const testAuthorId = userResult.lastID; 
    const testPosts = [
        { 
            title: "Продам гараж", 
            category: "Нерухомість", 
            content: "У хорошому стані", 
            authorId: testAuthorId, 
            date: now, 
            isDeleted: false 
        },
        { 
            title: "Куплю старий ноутбук", 
            category: "Електроніка", 
            content: "Шукаю щось для навчання", 
            authorId: testAuthorId, 
            date: now, 
            isDeleted: false 
        }
    ];

    for (const post of testPosts) {
        const safeIsDeleted = post.isDeleted ? 1 : 0; 
        await run(`
            INSERT INTO posts (title, category, content, authorId, date, isDeleted)
            VALUES ('${post.title}', '${post.category}', '${post.content}', ${post.authorId}, '${post.date}', ${safeIsDeleted})
        `);
    }

    console.log("Базу успішно наповнено тестовими даними!");
}

seed().catch(err => console.error(err));