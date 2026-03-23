const API_URL = '/sql-trainer/api';

// Хранилище для текущего упражнения
let currentExercise = null;

document.addEventListener('DOMContentLoaded', function() {
    
    // Проверяем наличие всех элементов
    checkElements();
    
    // Загружаем данные
    loadExercises();
    loadSchema();
    
    // Настраиваем кнопку выполнения
    setupButton();
    
    // Настраиваем кнопку теории
    setupTheoryButton();
    
    // Очищаем поле ввода при загрузке
    clearQueryField();
});

function setupTheoryButton() {
    const theoryBtn = document.getElementById('theory-btn');
    if (theoryBtn) {
        // Деактивируем кнопку, пока не выбрана задача
        theoryBtn.style.opacity = '0.5';
        theoryBtn.style.pointerEvents = 'none';
    }
}

function checkElements() {
    const elements = {
        'exercises-list': document.getElementById('exercises-list'),
        'schema-info': document.getElementById('schema-info'),
        'sql-query': document.getElementById('sql-query'),
        'execute-btn': document.getElementById('execute-btn'),
        'query-results': document.getElementById('query-results'),
        'row-count': document.getElementById('row-count'),
        'error-message': document.getElementById('error-message'),
        'validation-message': document.getElementById('validation-message')
    };
}

function setupButton() {
    const btn = document.getElementById('execute-btn');
    if (btn) {
        btn.addEventListener('click', function() {
            executeAndValidateQuery();
        });
    }
}

function clearQueryField() {
    const queryArea = document.getElementById('sql-query');
    if (queryArea) {
        queryArea.value = '';
        queryArea.placeholder = 'Напишите ваш SQL запрос здесь...';
    }
}

// Загрузка упражнений с группировкой по категориям
async function loadExercises() {
    
    const listDiv = document.getElementById('exercises-list');
    if (!listDiv) {
        return;
    }
    
    try {
        // Показываем загрузку
        listDiv.innerHTML = '<p style="color: blue;">Загрузка упражнений...</p>';
        
        // Делаем запрос
        const response = await fetch(API_URL + '/exercises');
        
        if (!response.ok) {
            throw new Error('Ошибка сервера: ' + response.status);
        }
        
        const exercises = await response.json();
        
        // Группируем упражнения по категориям
        const groupedExercises = {};
        exercises.forEach(ex => {
            if (!groupedExercises[ex.category_name]) {
                groupedExercises[ex.category_name] = [];
            }
            groupedExercises[ex.category_name].push(ex);
        });
        
        // Очищаем и заполняем список
        listDiv.innerHTML = '';                
        
        // Создаем аккордеон для категорий
        Object.keys(groupedExercises).forEach(categoryName => {
            const categoryExercises = groupedExercises[categoryName];
            
            // Категория
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'exercise-category';
            categoryDiv.style.cssText = 'margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;';
            
            // Заголовок категории
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.style.cssText = 'background: linear-gradient(135deg, #006CB4 0%, #3091D1 100%); color: white; padding: 7px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;';
            categoryHeader.innerHTML = `
                <span>${categoryName} (${categoryExercises.length})</span>
                <span class="toggle-icon">▼</span>
            `;
            
            // Контейнер для упражнений категории
            const categoryContent = document.createElement('div');
            categoryContent.className = 'category-content';
            categoryContent.style.cssText = 'display: none; padding: 10px; background: #f9f9f9; max-height: 400px; overflow-y: auto;';
            
            // Добавляем упражнения
            categoryExercises.forEach(ex => {
				const item = document.createElement('div');
				item.className = 'exercise-item';
				
				item.innerHTML = `
					<strong>${ex.id}. ${ex.title}</strong>
					<small>${ex.description}</small>
				`;
				
				// При клике на упражнение загружаем его в текущее упражнение
				item.addEventListener('click', function() {
					selectExercise(ex);
				});
				
				categoryContent.appendChild(item);
			});
            
            // Добавляем обработчик для сворачивания/разворачивания
            categoryHeader.addEventListener('click', function() {
                const isHidden = categoryContent.style.display === 'none';
                categoryContent.style.display = isHidden ? 'block' : 'none';
                const icon = categoryHeader.querySelector('.toggle-icon');
                icon.textContent = isHidden ? '▼' : '▶';
            });
            
            categoryDiv.appendChild(categoryHeader);
            categoryDiv.appendChild(categoryContent);
            listDiv.appendChild(categoryDiv);
        });
        
    } catch (error) {
        listDiv.innerHTML = '<p style="color: red;">Ошибка загрузки: ' + error.message + '</p>';
    }
}

// Выбор упражнения
function selectExercise(exercise) {
    
    // Сохраняем текущее упражнение
    currentExercise = exercise;
    
    // Очищаем поле ввода
    clearQueryField();
    
    // Очищаем предыдущие результаты
    clearResults();
    
    // Убираем выделение со всех задач
    document.querySelectorAll('.exercise-item').forEach(item => {
        item.classList.remove('selected');
        item.style.borderLeftWidth = '1px';
    });
    
    // Находим и подсвечиваем выбранный элемент
    setTimeout(() => {
        const items = document.querySelectorAll('.exercise-item');
        for (let item of items) {
            if (item.textContent.includes(exercise.title) && 
                item.textContent.includes(exercise.id.toString())) {
                item.classList.add('selected');
                break;
            }
        }
    }, 100);
    
    // Показываем сообщение о выбранном упражнении
    showTemporaryMessage(`Выбрана задача: ${exercise.title}. Напишите запрос и нажмите "Выполнить"`, 'info');
}

// Выполнение и проверка запроса
async function executeAndValidateQuery() {
    const queryArea = document.getElementById('sql-query');
    
    if (!queryArea) {
        return;
    }
    
    const query = queryArea.value;
    
    if (!query.trim()) {
        showTemporaryMessage('Введите SQL запрос', 'warning');
        return;
    }
    
    if (!currentExercise) {
        showTemporaryMessage('Сначала выберите задачу из списка', 'warning');
        return;
    }
    
    // Очищаем предыдущие результаты
    clearResults();
    
    // Показываем индикатор загрузки
    const resultsDiv = document.getElementById('query-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-hourglass-half text-warning"></i> Выполнение запроса...</div>';
    }
    
    try {
        // Выполняем запрос пользователя
        const userResponse = await fetch(API_URL + '/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query })
        });
        
        const userResult = await userResponse.json();
        
        if (userResult.error) {
            showTemporaryMessage('Ошибка в запросе: ' + userResult.error, 'error');
            return;
        }
        
        // Выполняем правильный запрос для сравнения
        const correctResponse = await fetch(API_URL + '/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: currentExercise.solution })
        });
        
        const correctResult = await correctResponse.json();
        
        // Сравниваем количество строк
        const userRowCount = userResult.row_count || 0;
        const correctRowCount = correctResult.row_count || 0;
        
        // Показываем результаты пользователя
        displayResults(userResult.data, userResult.row_count);
        
        // Проверяем правильность
        if (userRowCount === correctRowCount) {
            showValidationMessage('Запрос верный!', 'success');
        } else {
            showValidationMessage('Вы ошибаетесь. Попробуйте еще раз.', 'error');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        showTemporaryMessage('Ошибка подключения: ' + error.message, 'error');
    }
}

// Показ сообщения о валидации
function showValidationMessage(message, type) {
    const validationDiv = document.getElementById('validation-message');
    if (!validationDiv) return;
    
    let bgColor, textColor, borderColor;
    
    if (type === 'success') {
        bgColor = '#d4edda';
        textColor = '#155724';
        borderColor = '#28a745';
    } else if (type === 'error') {
        bgColor = '#f8d7da';
        textColor = '#721c24';
        borderColor = '#dc3545';
    } else {
        bgColor = '#fff3cd';
        textColor = '#856404';
        borderColor = '#ffc107';
    }
    
    validationDiv.innerHTML = message;
    validationDiv.style.cssText = `
        display: block;
        background-color: ${bgColor};
        color: ${textColor};
        padding: 12px 20px;
        margin: 10px 0;
        border-radius: 5px;
        border-left: 4px solid ${borderColor};
        font-family: 'Open Sans', sans-serif;
        font-weight: 400;
        animation: slideDown 0.3s ease-out;
    `;    
}

// Временное сообщение
function showTemporaryMessage(message, type = 'info') {
    const validationDiv = document.getElementById('validation-message');
    if (!validationDiv) return;
    
    let bgColor, textColor, borderColor;
    
    if (type === 'success') {
        bgColor = '#d4edda';
        textColor = '#155724';
        borderColor = '#28a745';
    } else if (type === 'error') {
        bgColor = '#f8d7da';
        textColor = '#721c24';
        borderColor = '#dc3545';
    } else if (type === 'warning') {
        bgColor = '#fff3cd';
        textColor = '#856404';
        borderColor = '#ffc107';
    } else {
        bgColor = '#cce5ff';
        textColor = '#004085';
        borderColor = '#006CB4'; // Pantone 300
    }
    
    validationDiv.innerHTML = message;
    validationDiv.style.cssText = `
        display: block;
        background-color: ${bgColor};
        color: ${textColor};
        padding: 12px 20px;
        margin: 10px 0;
        border-radius: 5px;
        border-left: 4px solid ${borderColor};
        font-family: 'Open Sans', sans-serif;
        font-weight: 400;
        animation: slideDown 0.3s ease-out;
    `;   
}

// Очистка результатов
function clearResults() {
    const resultsDiv = document.getElementById('query-results');
    const rowCountDiv = document.getElementById('row-count');
    const errorDiv = document.getElementById('error-message');
    const validationDiv = document.getElementById('validation-message');
    
    if (resultsDiv) resultsDiv.innerHTML = '';
    if (rowCountDiv) rowCountDiv.innerHTML = '';
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.innerHTML = '';
    }
    if (validationDiv) {
        validationDiv.style.display = 'none';
        validationDiv.innerHTML = '';
    }
}

// Отображение результатов
function displayResults(data, rowCount) {
    const resultsDiv = document.getElementById('query-results');
    const rowCountDiv = document.getElementById('row-count');
    
    if (!resultsDiv) return;
    
    if (!data || data.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;"> Нет данных</p>';
        if (rowCountDiv) rowCountDiv.innerHTML = 'Количество строк: 0';
        return;
    }
    
    // Получаем названия колонок
    const columns = Object.keys(data[0]);
    
    // Создаем таблицу
    let html = '<div style="max-height: 400px; overflow-y: auto;"><table class="table table-responsive">';
    
    // Заголовок (фиксированный)
    html += '<thead style="position: sticky; top: 0; z-index: 10; background: #fff;"><tr>';
    columns.forEach(col => {
        html += `<th style="padding: 12px; text-align: left; border: 1px solid #ddd; color: #000;">${col}</th>`;
    });
    html += '</tr></thead>';
    
    // Тело таблицы
    html += '<tbody>';
    data.forEach((row, index) => {
        const bgColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
        html += `<tr style="background-color: ${bgColor};">`;
        columns.forEach(col => {
            let value = row[col];
            if (value === null) value = '<span style="color: #999; font-style: italic;">NULL</span>';
            if (value instanceof Date) value = value.toLocaleString();
            if (typeof value === 'object') value = JSON.stringify(value);
            html += `<td style="padding: 10px; border: 1px solid #ddd;text-overflow: ellipsis;" title="${value}">${value}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    
    resultsDiv.innerHTML = html;
    
    if (rowCountDiv) {
        rowCountDiv.innerHTML = `Количество строк: ${rowCount}`;
    }
}

// Обновление счетчиков в категориях
function updateCategoryCounts() {
    document.querySelectorAll('.exercise-category').forEach(category => {
        const visibleItems = category.querySelectorAll('.exercise-item[style*="display: block"]').length;
        const totalItems = category.querySelectorAll('.exercise-item').length;
        const header = category.querySelector('.category-header span');
        if (header) {
            const categoryName = header.textContent.split(' (')[0];
            header.innerHTML = `${categoryName} (${visibleItems}/${totalItems})`;
        }
    });
}

async function loadSchema() {
    
    const schemaDiv = document.getElementById('schema-info');
    if (!schemaDiv) {
        return;
    }
    
    try {
        // Показываем загрузку
        schemaDiv.innerHTML = '<p style="color: blue;">Загрузка схемы...</p>';
        
        // Делаем запрос
        const response = await fetch(API_URL + '/schema');
        
        if (!response.ok) {
            throw new Error('Ошибка сервера: ' + response.status);
        }
        
        const schema = await response.json();
        
        // Очищаем и заполняем схему
        schemaDiv.innerHTML = '';
        
        const tableNames = Object.keys(schema);
        
        if (tableNames.length === 0) {
            schemaDiv.innerHTML = '<p>Нет таблиц</p>';
            return;
        }
        
        tableNames.forEach(function(tableName) {
            const tableDiv = document.createElement('div');
            tableDiv.className = 'schema-table';
            tableDiv.style.cssText = 'margin: 10px 0; padding: 5px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; transition: all 0.2s; background: white;';
            tableDiv.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 20px; margin-right: 10px;"><i class="fas fa-table text-primary"></i></span>
                    <div>
                        <h4 style="margin: 0; color: #2c3e50;">${tableName}</h4>
                    </div>
                </div>
            `;
            
            // При клике на таблицу выполняем SELECT * FROM table
            tableDiv.addEventListener('click', function() {
                const query = 'SELECT * FROM ' + tableName + ' LIMIT 10;';
                const queryArea = document.getElementById('sql-query');
                if (queryArea) {
                    queryArea.value = query;
                    showTemporaryMessage(`Шаблон для таблицы ${tableName} загружен в редактор`);
                }
            });
            
            // Добавляем ховер эффект
            tableDiv.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f0f0f0';
                this.style.transform = 'translateX(5px)';
                this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            
            tableDiv.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'white';
                this.style.transform = 'translateX(0)';
                this.style.boxShadow = 'none';
            });
            
            schemaDiv.appendChild(tableDiv);
        });
        
        
    } catch (error) {
        schemaDiv.innerHTML = '<p style="color: red;">Ошибка загрузки: ' + error.message + '</p>';
    }
}

// Получаем ссылки на элементы модального окна теории
const theoryModal = document.getElementById('theoryModal');
const theoryBtn = document.getElementById('theory-btn');
const theoryClose = document.querySelector('.theory-close');
const theoryModalTitle = document.getElementById('theory-modal-title');
const theoryModalBody = document.getElementById('theory-modal-body');

// Открытие модального окна с теорией
function openTheoryModal() {
    if (!currentExercise) {
        showTemporaryMessage('Сначала выберите задачу из списка', 'warning');
        return;
    }
    
    // Определяем категорию текущего упражнения
    const category = currentExercise.category;
    
    // Получаем данные теории по категории
    const theory = theoryData[category];
    
    if (theory) {
        theoryModalTitle.textContent = theory.title;
        theoryModalBody.innerHTML = theory.content;
        theoryModal.style.display = 'block';
    } else {
        showTemporaryMessage('Теоретическая справка для этого раздела в разработке', 'info');
    }
}

// Закрытие модального окна
function closeTheoryModal() {
    theoryModal.style.display = 'none';
}

// Настройка кнопки теории
if (theoryBtn) {
    theoryBtn.addEventListener('click', openTheoryModal);
}

// Закрытие по клику на крестик
if (theoryClose) {
    theoryClose.addEventListener('click', closeTheoryModal);
}

// Закрытие по клику вне модального окна
window.addEventListener('click', function(event) {
    if (event.target === theoryModal) {
        closeTheoryModal();
    }
});

// Закрытие по клавише Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && theoryModal.style.display === 'block') {
        closeTheoryModal();
    }
});

// Обновите функцию selectExercise, добавив активацию кнопки теории
function selectExercise(exercise) {
    
    // Сохраняем текущее упражнение
    currentExercise = exercise;
    
    // Активируем кнопку теории
    if (theoryBtn) {
        theoryBtn.style.opacity = '1';
        theoryBtn.style.pointerEvents = 'auto';
    }
    
    // Очищаем поле ввода
    clearQueryField();
    
    // Очищаем предыдущие результаты
    clearResults();
    
    // Убираем выделение со всех задач
    document.querySelectorAll('.exercise-item').forEach(item => {
        item.classList.remove('selected');
        item.style.borderLeftWidth = '1px';
    });
    
    // Находим и подсвечиваем выбранный элемент
    setTimeout(() => {
        const items = document.querySelectorAll('.exercise-item');
        for (let item of items) {
            if (item.textContent.includes(exercise.title) && 
                item.textContent.includes(exercise.id.toString())) {
                item.classList.add('selected');
                break;
            }
        }
    }, 100);
    
    // Показываем сообщение о выбранном упражнении
    showTemporaryMessage(`Выбрана задача: ${exercise.title}. Напишите запрос и нажмите "Выполнить"`, 'info');
}