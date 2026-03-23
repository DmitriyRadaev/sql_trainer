-- Создание базы данных (выполнить отдельно)
-- CREATE DATABASE medical_trainer;

-- Подключение к базе данных
-- \c medical_trainer;

-- Таблица пациентов
CREATE TABLE IF NOT EXISTS patients (
    patient_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    blood_type VARCHAR(3) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица врачей
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    email VARCHAR(100),
    hire_date DATE
);

-- Таблица отделений
CREATE TABLE IF NOT EXISTS departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    floor INTEGER,
    phone VARCHAR(20)
);

-- Таблица посещений/приемов
CREATE TABLE IF NOT EXISTS visits (
    visit_id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(patient_id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    dept_id INTEGER REFERENCES departments(dept_id) ON DELETE CASCADE,
    visit_date TIMESTAMP,
    diagnosis TEXT,
    symptoms TEXT,
    treatment TEXT
);

-- Таблица лекарств
CREATE TABLE IF NOT EXISTS medications (
    med_id SERIAL PRIMARY KEY,
    med_name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),
    price DECIMAL(10, 2),
    requires_prescription BOOLEAN DEFAULT TRUE
);

-- Таблица назначений лекарств
CREATE TABLE IF NOT EXISTS prescriptions (
    prescription_id SERIAL PRIMARY KEY,
    visit_id INTEGER REFERENCES visits(visit_id) ON DELETE CASCADE,
    med_id INTEGER REFERENCES medications(med_id) ON DELETE CASCADE,
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration_days INTEGER
);

-- Таблица медицинских показателей
CREATE TABLE IF NOT EXISTS vitals (
    vital_id SERIAL PRIMARY KEY,
    visit_id INTEGER REFERENCES visits(visit_id) ON DELETE CASCADE,
    temperature DECIMAL(4,2),
    heart_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    respiratory_rate INTEGER,
    oxygen_saturation INTEGER,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации
CREATE INDEX idx_visits_patient ON visits(patient_id);
CREATE INDEX idx_visits_doctor ON visits(doctor_id);
CREATE INDEX idx_visits_date ON visits(visit_date);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);