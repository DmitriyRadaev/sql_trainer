const theoryData = {
    // Раздел 1 SELECT и базовая фильтрация
    select: {
        title: 'SELECT и базовая фильтрация',
        content: `
            <h3><i class="fas fa-bookmark"></i> SELECT и базовая фильтрация</h3>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Основная структура SELECT запроса</h3>
                <pre><code>SELECT колонки
FROM таблица
WHERE условие
ORDER BY колонка [ASC|DESC]
LIMIT количество;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> SELECT</h3>
                <p>Команда SELECT используется для выборки данных из базы данных.</p>
                <pre><code>-- Выбрать все колонки
SELECT * FROM patients;

-- Выбрать конкретные колонки
SELECT first_name, last_name FROM patients;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> WHERE - фильтрация строк</h3>
                <p>WHERE позволяет отфильтровать строки по условию.</p>
                <pre><code>-- Сравнение
WHERE age > 18
WHERE gender = 'Male'

-- Логические операторы
WHERE age > 18 AND gender = 'Male'
WHERE specialization = 'Кардиолог' OR specialization = 'Хирург'</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Операторы сравнения</h3>
                <ul>
                    <li><code>=</code> - равно</li>
                    <li><code>!=</code> или <code><></code> - не равно</li>
                    <li><code>></code> - больше</li>
                    <li><code><</code> - меньше</li>
                    <li><code>>=</code> - больше или равно</li>
                    <li><code><=</code> - меньше или равно</li>
                </ul>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Специальные операторы</h3>
                <pre><code>-- BETWEEN - между значениями
WHERE birth_date BETWEEN '1980-01-01' AND '1990-12-31'

-- IN - в списке значений
WHERE blood_type IN ('A+', 'B+', 'O+')

-- LIKE - поиск по шаблону
WHERE last_name LIKE 'С%'     -- начинается с С
WHERE last_name LIKE '%ва'    -- заканчивается на ва
WHERE last_name LIKE '%ов%'   -- содержит ов

-- IS NULL / IS NOT NULL - проверка на NULL
WHERE phone IS NULL
WHERE email IS NOT NULL</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> ORDER BY - сортировка</h3>
                <pre><code>-- По возрастанию (по умолчанию)
ORDER BY birth_date

-- По убыванию
ORDER BY birth_date DESC

-- По нескольким полям
ORDER BY specialization, hire_date</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> LIMIT и OFFSET - ограничение результатов</h3>
                <pre><code>-- Только первые 5 записей
LIMIT 5

-- Пропустить 10 записей и взять следующие 5
LIMIT 5 OFFSET 10

-- Для пагинации (страница 3 по 10 записей)
LIMIT 10 OFFSET 20</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> DISTINCT - уникальные значения</h3>
                <pre><code>-- Только уникальные специализации
SELECT DISTINCT specialization FROM doctors;

-- Количество уникальных специализаций
SELECT COUNT(DISTINCT specialization) FROM doctors;</code></pre>
            </div>
            
            <div class="theory-note">
                <p><strong><i class="fas fa-lightbulb text-warning me-2"></i> Совет:</strong> Всегда начинайте с простого SELECT * FROM таблица, чтобы увидеть структуру данных, затем добавляйте условия.</p>
            </div>
        `
    },
    
    // Раздел 2 JOIN и связи между таблицами
    join: {
        title: 'JOIN и связи между таблицами',
        content: `
            <h3><i class="fas fa-link"></i> JOIN и связи между таблицами</h3>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Зачем нужны JOIN?</h3>
                <p>JOIN позволяют объединять данные из нескольких таблиц по связям между ними. В медицинской базе данные нормализованы (разбиты на таблицы), и JOIN нужны для получения полной информации.</p>
                <p>Пример связи: <code>visits.patient_id → patients.patient_id</code></p>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> INNER JOIN</h3>
                <p>Возвращает только те строки, для которых есть соответствие в обеих таблицах.</p>
                <pre><code>SELECT v.visit_id, p.first_name, p.last_name
FROM visits v
INNER JOIN patients p ON v.patient_id = p.patient_id;

-- Ключевое слово INNER можно опустить
SELECT v.visit_id, p.first_name
FROM visits v
JOIN patients p ON v.patient_id = p.patient_id;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> LEFT JOIN</h3>
                <p>Возвращает все строки из левой таблицы, даже если нет соответствия в правой. Для отсутствующих данных будет NULL.</p>
                <pre><code>-- Все пациенты, даже те, у кого не было посещений
SELECT p.first_name, v.visit_id
FROM patients p
LEFT JOIN visits v ON p.patient_id = v.patient_id;

-- Только пациенты без посещений
SELECT p.first_name
FROM patients p
LEFT JOIN visits v ON p.patient_id = v.patient_id
WHERE v.visit_id IS NULL;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> RIGHT JOIN</h3>
                <p>Возвращает все строки из правой таблицы. Аналог LEFT JOIN, но с другой стороны.</p>
                <pre><code>SELECT v.visit_id, d.first_name
FROM visits v
RIGHT JOIN doctors d ON v.doctor_id = d.doctor_id;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> FULL JOIN</h3>
                <p>Возвращает все строки из обеих таблиц. В PostgreSQL используется FULL OUTER JOIN.</p>
                <pre><code>SELECT p.first_name, v.visit_id
FROM patients p
FULL OUTER JOIN visits v ON p.patient_id = v.patient_id;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Соединение нескольких таблиц</h3>
                <pre><code>SELECT v.visit_id, 
       p.first_name as patient,
       d.first_name as doctor,
       dep.dept_name
FROM visits v
JOIN patients p ON v.patient_id = p.patient_id
JOIN doctors d ON v.doctor_id = d.doctor_id
JOIN departments dep ON v.dept_id = dep.dept_id;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Объединение с агрегацией</h3>
                <pre><code>-- Количество посещений для каждого врача
SELECT d.first_name, d.last_name, COUNT(v.visit_id) as visits
FROM doctors d
LEFT JOIN visits v ON d.doctor_id = v.doctor_id
GROUP BY d.doctor_id, d.first_name, d.last_name;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Самообъединение (SELF JOIN)</h3>
                <p>Соединение таблицы с самой собой.</p>
                <pre><code>-- Пациенты с одинаковой группой крови
SELECT p1.first_name, p1.last_name, p2.first_name, p2.last_name
FROM patients p1
JOIN patients p2 ON p1.blood_type = p2.blood_type
WHERE p1.patient_id < p2.patient_id;</code></pre>
            </div>
            
            <div class="theory-note">
                <p><strong><i class="fas fa-lightbulb text-warning me-2"></i> Совет:</strong> Начинайте с INNER JOIN, затем пробуйте LEFT JOIN, чтобы увидеть разницу. Всегда проверяйте, не теряются ли данные при объединении.</p>
            </div>
        `
    },
    
    // Раздел 3 Агрегация и GROUP BY
    aggregate: {
        title: 'Агрегация и GROUP BY',
        content: `
            <h3><i class="fas fa-chart-bar"></i> Агрегация и GROUP BY</h3>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Агрегатные функции</h3>
                <p>Агрегатные функции выполняют вычисления над набором строк и возвращают одно значение.</p>
                <ul>
                    <li><code>COUNT()</code> - количество строк</li>
                    <li><code>SUM()</code> - сумма значений</li>
                    <li><code>AVG()</code> - среднее значение</li>
                    <li><code>MIN()</code> - минимальное значение</li>
                    <li><code>MAX()</code> - максимальное значение</li>
                </ul>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> COUNT - подсчет количества</h3>
                <pre><code>-- Общее количество пациентов
SELECT COUNT(*) FROM patients;

-- Количество врачей-кардиологов
SELECT COUNT(*) FROM doctors WHERE specialization = 'Кардиолог';

-- Количество уникальных специализаций
SELECT COUNT(DISTINCT specialization) FROM doctors;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> SUM и AVG - сумма и среднее</h3>
                <pre><code>-- Общая стоимость всех лекарств
SELECT SUM(price) FROM medications;

-- Средняя цена лекарств
SELECT AVG(price) FROM medications;

-- Средний возраст пациентов
SELECT AVG(EXTRACT(YEAR FROM age(birth_date))) FROM patients;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> MIN и MAX - минимум и максимум</h3>
                <pre><code>-- Самый молодой пациент
SELECT MAX(birth_date) FROM patients;

-- Самый старший пациент
SELECT MIN(birth_date) FROM patients;

-- Самая высокая температура
SELECT MAX(temperature) FROM vitals;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> GROUP BY - группировка</h3>
                <p>GROUP BY группирует строки по одинаковым значениям указанных колонок.</p>
                <pre><code>-- Количество пациентов по группам крови
SELECT blood_type, COUNT(*) as count
FROM patients
GROUP BY blood_type;

-- Средний возраст по полу
SELECT gender, AVG(EXTRACT(YEAR FROM age(birth_date))) as avg_age
FROM patients
GROUP BY gender;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> HAVING - фильтрация групп</h3>
                <p>HAVING фильтрует группы после GROUP BY (аналог WHERE для групп).</p>
                <pre><code>-- Группы крови, встречающиеся более 2 раз
SELECT blood_type, COUNT(*) as count
FROM patients
GROUP BY blood_type
HAVING COUNT(*) > 2;

-- Врачи с более чем 5 посещениями
SELECT doctor_id, COUNT(*) as visits
FROM visits
GROUP BY doctor_id
HAVING COUNT(*) > 5;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> GROUP BY с несколькими полями</h3>
                <pre><code>-- Количество пациентов по полу и группе крови
SELECT gender, blood_type, COUNT(*)
FROM patients
GROUP BY gender, blood_type
ORDER BY gender, blood_type;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Порядок выполнения запроса</h3>
                <pre><code>1. FROM - выбор таблицы
2. WHERE - фильтрация строк
3. GROUP BY - группировка
4. HAVING - фильтрация групп
5. SELECT - выбор колонок
6. ORDER BY - сортировка
7. LIMIT - ограничение</code></pre>
            </div>
            
            <div class="theory-note">
                <p><strong><i class="fas fa-lightbulb text-warning me-2"></i> Совет:</strong> Все колонки в SELECT, не участвующие в агрегатных функциях, должны быть указаны в GROUP BY.</p>
            </div>
        `
    },
    
    // Раздел 4 Подзапросы и продвинутые конструкции
    subquery: {
        title: 'Подзапросы и продвинутые конструкции',
        content: `
            <h3><i class="fas fa-search"></i> Подзапросы и продвинутые конструкции</h3>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Что такое подзапрос?</h3>
                <p>Подзапрос (subquery) - это запрос внутри другого запроса. Результат подзапроса используется основным запросом.</p>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Подзапрос в WHERE (скалярный)</h3>
                <pre><code>-- Пациенты старше среднего возраста
SELECT * FROM patients 
WHERE birth_date < (SELECT AVG(birth_date) FROM patients);

-- Врачи с посещениями выше среднего
SELECT doctor_id, COUNT(*) as visits
FROM visits
GROUP BY doctor_id
HAVING COUNT(*) > (SELECT AVG(visits) 
                   FROM (SELECT COUNT(*) as visits 
                         FROM visits 
                         GROUP BY doctor_id) as avg_visits);</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Подзапрос с IN</h3>
                <pre><code>-- Пациенты, у которых была температура выше 38
SELECT * FROM patients 
WHERE patient_id IN (
    SELECT DISTINCT patient_id 
    FROM visits v
    JOIN vitals vt ON v.visit_id = vt.visit_id
    WHERE vt.temperature > 38.0
);</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Подзапрос с EXISTS</h3>
                <p>EXISTS проверяет, возвращает ли подзапрос хотя бы одну строку.</p>
                <pre><code>-- Врачи, у которых были посещения с высокой температурой
SELECT * FROM doctors d
WHERE EXISTS (
    SELECT 1 FROM visits v
    JOIN vitals vt ON v.visit_id = vt.visit_id
    WHERE v.doctor_id = d.doctor_id 
    AND vt.temperature > 39.0
);</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Подзапрос в SELECT</h3>
                <pre><code>-- Пациенты и количество их посещений
SELECT p.*, 
       (SELECT COUNT(*) 
        FROM visits v 
        WHERE v.patient_id = p.patient_id) as visits_count
FROM patients p;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Подзапрос в FROM</h3>
                <pre><code>-- Среднее количество посещений по врачам
SELECT AVG(visits_count) as avg_visits
FROM (
    SELECT doctor_id, COUNT(*) as visits_count
    FROM visits
    GROUP BY doctor_id
) as doctor_visits;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> CTE (Common Table Expressions) - WITH</h3>
                <p>CTE позволяют создавать временные именованные наборы данных.</p>
                <pre><code>WITH adult_patients AS (
    SELECT * FROM patients 
    WHERE birth_date < '1980-01-01'
)
SELECT * FROM adult_patients
WHERE gender = 'Male';

-- Более сложный пример
WITH doctor_visits AS (
    SELECT d.doctor_id, d.first_name, d.last_name, COUNT(v.visit_id) as visits
    FROM doctors d
    LEFT JOIN visits v ON d.doctor_id = v.doctor_id
    GROUP BY d.doctor_id, d.first_name, d.last_name
)
SELECT * FROM doctor_visits
WHERE visits > (SELECT AVG(visits) FROM doctor_visits);</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> Оконные функции</h3>
                <p>Оконные функции выполняют вычисления над набором строк, связанных с текущей строкой.</p>
                <pre><code>-- ROW_NUMBER - нумерация строк
SELECT first_name, last_name, birth_date,
       ROW_NUMBER() OVER (ORDER BY birth_date) as age_rank
FROM patients;

-- RANK - ранжирование с пропусками
SELECT doctor_id, COUNT(*) as visits,
       RANK() OVER (ORDER BY COUNT(*) DESC) as rank
FROM visits
GROUP BY doctor_id;

-- LAG - предыдущее значение
SELECT patient_id, visit_date,
       LAG(visit_date) OVER (PARTITION BY patient_id ORDER BY visit_date) as prev_visit
FROM visits;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> UNION, INTERSECT, EXCEPT</h3>
                <pre><code>-- UNION - объединение без дубликатов
SELECT first_name, last_name FROM patients
UNION
SELECT first_name, last_name FROM doctors;

-- INTERSECT - пересечение
SELECT first_name FROM patients
INTERSECT
SELECT first_name FROM doctors;

-- EXCEPT - разность
SELECT first_name FROM patients
EXCEPT
SELECT first_name FROM doctors;</code></pre>
            </div>
            
            <div class="theory-section">
                <h3><i class="fas fa-square text-primary me-2"></i> CASE - условная логика</h3>
                <pre><code>SELECT first_name, last_name,
    CASE 
        WHEN EXTRACT(YEAR FROM age(birth_date)) < 18 THEN 'Ребенок'
        WHEN EXTRACT(YEAR FROM age(birth_date)) BETWEEN 18 AND 60 THEN 'Взрослый'
        ELSE 'Пожилой'
    END as age_category
FROM patients;

-- CASE в GROUP BY
SELECT 
    CASE 
        WHEN temperature > 38.0 THEN 'Высокая'
        ELSE 'Нормальная'
    END as temp_category,
    COUNT(*) as count
FROM vitals
GROUP BY temp_category;</code></pre>
            </div>
            
            <div class="theory-note">
                <p><strong><i class="fas fa-lightbulb text-warning me-2"></i> Совет:</strong> Начинайте с простых подзапросов, затем переходите к CTE. CTE делают сложные запросы более читаемыми.</p>
            </div>
        `
    }
};