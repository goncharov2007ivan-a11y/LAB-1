# Лабораторна робота №2 (Бекенд без БД)

## Як запустити проєкт

1. Відкрийте термінал і перейдіть у папку бекенду:
   
   cd backend
   
2. Встановіть залежності:
   
   npm install
   
3. Запустіть сервер у режимі розробника:
   
   npm run dev
  

## Реалізовані сутності та фічі
- **Posts** 
- **Users** 
- **Posts** 

**Додаткові REST-можливості:**
- Тришарова архітектура ( Controllers, Services, Repositories).
- Валідація вхідних даних через zod + Middleware.
- Централізована обробка помилок (Error Handler).
- Логування запитів.
- Пагінація (`limit`, `offset`), Фільтрація (`category`) та Сортування.
- М'яке видалення (Soft Delete).
- DTO для приховування внутрішніх полів (наприклад, `isDeleted`).

## Перевірки 


### 1. Перевірка валідації (Очікується 400 Bad Request)
Спроба створити пост без обов'язкових полів:

curl -i -X POST http://localhost:3000/api/v1/posts \
-H "Content-Type: application/json" \
-d "{\"content\":\"Текст без заголовка і автора\"}"


### 2. Успішне створення поста (Очікується 201 Created)

curl -i -X POST http://localhost:3000/api/v1/posts \
-H "Content-Type: application/json" \
-d "{\"title\":\"Тестовий пост\",\"content\":\"Текст поста\",\"category\":\"Новини\",\"author\":\"Іван\"}"

### 3. Отримання списку з пагінацією та фільтрацією (Очікується 200 OK)

curl -i "http://localhost:3000/api/v1/posts?limit=2&category=Новини"


### 4. Обробка помилки "Не знайдено" (Очікується 404 Not Found)
Спроба отримати пост за неіснуючим ID:

curl -i http://localhost:3000/api/v1/posts/999999999
