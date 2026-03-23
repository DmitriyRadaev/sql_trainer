document.addEventListener('DOMContentLoaded', function() {
    createSchemaModal();
    
    // Добавляем обработчик для кнопки "Схема БД"
    const schemaTitle = document.querySelector('.sidebar h3:nth-of-type(2)');
    if (schemaTitle) {
        schemaTitle.style.cursor = 'pointer';
        schemaTitle.title = 'Нажмите для просмотра полной схемы';
        schemaTitle.addEventListener('click', openSchemaModal);
    }
});

function createSchemaModal() {
    // Проверяем, не создано ли уже окно
    if (document.getElementById('schemaModal')) return;
    
    const modalHTML = `
        <div id="schemaModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Схема базы данных</h5>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="schema-tabs">
                        <button class="tab-button active" onclick="showTab('diagram')">Диаграмма</button>
                        <button class="tab-button" onclick="showTab('description')">Описание</button>
                        <button class="tab-button" onclick="showTab('relationships')">Связи</button>
                        <button class="tab-button" onclick="showTab('queries')">Примеры запросов</button>
                    </div>
                    
                    <div id="diagram-tab" class="tab-content active">
                        <div class="schema-diagram">
                            <svg viewBox="0 0 800 600" class="diagram-svg">
                            </svg>
                        </div>
                    </div>
                    
                    <div id="description-tab" class="tab-content">
                        <div class="schema-description">
                            <h3><i class="fas fa-table text-primary"></i> Таблицы базы данных</h3>
                            <div class="tables-grid"></div>
                        </div>
                    </div>
                    
                    <div id="relationships-tab" class="tab-content">
                        <div class="relationships-info">
                            <h3><i class="fas fa-link text-primary"></i> Связи между таблицами</h3>
                            <ul class="relationships-list"></ul>
                        </div>
                    </div>
                    
                    <div id="queries-tab" class="tab-content">
                        <div class="example-queries">
                            <h3><i class="fas fa-lightbulb text-primary"></i> Примеры SQL запросов</h3>
                            <div class="queries-list"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
   
    addModalStyles();

    const modal = document.getElementById('schemaModal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            animation: fadeIn 0.3s;
        }
        
        @keyframes fadeIn {
            from {opacity: 0}
            to {opacity: 1}
        }
        
        .modal-content {
            background-color: white;
            margin: 20px auto;
            padding: 0;
            width: 90%;
            max-width: 1200px;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            animation: slideIn 0.3s;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
        }
        
        @keyframes slideIn {
            from {transform: translateY(-30px); opacity: 0;}
            to {transform: translateY(0); opacity: 1;}
        }
        
        .modal-header {
            background: linear-gradient(135deg, #006CB4 0%, #3091D1 100%);
            color: white;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h2 {
            margin: 0;
            font-size: 24px;
        }
        
        .close {
            color: white;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s;
        }
        
        .close:hover {
            transform: scale(1.2);
        }
        
        .modal-body {
            padding: 20px;
            overflow-y: auto;
            flex-grow: 1;
        }
        
        .schema-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        
        .tab-button {
            padding: 10px 20px;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 16px;
            color: #666;
            border-radius: 5px;
            transition: all 0.3s;
        }
        
        .tab-button:hover {
            background: #f0f0f0;
            color: #333;
        }
        
        .tab-button.active {
            background: linear-gradient(135deg, #006CB4 0%, #3091D1 100%);
            color: white;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
            animation: fadeIn 0.5s;
        }
        
        .schema-diagram {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            overflow-x: auto;
        }
        
        .diagram-svg {
            width: 100%;
            height: auto;
            min-height: 500px;
        }
        
        .tables-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        
        .table-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .table-header {
            background: linear-gradient(135deg, #006CB4 0%, #3091D1 100%);
            color: white;
            padding: 10px;
            font-weight: bold;
        }
        
        .table-fields {
            padding: 10px;
        }
        
        .field-row {
            display: flex;
            justify-content: space-between;
            padding: 5px;
            border-bottom: 1px dashed #eee;
            font-size: 13px;
        }
        
        .field-name {
            font-weight: bold;
            color: #333;
        }
        
        .field-type {
            color: #666;
            font-size: 12px;
        }
        
        .pk {
            color: #e74c3c;
            margin-left: 5px;
        }
        
        .fk {
            color: #3498db;
            margin-left: 5px;
        }
        
        .relationships-list {
            list-style: none;
            padding: 20px;
        }
        
        .relationships-list li {
            padding: 10px;
            margin: 5px 0;
            background: #f8f9fa;
            border-left: 4px solid #006cb4;
            border-radius: 4px;
        }
        
        .queries-list {
            display: grid;
            gap: 15px;
            padding: 20px;
        }
        
        .query-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            border: 1px solid #dee2e6;
        }
        
        .query-card h4 {
            margin: 0 0 10px 0;
            color: #2c3e50;
        }
        
        .query-card pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 12px;
        }
        
        .copy-query {
            margin-top: 10px;
            padding: 5px 10px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        
        .copy-query:hover {
            background: #2980b9;
        }
    `;
    
    document.head.appendChild(style);
}

// Функция открытия модального окна
function openSchemaModal() {
    const modal = document.getElementById('schemaModal');
    if (modal) {
        modal.style.display = 'block';
        drawSchemaDiagram();
        populateTablesGrid();
        populateRelationships();
        populateExampleQueries();
    }
}

// Функция переключения вкладок
function showTab(tabName) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показываем выбранную вкладку
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Активируем кнопку
    event.target.classList.add('active');
    
    // Если выбрана диаграмма, перерисовываем
    if (tabName === 'diagram') {
        drawSchemaDiagram();
    }
}

// Отрисовка SVG диаграммы
function drawSchemaDiagram() {
    const svg = document.querySelector('.diagram-svg');
    if (!svg) return;
    
    // Очищаем SVG
    svg.innerHTML = '';
    
    // Позиции таблиц
    const tables = [
        { name: 'patients', x: 100, y: 10, width: 180, fields: ['patient_id PK', 'first_name', 'last_name', 'birth_date', 'gender', 'phone', 'email', 'blood_type'] },
        { name: 'doctors', x: 400, y: 10, width: 180, fields: ['doctor_id PK', 'first_name', 'last_name', 'specialization', 'license_number', 'phone', 'email'] },
        { name: 'departments', x: 100, y: 220, width: 180, fields: ['dept_id PK', 'dept_name', 'floor', 'phone'] },
        { name: 'visits', x: 300, y: 340, width: 180, fields: ['visit_id PK', 'patient_id FK', 'doctor_id FK', 'dept_id FK', 'visit_date', 'diagnosis'] },
        { name: 'medications', x: 500, y: 220, width: 180, fields: ['med_id PK', 'med_name', 'manufacturer', 'price', 'requires_prescription'] },
        { name: 'prescriptions', x: 500, y: 430, width: 180, fields: ['prescription_id PK', 'visit_id FK', 'med_id FK', 'dosage', 'frequency'] },
        { name: 'vitals', x: 100, y: 400, width: 180, fields: ['vital_id PK', 'visit_id FK', 'temperature', 'heart_rate', 'blood_pressure'] }
    ];
    
    // Рисуем связи (линии)
    const connections = [
        { from: 'patients', to: 'visits' },
        { from: 'doctors', to: 'visits' },
        { from: 'departments', to: 'visits' },
        { from: 'visits', to: 'prescriptions' },
        { from: 'medications', to: 'prescriptions' },
        { from: 'visits', to: 'vitals' }
    ];
    
    // Рисуем линии связей
    connections.forEach(conn => {
        const fromTable = tables.find(t => t.name === conn.from);
        const toTable = tables.find(t => t.name === conn.to);
        
        if (fromTable && toTable) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromTable.x + fromTable.width);
            line.setAttribute('y1', fromTable.y + 40);
            line.setAttribute('x2', toTable.x);
            line.setAttribute('y2', toTable.y + 40);
            line.setAttribute('stroke', '#999');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-dasharray', '5,5');
            svg.appendChild(line);
        }
    });
    
    // Рисуем таблицы
    tables.forEach(table => {
        // Прямоугольник таблицы
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', table.x);
        rect.setAttribute('y', table.y);
        rect.setAttribute('width', table.width);
        rect.setAttribute('height', Math.min(30 + table.fields.length * 20, 200));
        rect.setAttribute('fill', 'white');
        rect.setAttribute('stroke', '#006cb4');
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('rx', '5');
        svg.appendChild(rect);
        
        // Название таблицы
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', table.x + 10);
        title.setAttribute('y', table.y + 20);
        title.setAttribute('fill', '#2c3e50');
        title.setAttribute('font-weight', 'bold');
        title.textContent = table.name;
        svg.appendChild(title);
        
        // Поля таблицы
        table.fields.forEach((field, index) => {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', table.x + 10);
            text.setAttribute('y', table.y + 45 + index * 18);
            text.setAttribute('fill', '#666');
            text.setAttribute('font-size', '11');
            text.textContent = field;
            svg.appendChild(text);
        });
    });
}

// Заполнение сетки таблиц
function populateTablesGrid() {
    const grid = document.querySelector('.tables-grid');
    if (!grid) return;
    
    const tables = [
        {
            name: 'patients',
            description: 'Пациенты',
            fields: [
                { name: 'patient_id', type: 'SERIAL', pk: true },
                { name: 'first_name', type: 'VARCHAR(50)' },
                { name: 'last_name', type: 'VARCHAR(50)' },
                { name: 'birth_date', type: 'DATE' },
                { name: 'gender', type: 'VARCHAR(10)' },
                { name: 'phone', type: 'VARCHAR(20)' },
                { name: 'email', type: 'VARCHAR(100)' },
                { name: 'blood_type', type: 'VARCHAR(3)' }
            ]
        },
        {
            name: 'doctors',
            description: 'Врачи',
            fields: [
                { name: 'doctor_id', type: 'SERIAL', pk: true },
                { name: 'first_name', type: 'VARCHAR(50)' },
                { name: 'last_name', type: 'VARCHAR(50)' },
                { name: 'specialization', type: 'VARCHAR(100)' },
                { name: 'license_number', type: 'VARCHAR(50)' },
                { name: 'phone', type: 'VARCHAR(20)' },
                { name: 'email', type: 'VARCHAR(100)' }
            ]
        },
        {
            name: 'departments',
            description: 'Отделения',
            fields: [
                { name: 'dept_id', type: 'SERIAL', pk: true },
                { name: 'dept_name', type: 'VARCHAR(100)' },
                { name: 'floor', type: 'INTEGER' },
                { name: 'phone', type: 'VARCHAR(20)' }
            ]
        },
        {
            name: 'visits',
            description: 'Посещения',
            fields: [
                { name: 'visit_id', type: 'SERIAL', pk: true },
                { name: 'patient_id', type: 'INTEGER', fk: 'patients' },
                { name: 'doctor_id', type: 'INTEGER', fk: 'doctors' },
                { name: 'dept_id', type: 'INTEGER', fk: 'departments' },
                { name: 'visit_date', type: 'TIMESTAMP' },
                { name: 'diagnosis', type: 'TEXT' }
            ]
        },
        {
            name: 'medications',
            description: 'Лекарства',
            fields: [
                { name: 'med_id', type: 'SERIAL', pk: true },
                { name: 'med_name', type: 'VARCHAR(100)' },
                { name: 'manufacturer', type: 'VARCHAR(100)' },
                { name: 'price', type: 'DECIMAL(10,2)' },
                { name: 'requires_prescription', type: 'BOOLEAN' }
            ]
        },
        {
            name: 'prescriptions',
            description: 'Назначения',
            fields: [
                { name: 'prescription_id', type: 'SERIAL', pk: true },
                { name: 'visit_id', type: 'INTEGER', fk: 'visits' },
                { name: 'med_id', type: 'INTEGER', fk: 'medications' },
                { name: 'dosage', type: 'VARCHAR(50)' },
                { name: 'frequency', type: 'VARCHAR(50)' }
            ]
        },
        {
            name: 'vitals',
            description: 'Показатели',
            fields: [
                { name: 'vital_id', type: 'SERIAL', pk: true },
                { name: 'visit_id', type: 'INTEGER', fk: 'visits' },
                { name: 'temperature', type: 'DECIMAL(4,2)' },
                { name: 'heart_rate', type: 'INTEGER' },
                { name: 'blood_pressure_systolic', type: 'INTEGER' },
                { name: 'blood_pressure_diastolic', type: 'INTEGER' }
            ]
        }
    ];
    
    grid.innerHTML = '';
    
    tables.forEach(table => {
        const card = document.createElement('div');
        card.className = 'table-card';
        
        let fieldsHtml = '';
        table.fields.forEach(field => {
            let markers = '';
            if (field.pk) markers += '<span class="pk" title="Primary Key"><i class="fas fa-key text-warning"></i></span>';
            if (field.fk) markers += `<span class="fk" title="Foreign Key → ${field.fk}"><i class="fas fa-link"></i></span>`;
            
            fieldsHtml += `
                <div class="field-row">
                    <span class="field-name">${field.name}${markers}</span>
                    <span class="field-type">${field.type}</span>
                </div>
            `;
        });
        
        card.innerHTML = `
            <div class="table-header"><i class="fas fa-table"></i> ${table.name} <small>${table.description}</small></div>
            <div class="table-fields">${fieldsHtml}</div>
        `;
        
        grid.appendChild(card);
    });
}

// Заполнение списка связей
function populateRelationships() {
    const list = document.querySelector('.relationships-list');
    if (!list) return;
    
    const relationships = [
        { from: 'visits.patient_id', to: 'patients.patient_id', type: 'Многие к одному', description: 'Один пациент может иметь много посещений' },
        { from: 'visits.doctor_id', to: 'doctors.doctor_id', type: 'Многие к одному', description: 'Один врач принимает много пациентов' },
        { from: 'visits.dept_id', to: 'departments.dept_id', type: 'Многие к одному', description: 'В отделении много посещений' },
        { from: 'prescriptions.visit_id', to: 'visits.visit_id', type: 'Многие к одному', description: 'На одно посещение может быть много назначений' },
        { from: 'prescriptions.med_id', to: 'medications.med_id', type: 'Многие к одному', description: 'Одно лекарство может назначаться много раз' },
        { from: 'vitals.visit_id', to: 'visits.visit_id', type: 'Один к одному', description: 'На одно посещение - один набор показателей' }
    ];
    
    list.innerHTML = relationships.map(rel => `
        <li>
            <strong>${rel.from}</strong> → <strong>${rel.to}</strong>
            <br>
            <small>${rel.type}</small>
            <br>
            <span style="color: #666;">${rel.description}</span>
        </li>
    `).join('');
}

// Заполнение примеров запросов
function populateExampleQueries() {
    const container = document.querySelector('.queries-list');
    if (!container) return;
    
    const queries = [
        {
            title: 'Все пациенты с их последними посещениями',
            query: `SELECT p.first_name, p.last_name, 
       MAX(v.visit_date) as last_visit,
       COUNT(v.visit_id) as total_visits
FROM patients p
LEFT JOIN visits v ON p.patient_id = v.patient_id
GROUP BY p.patient_id, p.first_name, p.last_name
ORDER BY last_visit DESC;`
        },
        {
            title: 'Врачи и количество уникальных пациентов',
            query: `SELECT d.first_name, d.last_name, d.specialization,
       COUNT(DISTINCT v.patient_id) as unique_patients
FROM doctors d
LEFT JOIN visits v ON d.doctor_id = v.doctor_id
GROUP BY d.doctor_id, d.first_name, d.last_name, d.specialization
ORDER BY unique_patients DESC;`
        },
        {
            title: 'Статистика по отделениям',
            query: `SELECT dept_name,
       COUNT(v.visit_id) as visits,
       COUNT(DISTINCT v.patient_id) as patients,
       AVG(vt.temperature) as avg_temperature
FROM departments d
LEFT JOIN visits v ON d.dept_id = v.dept_id
LEFT JOIN vitals vt ON v.visit_id = vt.visit_id
GROUP BY d.dept_id, dept_name;`
        },
        {
            title: 'Пациенты с температурой выше 38.0',
            query: `SELECT p.first_name, p.last_name, 
       v.visit_date, vt.temperature
FROM patients p
JOIN visits v ON p.patient_id = v.patient_id
JOIN vitals vt ON v.visit_id = vt.visit_id
WHERE vt.temperature > 38.0
ORDER BY vt.temperature DESC;`
        }
    ];
    
    container.innerHTML = queries.map(q => `
        <div class="query-card">
            <h4>${q.title}</h4>
            <pre><code>${q.query}</code></pre>
            <button class="copy-query" onclick="copyQuery(this)">Копировать запрос</button>
        </div>
    `).join('');
}

// Функция копирования запроса
function copyQuery(button) {
    const pre = button.previousElementSibling;
    const query = pre.textContent;
    
    navigator.clipboard.writeText(query).then(() => {
        button.textContent = 'Скопировано';
        setTimeout(() => {
            button.textContent = 'Копировать запрос';
        }, 2000);
    });
}

// Добавляем в глобальную область видимости
window.showTab = showTab;
window.copyQuery = copyQuery;