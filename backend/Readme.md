# Дошка оголошень (Лабораторна робота №3)

## Як запустити проєкт

1. Встановити залежності: `npm install`
2. Заповнити базу тестовими даними (опційно): `npx tsx src/db/seed.ts`
3. Запустити сервер у режимі розробки: `npm run dev`
   Сервер працюватиме на `http://localhost:3000`.
   Файл бази даних автоматично створюється за шляхом `./data/app.db`.

## Схема Бази Даних

База даних складається з трьох пов'язаних таблиць.

1. **Users** (Користувачі)
   - `id` INTEGER PRIMARY KEY
   - `name` TEXT NOT NULL
   - `email` TEXT NOT NULL UNIQUE (Обмеження: не можна створити двох юзерів з однаковим email)
   - `date` TEXT NOT NULL

2. **Posts** (Оголошення)
   - `id` INTEGER PRIMARY KEY
   - `title`, `category`, `content`, `date` TEXT NOT NULL
   - `authorId` INTEGER NOT NULL (Зовнішній ключ -> Users.id. `ON DELETE CASCADE`)

3. **Comments** (Коментарі)
   - `id` INTEGER PRIMARY KEY
   - `text`, `date` TEXT NOT NULL
   - `postId` INTEGER NOT NULL (Зовнішній ключ -> Posts.id. `ON DELETE CASCADE`)
   - `authorId` INTEGER NOT NULL (Зовнішній ключ -> Users.id. `ON DELETE RESTRICT`)

Додано індекс `idx_posts_category` на таблицю `Posts` для пришвидшення фільтрації за категоріями.

## Приклади API Запитів

Отримати статистику (агрегація COUNT) категорій:
`curl http://localhost:3000/api/v1/posts/stats`

Отримати пости (з фільтрацією, пагінацією та сортуванням БД):
`curl "http://localhost:3000/api/v1/posts?category=Електроніка&limit=5&dateSort=desc"`

## Вразливість SQL Injection (Демонстрація)

Ендпойнт `GET /api/v1/posts` навмисно залишено вразливим до SQL-ін'єкцій через параметр `search` (для демонстрації в рамках ЛР №3).
У репозиторії запит формується через конкатенацію: `LIKE '%${options.search}%'`.

**Приклад злому:**
Якщо відправити запит: `curl "http://localhost:3000/api/v1/posts?search=' OR 1=1 --"`
Запит до БД перетвориться на: `WHERE p.title LIKE '%' OR 1=1 --%'`, що змусить базу проігнорувати всі інші фільтри (зокрема перевірку на `isDeleted = 0`) і видати абсолютно всі записи.
