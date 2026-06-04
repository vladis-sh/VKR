import {
  ContentEntryType,
  ContentOrigin,
  Prisma,
  PrismaClient,
  KnowledgeLevel,
  QuestionSource,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LIVE_CODING_TASKS } from './legacy-content/liveCoding';
import { ROADMAPS } from './legacy-content/roadmap';
import { TEST_CATALOG_THEMES } from './legacy-content/testCatalog';

const prisma = new PrismaClient();

async function seedContentEntry(
  type: ContentEntryType,
  slug: string,
  title: string,
  payload: Prisma.InputJsonValue,
) {
  await prisma.contentEntry.upsert({
    where: {
      type_slug: {
        type,
        slug,
      },
    },
    update: {
      title,
      payload,
      origin: ContentOrigin.seed,
      isPublished: true,
      deletedAt: null,
    },
    create: {
      type,
      slug,
      title,
      payload,
      origin: ContentOrigin.seed,
      isPublished: true,
    },
  });
}

async function main() {
  console.log('Starting seed...');

  // Create demo users
  const passwordHash = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { role: UserRole.admin, emailVerified: true },
    create: {
      email: 'admin@example.com',
      passwordHash,
      fullName: 'Администратор',
      knowledgeLevel: KnowledgeLevel.senior,
      isProfileComplete: true,
      emailVerified: true,
      role: UserRole.admin,
    },
  });
  console.log('Admin user:', adminUser.email);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: { emailVerified: true },
    create: {
      email: 'demo@example.com',
      passwordHash,
      fullName: 'Демо Пользователь',
      knowledgeLevel: KnowledgeLevel.middle,
      isProfileComplete: true,
      emailVerified: true,
    },
  });

  const juniorUser = await prisma.user.upsert({
    where: { email: 'junior@example.com' },
    update: { emailVerified: true },
    create: {
      email: 'junior@example.com',
      passwordHash,
      fullName: 'Алексей Новиков',
      knowledgeLevel: KnowledgeLevel.junior,
      isProfileComplete: true,
      emailVerified: true,
    },
  });

  const seniorUser = await prisma.user.upsert({
    where: { email: 'senior@example.com' },
    update: { emailVerified: true },
    create: {
      email: 'senior@example.com',
      passwordHash,
      fullName: 'Мария Петрова',
      knowledgeLevel: KnowledgeLevel.senior,
      isProfileComplete: true,
      emailVerified: true,
    },
  });

  console.log('Users created:', demoUser.id, juniorUser.id, seniorUser.id);

  // ========================
  // MATERIALS
  // ========================
  const materials = await Promise.all([
    prisma.material.upsert({
      where: { id: 'mat-html5' },
      update: {},
      create: {
        id: 'mat-html5',
        title: 'Основы HTML5 и семантическая верстка',
        shortDescription:
          'Полное руководство по семантическим элементам HTML5, доступности и лучшим практикам верстки',
        level: KnowledgeLevel.junior,
        tags: ['HTML', 'HTML5', 'семантика', 'доступность'],
        content: `# Основы HTML5 и семантическая верстка

## Что такое семантический HTML?

Семантический HTML — это использование HTML-элементов по их назначению, а не только для визуального отображения. Семантические элементы чётко описывают своё содержимое как браузеру, так и разработчику.

## Основные семантические элементы HTML5

### Структурные элементы

**\`<header>\`** — шапка страницы или секции. Содержит навигацию, логотип, заголовки.
\`\`\`html
<header>
  <nav>
    <ul>
      <li><a href="/">Главная</a></li>
      <li><a href="/about">О нас</a></li>
    </ul>
  </nav>
</header>
\`\`\`

**\`<nav>\`** — блок навигации. Используется для основных навигационных ссылок.

**\`<main>\`** — основное содержимое страницы. На странице должен быть только один \`<main>\`.

**\`<article>\`** — самостоятельный, независимый контент: статья, пост в блоге, комментарий.

**\`<section>\`** — тематический раздел содержимого. Обычно имеет заголовок.

**\`<aside>\`** — боковой контент, связанный с основным: сайдбар, реклама, дополнительная информация.

**\`<footer>\`** — подвал страницы или секции. Содержит копирайт, ссылки, контакты.

### Текстовые элементы

**\`<h1>\`–\`<h6>\`** — заголовки иерархии. \`<h1>\` — главный заголовок страницы, должен быть один.

**\`<p>\`** — параграф текста.

**\`<strong>\`** — важный текст (семантически важный, отображается жирным).

**\`<em>\`** — акцент/выделение (семантически выделенный, отображается курсивом).

**\`<time>\`** — дата и время.
\`\`\`html
<time datetime="2024-03-15">15 марта 2024</time>
\`\`\`

**\`<address>\`** — контактная информация автора или владельца.

**\`<figure>\`** и **\`<figcaption>\`** — изображение с подписью.
\`\`\`html
<figure>
  <img src="diagram.png" alt="Схема архитектуры">
  <figcaption>Рис. 1. Схема архитектуры приложения</figcaption>
</figure>
\`\`\`

## Почему важна семантика?

### 1. Доступность (Accessibility)
Скринридеры и вспомогательные технологии используют семантику для навигации по странице. Правильная разметка позволяет незрячим пользователям понять структуру страницы.

### 2. SEO
Поисковые системы лучше индексируют семантически правильные страницы. Google понимает важность контента внутри \`<article>\`, \`<h1>\` и т.д.

### 3. Поддерживаемость
Код становится самодокументируемым — другой разработчик сразу понимает структуру страницы.

## Практический пример: Структура страницы блога

\`\`\`html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Мой блог</title>
</head>
<body>
  <header>
    <h1>Мой блог о программировании</h1>
    <nav aria-label="Основная навигация">
      <ul>
        <li><a href="/">Главная</a></li>
        <li><a href="/articles">Статьи</a></li>
        <li><a href="/about">Обо мне</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>Введение в React Hooks</h2>
        <time datetime="2024-03-15">15 марта 2024</time>
        <address>Автор: <a href="/author">Иван Иванов</a></address>
      </header>

      <p>React Hooks позволяют использовать состояние и другие возможности React...</p>

      <section>
        <h3>useState</h3>
        <p>Хук useState позволяет добавить локальное состояние в функциональный компонент.</p>
      </section>

      <footer>
        <p>Теги: React, JavaScript, Frontend</p>
      </footer>
    </article>
  </main>

  <aside>
    <h2>Популярные статьи</h2>
    <ul>
      <li><a href="/articles/1">Основы TypeScript</a></li>
    </ul>
  </aside>

  <footer>
    <p>&copy; 2024 Мой блог. Все права защищены.</p>
  </footer>
</body>
</html>
\`\`\`

## Атрибуты доступности (ARIA)

Когда семантики HTML недостаточно, используйте ARIA-атрибуты:

- **\`aria-label\`** — текстовая метка для элемента
- **\`aria-labelledby\`** — ссылка на элемент, содержащий метку
- **\`aria-describedby\`** — ссылка на элемент с описанием
- **\`role\`** — явное указание роли элемента
- **\`aria-hidden\`** — скрытие декоративных элементов от скринридеров

## Новые элементы HTML5

- **\`<details>\`** и **\`<summary>\`** — раскрываемый контент
- **\`<dialog>\`** — модальные окна
- **\`<progress>\`** — индикатор прогресса
- **\`<meter>\`** — измерение в известном диапазоне
- **\`<datalist>\`** — список подсказок для input

## Итог

Семантическая верстка — это не просто правило хорошего тона, это основа доступного, SEO-оптимизированного и поддерживаемого кода. Всегда выбирайте элемент по его смыслу, а не по внешнему виду.`,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-css-grid' },
      update: {},
      create: {
        id: 'mat-css-grid',
        title: 'CSS Grid и Flexbox: полное руководство',
        shortDescription: 'Сравнение Grid и Flexbox, когда что использовать, практические примеры',
        level: KnowledgeLevel.junior,
        tags: ['CSS', 'Grid', 'Flexbox', 'верстка', 'layout'],
        content: `# CSS Grid и Flexbox: полное руководство

## Flexbox — одномерные раскладки

Flexbox (Flexible Box Layout) предназначен для раскладки элементов **в одном направлении** — строке или столбце.

### Основные свойства контейнера

\`\`\`css
.container {
  display: flex;
  flex-direction: row | column | row-reverse | column-reverse;
  flex-wrap: nowrap | wrap | wrap-reverse;
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
  align-items: stretch | flex-start | flex-end | center | baseline;
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
  gap: 16px; /* расстояние между элементами */
}
\`\`\`

### Основные свойства элементов

\`\`\`css
.item {
  flex-grow: 0;   /* насколько элемент может расти */
  flex-shrink: 1; /* насколько элемент может сжиматься */
  flex-basis: auto; /* начальный размер элемента */
  flex: 1; /* сокращение: grow shrink basis */
  order: 0; /* порядок отображения */
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
\`\`\`

### Практический пример: навигация

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
}

.navbar-logo { flex-shrink: 0; }
.navbar-links { display: flex; gap: 24px; }
.navbar-actions { display: flex; gap: 8px; }
\`\`\`

## CSS Grid — двумерные раскладки

CSS Grid предназначен для раскладки элементов **в двух направлениях** одновременно — по строкам и столбцам.

### Основные свойства контейнера

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr 1fr; /* явные столбцы */
  grid-template-rows: auto 1fr auto;     /* явные строки */
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  gap: 16px;
  column-gap: 24px;
  row-gap: 16px;
}
\`\`\`

### Единица fr и функция repeat()

\`\`\`css
.grid {
  /* 3 равных столбца */
  grid-template-columns: repeat(3, 1fr);

  /* Адаптивная сетка: минимум 250px, максимум 1fr */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

  /* 12-колоночная сетка */
  grid-template-columns: repeat(12, 1fr);
}
\`\`\`

### Размещение элементов

\`\`\`css
.item {
  /* По номерам линий */
  grid-column: 1 / 3; /* от линии 1 до линии 3 */
  grid-row: 1 / 2;

  /* Сокращённая запись */
  grid-area: 2 / 1 / 4 / 3; /* row-start / col-start / row-end / col-end */

  /* По именованным областям */
  grid-area: header;
}
\`\`\`

### Практический пример: layout страницы

\`\`\`css
.page-layout {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: 64px 1fr 80px;
  min-height: 100vh;
}

@media (min-width: 768px) {
  .page-layout {
    grid-template-areas:
      "header header"
      "sidebar main"
      "footer footer";
    grid-template-columns: 240px 1fr;
    grid-template-rows: 64px 1fr 80px;
  }
}

.page-header { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-main { grid-area: main; }
.page-footer { grid-area: footer; }
\`\`\`

## Когда использовать Grid, а когда Flexbox?

| Критерий | Flexbox | Grid |
|----------|---------|------|
| Направление | 1D (строка или столбец) | 2D (строки и столбцы) |
| Управление | От содержимого | От контейнера |
| Использование | Компоненты | Макеты страниц |
| Выравнивание | По одной оси | По обеим осям |

**Используйте Flexbox для:**
- Навигационных панелей
- Кнопок с иконками
- Карточек в ряд
- Центрирования элемента

**Используйте Grid для:**
- Макетов страниц
- Сложных двумерных сеток
- Перекрывающихся элементов
- Адаптивных галерей

## Совместное использование

Grid и Flexbox отлично работают вместе:

\`\`\`css
/* Grid для общего макета */
.page {
  display: grid;
  grid-template-columns: 1fr 3fr;
}

/* Flexbox для элементов внутри grid-ячеек */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1; /* Растягивается, чтобы кнопка была внизу */
}
\`\`\`

## Современные возможности

### Subgrid
\`\`\`css
.parent {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.child {
  grid-column: span 2;
  display: grid;
  grid-template-columns: subgrid; /* наследует колонки родителя */
}
\`\`\`

### Container Queries
\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
\`\`\``,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-js-closures' },
      update: {},
      create: {
        id: 'mat-js-closures',
        title: 'JavaScript: замыкания и область видимости',
        shortDescription:
          'Глубокое понимание замыканий, области видимости, hoisting и практическое применение',
        level: KnowledgeLevel.middle,
        tags: ['JavaScript', 'замыкания', 'scope', 'hoisting', 'ES6'],
        content: `# JavaScript: замыкания и область видимости

## Область видимости (Scope)

Область видимости определяет, где в коде доступны переменные.

### Глобальная область видимости
Переменные, объявленные вне функций и блоков, доступны везде.

### Функциональная область видимости
\`\`\`javascript
function outer() {
  const x = 10; // доступна только внутри outer

  function inner() {
    console.log(x); // 10 — inner видит x из outer
  }

  inner();
}
// console.log(x); // ReferenceError: x is not defined
\`\`\`

### Блочная область видимости (ES6+)
\`\`\`javascript
{
  let blockVar = 'block';
  const blockConst = 'const';
  var funcVar = 'function'; // var игнорирует блок!
}
// console.log(blockVar); // ReferenceError
// console.log(blockConst); // ReferenceError
console.log(funcVar); // 'function' — var «всплывает» до функции
\`\`\`

## Hoisting (Поднятие)

JavaScript «поднимает» объявления переменных и функций в начало их области видимости.

### Hoisting переменных
\`\`\`javascript
console.log(a); // undefined (не ошибка! var поднялся)
var a = 5;
console.log(a); // 5

// console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;
\`\`\`

### Hoisting функций
\`\`\`javascript
// Function Declaration — полностью поднимается
sayHello(); // 'Hello!' — работает до объявления!
function sayHello() {
  console.log('Hello!');
}

// Function Expression — только объявление переменной поднимается
// greet(); // TypeError: greet is not a function
const greet = function() {
  console.log('Hi!');
};
\`\`\`

## Замыкания (Closures)

Замыкание — это функция, которая «помнит» своё лексическое окружение, даже когда выполняется за его пределами.

\`\`\`javascript
function makeCounter(initialValue = 0) {
  let count = initialValue; // эта переменная «замкнута» в возвращаемых функциях

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; },
    reset() { count = initialValue; }
  };
}

const counter = makeCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.getCount());  // 11
\`\`\`

### Классический пример с циклом

\`\`\`javascript
// Проблема с var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3 (!)
}

// Решение 1: let (блочная область видимости)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// Решение 2: IIFE (Immediately Invoked Function Expression)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100); // 0, 1, 2
  })(i);
}
\`\`\`

### Практическое применение замыканий

**1. Приватные данные и инкапсуляция:**
\`\`\`javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // приватная переменная

  return {
    deposit(amount) {
      if (amount > 0) balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      return balance;
    },
    getBalance() { return balance; }
  };
}

const account = createBankAccount(1000);
account.deposit(500);   // 1500
account.withdraw(200);  // 1300
// account.balance — undefined (нет прямого доступа)
\`\`\`

**2. Мемоизация:**
\`\`\`javascript
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalculation = memoize((n) => {
  console.log('Computing...');
  return n * n;
});

expensiveCalculation(5); // 'Computing...' → 25
expensiveCalculation(5); // 25 (из кэша)
\`\`\`

**3. Частичное применение (Partial Application):**
\`\`\`javascript
function multiply(a, b) {
  return a * b;
}

function partial(fn, ...args) {
  return function(...remainingArgs) {
    return fn(...args, ...remainingArgs);
  };
}

const double = partial(multiply, 2);
const triple = partial(multiply, 3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
\`\`\`

## Цепочка областей видимости (Scope Chain)

При поиске переменной JavaScript ищет её сначала в текущей области, затем во внешних — вплоть до глобальной.

\`\`\`javascript
const globalVar = 'global';

function outer() {
  const outerVar = 'outer';

  function middle() {
    const middleVar = 'middle';

    function inner() {
      const innerVar = 'inner';

      // Имеет доступ ко всем переменным выше по цепочке
      console.log(innerVar);   // 'inner'
      console.log(middleVar);  // 'middle'
      console.log(outerVar);   // 'outer'
      console.log(globalVar);  // 'global'
    }

    inner();
  }

  middle();
}
\`\`\`

## Ловушки и подводные камни

### Замыкание в обработчиках событий
\`\`\`javascript
function setupButtons() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      console.log(\`Clicked button \${index}\`); // Правильно!
    });
  });
}
\`\`\`

### Утечки памяти через замыкания
\`\`\`javascript
// Потенциальная утечка памяти
function createHeavyObject() {
  const largeData = new Array(1000000).fill('data');

  return function() {
    // largeData никогда не освободится, пока жива эта функция
    return largeData[0];
  };
}

// Лучше:
function createHeavyObject() {
  const largeData = new Array(1000000).fill('data');
  const firstItem = largeData[0]; // Сохраняем только нужное

  return function() {
    return firstItem; // largeData может быть освобождён
  };
}
\`\`\``,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-ts-generics' },
      update: {},
      create: {
        id: 'mat-ts-generics',
        title: 'TypeScript: дженерики и продвинутые типы',
        shortDescription:
          'Дженерики, условные типы, mapped types, utility types и продвинутые возможности TypeScript',
        level: KnowledgeLevel.middle,
        tags: ['TypeScript', 'дженерики', 'generics', 'типы'],
        content: `# TypeScript: дженерики и продвинутые типы

## Дженерики (Generics)

Дженерики позволяют создавать компоненты, работающие с различными типами данных.

### Базовый синтаксис

\`\`\`typescript
// Без дженериков — теряем типизацию
function identity(arg: any): any {
  return arg;
}

// С дженериком — сохраняем тип
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);    // number
const str = identity<string>('hi');  // string
const inferred = identity(true);     // boolean (вывод типа)
\`\`\`

### Дженерики с ограничениями (Constraints)

\`\`\`typescript
interface HasLength {
  length: number;
}

function getLength<T extends HasLength>(arg: T): number {
  return arg.length;
}

getLength('hello');     // 5
getLength([1, 2, 3]);   // 3
getLength({ length: 10 }); // 10
// getLength(42); // Error: number doesn't have length

// Несколько ограничений
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
\`\`\`

### Дженерик-классы и интерфейсы

\`\`\`typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // ...
  }
  // ...
}

// Stack с дженериком
class Stack<T> {
  private items: T[] = [];

  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  isEmpty(): boolean { return this.items.length === 0; }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
\`\`\`

## Utility Types

TypeScript предоставляет готовые утилиты для преобразования типов.

\`\`\`typescript
interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  role: 'admin' | 'user';
}

// Partial<T> — все поля опциональные
type UpdateUserDto = Partial<User>;
// { id?: string; email?: string; name?: string; ... }

// Required<T> — все поля обязательные
type RequiredUser = Required<User>;

// Pick<T, K> — выбрать только указанные поля
type UserProfile = Pick<User, 'id' | 'name' | 'email'>;
// { id: string; name: string; email: string; }

// Omit<T, K> — исключить указанные поля
type CreateUserDto = Omit<User, 'id'>;
// { email: string; name: string; age: number; role: ... }

// Readonly<T> — все поля только для чтения
type ReadonlyUser = Readonly<User>;

// Record<K, V> — объект с ключами K и значениями V
type UsersByRole = Record<User['role'], User[]>;
// { admin: User[]; user: User[]; }

// Exclude<T, U> — исключить из Union
type NonAdmin = Exclude<User['role'], 'admin'>; // 'user'

// Extract<T, U> — извлечь из Union
type AdminRole = Extract<User['role'], 'admin'>; // 'admin'

// NonNullable<T> — исключить null и undefined
type NonNullableString = NonNullable<string | null | undefined>; // string

// ReturnType<T> — тип возвращаемого значения функции
function getUser(): User { /* ... */ }
type GetUserReturn = ReturnType<typeof getUser>; // User

// Parameters<T> — типы параметров функции
type GetUserParams = Parameters<typeof getUser>; // []
\`\`\`

## Условные типы (Conditional Types)

\`\`\`typescript
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>;  // 'yes'
type B = IsString<number>;  // 'no'

// Распределение по Union
type IsStringInUnion<T> = T extends string ? true : false;
type C = IsStringInUnion<string | number>;  // boolean (true | false)

// infer — вывод типа внутри условного типа
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

type D = UnpackPromise<Promise<string>>;  // string
type E = UnpackPromise<number>;           // number

// Получить тип элемента массива
type ArrayElement<T> = T extends (infer U)[] ? U : never;
type F = ArrayElement<string[]>;  // string

// Глубокий Readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
\`\`\`

## Mapped Types

\`\`\`typescript
// Создание типа на основе другого
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};

// С переименованием ключей (as)
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type UserGetters = Getters<Pick<User, 'name' | 'email'>>;
// { getName: () => string; getEmail: () => string; }

// Фильтрация полей
type OnlyStringFields<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
\`\`\`

## Template Literal Types

\`\`\`typescript
type Direction = 'top' | 'right' | 'bottom' | 'left';
type Margin = \`margin-\${Direction}\`;
// 'margin-top' | 'margin-right' | 'margin-bottom' | 'margin-left'

type EventNames = 'click' | 'focus' | 'blur';
type EventHandlers = \`on\${Capitalize<EventNames>}\`;
// 'onClick' | 'onFocus' | 'onBlur'
\`\`\`

## Discriminated Unions

\`\`\`typescript
type LoadingState = { status: 'loading' };
type SuccessState<T> = { status: 'success'; data: T };
type ErrorState = { status: 'error'; error: string };

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function handleState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data;  // TypeScript знает, что это SuccessState<T>
    case 'error':
      return state.error; // TypeScript знает, что это ErrorState
  }
}
\`\`\``,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-react-hooks' },
      update: {},
      create: {
        id: 'mat-react-hooks',
        title: 'React: хуки и управление состоянием',
        shortDescription:
          'Полное руководство по React хукам: useState, useEffect, useCallback, useMemo, useRef, кастомные хуки',
        level: KnowledgeLevel.middle,
        tags: ['React', 'Hooks', 'useState', 'useEffect', 'useMemo'],
        content: `# React: хуки и управление состоянием

## useState — локальное состояние

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // Функциональное обновление — безопасно при множественных обновлениях
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// Сложное состояние
function Form() {
  const [form, setForm] = useState({ name: '', email: '', age: 0 });

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form>
      <input value={form.name} onChange={handleChange('name')} />
      <input value={form.email} onChange={handleChange('email')} />
    </form>
  );
}
\`\`\`

## useEffect — побочные эффекты

\`\`\`jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Эффект выполняется при монтировании и при изменении userId
    let cancelled = false; // Флаг отмены для предотвращения race conditions

    setLoading(true);

    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) { // Не обновляем состояние, если компонент размонтирован
          setUser(data);
          setLoading(false);
        }
      });

    // Функция очистки — вызывается при размонтировании или перед следующим эффектом
    return () => {
      cancelled = true;
    };
  }, [userId]); // Зависимости — массив значений, при изменении которых запускается эффект

  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}

// useEffect с подпиской
function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); // Очистка!
    };
  }, []); // Пустой массив — только при монтировании/размонтировании

  return <div>{size.width} x {size.height}</div>;
}
\`\`\`

## useCallback и useMemo — оптимизация

\`\`\`jsx
import { useState, useCallback, useMemo, memo } from 'react';

// memo — мемоизация компонента
const ExpensiveChild = memo(({ onClick, items }) => {
  console.log('ExpensiveChild rendered');
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onClick(item.id)}>{item.name}</li>
      ))}
    </ul>
  );
});

function Parent() {
  const [count, setCount] = useState(0);
  const [items] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ]);

  // Без useCallback: новая функция при каждом рендере → ExpensiveChild перерисовывается
  // С useCallback: функция мемоизируется → ExpensiveChild НЕ перерисовывается
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []); // Зависимости пустые — функция не меняется

  // useMemo — мемоизация вычислений
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.id, 0);
  }, [items]); // Пересчитывается только при изменении items

  return (
    <div>
      <p>Count: {count}, Sum: {expensiveValue}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <ExpensiveChild onClick={handleClick} items={items} />
    </div>
  );
}
\`\`\`

## useRef — ссылки и мутабельные значения

\`\`\`jsx
import { useRef, useEffect } from 'react';

function TextInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // Фокус при монтировании
  }, []);

  return <input ref={inputRef} placeholder="Auto-focused" />;
}

// useRef для хранения предыдущего значения
function usePrevious(value) {
  const ref = useRef(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// useRef для хранения значений без ре-рендера
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
\`\`\`

## useReducer — сложное состояние

\`\`\`jsx
import { useReducer } from 'react';

const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + state.step };
    case 'DECREMENT':
      return { ...state, count: state.count - state.step };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'RESET':
      return initialState;
    default:
      throw new Error(\`Unknown action: \${action.type}\`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}, Step: {state.step}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <input
        type="number"
        value={state.step}
        onChange={(e) => dispatch({ type: 'SET_STEP', payload: +e.target.value })}
      />
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
\`\`\`

## Кастомные хуки

\`\`\`jsx
// useFetch — хук для загрузки данных
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json();
      })
      .then(data => { if (!cancelled) setData(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// useLocalStorage — синхронизация с localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [value, setStoredValue];
}

// useDebounce — задержка обновления значения
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
\`\`\``,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-react-patterns' },
      update: {},
      create: {
        id: 'mat-react-patterns',
        title: 'React: паттерны и архитектура компонентов',
        shortDescription:
          'Compound Components, Render Props, HOC, Context, паттерны для масштабируемых React приложений',
        level: KnowledgeLevel.senior,
        tags: ['React', 'паттерны', 'архитектура', 'HOC', 'Compound Components'],
        content: `# React: паттерны и архитектура компонентов

## Compound Components (Составные компоненты)

Паттерн для создания компонентов с гибким API, скрывая внутреннее состояние через Context.

\`\`\`jsx
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }) {
  return <div className="tabs-list" role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      className={\`tab \${activeTab === id ? 'active' : ''}\`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === id ? <div role="tabpanel">{children}</div> : null;
};

// Использование
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab id="profile">Профиль</Tabs.Tab>
    <Tabs.Tab id="settings">Настройки</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="profile"><ProfileForm /></Tabs.Panel>
  <Tabs.Panel id="settings"><SettingsForm /></Tabs.Panel>
</Tabs>
\`\`\`

## Render Props

Паттерн передачи функции-рендера через props для гибкого переиспользования логики.

\`\`\`jsx
// DataProvider с render prop
function DataProvider({ url, render }) {
  const { data, loading, error } = useFetch(url);
  return render({ data, loading, error });
}

// children as function
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '300px' }}>
      {children(position)}
    </div>
  );
}

// Использование
<MouseTracker>
  {({ x, y }) => (
    <p>Mouse: {x}, {y}</p>
  )}
</MouseTracker>
\`\`\`

## Higher Order Components (HOC)

HOC — функция, принимающая компонент и возвращающая новый компонент с дополнительными возможностями.

\`\`\`jsx
// withAuth HOC
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" />;

    return <WrappedComponent {...props} user={user} />;
  };
}

// withLogger HOC
function withLogger(WrappedComponent) {
  return function LoggedComponent(props) {
    useEffect(() => {
      console.log(\`\${WrappedComponent.name} mounted\`, props);
      return () => console.log(\`\${WrappedComponent.name} unmounted\`);
    }, []);

    return <WrappedComponent {...props} />;
  };
}

// Композиция HOC
const EnhancedDashboard = withLogger(withAuth(Dashboard));
\`\`\`

## Context + useReducer — глобальное состояние

\`\`\`jsx
const AppContext = createContext(null);

const initialState = {
  user: null,
  theme: 'light',
  notifications: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
\`\`\`

## State Machine Pattern

\`\`\`jsx
const states = {
  idle: { on: { FETCH: 'loading' } },
  loading: { on: { SUCCESS: 'success', ERROR: 'error' } },
  success: { on: { RESET: 'idle' } },
  error: { on: { RETRY: 'loading', RESET: 'idle' } },
};

function useMachine(initialState) {
  const [current, setCurrent] = useState(initialState);

  const send = useCallback((event) => {
    setCurrent(prev => {
      const nextState = states[prev]?.on[event];
      return nextState ?? prev;
    });
  }, []);

  return [current, send];
}

function FetchButton({ url }) {
  const [state, send] = useMachine('idle');
  const [data, setData] = useState(null);

  const fetch = async () => {
    send('FETCH');
    try {
      const res = await fetch(url);
      setData(await res.json());
      send('SUCCESS');
    } catch {
      send('ERROR');
    }
  };

  return (
    <div>
      {state === 'idle' && <button onClick={fetch}>Загрузить</button>}
      {state === 'loading' && <Spinner />}
      {state === 'success' && <DataView data={data} />}
      {state === 'error' && <button onClick={fetch}>Повторить</button>}
    </div>
  );
}
\`\`\``,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-fsd' },
      update: {},
      create: {
        id: 'mat-fsd',
        title: 'Frontend Architecture: Feature Sliced Design',
        shortDescription:
          'Методология FSD для масштабируемых frontend приложений: слои, слайсы, сегменты',
        level: KnowledgeLevel.senior,
        tags: ['архитектура', 'FSD', 'Feature Sliced Design', 'frontend'],
        content: `# Frontend Architecture: Feature Sliced Design

## Что такое Feature Sliced Design?

Feature Sliced Design (FSD) — архитектурная методология для фронтенда, направленная на создание масштабируемых, поддерживаемых и тестируемых приложений. Она определяет способ организации кода через иерархию слоёв.

## Слои (Layers)

FSD определяет 7 слоёв в порядке убывания уровня абстракции:

\`\`\`
src/
├── app/          # Инициализация приложения, провайдеры, роутер
├── pages/        # Страницы приложения
├── widgets/      # Крупные автономные блоки UI
├── features/     # Бизнес-фичи, действия пользователя
├── entities/     # Бизнес-сущности
├── shared/       # Переиспользуемый код без бизнес-логики
└── processes/    # (deprecated) Межстраничные процессы
\`\`\`

**Правило импортов:** каждый слой может импортировать только из слоёв ниже.

## Слайсы и сегменты

Каждый слой (кроме shared и app) делится на **слайсы** — модули конкретной функциональности.

Каждый слайс содержит **сегменты**:
- \`ui/\` — компоненты React
- \`model/\` — состояние (Redux слайс, Zustand store, хуки)
- \`api/\` — взаимодействие с API
- \`lib/\` — вспомогательные функции
- \`config/\` — конфигурация

\`\`\`
features/
├── auth/
│   ├── ui/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── model/
│   │   ├── auth.store.ts
│   │   └── auth.hooks.ts
│   ├── api/
│   │   └── auth.api.ts
│   └── index.ts   # Публичное API слайса
├── user-profile/
└── quiz-session/
\`\`\`

## Public API (index.ts)

Каждый слайс экспортирует только то, что нужно другим слоям через \`index.ts\`:

\`\`\`typescript
// features/auth/index.ts
export { LoginForm } from './ui/LoginForm';
export { RegisterForm } from './ui/RegisterForm';
export { useAuth } from './model/auth.hooks';
export type { AuthCredentials } from './model/auth.types';

// Внутренние детали реализации НЕ экспортируются
\`\`\`

## Пример структуры проекта

\`\`\`
src/
├── app/
│   ├── providers/
│   │   ├── RouterProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── ThemeProvider.tsx
│   ├── styles/
│   │   └── index.css
│   └── App.tsx
│
├── pages/
│   ├── home/
│   │   ├── ui/HomePage.tsx
│   │   └── index.ts
│   ├── quiz/
│   │   ├── ui/QuizPage.tsx
│   │   └── index.ts
│   └── profile/
│
├── widgets/
│   ├── header/
│   │   ├── ui/Header.tsx
│   │   └── index.ts
│   └── sidebar/
│
├── features/
│   ├── quiz-session/
│   │   ├── ui/
│   │   │   ├── QuizQuestion.tsx
│   │   │   └── QuizResults.tsx
│   │   ├── model/
│   │   │   ├── quiz.store.ts
│   │   │   └── quiz.selectors.ts
│   │   ├── api/
│   │   │   └── quiz.api.ts
│   │   └── index.ts
│   └── study-material/
│
├── entities/
│   ├── user/
│   │   ├── ui/UserAvatar.tsx
│   │   ├── model/user.types.ts
│   │   └── index.ts
│   ├── question/
│   └── material/
│
└── shared/
    ├── ui/
    │   ├── Button/
    │   ├── Input/
    │   ├── Modal/
    │   └── index.ts
    ├── api/
    │   └── http-client.ts
    ├── lib/
    │   ├── utils.ts
    │   └── format.ts
    └── config/
        └── constants.ts
\`\`\`

## Преимущества FSD

1. **Явные границы** — понятно, куда добавлять код
2. **Независимость слайсов** — можно удалить фичу, не сломав другие
3. **Масштабируемость** — легко добавлять новые фичи
4. **Онбординг** — новые разработчики быстро ориентируются
5. **Тестируемость** — чёткие зависимости упрощают моки

## Частые ошибки

- Импорт из вышестоящего слоя (нарушение правила импортов)
- Бизнес-логика в shared
- «Плоские» слайсы без сегментов
- Отсутствие public API (index.ts)`,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-nodejs-event-loop' },
      update: {},
      create: {
        id: 'mat-nodejs-event-loop',
        title: 'Node.js: event loop и асинхронность',
        shortDescription:
          'Как работает event loop в Node.js, фазы цикла событий, async/await, streams, Worker Threads',
        level: KnowledgeLevel.middle,
        tags: ['Node.js', 'event loop', 'async', 'JavaScript', 'streams'],
        content: `# Node.js: event loop и асинхронность

## Архитектура Node.js

Node.js — однопоточная среда выполнения JavaScript, основанная на движке V8 и библиотеке libuv.

**Ключевые компоненты:**
- **V8** — движок JavaScript (компиляция и выполнение JS)
- **libuv** — библиотека асинхронного ввода-вывода (event loop, thread pool)
- **Thread Pool** — пул потоков для файловых операций, DNS, crypto

## Event Loop: фазы

Event loop — бесконечный цикл, обрабатывающий события. Состоит из фаз:

\`\`\`
   ┌───────────────────────────┐
┌─>│           timers          │  setTimeout, setInterval callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  I/O callbacks отложенные до следующей итерации
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  только внутренняя использование
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  получение новых I/O событий
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  socket.on('close', ...)
   └───────────────────────────┘
\`\`\`

**Между каждой фазой:**
- Обрабатываются microtasks: Promise callbacks (\`.then\`, \`.catch\`)
- process.nextTick() — приоритет выше Promise

## Порядок выполнения

\`\`\`javascript
console.log('1: Start');

setTimeout(() => console.log('5: setTimeout 0'), 0);

setImmediate(() => console.log('6: setImmediate'));

Promise.resolve()
  .then(() => console.log('3: Promise.then'));

process.nextTick(() => console.log('2: nextTick'));

console.log('4: End');

// Вывод:
// 1: Start
// 4: End
// 2: nextTick
// 3: Promise.then
// 5: setTimeout 0
// 6: setImmediate
\`\`\`

## Async/Await и обработка ошибок

\`\`\`javascript
// Паттерн для async функций
async function fetchUserData(userId) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error(\`User \${userId} not found\`);

    const [profile, settings] = await Promise.all([
      fetchProfile(userId),
      fetchSettings(userId),
    ]);

    return { user, profile, settings };
  } catch (error) {
    logger.error('Failed to fetch user data', { userId, error });
    throw error;
  }
}

// Promise.allSettled — когда нужны все результаты, даже с ошибками
async function fetchMultipleUsers(ids) {
  const results = await Promise.allSettled(ids.map(id => fetchUser(id)));

  return results.map((result, i) => ({
    id: ids[i],
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason.message : null,
  }));
}
\`\`\`

## Streams в Node.js

Streams позволяют обрабатывать данные по частям, не загружая всё в память.

\`\`\`javascript
import { createReadStream, createWriteStream } from 'fs';
import { Transform, pipeline } from 'stream';
import { promisify } from 'util';
import { createGzip } from 'zlib';

const pipelineAsync = promisify(pipeline);

// Обработка большого файла с минимальным потреблением памяти
async function processLargeFile(inputPath, outputPath) {
  const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk.toString().toUpperCase());
    }
  });

  await pipelineAsync(
    createReadStream(inputPath),
    upperCaseTransform,
    createGzip(),
    createWriteStream(outputPath + '.gz')
  );

  console.log('Processing complete');
}

// Readable stream из массива
import { Readable } from 'stream';

async function* generateData() {
  for (let i = 0; i < 1000000; i++) {
    yield \`row_\${i}\\n\`;
  }
}

const stream = Readable.from(generateData());
stream.pipe(createWriteStream('output.txt'));
\`\`\`

## Worker Threads — многопоточность

\`\`\`javascript
// main.js
import { Worker } from 'worker_threads';

function runWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData: data });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(\`Worker stopped with exit code \${code}\`));
    });
  });
}

// worker.js
import { workerData, parentPort } from 'worker_threads';

function heavyCalculation(data) {
  // CPU-интенсивная задача не блокирует event loop главного потока
  let result = 0;
  for (let i = 0; i < data.n; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

parentPort.postMessage(heavyCalculation(workerData));
\`\`\``,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-nestjs' },
      update: {},
      create: {
        id: 'mat-nestjs',
        title: 'NestJS: модули, провайдеры и DI',
        shortDescription:
          'Архитектура NestJS: модульная система, инъекция зависимостей, провайдеры, жизненный цикл',
        level: KnowledgeLevel.middle,
        tags: ['NestJS', 'Node.js', 'DI', 'TypeScript', 'архитектура'],
        content: `# NestJS: модули, провайдеры и DI

## Архитектура NestJS

NestJS основан на трёх ключевых концепциях:
1. **Модули** — логические единицы организации кода
2. **Провайдеры** — сервисы, репозитории, фабрики
3. **Инъекция зависимостей (DI)** — управление зависимостями

## Модули

\`\`\`typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // импорт других модулей
    SharedModule,
  ],
  controllers: [UsersController],      // HTTP обработчики
  providers: [UsersService, UserRepo], // провайдеры модуля
  exports: [UsersService],             // экспорт для других модулей
})
export class UsersModule {}

// Глобальный модуль — доступен везде без импорта
@Global()
@Module({
  providers: [ConfigService, LoggerService],
  exports: [ConfigService, LoggerService],
})
export class GlobalModule {}
\`\`\`

## Провайдеры и DI

\`\`\`typescript
// Стандартный провайдер
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(\`User \${id} not found\`);
    return user;
  }
}

// Custom providers
@Module({
  providers: [
    // useClass — стандартный провайдер
    { provide: UsersService, useClass: UsersService },

    // useValue — конкретное значение
    { provide: 'CONFIG', useValue: { apiUrl: 'http://api.example.com' } },

    // useFactory — фабрика с зависимостями
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        return createConnection(configService.get('DATABASE_URL'));
      },
      inject: [ConfigService],
    },

    // useExisting — алиас для существующего провайдера
    { provide: 'Logger', useExisting: LoggerService },
  ],
})
export class AppModule {}
\`\`\`

## Жизненный цикл

\`\`\`typescript
@Injectable()
export class AppService implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy {
  async onModuleInit() {
    // Вызывается после инициализации модуля
    await this.connect();
    console.log('Service initialized');
  }

  async onApplicationBootstrap() {
    // Вызывается после инициализации ВСЕХ модулей
    await this.seedDatabase();
  }

  async onModuleDestroy() {
    // Вызывается при завершении приложения (Ctrl+C, kill)
    await this.disconnect();
    console.log('Service destroyed');
  }
}
\`\`\`

## Middleware, Guards, Interceptors, Pipes

\`\`\`typescript
// Middleware — обработка до Route Handler
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(\`\${req.method} \${req.url}\`);
    next();
  }
}

// Guard — авторизация
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.roles.includes(role));
  }
}

// Interceptor — трансформация ответа
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({ success: true, data, timestamp: new Date().toISOString() }))
    );
  }
}

// Pipe — трансформация и валидация входных данных
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) throw new BadRequestException('Validation failed');
    return val;
  }
}
\`\`\`

## Exception Filters

\`\`\`typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      success: false,
      error: {
        code: status,
        message: typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
\`\`\``,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-postgresql' },
      update: {},
      create: {
        id: 'mat-postgresql',
        title: 'PostgreSQL: индексы и оптимизация запросов',
        shortDescription:
          'B-tree, GIN, GiST индексы, EXPLAIN ANALYZE, партиционирование, оптимизация медленных запросов',
        level: KnowledgeLevel.senior,
        tags: ['PostgreSQL', 'SQL', 'индексы', 'оптимизация', 'базы данных'],
        content: `# PostgreSQL: индексы и оптимизация запросов

## Типы индексов

### B-tree (по умолчанию)
Подходит для равенства, диапазонных запросов, сортировки.

\`\`\`sql
-- Простой индекс
CREATE INDEX idx_users_email ON users(email);

-- Составной индекс (порядок важен!)
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Частичный индекс — только для подмножества строк
CREATE INDEX idx_users_active ON users(email) WHERE is_active = true;

-- Уникальный индекс
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);
\`\`\`

### GIN (Generalized Inverted Index)
Подходит для массивов, JSONB, полнотекстового поиска.

\`\`\`sql
-- Индекс для массивов
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
SELECT * FROM articles WHERE tags @> ARRAY['javascript'];

-- Индекс для JSONB
CREATE INDEX idx_users_metadata ON users USING GIN(metadata);
SELECT * FROM users WHERE metadata @> '{"role": "admin"}';

-- Полнотекстовый поиск
CREATE INDEX idx_articles_search ON articles USING GIN(
  to_tsvector('russian', title || ' ' || content)
);
SELECT * FROM articles
WHERE to_tsvector('russian', title || ' ' || content) @@ to_tsquery('russian', 'javascript');
\`\`\`

## EXPLAIN ANALYZE

\`\`\`sql
EXPLAIN ANALYZE
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.id
ORDER BY order_count DESC
LIMIT 10;

-- Типичный вывод и что искать:
-- Seq Scan — полное сканирование таблицы (плохо для больших таблиц)
-- Index Scan — использование индекса (хорошо)
-- Hash Join — соединение через хеш-таблицу
-- Nested Loop — вложенный цикл (хорошо для малых наборов)
-- cost=0.00..15234.56 — примерная стоимость
-- rows=1000 — ожидаемое количество строк
-- actual time=0.123..45.678 — реальное время
\`\`\`

## Оптимизация запросов

### N+1 проблема
\`\`\`sql
-- Плохо (N+1):
SELECT * FROM users;  -- потом для каждого:
SELECT * FROM orders WHERE user_id = $1;

-- Хорошо (JOIN):
SELECT u.*, json_agg(o.*) as orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id;

-- Или с подзапросом:
SELECT u.*,
  (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
FROM users u;
\`\`\`

### CTE (Common Table Expressions)
\`\`\`sql
WITH active_users AS (
  SELECT id FROM users WHERE last_login > NOW() - INTERVAL '7 days'
),
user_stats AS (
  SELECT user_id, COUNT(*) as test_count, AVG(score) as avg_score
  FROM test_sessions
  WHERE user_id IN (SELECT id FROM active_users)
  GROUP BY user_id
)
SELECT u.full_name, us.test_count, us.avg_score
FROM users u
JOIN user_stats us ON us.user_id = u.id
ORDER BY us.avg_score DESC;

-- Рекурсивный CTE — для деревьев и графов
WITH RECURSIVE category_tree AS (
  SELECT id, name, parent_id, 0 AS level
  FROM categories WHERE parent_id IS NULL

  UNION ALL

  SELECT c.id, c.name, c.parent_id, ct.level + 1
  FROM categories c
  JOIN category_tree ct ON ct.id = c.parent_id
)
SELECT * FROM category_tree ORDER BY level, name;
\`\`\`

## Партиционирование

\`\`\`sql
-- Партиционирование по диапазону дат
CREATE TABLE events (
  id BIGSERIAL,
  user_id INT,
  event_type VARCHAR(50),
  created_at TIMESTAMP
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2024_q1 PARTITION OF events
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE events_2024_q2 PARTITION OF events
  FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- PostgreSQL автоматически направит запрос в нужную партицию
SELECT * FROM events WHERE created_at BETWEEN '2024-01-01' AND '2024-03-31';
\`\`\`

## Настройка PostgreSQL (postgresql.conf)

\`\`\`ini
# Память
shared_buffers = 256MB          # 25% ОЗУ
effective_cache_size = 1GB      # 75% ОЗУ
work_mem = 16MB                 # для сортировок и хешей
maintenance_work_mem = 256MB    # для VACUUM, CREATE INDEX

# Производительность
max_connections = 100           # ограничьте и используйте пул
random_page_cost = 1.1          # для SSD (по умолчанию 4.0 для HDD)
effective_io_concurrency = 200  # для SSD

# Логирование медленных запросов
log_min_duration_statement = 1000  # логировать запросы > 1 секунды
log_slow_autovacuum = on
\`\`\``,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-rest-api' },
      update: {},
      create: {
        id: 'mat-rest-api',
        title: 'REST API: дизайн и best practices',
        shortDescription:
          'Принципы REST, проектирование эндпоинтов, версионирование, обработка ошибок, документация',
        level: KnowledgeLevel.middle,
        tags: ['REST', 'API', 'HTTP', 'дизайн', 'backend'],
        content: `# REST API: дизайн и best practices

## Принципы REST

1. **Uniform Interface** — единообразный интерфейс
2. **Stateless** — без состояния на сервере
3. **Cacheable** — кэшируемость
4. **Client-Server** — разделение клиента и сервера
5. **Layered System** — многоуровневость
6. **Code on Demand** (опционально)

## Именование ресурсов

\`\`\`
# Существительные, не глаголы
GET /users          # ✓ список пользователей
GET /getUsers       # ✗

# Множественное число
GET /users          # ✓
GET /user           # ✗

# Вложенные ресурсы
GET /users/{id}/orders         # заказы конкретного пользователя
POST /users/{id}/orders        # создать заказ для пользователя
GET /users/{id}/orders/{ordId} # конкретный заказ

# Действия (если нельзя выразить HTTP методом)
POST /users/{id}/activate      # активировать пользователя
POST /orders/{id}/cancel       # отменить заказ
POST /auth/refresh             # обновить токен
\`\`\`

## HTTP методы и коды ответа

\`\`\`
GET    /resources     → 200 OK (список)
GET    /resources/:id → 200 OK, 404 Not Found
POST   /resources     → 201 Created
PUT    /resources/:id → 200 OK (полное обновление)
PATCH  /resources/:id → 200 OK (частичное обновление)
DELETE /resources/:id → 204 No Content, 404 Not Found

# Коды ошибок
400 Bad Request       — неверные данные запроса
401 Unauthorized      — не аутентифицирован
403 Forbidden         — нет прав
404 Not Found         — ресурс не найден
409 Conflict          — конфликт (например, email занят)
422 Unprocessable     — ошибки валидации
429 Too Many Requests — превышен лимит запросов
500 Internal Server Error — ошибка сервера
\`\`\`

## Структура ответа

\`\`\`json
// Успешный ответ
{
  "success": true,
  "data": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "Иван"
  }
}

// Пагинация
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}

// Ошибка
{
  "success": false,
  "error": {
    "code": 422,
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "password", "message": "Password too short" }
    ]
  }
}
\`\`\`

## Версионирование API

\`\`\`
# URL versioning (наиболее распространён)
GET /api/v1/users
GET /api/v2/users

# Header versioning
Accept: application/vnd.api+json;version=1

# Query parameter
GET /api/users?version=2
\`\`\`

## Фильтрация, сортировка, пагинация

\`\`\`
# Фильтрация
GET /users?role=admin&isActive=true
GET /products?minPrice=100&maxPrice=500&category=electronics

# Сортировка
GET /users?sort=createdAt&order=desc
GET /products?sort=-price,+name  # minus = desc, plus = asc

# Пагинация
GET /users?page=2&limit=20

# Выбор полей (sparse fieldsets)
GET /users?fields=id,name,email

# Поиск
GET /users?search=Иван
\`\`\`

## Безопасность

\`\`\`typescript
// Rate limiting
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } })
@Post('/auth/login')
async login() { ... }

// CORS
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});

// Helmet (security headers)
app.use(helmet());

// Validation & sanitization
@IsEmail()
@IsNotEmpty()
email: string;
\`\`\``,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-big-o' },
      update: {},
      create: {
        id: 'mat-big-o',
        title: 'Алгоритмы: Big O нотация и сложность',
        shortDescription:
          'Временная и пространственная сложность, Big O нотация, анализ алгоритмов, примеры',
        level: KnowledgeLevel.junior,
        tags: ['алгоритмы', 'Big O', 'сложность', 'программирование'],
        content: `# Алгоритмы: Big O нотация

## Что такое Big O?

Big O — математическая нотация для описания асимптотической сложности алгоритма. Она показывает, как растёт время выполнения или потребление памяти в зависимости от размера входных данных n.

## Основные классы сложности

### O(1) — константная
\`\`\`javascript
function getFirst(arr) {
  return arr[0]; // всегда одна операция, независимо от размера массива
}

const map = new Map();
map.get('key'); // O(1) — поиск в хеш-таблице
\`\`\`

### O(log n) — логарифмическая
\`\`\`javascript
// Бинарный поиск — делим задачу пополам на каждом шаге
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}
// n=1000 → ~10 операций
// n=1000000 → ~20 операций
\`\`\`

### O(n) — линейная
\`\`\`javascript
function findMax(arr) {
  let max = arr[0];
  for (const item of arr) { // n итераций
    if (item > max) max = item;
  }
  return max;
}
\`\`\`

### O(n log n) — квазилинейная
\`\`\`javascript
// Merge Sort — самый известный пример
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));  // O(log n) уровней
  const right = mergeSort(arr.slice(mid));

  return merge(left, right); // O(n) на каждом уровне
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}
\`\`\`

### O(n²) — квадратичная
\`\`\`javascript
// Bubble Sort
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {        // n итераций
    for (let j = 0; j < arr.length - i; j++) {  // ~n итераций
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
// n=1000 → ~1,000,000 операций
\`\`\`

### O(2^n) — экспоненциальная
\`\`\`javascript
// Наивный Фибоначчи
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2); // каждый вызов порождает 2 новых
}
// fib(50) — миллиарды вызовов!

// Оптимизация с мемоизацией → O(n)
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
\`\`\`

## Пространственная сложность

\`\`\`javascript
// O(1) — константная память
function sum(arr) {
  let total = 0;
  for (const n of arr) total += n;
  return total;
}

// O(n) — линейная память
function doubleAll(arr) {
  return arr.map(x => x * 2); // создаём новый массив размером n
}

// O(n) — стек рекурсии
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // n фреймов на стеке
}
\`\`\`

## Таблица сложностей структур данных

| Структура | Access | Search | Insert | Delete |
|-----------|--------|--------|--------|--------|
| Array | O(1) | O(n) | O(n) | O(n) |
| Linked List | O(n) | O(n) | O(1) | O(1) |
| Hash Table | O(1) | O(1) | O(1) | O(1) |
| BST | O(log n) | O(log n) | O(log n) | O(log n) |
| Heap | O(n) | O(n) | O(log n) | O(log n) |

## Практические советы

1. **Избегайте вложенных циклов** — это обычно O(n²) или хуже
2. **Используйте Map/Set** вместо indexOf для поиска → O(1) вместо O(n)
3. **Сортируйте один раз** — потом бинарный поиск O(log n)
4. **Мемоизируйте** рекурсивные функции с повторяющимися вычислениями`,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-data-structures' },
      update: {},
      create: {
        id: 'mat-data-structures',
        title: 'Структуры данных: деревья и графы',
        shortDescription:
          'BST, AVL деревья, кучи, графы, BFS/DFS алгоритмы обхода, практические применения',
        level: KnowledgeLevel.senior,
        tags: ['алгоритмы', 'структуры данных', 'деревья', 'графы', 'BFS', 'DFS'],
        content: `# Структуры данных: деревья и графы

## Бинарное дерево поиска (BST)

\`\`\`javascript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() { this.root = null; }

  insert(val) {
    const node = new TreeNode(val);
    if (!this.root) { this.root = node; return; }

    let current = this.root;
    while (true) {
      if (val < current.val) {
        if (!current.left) { current.left = node; return; }
        current = current.left;
      } else {
        if (!current.right) { current.right = node; return; }
        current = current.right;
      }
    }
  }

  // In-order traversal → отсортированный массив
  inOrder(node = this.root, result = []) {
    if (!node) return result;
    this.inOrder(node.left, result);
    result.push(node.val);
    this.inOrder(node.right, result);
    return result;
  }
}
\`\`\`

## Обходы дерева

\`\`\`javascript
// DFS — в глубину (рекурсивно)
function dfsPreOrder(root) {
  if (!root) return [];
  return [root.val, ...dfsPreOrder(root.left), ...dfsPreOrder(root.right)];
}

// BFS — в ширину (итеративно с очередью)
function bfs(root) {
  if (!root) return [];
  const result = [], queue = [root];

  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}

// BFS по уровням
function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];

  while (queue.length) {
    const level = [], size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
\`\`\`

## Графы

\`\`\`javascript
class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(v) {
    if (!this.adjacencyList.has(v)) this.adjacencyList.set(v, []);
  }

  addEdge(v1, v2) {
    this.adjacencyList.get(v1).push(v2);
    this.adjacencyList.get(v2).push(v1); // для ненаправленного графа
  }

  // DFS
  dfs(start) {
    const visited = new Set(), result = [];

    const dfsHelper = (vertex) => {
      visited.add(vertex);
      result.push(vertex);
      for (const neighbor of this.adjacencyList.get(vertex)) {
        if (!visited.has(neighbor)) dfsHelper(neighbor);
      }
    };

    dfsHelper(start);
    return result;
  }

  // BFS
  bfs(start) {
    const visited = new Set([start]);
    const queue = [start], result = [];

    while (queue.length) {
      const vertex = queue.shift();
      result.push(vertex);

      for (const neighbor of this.adjacencyList.get(vertex)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return result;
  }

  // Кратчайший путь (BFS)
  shortestPath(start, end) {
    if (start === end) return [start];

    const visited = new Set([start]);
    const queue = [[start, [start]]];

    while (queue.length) {
      const [vertex, path] = queue.shift();

      for (const neighbor of this.adjacencyList.get(vertex)) {
        if (neighbor === end) return [...path, neighbor];
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }
    return null; // путь не найден
  }
}
\`\`\`

## Алгоритм Дейкстры

\`\`\`javascript
function dijkstra(graph, start) {
  const distances = {}, prev = {}, unvisited = new Set();

  for (const vertex of Object.keys(graph)) {
    distances[vertex] = vertex === start ? 0 : Infinity;
    unvisited.add(vertex);
  }

  while (unvisited.size) {
    // Находим непосещённую вершину с минимальным расстоянием
    const current = [...unvisited].reduce((min, v) =>
      distances[v] < distances[min] ? v : min
    );

    if (distances[current] === Infinity) break;
    unvisited.delete(current);

    for (const [neighbor, weight] of graph[current]) {
      const newDist = distances[current] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        prev[neighbor] = current;
      }
    }
  }

  return { distances, prev };
}
\`\`\``,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-security' },
      update: {},
      create: {
        id: 'mat-security',
        title: 'Безопасность веб-приложений: OWASP Top 10',
        shortDescription:
          'XSS, CSRF, SQL-инъекции, IDOR, неверная конфигурация безопасности и защита от них',
        level: KnowledgeLevel.senior,
        tags: ['безопасность', 'OWASP', 'XSS', 'CSRF', 'SQL injection'],
        content: `# Безопасность веб-приложений: OWASP Top 10

## A01: Broken Access Control

Неправильный контроль доступа позволяет злоумышленникам получить доступ к чужим данным.

\`\`\`typescript
// УЯЗВИМО: IDOR (Insecure Direct Object Reference)
app.get('/api/users/:id/data', async (req, res) => {
  const data = await db.getUserData(req.params.id); // нет проверки прав!
  res.json(data);
});

// БЕЗОПАСНО: проверяем, что пользователь запрашивает свои данные
app.get('/api/users/:id/data', authenticate, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const data = await db.getUserData(req.params.id);
  res.json(data);
});
\`\`\`

## A02: Cryptographic Failures

\`\`\`typescript
// УЯЗВИМО: слабое хеширование пароля
const hash = md5(password); // MD5 легко взламывается
const hash2 = sha1(password); // SHA1 тоже устарел

// БЕЗОПАСНО: bcrypt с достаточным числом раундов
import * as bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12); // 12 раундов
const isMatch = await bcrypt.compare(password, hash);

// УЯЗВИМО: хранение секретов в коде
const JWT_SECRET = 'my-secret'; // жёстко задан в коде

// БЕЗОПАСНО: переменные окружения
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET not configured');
\`\`\`

## A03: SQL Injection

\`\`\`typescript
// УЯЗВИМО: конкатенация строк
const users = await db.query(
  \`SELECT * FROM users WHERE email = '\${email}'\`
  // email = "' OR '1'='1" → возвращает всех пользователей!
);

// БЕЗОПАСНО: параметризованные запросы
const users = await db.query(
  'SELECT * FROM users WHERE email = $1', [email]
);

// ORM (Prisma) автоматически защищает от SQL injection
const user = await prisma.user.findUnique({ where: { email } });
\`\`\`

## A07: Cross-Site Scripting (XSS)

\`\`\`typescript
// УЯЗВИМО: вставка HTML без экранирования
div.innerHTML = userInput; // userInput = '<script>alert("xss")</script>'

// БЕЗОПАСНО: экранирование или textContent
div.textContent = userInput; // автоматически экранирует HTML

// В React: JSX автоматически экранирует
const Component = ({ userContent }) => <div>{userContent}</div>; // безопасно

// dangerouslySetInnerHTML — только с очисткой!
import DOMPurify from 'dompurify';
const safe = DOMPurify.sanitize(userHtml);
<div dangerouslySetInnerHTML={{ __html: safe }} />
\`\`\`

## CSRF (Cross-Site Request Forgery)

\`\`\`typescript
// Защита с помощью SameSite cookies
res.cookie('session', token, {
  httpOnly: true,
  secure: true,       // только HTTPS
  sameSite: 'strict', // cookie не отправляется с других сайтов
});

// Или Double Submit Cookie Pattern
// Или синхронизация токенов (CSRF token в hidden field)
\`\`\`

## Security Headers

\`\`\`typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'nonce-{random}'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Заголовки, которые добавляет Helmet:
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 0
// Strict-Transport-Security: max-age=31536000
// Content-Security-Policy: ...
\`\`\`

## Rate Limiting

\`\`\`typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // максимум 5 попыток входа
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/auth/login', authLimiter, authController.login);
\`\`\``,
      },
    }),

    prisma.material.upsert({
      where: { id: 'mat-http-performance' },
      update: {},
      create: {
        id: 'mat-http-performance',
        title: 'HTTP/2 и Web Performance',
        shortDescription:
          'Кэширование, сжатие, HTTP/2, Core Web Vitals, оптимизация загрузки страниц',
        level: KnowledgeLevel.middle,
        tags: ['HTTP', 'производительность', 'кэширование', 'HTTP/2', 'Web Vitals'],
        content: `# HTTP/2 и Web Performance

## HTTP/2 vs HTTP/1.1

| Особенность | HTTP/1.1 | HTTP/2 |
|-------------|----------|--------|
| Мультиплексирование | ✗ (одно соединение = один запрос) | ✓ (множество запросов в одном соединении) |
| Сжатие заголовков | ✗ | ✓ (HPACK) |
| Server Push | ✗ | ✓ |
| Приоритизация | ✗ | ✓ |
| Формат | Текст | Бинарный |

## Кэширование

\`\`\`http
# Cache-Control директивы
Cache-Control: max-age=3600          # кэш на 1 час
Cache-Control: no-cache              # всегда проверять у сервера (но можно использовать кэш)
Cache-Control: no-store              # не кэшировать вообще
Cache-Control: public                # можно кэшировать в CDN
Cache-Control: private               # только браузерный кэш
Cache-Control: immutable             # никогда не изменится (версионированные файлы)
Cache-Control: stale-while-revalidate=60  # обновлять в фоне

# ETag — хеш содержимого
ETag: "abc123"
If-None-Match: "abc123"  # если не изменился → 304 Not Modified

# Last-Modified
Last-Modified: Mon, 15 Jan 2024 10:00:00 GMT
If-Modified-Since: Mon, 15 Jan 2024 10:00:00 GMT
\`\`\`

## Стратегии кэширования

\`\`\`typescript
// HTML страницы — не кэшировать или короткий TTL
res.setHeader('Cache-Control', 'no-cache');

// CSS/JS с хешем в имени (content hash) — кэшировать навсегда
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
// main.a3f4b2c.js → main.d5e6f7a.js при изменении

// API ответы
res.setHeader('Cache-Control', 'private, no-cache');

// Изображения
res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 день
\`\`\`

## Сжатие

\`\`\`typescript
import compression from 'compression';

// Gzip сжатие
app.use(compression({
  level: 6, // 1 (быстро) - 9 (максимальное сжатие)
  threshold: 1024, // не сжимать файлы меньше 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
}));

// Brotli (лучшее сжатие, современные браузеры)
// Nginx: brotli on; brotli_comp_level 6;
\`\`\`

## Core Web Vitals

\`\`\`
LCP (Largest Contentful Paint) — время до отрисовки главного контента
  Хорошо: < 2.5s | Нужно улучшить: < 4s | Плохо: > 4s

FID (First Input Delay) / INP — время реакции на первое взаимодействие
  Хорошо: < 100ms | Нужно улучшить: < 300ms | Плохо: > 300ms

CLS (Cumulative Layout Shift) — стабильность макета
  Хорошо: < 0.1 | Нужно улучшить: < 0.25 | Плохо: > 0.25

TTFB (Time to First Byte) — время до первого байта от сервера
  Хорошо: < 800ms
\`\`\`

## Оптимизация изображений

\`\`\`html
<!-- Современные форматы -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>

<!-- Адаптивные изображения -->
<img
  srcset="image-320.jpg 320w, image-640.jpg 640w, image-1280.jpg 1280w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
  src="image-640.jpg"
  alt="Description"
>

<!-- Приоритизация LCP изображения -->
<img src="hero.jpg" fetchpriority="high" alt="Hero">
\`\`\`

## Resource Hints

\`\`\`html
<!-- Preconnect — установить соединение заранее -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- DNS-prefetch — только DNS резолюция -->
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- Preload — загрузить критический ресурс раньше -->
<link rel="preload" href="fonts/inter.woff2" as="font" crossorigin>
<link rel="preload" href="css/critical.css" as="style">

<!-- Prefetch — загрузить ресурс для будущей навигации -->
<link rel="prefetch" href="/next-page.js">
\`\`\``,
      },
    }),
  ]);

  console.log(`Created ${materials.length} materials`);

  // ========================
  // QUESTIONS
  // ========================
  const questionsData = [
    // HTML/CSS
    {
      id: 'q-html-1',
      topic: 'HTML/CSS',
      text: 'Что из перечисленного является семантическим элементом HTML5?',
      options: ['<div>', '<span>', '<article>', '<b>'],
      correctAnswerIndex: 2,
      explanation:
        '<article> — это семантический элемент HTML5, означающий самостоятельный блок контента (статью, пост). <div> и <span> — неcемантические контейнеры. <b> — элемент форматирования без семантики (для семантики используйте <strong>).',
      difficulty: KnowledgeLevel.junior,
    },
    {
      id: 'q-html-2',
      topic: 'HTML/CSS',
      text: 'Какое свойство CSS используется для создания многоколоночного макета с автоматическим распределением колонок?',
      options: [
        'grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))',
        'flex-wrap: wrap',
        'column-count: auto',
        'display: multi-column',
      ],
      correctAnswerIndex: 0,
      explanation:
        'grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) создаёт адаптивную сетку, где колонки автоматически заполняют доступное пространство, каждая шириной не менее 200px. auto-fill создаёт столько колонок, сколько помещается. Это наиболее гибкое решение.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-html-3',
      topic: 'HTML/CSS',
      text: 'В чём разница между display: none и visibility: hidden?',
      options: [
        'Нет разницы, оба скрывают элемент',
        'display: none убирает элемент из потока документа, visibility: hidden скрывает, но сохраняет место',
        'visibility: hidden убирает из потока, display: none только скрывает',
        'display: none работает только в Chrome',
      ],
      correctAnswerIndex: 1,
      explanation:
        'display: none полностью убирает элемент из потока документа — он не занимает место. visibility: hidden скрывает элемент визуально, но он продолжает занимать своё место в документе. Также opacity: 0 скрывает элемент, но он остаётся кликабельным.',
      difficulty: KnowledgeLevel.junior,
    },
    {
      id: 'q-html-4',
      topic: 'HTML/CSS',
      text: 'Что такое CSS специфичность и как она рассчитывается?',
      options: [
        'Специфичность определяет порядок загрузки CSS файлов',
        'Специфичность = (inline, id, class/attr/pseudo-class, element) — 4 компонента',
        'Специфичность определяется только порядком следования правил',
        'Специфичность — это вес !important',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Специфичность CSS рассчитывается как 4 числа: (inline styles, ID, classes/attributes/pseudo-classes, elements/pseudo-elements). Например: #nav .link:hover a = (0,1,2,1). При конфликте побеждает правило с большей специфичностью. !important перекрывает все обычные правила.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-html-5',
      topic: 'HTML/CSS',
      text: 'Что такое BEM и какова его основная цель?',
      options: [
        'Browser Extension Manager — менеджер расширений браузера',
        'Block Element Modifier — методология именования CSS классов для создания переиспользуемых компонентов',
        'Binary Encoding Method — метод кодирования данных',
        'Backend Event Module — модуль для обработки событий',
      ],
      correctAnswerIndex: 1,
      explanation:
        'BEM (Block Element Modifier) — методология именования CSS классов. Блок (.card) — независимый компонент. Элемент (.card__title) — часть блока. Модификатор (.card--featured) — состояние/вариант. Цель — создать предсказуемую, переиспользуемую архитектуру стилей без конфликтов.',
      difficulty: KnowledgeLevel.junior,
    },
    {
      id: 'q-html-6',
      topic: 'HTML/CSS',
      text: 'Что делает свойство CSS position: sticky?',
      options: [
        'Делает элемент фиксированным относительно экрана (как fixed)',
        'Элемент ведёт себя как relative, пока не достигнет порогового значения, затем как fixed',
        'Делает элемент абсолютно позиционированным',
        'Прикрепляет элемент к верхней части родителя',
      ],
      correctAnswerIndex: 1,
      explanation:
        'position: sticky создаёт «прилипающий» элемент: он ведёт себя как relative в нормальном потоке, но при прокрутке к указанному порогу (top: 0) «прилипает» и ведёт себя как fixed внутри своего scrolling container. Отлично подходит для навигации.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-html-7',
      topic: 'HTML/CSS',
      text: 'Какой HTML-атрибут следует использовать для улучшения доступности кнопки с иконкой без текста?',
      options: ['title="..."', 'aria-label="..."', 'alt="..."', 'name="..."'],
      correctAnswerIndex: 1,
      explanation:
        'aria-label предоставляет текстовую метку для элемента, которую используют скринридеры. Для кнопки без видимого текста это обязательно. title создаёт всплывающую подсказку, но не все скринридеры его читают. alt используется только для изображений.',
      difficulty: KnowledgeLevel.junior,
    },
    {
      id: 'q-html-8',
      topic: 'HTML/CSS',
      text: 'Что такое CSS Custom Properties (переменные) и каково их главное преимущество перед переменными препроцессоров?',
      options: [
        'Custom Properties быстрее обрабатываются браузером',
        'Custom Properties доступны в JavaScript и могут изменяться во время выполнения (runtime)',
        'Custom Properties поддерживаются во всех браузерах, переменные препроцессоров — нет',
        'Custom Properties автоматически обновляют все зависимые стили',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Главное преимущество CSS Custom Properties (--color: red) перед переменными SASS/LESS — они живут в браузере во время выполнения. Их можно читать и изменять через JavaScript (el.style.setProperty), они каскадируются и наследуются, их можно переопределять в медиа-запросах.',
      difficulty: KnowledgeLevel.middle,
    },

    // JavaScript
    {
      id: 'q-js-1',
      topic: 'JavaScript',
      text: 'Что выведет следующий код: console.log(typeof null)?',
      options: ['"null"', '"undefined"', '"object"', '"error"'],
      correctAnswerIndex: 2,
      explanation:
        'typeof null === "object" — это известный баг JavaScript, существующий с самого начала языка. Исторически в JavaScript значения хранились в 32-битных блоках, и null был представлен нулевыми битами, которые интерпретировались как объект. Для проверки на null используйте строгое сравнение: value === null.',
      difficulty: KnowledgeLevel.junior,
    },
    {
      id: 'q-js-2',
      topic: 'JavaScript',
      text: 'В чём разница между == и === в JavaScript?',
      options: [
        '== быстрее, === медленнее',
        '== проверяет только значение (с приведением типов), === проверяет значение И тип',
        '== для чисел, === для строк',
        'Нет разницы в современном JavaScript',
      ],
      correctAnswerIndex: 1,
      explanation:
        '== (нестрогое равенство) приводит типы перед сравнением: "5" == 5 → true, null == undefined → true. === (строгое равенство) не приводит типы: "5" === 5 → false. Рекомендуется всегда использовать === для предсказуемого поведения.',
      difficulty: KnowledgeLevel.junior,
    },
    {
      id: 'q-js-3',
      topic: 'JavaScript',
      text: 'Что такое замыкание в JavaScript?',
      options: [
        'Метод завершения асинхронной операции',
        'Функция, которая запоминает переменные из своего лексического окружения даже после его завершения',
        'Способ закрытия HTTP соединения',
        'Паттерн для инкапсуляции классов',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Замыкание (closure) — функция вместе со ссылкой на своё лексическое окружение. Функция "помнит" переменные из области видимости, где была создана, даже если внешняя функция уже завершила выполнение. Используется для приватных переменных, фабрик функций, мемоизации.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-js-4',
      topic: 'JavaScript',
      text: 'Что такое Event Loop и как он работает в JavaScript?',
      options: [
        'Это цикл for...of для обхода событий DOM',
        'Механизм, позволяющий JS выполнять асинхронный код в однопоточной среде, используя очередь задач',
        'Встроенный планировщик задач Node.js',
        'Способ обработки кликов мыши',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Event Loop — сердце асинхронного JS. Он мониторит Call Stack и Task Queue. Когда стек пуст, Event Loop берёт задачи из очереди. Порядок: синхронный код → microtasks (Promise.then, queueMicrotask) → macrotasks (setTimeout, setInterval, I/O). Это позволяет JS быть однопоточным, но неблокирующим.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-js-5',
      topic: 'JavaScript',
      text: 'Что такое Promise.all() и чем отличается от Promise.allSettled()?',
      options: [
        'Promise.all быстрее, allSettled медленнее',
        'Promise.all отклоняется при первой ошибке, allSettled ждёт все промисы и возвращает статус каждого',
        'allSettled только для Node.js, Promise.all для браузера',
        'Нет разницы, оба возвращают массив результатов',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Promise.all() завершается с ошибкой, если хотя бы один промис отклонён (fail-fast). Promise.allSettled() ждёт завершения ВСЕХ промисов и возвращает массив объектов {status: "fulfilled"|"rejected", value|reason}. Используйте allSettled, когда нужны все результаты независимо от ошибок.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-js-6',
      topic: 'JavaScript',
      text: 'Как работает прототипное наследование в JavaScript?',
      options: [
        'JavaScript использует классическое наследование через ключевое слово class',
        'Каждый объект имеет ссылку [[Prototype]] на другой объект; при поиске свойства идёт по цепочке прототипов',
        'Наследование в JS работает только через функции-конструкторы',
        'Прототипное наследование — устаревший механизм, заменённый классами в ES6',
      ],
      correctAnswerIndex: 1,
      explanation:
        'В JavaScript каждый объект имеет скрытое свойство [[Prototype]] (доступное через __proto__ или Object.getPrototypeOf). При обращении к свойству, которого нет в объекте, JS ищет его в цепочке прототипов. Классы ES6 — это синтаксический сахар над прототипным наследованием.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-js-7',
      topic: 'JavaScript',
      text: 'Что делает метод Array.prototype.reduce()?',
      options: [
        'Удаляет дубликаты из массива',
        'Уменьшает массив, удаляя последний элемент',
        'Выполняет функцию для каждого элемента, накапливая результат в аккумуляторе',
        'Сортирует массив в обратном порядке',
      ],
      correctAnswerIndex: 2,
      explanation:
        'reduce(callback, initialValue) итерирует массив, передавая каждому вызову аккумулятор и текущий элемент. Возвращает итоговое значение аккумулятора. Пример: [1,2,3].reduce((sum, n) => sum + n, 0) → 6. Используется для агрегации: суммы, группировки, преобразования массива в объект.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-js-8',
      topic: 'JavaScript',
      text: 'Что такое деструктуризация и spread оператор в ES6?',
      options: [
        'Деструктуризация разрушает объект, spread копирует данные на диск',
        'Деструктуризация извлекает значения из объектов/массивов в переменные; spread (...) разворачивает итерируемое',
        'Это одно и то же — оба извлекают данные',
        'Spread создаёт глубокую копию объекта',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Деструктуризация: const {a, b} = obj или const [x, y] = arr — извлекает значения в переменные. Spread оператор (...): [...arr1, ...arr2] — разворачивает итерируемое; {...obj1, ...obj2} — объединяет объекты (поверхностная копия). Rest параметры тоже используют ...: function f(...args).',
      difficulty: KnowledgeLevel.junior,
    },
    {
      id: 'q-js-9',
      topic: 'JavaScript',
      text: 'Чем отличаются функции-генераторы (function*) от обычных функций?',
      options: [
        'Генераторы быстрее обычных функций',
        'Генераторы могут приостанавливать выполнение через yield и возобновлять с того места, используя итератор',
        'Генераторы — это просто синтаксический сахар для async/await',
        'Генераторы автоматически кэшируют результаты',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Генераторы (function*) возвращают итератор. yield приостанавливает функцию и возвращает значение. Следующий вызов .next() продолжает с места паузы. Полезны для: ленивой оценки последовательностей, реализации итераторов, работы с бесконечными последовательностями, управления потоком выполнения.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-js-10',
      topic: 'JavaScript',
      text: 'Что такое WeakMap и WeakSet и зачем они нужны?',
      options: [
        'Более быстрые версии Map и Set',
        'Коллекции с слабыми ссылками на объекты-ключи, позволяющие сборщику мусора удалять их при отсутствии других ссылок',
        'Map и Set только для примитивных значений',
        'Синхронизированные коллекции для многопоточного кода',
      ],
      correctAnswerIndex: 1,
      explanation:
        'WeakMap/WeakSet хранят слабые ссылки на объекты-ключи. Если на объект больше нет сильных ссылок, он может быть удалён сборщиком мусора, а запись в WeakMap/WeakSet исчезнет. Нельзя итерироваться. Полезны для хранения приватных данных и метаданных, связанных с объектами, без утечек памяти.',
      difficulty: KnowledgeLevel.senior,
    },

    // TypeScript
    {
      id: 'q-ts-1',
      topic: 'TypeScript',
      text: 'Что такое дженерики (Generics) в TypeScript?',
      options: [
        'Способ создания общих (generic) CSS стилей',
        'Механизм создания переиспользуемых компонентов, работающих с разными типами данных с сохранением типобезопасности',
        'Встроенные типы TypeScript (string, number, boolean)',
        'Шаблоны для генерации кода',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Дженерики позволяют создавать функции, классы и интерфейсы, которые работают с любым типом, при этом сохраняя типобезопасность. Пример: function identity<T>(arg: T): T { return arg; } — T будет выведен из переданного аргумента. Избегаем any и сохраняем информацию о типах.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-ts-2',
      topic: 'TypeScript',
      text: 'Что такое union types (|) и intersection types (&)?',
      options: [
        'Union — объединяет объекты, intersection — создаёт подмножество',
        'Union (A|B) — значение может быть A или B; Intersection (A&B) — значение должно быть одновременно A и B',
        'Это синонимы, оба обозначают объединение типов',
        'Union для примитивов, intersection для объектов',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Union type (string | number) — значение может быть ОДНИМ из перечисленных типов. Требует type narrowing для использования. Intersection type (TypeA & TypeB) — значение должно удовлетворять ОБОИМ типам одновременно. Используется для объединения типов объектов: type Admin = User & { permissions: string[] }.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-ts-3',
      topic: 'TypeScript',
      text: 'Что делает утилитный тип Partial<T>?',
      options: [
        'Удаляет половину полей из типа',
        'Делает все поля типа T необязательными (добавляет ? к каждому)',
        'Делает все поля типа T обязательными',
        'Создаёт частичную копию типа с subset полей',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Partial<T> создаёт новый тип, где все поля T становятся опциональными (?: вместо :). Полезно для DTOs обновления данных, где не нужно передавать все поля. Противоположность — Required<T>, делающий все поля обязательными.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-ts-4',
      topic: 'TypeScript',
      text: 'Что такое декораторы в TypeScript и для чего они используются?',
      options: [
        'Синтаксический сахар для комментариев в коде',
        'Специальные функции (@decorator), применяемые к классам, методам, свойствам для добавления метаданных или модификации поведения',
        'Способ визуального оформления кода',
        'Альтернатива интерфейсам',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Декораторы (@Controller, @Injectable, @Get) — это функции, принимающие target (класс/метод/свойство) и выполняющие с ним операции. Широко используются в Angular и NestJS для: регистрации маршрутов, инъекции зависимостей, валидации, добавления метаданных через Reflect.metadata.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-ts-5',
      topic: 'TypeScript',
      text: 'Что такое type guards и зачем они нужны?',
      options: [
        'Ограничения для защиты типов от изменений',
        'Конструкции для сужения типа (type narrowing) в условных блоках — instanceof, typeof, in, is',
        'Способ блокировки изменений типов в runtime',
        'Валидаторы для runtime проверки типов',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Type guards позволяют TypeScript "понять" более конкретный тип в блоке кода. typeof x === "string" — TypeScript знает, что x: string внутри блока. instanceof — для классов. "property" in obj — для проверки наличия поля. User-defined: function isUser(x): x is User — явное указание.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-ts-6',
      topic: 'TypeScript',
      text: 'Что такое mapped types в TypeScript?',
      options: [
        'Типы для работы с Map и WeakMap',
        'Синтаксис создания нового типа путём трансформации каждого свойства существующего типа: { [K in keyof T]: ... }',
        'Способ маппинга HTTP запросов на типы',
        'Встроенные типы для работы с коллекциями',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Mapped types итерируют ключи типа и создают новый тип: { [K in keyof T]: T[K] | null } — каждое поле T может быть null. Это основа для Partial, Required, Readonly, Record. Можно добавлять/убирать модификаторы: +? для опциональности, -readonly для удаления readonly.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-ts-7',
      topic: 'TypeScript',
      text: 'Чем отличается interface от type в TypeScript?',
      options: [
        'interface только для объектов, type для примитивов',
        'Основные отличия: interface расширяется (declaration merging), type поддерживает union/intersection/tuple; оба взаимозаменяемы для объектов',
        'type быстрее компилируется, interface нет',
        'interface устарел, следует использовать только type',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Ключевые различия: 1) Declaration merging — interface можно объявить дважды и TypeScript объединит их, type нельзя. 2) type поддерживает union (A|B), tuple [A,B], mapped types. 3) interface более читаем для объектов/классов. На практике: interface для public API и extends-наследования, type для сложных трансформаций.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-ts-8',
      topic: 'TypeScript',
      text: 'Что такое conditional types в TypeScript?',
      options: [
        'Условные операторы if/else для типов',
        'Типы вида T extends U ? X : Y, позволяющие выражать условные зависимости между типами',
        'Типы с условной компиляцией',
        'Способ проверки типов в runtime',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Conditional types: T extends U ? X : Y — если T совместим с U, тип X, иначе Y. При применении к union типу распределяются: (A | B) extends string ? ... обрабатывает A и B по отдельности. Ключевое слово infer извлекает тип внутри условия. Основа для ReturnType, Parameters, Awaited.',
      difficulty: KnowledgeLevel.senior,
    },

    // React
    {
      id: 'q-react-1',
      topic: 'React',
      text: 'Что такое виртуальный DOM в React?',
      options: [
        'Отдельный браузер для рендеринга React',
        'Легковесное JavaScript-представление реального DOM, позволяющее React эффективно обновлять только изменившиеся части страницы',
        'Серверный рендеринг без браузера',
        'DOM элементы, хранящиеся в памяти без отображения',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Virtual DOM — JavaScript-объект, отражающий структуру реального DOM. При изменении состояния React создаёт новый Virtual DOM, сравнивает с предыдущим (diffing/reconciliation), находит минимальный набор изменений и применяет их к реальному DOM (patching). Это эффективнее прямой работы с DOM.',
      difficulty: KnowledgeLevel.junior,
    },
    {
      id: 'q-react-2',
      topic: 'React',
      text: 'Для чего используется хук useEffect и как правильно указывать зависимости?',
      options: [
        'Для хранения состояния компонента',
        'Для выполнения побочных эффектов; зависимости — массив значений, при изменении которых эффект перезапускается',
        'Для обработки событий компонента',
        'Для создания мемоизированных функций',
      ],
      correctAnswerIndex: 1,
      explanation:
        'useEffect(callback, deps) выполняет callback после рендера. [] — только при монтировании. [a, b] — при монтировании и при изменении a или b. Без массива — после каждого рендера. В callback можно вернуть функцию очистки. Важно: нельзя пропускать зависимости (react-hooks/exhaustive-deps).',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-react-3',
      topic: 'React',
      text: 'В чём разница между useCallback и useMemo?',
      options: [
        'useCallback для классов, useMemo для функциональных компонентов',
        'useCallback мемоизирует функцию, useMemo мемоизирует результат вычисления',
        'Нет разницы, оба мемоизируют значения',
        'useMemo для асинхронных операций, useCallback для синхронных',
      ],
      correctAnswerIndex: 1,
      explanation:
        'useCallback(fn, deps) возвращает мемоизированную функцию — ту же ссылку, если зависимости не изменились. useMemo(fn, deps) возвращает мемоизированный РЕЗУЛЬТАТ вызова fn. useCallback(fn, deps) === useMemo(() => fn, deps). Используйте useCallback для функций, передаваемых в memo-компоненты.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-react-4',
      topic: 'React',
      text: 'Что такое React Context и когда его следует использовать?',
      options: [
        'Контекст выполнения JavaScript в браузере',
        'Механизм передачи данных через дерево компонентов без явной передачи через props на каждом уровне',
        'Аналог Redux для управления глобальным состоянием',
        'Способ передачи refs между компонентами',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Context решает проблему "props drilling" — необходимости передавать props через многие уровни. Используйте для: темы UI, текущего пользователя, настроек языка, состояния аутентификации. НЕ используйте для: часто меняющихся данных (вызывает лишние ре-рендеры), сложного глобального состояния (лучше Redux/Zustand).',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-react-5',
      topic: 'React',
      text: 'Что такое React.memo() и когда его использовать?',
      options: [
        'Хук для мемоизации значений в компоненте',
        'HOC, предотвращающий ре-рендер функционального компонента, если его props не изменились',
        'Способ кэширования результатов рендера на сервере',
        'Метод для оптимизации Context',
      ],
      correctAnswerIndex: 1,
      explanation:
        'React.memo() оборачивает функциональный компонент и делает поверхностное сравнение props. Если props не изменились, компонент не перерендеривается. Используйте когда: компонент рендерится часто, с теми же props; рендер дорогостоящий; компонент получает объекты/функции (нужны useCallback/useMemo у родителя).',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-react-6',
      topic: 'React',
      text: 'Что такое reconciliation в React?',
      options: [
        'Процесс синхронизации состояния с сервером',
        'Алгоритм сравнения Virtual DOM деревьев для нахождения минимального числа изменений реального DOM',
        'Механизм разрешения конфликтов в состоянии',
        'Процесс отмены изменений состояния',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Reconciliation — алгоритм React для обновления DOM. Он сравнивает два дерева Virtual DOM (diffing). Правила: элементы разных типов уничтожают поддерево; элементы одного типа обновляют атрибуты; ключи помогают отслеживать элементы в списках. Fiber — архитектура React 16+ для incremental rendering.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-react-7',
      topic: 'React',
      text: 'Когда следует использовать useReducer вместо useState?',
      options: [
        'useReducer всегда лучше useState',
        'useReducer предпочтительнее для сложной логики состояния с несколькими взаимосвязанными значениями или когда следующее состояние зависит от предыдущего',
        'useReducer для массивов и объектов, useState для примитивов',
        'useReducer только в компонентах с более чем 100 строками кода',
      ],
      correctAnswerIndex: 1,
      explanation:
        'useReducer лучше useState когда: 1) Следующее состояние зависит от предыдущего; 2) Несколько связанных значений состояния; 3) Сложная логика обновления; 4) Нужна предсказуемость (чистые функции редьюсеры). useState проще для независимых примитивных значений.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-react-8',
      topic: 'React',
      text: 'Что такое Suspense и lazy loading компонентов?',
      options: [
        'Способ отложить выполнение эффектов',
        'React.lazy() загружает компонент только когда он нужен (code splitting); Suspense показывает fallback во время загрузки',
        'Механизм приостановки рендеринга при ошибках',
        'Кэширование запросов в React',
      ],
      correctAnswerIndex: 1,
      explanation:
        'React.lazy(() => import("./Component")) создаёт компонент с динамическим импортом. Suspense отображает fallback (например, <Spinner/>) пока компонент загружается. Это позволяет разделить бандл (code splitting) и загружать части приложения по требованию, улучшая начальную загрузку.',
      difficulty: KnowledgeLevel.middle,
    },

    // Frontend Architecture
    {
      id: 'q-arch-1',
      topic: 'Frontend архитектура',
      text: 'Что такое Feature Sliced Design (FSD)?',
      options: [
        'Паттерн разделения CSS стилей по фичам',
        'Архитектурная методология для frontend с иерархическими слоями: app, pages, widgets, features, entities, shared',
        'Подход к разрезанию изображений для оптимизации',
        'Способ организации тестов по функциональности',
      ],
      correctAnswerIndex: 1,
      explanation:
        'FSD — методология организации frontend кода. 7 слоёв в порядке убывания абстракции: app (инициализация), pages (страницы), widgets (крупные блоки), features (бизнес-фичи), entities (сущности), shared (переиспользуемый код). Правило: слой может импортировать только из слоёв ниже.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-arch-2',
      topic: 'Frontend архитектура',
      text: 'Что такое Atomic Design?',
      options: [
        'Оптимизация CSS с использованием atomic classes',
        'Методология Брэда Фроста: atoms → molecules → organisms → templates → pages',
        'Подход к управлению состоянием с использованием атомов (Recoil, Jotai)',
        'Архитектура микрофронтендов',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Atomic Design — методология Брэда Фроста. Atoms (кнопка, input) → Molecules (форма поиска = input + кнопка) → Organisms (хедер = логотип + навигация + поиск) → Templates (макет страницы) → Pages (конкретная страница с данными). Помогает создать систему компонентов.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-arch-3',
      topic: 'Frontend архитектура',
      text: 'Что такое микрофронтенды?',
      options: [
        'Очень маленькие компоненты React',
        'Архитектурный паттерн разбиения frontend на независимо разрабатываемые и деплоящиеся приложения',
        'Технология оптимизации размера JavaScript бандла',
        'Подход к mobile-first разработке',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Микрофронтенды — применение принципов микросервисов к frontend. Разные команды разрабатывают независимые части UI (разные технологии, деплои). Реализуется через: iframes, Web Components, Module Federation (webpack), single-spa. Плюсы: независимость, масштабирование команд. Минусы: сложность интеграции.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-arch-4',
      topic: 'Frontend архитектура',
      text: 'Что такое SOLID принципы применительно к React компонентам?',
      options: [
        'SOLID применим только к backend коду',
        'S: один компонент — одна ответственность; O: расширение без изменения; L: замена предка; I: минимальный интерфейс props; D: зависимость от абстракций',
        'Набор CSS методологий',
        'Паттерны оптимизации производительности',
      ],
      correctAnswerIndex: 1,
      explanation:
        'SOLID в React: SRP — компонент решает одну задачу; OCP — расширяем через children/props, не изменяя исходный; LSP — компоненты заменяемы без нарушений; ISP — не передавать лишних props; DIP — зависеть от хуков/контекста (абстракции), а не конкретных реализаций. Улучшает тестируемость и переиспользуемость.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-arch-5',
      topic: 'Frontend архитектура',
      text: 'Что такое паттерн Container/Presentational (умные/глупые компоненты)?',
      options: [
        'Разделение компонентов по размеру',
        'Container — управляет логикой и состоянием, Presentational — только отображает данные через props без логики',
        'Container — для серверного рендеринга, Presentational — для клиентского',
        'Паттерн для работы с формами',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Container (Smart) компоненты: знают, ОТКУДАданные, работают с API/store, содержат логику, передают данные через props. Presentational (Dumb): знают КАК отображать, не зависят от store/API, легко тестируемы, переиспользуемы. С хуками граница размылась, но принцип разделения ответственности остаётся актуальным.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-arch-6',
      topic: 'Frontend архитектура',
      text: 'Что такое Code Splitting и как его реализовать в React?',
      options: [
        'Разделение кода команды на разные репозитории',
        'Разбивка JavaScript бандла на части, загружаемые по требованию; реализуется через React.lazy, dynamic import или webpack chunks',
        'Удаление неиспользуемого кода (tree shaking)',
        'Разделение CSS и JavaScript файлов',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Code Splitting уменьшает начальный размер бандла. Способы: React.lazy() + Suspense для компонентов; dynamic import() для модулей; webpack chunks через /* webpackChunkName */; route-based splitting (по маршрутам). Пример: const Dashboard = React.lazy(() => import("./Dashboard")) — загружается только при переходе на страницу.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-arch-7',
      topic: 'Frontend архитектура',
      text: 'В чём разница между SSR, SSG и CSR?',
      options: [
        'Это разные фреймворки для React',
        'CSR — рендеринг в браузере; SSR — рендеринг на сервере для каждого запроса; SSG — генерация HTML при сборке',
        'Различные протоколы передачи данных',
        'Способы кэширования JavaScript',
      ],
      correctAnswerIndex: 1,
      explanation:
        'CSR (Create React App): JS в браузере, медленный FCP, плохой SEO. SSR (Next.js getServerSideProps): HTML на сервере для каждого запроса, хороший SEO, медленнее при нагрузке. SSG (Next.js getStaticProps): HTML при build time, быстрый, отлично кэшируется, данные могут быть устаревшими. ISR — обновление статики в фоне.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-arch-8',
      topic: 'Frontend архитектура',
      text: 'Что такое Flux паттерн и как он реализован в Redux?',
      options: [
        'CSS флексбокс для архитектурных схем',
        'Однонаправленный поток данных: Action → Dispatcher → Store → View; в Redux: Action → Reducer → Store → Component',
        'Паттерн для работы с формами в React',
        'Метод асинхронного обновления состояния',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Flux — архитектура с однонаправленным потоком данных Facebook. Redux — её реализация: Action (описывает что произошло) → Reducer (чистая функция, вычисляет новое состояние) → Store (единственный источник правды) → View (компоненты). Однонаправленность делает состояние предсказуемым и отлаживаемым.',
      difficulty: KnowledgeLevel.middle,
    },

    // Браузер и HTTP
    {
      id: 'q-browser-1',
      topic: 'Браузер и HTTP',
      text: 'Что происходит при вводе URL в браузере и нажатии Enter?',
      options: [
        'Браузер сразу загружает HTML с сервера',
        'DNS резолюция → TCP соединение → TLS handshake → HTTP запрос → получение HTML → парсинг → загрузка ресурсов → рендеринг',
        'Браузер проверяет кэш и отображает страницу',
        'Отправляется WebSocket соединение',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Полный путь: 1) Проверка кэша DNS; 2) DNS резолюция (домен → IP); 3) TCP handshake (SYN-SYN/ACK-ACK); 4) TLS handshake (для HTTPS); 5) HTTP GET запрос; 6) Получение HTML; 7) Парсинг HTML, построение DOM; 8) Загрузка CSS (CSSOM), JS, изображений; 9) Render tree → Layout → Paint → Composite.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-browser-2',
      topic: 'Браузер и HTTP',
      text: 'Что такое CORS и как браузер его обрабатывает?',
      options: [
        'Cross-Origin Resource Sharing — политика безопасности браузера, контролирующая доступ к ресурсам с другого источника через HTTP заголовки',
        'Метод шифрования HTTP запросов',
        'Способ сжатия данных при передаче',
        'Протокол аутентификации для API',
      ],
      correctAnswerIndex: 0,
      explanation:
        'CORS — механизм браузера для контроля cross-origin запросов. Simple requests проходят напрямую. Preflighted requests (сложные запросы) сначала отправляют OPTIONS запрос. Сервер отвечает заголовками: Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers. Только браузер соблюдает CORS — Postman его игнорирует.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-browser-3',
      topic: 'Браузер и HTTP',
      text: 'Чем отличается localStorage от sessionStorage и cookies?',
      options: [
        'localStorage быстрее, остальные медленнее',
        'localStorage: постоянный до явного удаления; sessionStorage: только для вкладки; cookies: отправляются с каждым HTTP запросом, имеют срок жизни',
        'Все три хранят данные одинаково',
        'cookies только для сессий, localStorage постоянный',
      ],
      correctAnswerIndex: 1,
      explanation:
        'localStorage: хранится до явного удаления, синхронный, доступен во всех вкладках домена, ~5MB. sessionStorage: очищается при закрытии вкладки, только для текущей вкладки, ~5MB. Cookies: отправляются с каждым HTTP запросом (могут влиять на производительность), есть флаги HttpOnly, Secure, SameSite, можно задать срок жизни, ~4KB.',
      difficulty: KnowledgeLevel.junior,
    },
    {
      id: 'q-browser-4',
      topic: 'Браузер и HTTP',
      text: 'Что такое Critical Rendering Path?',
      options: [
        'Алгоритм поиска критических ошибок в коде',
        'Последовательность шагов браузера от получения HTML до отображения пикселей: DOM → CSSOM → Render Tree → Layout → Paint → Composite',
        'Критический путь доставки данных от сервера',
        'Способ оптимизации JavaScript',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Critical Rendering Path: 1) Парсинг HTML → DOM; 2) Парсинг CSS → CSSOM (блокирует рендеринг!); 3) DOM + CSSOM = Render Tree; 4) Layout (вычисление размеров/позиций); 5) Paint (заполнение пикселями); 6) Composite (слои GPU). JS блокирует парсинг HTML (если нет async/defer). Оптимизация: inline critical CSS, defer JS.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-browser-5',
      topic: 'Браузер и HTTP',
      text: 'В чём разница между reflow (layout) и repaint?',
      options: [
        'Reflow перезагружает страницу, repaint перерисовывает',
        'Reflow пересчитывает геометрию элементов (позиции, размеры) — дорогостоящая операция; repaint только перерисовывает внешний вид без изменения геометрии',
        'Нет разницы, оба термина обозначают перерисовку',
        'Repaint работает с GPU, reflow с CPU',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Reflow (layout) — пересчёт геометрии элементов. Триггеры: изменение размера, позиции, добавление/удаление элементов. ДОРОГО — каскадно влияет на дочерние и соседние элементы. Repaint — перерисовка без изменения геометрии: изменение цвета, фона. ДЕШЕВЛЕ reflow. Composite — только перемещение слоёв (transform, opacity). ДЕШЕВЛЕ всего.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-browser-6',
      topic: 'Браузер и HTTP',
      text: 'Что такое Service Worker и как он работает?',
      options: [
        'Web Worker для обработки запросов к серверу',
        'Скрипт, запускаемый в отдельном потоке, работающий как прокси между браузером и сетью; позволяет кэширование, push уведомления, offline работу',
        'Серверный скрипт для обработки HTTP запросов',
        'Утилита для мониторинга производительности',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Service Worker — JavaScript файл, запускаемый отдельно от страницы, без доступа к DOM. Работает как сетевой прокси: перехватывает запросы (fetch event), может возвращать кэшированные ответы. Основа PWA. Жизненный цикл: install → activate → fetch. Работает только по HTTPS (кроме localhost).',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-browser-7',
      topic: 'Браузер и HTTP',
      text: 'Что такое Web Workers?',
      options: [
        'Серверные воркеры для обработки запросов',
        'JavaScript, запускаемый в отдельном потоке браузера без доступа к DOM, для CPU-интенсивных задач',
        'Web Assembly модули',
        'Менеджеры кэша браузера',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Web Workers позволяют запускать JavaScript в фоновом потоке, не блокируя UI. Общение через postMessage / onmessage. Нет доступа к DOM, window, document. Полезны для: тяжёлых вычислений, обработки данных, парсинга. Виды: Dedicated Worker, Shared Worker, Service Worker.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-browser-8',
      topic: 'Браузер и HTTP',
      text: 'Что такое Content Security Policy (CSP) и зачем он нужен?',
      options: [
        'Политика разграничения доступа к контенту сайта',
        'HTTP заголовок, определяющий откуда браузер может загружать ресурсы, защищающий от XSS и инъекций',
        'Система управления правами доступа пользователей',
        'Инструмент шифрования контента',
      ],
      correctAnswerIndex: 1,
      explanation:
        'CSP — HTTP заголовок Content-Security-Policy, указывающий браузеру откуда разрешено загружать ресурсы. Пример: default-src "self" — только с текущего домена. script-src "self" "nonce-{}" — скрипты только с домена и с nonce. Предотвращает XSS, инъекции стилей, data URI атаки. Нарушения можно логировать через report-uri.',
      difficulty: KnowledgeLevel.senior,
    },

    // Node.js
    {
      id: 'q-nodejs-1',
      topic: 'Node.js',
      text: 'Что такое Event Loop в Node.js и из каких фаз он состоит?',
      options: [
        'Цикл обработки событий DOM, аналогичный браузерному',
        'Механизм асинхронного выполнения с фазами: timers, pending callbacks, idle/prepare, poll, check, close callbacks',
        'Очередь запросов к базе данных',
        'Менеджер потоков для параллельного выполнения',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Event Loop Node.js: timers (setTimeout/setInterval) → pending callbacks (отложенные I/O) → idle/prepare → poll (ожидание I/O) → check (setImmediate) → close callbacks. Microtasks (Promise, process.nextTick) выполняются между фазами, nextTick имеет приоритет перед Promise. libuv реализует I/O операции.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-nodejs-2',
      topic: 'Node.js',
      text: 'Что такое Streams в Node.js и какие типы существуют?',
      options: [
        'Потоки данных в реальном времени через WebSocket',
        'Readable (чтение), Writable (запись), Duplex (оба), Transform (преобразование) — обрабатывают данные порциями без загрузки всего в память',
        'Системные потоки операционной системы',
        'Асинхронные генераторы данных',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Streams обрабатывают данные по кускам (chunks), не загружая всё в память. Типы: Readable (fs.createReadStream), Writable (fs.createWriteStream), Duplex (TCP сокеты), Transform (zlib.createGzip). Соединяются через pipe(). Идеальны для: чтения больших файлов, HTTP запросов/ответов, сжатия на лету.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-nodejs-3',
      topic: 'Node.js',
      text: 'Чем отличается process.nextTick() от setImmediate()?',
      options: [
        'Нет разницы, оба выполняются асинхронно',
        'process.nextTick выполняется в текущей итерации Event Loop (в microtask queue), setImmediate — в check фазе следующей итерации',
        'setImmediate быстрее nextTick',
        'nextTick для синхронного кода, setImmediate для асинхронного',
      ],
      correctAnswerIndex: 1,
      explanation:
        'process.nextTick помещает callback в nextTick queue — выполняется ПОСЛЕ текущей операции, НО ПЕРЕД переходом к следующей фазе Event Loop (даже перед Promise!). setImmediate выполняется в check фазе следующей итерации Event Loop, после poll фазы. Рекурсивный nextTick может заблокировать I/O.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-nodejs-4',
      topic: 'Node.js',
      text: 'Что такое cluster модуль Node.js?',
      options: [
        'Инструмент для управления Docker кластерами',
        'Модуль для создания дочерних процессов, использующих один порт, позволяя утилизировать все ядра CPU',
        'Менеджер Node.js пакетов',
        'Инструмент балансировки нагрузки для HTTP',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Node.js однопоточный, но cluster позволяет создать дочерние worker процессы (по числу CPU ядер), разделяющие один порт. Master процесс принимает соединения и распределяет между workers (round-robin). Каждый worker — отдельный процесс со своим Event Loop. Альтернатива — PM2 с cluster mode.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-nodejs-5',
      topic: 'Node.js',
      text: 'Что такое middleware в Express/NestJS?',
      options: [
        'Промежуточные серверы между клиентом и базой данных',
        'Функции, выполняющиеся в цепочке обработки запроса, имеющие доступ к req, res и функции next()',
        'Мидлвары — это DTO для передачи данных',
        'Плагины для работы с базами данных',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Middleware — функции в pipeline обработки запроса. Получают req, res, next. Могут: изменить req/res, завершить запрос (res.json()), передать управление (next()) или вызвать ошибку (next(error)). Примеры: логирование, парсинг body, аутентификация, CORS. В NestJS — Guards, Interceptors, Pipes тоже являются формой middleware.',
      difficulty: KnowledgeLevel.junior,
    },
    {
      id: 'q-nodejs-6',
      topic: 'Node.js',
      text: 'Что такое Worker Threads в Node.js и когда их использовать?',
      options: [
        'Аналог Web Workers для параллельных HTTP запросов',
        'Потоки для CPU-интенсивных задач (криптография, обработка изображений), не блокирующие Event Loop',
        'Пул соединений к базе данных',
        'Инструмент для параллельного запуска тестов',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Worker Threads создают настоящие OS потоки с отдельными Event Loop и V8. Общение через postMessage или SharedArrayBuffer. Используйте для CPU-интенсивных задач: компрессия, шифрование, обработка изображений, машинное обучение. НЕ используйте для I/O — для этого Event Loop и так эффективен.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-nodejs-7',
      topic: 'Node.js',
      text: 'Что такое fs.promises и зачем использовать async файловые операции?',
      options: [
        'Синхронные файловые операции для безопасного чтения',
        'Promise-based API для файловых операций, не блокирующих Event Loop в отличие от fs.readFileSync',
        'Специальный API для работы с большими файлами',
        'Метод для работы с файлами в Worker Threads',
      ],
      correctAnswerIndex: 1,
      explanation:
        'fs.readFileSync блокирует Event Loop — всё приложение ждёт чтения файла. fs.promises.readFile (или fs.readFile с callback) выполняется через libuv thread pool асинхронно, не блокируя Event Loop. В server-side коде ВСЕГДА используйте async версии для максимальной производительности.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-nodejs-8',
      topic: 'Node.js',
      text: 'Как работает require() и module caching в Node.js?',
      options: [
        'require() загружает файл каждый раз заново при вызове',
        'При первом require() модуль загружается, выполняется и кэшируется; последующие вызовы возвращают кэшированный exports объект',
        'require() аналогичен import и всегда загружает свежую копию',
        'Кэширование происходит только в production режиме',
      ],
      correctAnswerIndex: 1,
      explanation:
        'CommonJS require(): 1) Разрешает путь; 2) Проверяет require.cache; 3) Если нет — создаёт Module объект, оборачивает файл в функцию, выполняет, кэширует module.exports. Модуль — синглтон. Можно очистить кэш: delete require.cache[modulePath]. Круговые зависимости получают частично заполненный exports.',
      difficulty: KnowledgeLevel.middle,
    },

    // NestJS
    {
      id: 'q-nestjs-1',
      topic: 'NestJS',
      text: 'Что такое Provider в NestJS и как работает Dependency Injection?',
      options: [
        'Поставщик внешних API для NestJS',
        'Класс с @Injectable(), который может быть инжектирован через constructor; DI контейнер создаёт экземпляры и управляет зависимостями',
        'Конфигурационный файл для модуля',
        'Middleware для обработки запросов',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Provider в NestJS — класс, декорированный @Injectable(). NestJS IoC контейнер создаёт экземпляры и инжектирует зависимости через constructor. Жизненный цикл: singleton по умолчанию (один экземпляр на модуль). Scope.REQUEST — новый экземпляр для каждого запроса. Scope.TRANSIENT — новый для каждого инжекта.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-nestjs-2',
      topic: 'NestJS',
      text: 'В чём разница между Guard, Interceptor и Middleware в NestJS?',
      options: [
        'Это синонимы для разных версий NestJS',
        'Middleware — до роутера; Guard — авторизация (boolean); Interceptor — до/после handler, трансформация ответа; все часть request lifecycle',
        'Guard для frontend, Middleware для backend, Interceptor для базы данных',
        'Только Guard нужен для безопасности',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Порядок выполнения: Middleware → Guard → Interceptor (before) → Pipe → Controller → Interceptor (after) → ExceptionFilter. Middleware: не знает о контексте выполнения. Guard: возвращает true/false, решает доступ. Interceptor: работает с Observable, может изменять запрос и ответ. Pipe: трансформация/валидация аргументов.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-nestjs-3',
      topic: 'NestJS',
      text: 'Что такое модули в NestJS и зачем нужен декоратор @Module?',
      options: [
        'Файлы с расширением .module.ts',
        '@Module организует приложение в связанные компоненты: imports (другие модули), controllers (маршруты), providers (сервисы), exports (доступные снаружи)',
        'Способ импортировать npm пакеты',
        'Конфигурация маршрутизатора',
      ],
      correctAnswerIndex: 1,
      explanation:
        '@Module() — основа архитектуры NestJS. imports: другие модули, чьи exports нужны. controllers: HTTP обработчики. providers: сервисы, guards, pipes (инжектируются только внутри модуля). exports: провайдеры, доступные другим модулям. Каждый модуль создаёт изолированную область видимости DI.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-nestjs-4',
      topic: 'NestJS',
      text: 'Что такое Pipes в NestJS?',
      options: [
        'Каналы передачи данных между сервисами',
        'Классы с @Injectable() для трансформации входных данных или их валидации; могут бросать исключения',
        'Шаблоны для генерации кода',
        'Декораторы для маршрутов',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Pipes выполняют две задачи: трансформацию (ParseIntPipe, ParseUUIDPipe) и валидацию (ValidationPipe). Применяются на: параметры (@Param, @Query, @Body), методы контроллера, глобально. ValidationPipe с class-validator автоматически валидирует DTO и бросает BadRequestException при ошибках.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-nestjs-5',
      topic: 'NestJS',
      text: 'Как реализовать аутентификацию с JWT в NestJS?',
      options: [
        'Использовать middleware для проверки каждого запроса',
        '@nestjs/passport с JwtStrategy (extracting token → validating payload) + JwtAuthGuard защищает эндпоинты',
        'Хранить JWT в базе данных и проверять при каждом запросе',
        'Использовать встроенный NestJS AuthModule',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Стандартный подход: PassportModule + JwtModule. JwtStrategy extends PassportStrategy(Strategy) — определяет как извлечь токен (из заголовка или cookie) и validate(payload) возвращает пользователя. JwtAuthGuard extends AuthGuard("jwt") — применяется к роутам. @UseGuards(JwtAuthGuard) или глобально.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-nestjs-6',
      topic: 'NestJS',
      text: 'Что такое Custom Decorators в NestJS?',
      options: [
        'Декораторы для кастомизации внешнего вида Swagger',
        'Созданные разработчиком декораторы через createParamDecorator или SetMetadata для добавления функциональности к эндпоинтам',
        'Встроенные декораторы NestJS для работы с базой данных',
        'Плагины для NestJS CLI',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Custom decorators: createParamDecorator((data, ctx) => ...) — для параметров роута (например, @CurrentUser()). SetMetadata(key, value) + Reflector в Guard — для метаданных (@Roles("admin")). Composable decorators: applyDecorators(...decorators) объединяет несколько декораторов в один.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-nestjs-7',
      topic: 'NestJS',
      text: 'Как реализовать глобальную обработку ошибок в NestJS?',
      options: [
        'Использовать try/catch в каждом контроллере',
        'ExceptionFilter с @Catch() — перехватывает исключения и формирует ответ; регистрируется через app.useGlobalFilters()',
        'Middleware для перехвата всех ошибок',
        'Interceptor с catchError оператором RxJS',
      ],
      correctAnswerIndex: 1,
      explanation:
        '@Catch(HttpException) + implements ExceptionFilter: метод catch(exception, host) формирует унифицированный ответ. @Catch() без аргументов — ловит всё. Порядок: встроенные NestJS исключения → кастомные фильтры. app.useGlobalFilters(new HttpExceptionFilter()) применяет ко всему приложению.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-nestjs-8',
      topic: 'NestJS',
      text: 'Что такое ConfigModule в NestJS и как его использовать?',
      options: [
        'Встроенный модуль для работы с конфигурационными файлами JSON',
        '@nestjs/config — модуль для работы с переменными окружения (.env); ConfigService.get() типизированный доступ к конфигурации',
        'Инструмент для управления версиями конфигурации',
        'Способ хранения конфигурации в базе данных',
      ],
      correctAnswerIndex: 1,
      explanation:
        'ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }) загружает .env и регистрирует ConfigService. ConfigService.get<string>("JWT_SECRET") — типизированный доступ. Валидация через Joi: validationSchema: Joi.object({PORT: Joi.number().default(3000)}). Кастомная конфигурация: load: [() => ({port: parseInt(process.env.PORT)})].',
      difficulty: KnowledgeLevel.middle,
    },

    // Базы данных
    {
      id: 'q-db-1',
      topic: 'Базы данных',
      text: 'Что такое ACID транзакции в базах данных?',
      options: [
        'Протокол химической безопасности для баз данных',
        'Atomicity (всё или ничего), Consistency (целостность), Isolation (изоляция), Durability (долговечность)',
        'Алгоритм шифрования данных',
        'Метод резервного копирования',
      ],
      correctAnswerIndex: 1,
      explanation:
        'ACID: Atomicity — транзакция выполняется полностью или откатывается. Consistency — данные остаются в согласованном состоянии. Isolation — транзакции не видят незафиксированных изменений других. Durability — зафиксированные данные сохраняются даже при сбоях. PostgreSQL полностью ACID-совместим.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-db-2',
      topic: 'Базы данных',
      text: 'Что такое N+1 проблема и как её решить?',
      options: [
        'Ошибка в SQL синтаксисе при работе с NULL значениями',
        'Антипаттерн: 1 запрос для получения списка + N запросов для каждой записи; решается через JOIN, eager loading или DataLoader',
        'Ограничение PostgreSQL на количество соединений',
        'Проблема при работе с транзакциями',
      ],
      correctAnswerIndex: 1,
      explanation:
        'N+1: загрузили 100 пользователей (1 запрос), затем для каждого загружаем заказы (100 запросов) = 101 запрос. Решения: 1) SQL JOIN; 2) Prisma: include {orders: true}; 3) DataLoader — батчинг N запросов в один; 4) Денормализация. N+1 — одна из главных причин медленных API.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-db-3',
      topic: 'Базы данных',
      text: 'Что такое индексы в базах данных и когда они помогают?',
      options: [
        'Числовые идентификаторы для строк таблицы',
        'Структуры данных (B-tree, хеш), ускоряющие поиск; эффективны для SELECT с WHERE, ORDER BY, JOIN по индексированным колонкам',
        'Способ сжатия данных в базе',
        'Ограничения для обеспечения уникальности',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Индексы — отдельные структуры данных (B-tree по умолчанию в PostgreSQL), позволяющие найти строки без полного сканирования таблицы. Помогают: WHERE по индексированной колонке, ORDER BY, JOIN по ключам. НЕ помогают: обновление данных (индекс поддерживается), функции от колонки (WHERE LOWER(email)), маленькие таблицы.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-db-4',
      topic: 'Базы данных',
      text: 'Что такое нормализация базы данных и когда применять денормализацию?',
      options: [
        'Нормализация — способ ускорить запросы разбиением таблиц',
        'Нормализация уменьшает избыточность (1NF→2NF→3NF); денормализация — намеренное введение избыточности для ускорения чтения',
        'Нормализация — это индексирование всех колонок',
        'Денормализация применяется только в NoSQL базах',
      ],
      correctAnswerIndex: 1,
      explanation:
        '1NF: атомарные значения, уникальные строки. 2NF: нет частичных зависимостей. 3NF: нет транзитивных зависимостей. Нормализация: меньше дублирования, проще обновление. Денормализация: часть данных дублируется для ускорения READ (счётчики, кэшированные значения). Применяется в аналитических системах, когда JOIN становятся узким местом.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-db-5',
      topic: 'Базы данных',
      text: 'Что такое Prisma ORM и каковы его основные преимущества?',
      options: [
        'Библиотека для работы с Redis',
        'Type-safe ORM с автогенерируемым клиентом из schema.prisma, поддерживает миграции и имеет отличный DX',
        'Фреймворк для создания GraphQL API',
        'Инструмент визуального проектирования баз данных',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Prisma: 1) schema.prisma — единственный источник правды для моделей; 2) prisma generate создаёт типизированный клиент; 3) Автокомплит и type-safety в запросах; 4) Migrations с версионированием; 5) Prisma Studio — GUI для данных; 6) Поддержка PostgreSQL, MySQL, SQLite, MongoDB. Минусы: менее гибкий чем raw SQL для сложных запросов.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-db-6',
      topic: 'Базы данных',
      text: 'Что такое уровни изоляции транзакций?',
      options: [
        'Уровни доступа пользователей к базе данных',
        'Read Uncommitted, Read Committed, Repeatable Read, Serializable — определяют видимость изменений между параллельными транзакциями',
        'Способы шифрования транзакций',
        'Типы блокировок строк в PostgreSQL',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Уровни изоляции (от низкого к высокому): Read Uncommitted (грязное чтение), Read Committed (по умолчанию в PostgreSQL, нет грязного чтения), Repeatable Read (нет неповторяемого чтения), Serializable (нет фантомных чтений, транзакции как последовательные). Выше уровень = меньше аномалий = больше блокировок = меньше производительность.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-db-7',
      topic: 'Базы данных',
      text: 'Что такое CAP теорема?',
      options: [
        'Принцип проектирования SQL схем',
        'Распределённая система может гарантировать одновременно только 2 из 3: Consistency, Availability, Partition tolerance',
        'Методология оценки производительности баз данных',
        'Алгоритм сжатия данных',
      ],
      correctAnswerIndex: 1,
      explanation:
        'CAP теорема (Брюер): Consistency (все узлы видят одни данные), Availability (каждый запрос получает ответ), Partition tolerance (работает при потере связи между узлами). В реальных распределённых системах разделение неизбежно, поэтому выбор между CP (PostgreSQL, HBase) и AP (Cassandra, CouchDB). MongoDB: CP по умолчанию.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-db-8',
      topic: 'Базы данных',
      text: 'Что такое шардинг базы данных?',
      options: [
        'Разделение таблицы на вертикальные части по колонкам',
        'Горизонтальное партиционирование — разбивка данных на независимые части (шарды) по разным серверам для масштабирования',
        'Резервное копирование с инкрементными снимками',
        'Репликация базы данных',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Шардинг — горизонтальное масштабирование: данные делятся по ключу шардинга (user_id % N) между несколькими серверами. Каждый сервер хранит свой шард. Плюсы: масштабирование записи, большие объёмы данных. Минусы: сложные JOIN, транзакции между шардами, перешардинг. Используется в очень крупных системах (ВКонтакте, Telegram).',
      difficulty: KnowledgeLevel.senior,
    },

    // Алгоритмы
    {
      id: 'q-algo-1',
      topic: 'Алгоритмы',
      text: 'Какова временная сложность бинарного поиска?',
      options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
      correctAnswerIndex: 2,
      explanation:
        'Бинарный поиск делит отсортированный массив пополам на каждом шаге. Для массива из n элементов: максимум log₂(n) сравнений. n=1000 → 10 шагов, n=1000000 → 20 шагов. Требование: массив должен быть отсортирован. Сложность по памяти: O(1) итеративно, O(log n) рекурсивно (стек вызовов).',
      difficulty: KnowledgeLevel.junior,
    },
    {
      id: 'q-algo-2',
      topic: 'Алгоритмы',
      text: 'Что такое динамическое программирование?',
      options: [
        'Программирование с использованием динамических переменных',
        'Метод решения задач через разбивку на подзадачи с сохранением (мемоизацией) результатов для избежания повторных вычислений',
        'Автоматическое изменение кода во время выполнения',
        'Способ оптимизации памяти в алгоритмах',
      ],
      correctAnswerIndex: 1,
      explanation:
        'DP решает задачи, разбивая их на перекрывающиеся подзадачи и сохраняя результаты. Два подхода: top-down (мемоизация) — рекурсия + кэш; bottom-up (tabulation) — итеративное заполнение таблицы. Примеры: числа Фибоначчи, рюкзак, редакционное расстояние, задача о монетах, LCS.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-algo-3',
      topic: 'Алгоритмы',
      text: 'Какой алгоритм сортировки имеет среднюю сложность O(n log n) и при этом работает "in-place"?',
      options: ['Merge Sort', 'Quick Sort', 'Bubble Sort', 'Counting Sort'],
      correctAnswerIndex: 1,
      explanation:
        'Quick Sort (быстрая сортировка): выбирает pivot, разбивает массив на элементы меньше/больше pivot, рекурсивно сортирует части. Среднее: O(n log n). Худший случай: O(n²) при плохом выборе pivot. In-place (O(log n) памяти для стека). Merge Sort: гарантированное O(n log n), но O(n) памяти.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-algo-4',
      topic: 'Алгоритмы',
      text: 'Что такое "скользящее окно" (sliding window) техника?',
      options: [
        'Метод работы с прокруткой в интерфейсах',
        'Алгоритмический паттерн для задач с подмассивами/подстроками: поддерживается окно фиксированного или переменного размера без пересчёта с нуля',
        'Алгоритм кэширования данных в браузере',
        'Способ сжатия данных',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Sliding Window оптимизирует задачи на подмассивы. Вместо O(n²) перебора всех подмассивов — двигаем окно за O(n). Пример: максимальная сумма подмассива длины k. Fixed window: оба указателя двигаются синхронно. Variable window: правый указатель расширяет, левый сужает по условию. Позволяет избежать вложенных циклов.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-algo-5',
      topic: 'Алгоритмы',
      text: 'В чём разница между BFS и DFS для обхода графа?',
      options: [
        'BFS для деревьев, DFS для графов',
        'BFS (очередь) обходит по уровням, находит кратчайший путь в невзвешенном графе; DFS (стек/рекурсия) идёт вглубь, используется для поиска цикла, топологической сортировки',
        'BFS быстрее DFS для всех задач',
        'DFS использует больше памяти чем BFS',
      ],
      correctAnswerIndex: 1,
      explanation:
        'BFS (очередь): обходит слой за слоем, гарантирует кратчайший путь в невзвешенном графе, больше памяти O(w) где w — ширина. DFS (стек/рекурсия): идёт до конца пути, затем возвращается, меньше памяти O(h) где h — высота. DFS применяется: обнаружение цикла, топологическая сортировка, связные компоненты.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-algo-6',
      topic: 'Алгоритмы',
      text: 'Что такое два указателя (two pointers) техника?',
      options: [
        'Использование двух переменных для хранения указателей на объекты',
        'Паттерн с двумя индексами, движущимися к друг другу или в одном направлении по массиву, для решения задач за O(n) вместо O(n²)',
        'Метод работы с двусвязными списками',
        'Способ обхода двумерных массивов',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Two Pointers: два индекса в массиве/строке. 1) Сближающиеся: left=0, right=n-1 двигаются навстречу (поиск пары с суммой, палиндром, Container With Most Water). 2) Скользящее окно: оба идут вправо. Требует отсортированного массива для многих задач. Сложность O(n) вместо O(n²) вложенного цикла.',
      difficulty: KnowledgeLevel.middle,
    },
    {
      id: 'q-algo-7',
      topic: 'Алгоритмы',
      text: 'Что такое пирамидальная сортировка (Heap Sort) и в чём преимущество кучи?',
      options: [
        'Сортировка путём разделения массива на две кучи',
        'Сортировка с использованием бинарной кучи (min/max heap); куча даёт O(log n) для insert и extractMin/Max',
        'Рекурсивная сортировка слиянием',
        'Сортировка путём построения графа зависимостей',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Heap — бинарное дерево, где родитель >= детей (max-heap). Операции: insert O(log n), extractMax O(log n), peek O(1). Heap Sort: построить max-heap O(n), затем n раз извлекать максимум O(n log n). Итого O(n log n), in-place O(1). Куча используется для: Priority Queue, медиана потока, K наибольших элементов.',
      difficulty: KnowledgeLevel.senior,
    },
    {
      id: 'q-algo-8',
      topic: 'Алгоритмы',
      text: 'Что такое топологическая сортировка и где применяется?',
      options: [
        'Сортировка по географическому расположению данных',
        'Линейный порядок вершин ориентированного ациклического графа (DAG), где для каждого ребра u→v, u идёт раньше v',
        'Способ упорядочить элементы по приоритету',
        'Оптимальная сортировка для баз данных',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Топологическая сортировка применима только к DAG (нет циклов). Алгоритмы: Кан (BFS с in-degree) и DFS (постпорядок). Применения: порядок сборки зависимостей (npm install), планирование задач с зависимостями, компиляция модулей, определение порядка миграций базы данных. Наличие цикла = топологическая сортировка невозможна.',
      difficulty: KnowledgeLevel.senior,
    },
  ];

  for (const q of questionsData) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: {
        id: q.id,
        topic: q.topic,
        text: q.text,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation,
        difficulty: q.difficulty,
        sourceType: QuestionSource.static,
      },
    });
  }

  console.log(`Created ${questionsData.length} questions`);

  for (const roadmap of ROADMAPS) {
    await seedContentEntry(
      ContentEntryType.roadmap,
      roadmap.slug,
      roadmap.title,
      roadmap as unknown as Prisma.InputJsonValue,
    );
  }

  for (const task of LIVE_CODING_TASKS) {
    await seedContentEntry(
      ContentEntryType.live_coding_task,
      task.slug,
      task.title,
      task as unknown as Prisma.InputJsonValue,
    );
  }

  for (const theme of TEST_CATALOG_THEMES) {
    await seedContentEntry(
      ContentEntryType.test_catalog_theme,
      theme.slug,
      theme.title,
      theme as unknown as Prisma.InputJsonValue,
    );
  }

  console.log(
    `Seeded content entries: ${ROADMAPS.length} roadmaps, ${LIVE_CODING_TASKS.length} live coding tasks, ${TEST_CATALOG_THEMES.length} test themes`,
  );

  // Create sample test sessions for stats
  const testSession1 = await prisma.testSession.create({
    data: {
      userId: demoUser.id,
      mode: 'topic',
      topic: 'JavaScript',
      correctCount: 8,
      incorrectCount: 2,
      totalQuestions: 10,
      durationSeconds: 420,
      accuracyPercent: 80,
    },
  });

  const testSession2 = await prisma.testSession.create({
    data: {
      userId: seniorUser.id,
      mode: 'time_attack',
      correctCount: 15,
      incorrectCount: 3,
      totalQuestions: 18,
      durationSeconds: 600,
      accuracyPercent: 83.33,
    },
  });

  const testSession3 = await prisma.testSession.create({
    data: {
      userId: juniorUser.id,
      mode: 'topic',
      topic: 'HTML/CSS',
      correctCount: 5,
      incorrectCount: 3,
      totalQuestions: 8,
      durationSeconds: 300,
      accuracyPercent: 62.5,
    },
  });

  // Add some answer history
  const jsQuestions = questionsData.filter((q) => q.topic === 'JavaScript').slice(0, 5);
  for (const q of jsQuestions) {
    await prisma.testAnswerHistory.create({
      data: {
        testSessionId: testSession1.id,
        questionId: q.id,
        selectedAnswerIndex: q.correctAnswerIndex,
        isCorrect: true,
      },
    });
  }

  // Create reminders
  await prisma.reminder.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      enabled: true,
      time: '09:00',
      weekdays: [1, 2, 3, 4, 5],
    },
  });

  console.log('Seed completed successfully!');
  console.log('Demo users:');
  console.log('  demo@example.com / password123');
  console.log('  junior@example.com / password123');
  console.log('  senior@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
