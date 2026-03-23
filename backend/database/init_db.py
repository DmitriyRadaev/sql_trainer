import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime, timedelta
import random

# Конфигурация подключения
DB_CONFIG = {
    'host': 'localhost',
    'database': 'medical_trainer',
    'user': 'postgres',
    'password': 'G7NYGRwn{dNM',
    'port': 5432
}

def init_database():
    """Инициализация базы данных и заполнение тестовыми данными"""
    
    # Чтение SQL схемы
    with open('database/medical_data.sql', 'r') as f:
        schema_sql = f.read()
    
    try:
        # Подключение к PostgreSQL
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Выполнение SQL для создания таблиц
        cursor.execute(schema_sql)
        print("✓ Таблицы созданы успешно")
        
        # Заполнение данными
        insert_sample_data(cursor)
        
        cursor.close()
        conn.close()
        print("✓ База данных успешно инициализирована")
        
    except Exception as e:
        print(f"✗ Ошибка инициализации: {e}")

def insert_sample_data(cursor):
    """Заполнение таблиц тестовыми данными"""
    
    # Очистка таблиц (если нужно)
    tables = ['prescriptions', 'vitals', 'visits', 'medications', 'patients', 'doctors', 'departments']
    for table in tables:
        cursor.execute(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE;")
    
    # 1. Отделения
    departments_data = [
        ('Кардиология', 3, '+7(495)123-45-67'),
        ('Терапия', 2, '+7(495)123-45-68'),
        ('Хирургия', 4, '+7(495)123-45-69'),
        ('Педиатрия', 1, '+7(495)123-45-70'),
        ('Неврология', 3, '+7(495)123-45-71'),
        ('Онкология', 5, '+7(495)123-45-72')
    ]
    
    for dept in departments_data:
        cursor.execute("""
            INSERT INTO departments (dept_name, floor, phone) 
            VALUES (%s, %s, %s)
        """, dept)
    
    # 2. Врачи
    doctors_data = [
        ('Алексей', 'Смирнов', 'Кардиолог', 'LIC12345', '+7(999)456-78-90', 'a.smirnov@hospital.ru', '2015-01-10'),
        ('Елена', 'Козлова', 'Терапевт', 'LIC12346', '+7(999)567-89-01', 'e.kozlova@hospital.ru', '2016-03-15'),
        ('Дмитрий', 'Волков', 'Хирург', 'LIC12347', '+7(999)678-90-12', 'd.volkov@hospital.ru', '2014-11-20'),
        ('Анна', 'Морозова', 'Педиатр', 'LIC12348', '+7(999)789-01-23', 'a.morozova@hospital.ru', '2017-05-05'),
        ('Сергей', 'Новиков', 'Невролог', 'LIC12349', '+7(999)890-12-34', 's.novikov@hospital.ru', '2013-09-12'),
        ('Ольга', 'Белова', 'Онколог', 'LIC12350', '+7(999)901-23-45', 'o.belova@hospital.ru', '2018-02-28')
    ]
    
    for d in doctors_data:
        cursor.execute("""
            INSERT INTO doctors (first_name, last_name, specialization, license_number, phone, email, hire_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, d)
    
    # 3. Пациенты
    patients_data = [
        ('Иван', 'Петров', '1985-03-15', 'Male', '+7(999)123-45-67', 'ivan.p@email.com', 'ул. Ленина 10, кв. 5', 'A+'),
        ('Мария', 'Сидорова', '1990-07-22', 'Female', '+7(999)234-56-78', 'maria.s@email.com', 'ул. Гагарина 15, кв. 42', 'B+'),
        ('Петр', 'Иванов', '1978-11-30', 'Male', '+7(999)345-67-89', 'petr.i@email.com', 'ул. Пушкина 7, кв. 12', 'O+'),
        ('Екатерина', 'Соколова', '1982-09-18', 'Female', '+7(999)456-78-90', 'ekaterina.s@email.com', 'пр. Мира 23, кв. 8', 'AB-'),
        ('Михаил', 'Федоров', '1995-12-05', 'Male', '+7(999)567-89-01', 'mikhail.f@email.com', 'ул. Советская 5, кв. 91', 'A-'),
        ('Татьяна', 'Мороз', '1988-04-25', 'Female', '+7(999)678-90-12', 'tatiana.m@email.com', 'ул. Лесная 12, кв. 34', 'B-'),
        ('Андрей', 'Павлов', '1975-08-12', 'Male', '+7(999)789-01-23', 'andrey.p@email.com', 'ул. Цветочная 3, кв. 56', 'O-'),
        ('Наталья', 'Ким', '1992-02-28', 'Female', '+7(999)890-12-34', 'natalia.k@email.com', 'ул. Новая 8, кв. 17', 'AB+')
    ]
    
    for p in patients_data:
        cursor.execute("""
            INSERT INTO patients (first_name, last_name, birth_date, gender, phone, email, address, blood_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, p)
    
    # 4. Лекарства
    medications_data = [
        ('Аспирин', 'Bayer', 150.00, False),
        ('Парацетамол', 'Фармстандарт', 80.00, False),
        ('Амоксициллин', 'АО "Биохимик"', 350.00, True),
        ('Лизиноприл', 'Тева', 280.00, True),
        ('Метформин', 'Merck', 400.00, True),
        ('Омепразол', 'Dr. Reddy\'s', 220.00, False),
        ('Аторвастатин', 'Pfizer', 550.00, True),
        ('Сальбутамол', 'GlaxoSmithKline', 320.00, True)
    ]
    
    for m in medications_data:
        cursor.execute("""
            INSERT INTO medications (med_name, manufacturer, price, requires_prescription)
            VALUES (%s, %s, %s, %s)
        """, m)
    
    # 5. Посещения (с данными за последние 6 месяцев)
    visits_data = []
    for i in range(50):  # 50 посещений
        visit_date = datetime.now() - timedelta(days=random.randint(1, 180))
        visits_data.append((
            random.randint(1, 8),  # patient_id
            random.randint(1, 6),  # doctor_id
            random.randint(1, 6),  # dept_id
            visit_date,
            f'Диагноз {i}',
            'Симптомы: кашель, температура' if random.choice([True, False]) else 'Симптомы: головная боль, слабость',
            'Лечение: постельный режим, обильное питье'
        ))
    
    for v in visits_data:
        cursor.execute("""
            INSERT INTO visits (patient_id, doctor_id, dept_id, visit_date, diagnosis, symptoms, treatment)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, v)
    
    # 6. Показатели жизнедеятельности
    vitals_data = []
    for visit_id in range(1, 51):
        vitals_data.append((
            visit_id,
            round(random.uniform(36.1, 39.0), 1),  # temperature
            random.randint(60, 100),  # heart_rate
            random.randint(100, 140),  # systolic
            random.randint(60, 90),  # diastolic
            random.randint(12, 20),  # respiratory_rate
            random.randint(92, 100)  # oxygen_saturation
        ))
    
    for v in vitals_data:
        cursor.execute("""
            INSERT INTO vitals (visit_id, temperature, heart_rate, blood_pressure_systolic, 
                              blood_pressure_diastolic, respiratory_rate, oxygen_saturation)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, v)
    
    # 7. Назначения лекарств
    prescriptions_data = []
    for visit_id in range(1, 51):
        if random.choice([True, False]):  # Не у всех посещений есть назначения
            med_count = random.randint(1, 3)
            for _ in range(med_count):
                prescriptions_data.append((
                    visit_id,
                    random.randint(1, 8),
                    f'{random.randint(1, 3)} таб.',
                    f'{random.randint(1, 3)} раза в день',
                    random.randint(3, 14)
                ))
    
    for p in prescriptions_data:
        cursor.execute("""
            INSERT INTO prescriptions (visit_id, med_id, dosage, frequency, duration_days)
            VALUES (%s, %s, %s, %s, %s)
        """, p)
    
    print(f"✓ Добавлено данных: {len(departments_data)} отделений, {len(doctors_data)} врачей, "
          f"{len(patients_data)} пациентов, {len(medications_data)} лекарств, "
          f"{len(visits_data)} посещений")

if __name__ == "__main__":
    init_database()