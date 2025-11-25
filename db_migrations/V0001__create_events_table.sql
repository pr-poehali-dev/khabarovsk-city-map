CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    price VARCHAR(100) NOT NULL,
    image_url TEXT,
    description TEXT,
    lat DECIMAL(10, 7) NOT NULL,
    lng DECIMAL(10, 7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_date ON events(event_date);

INSERT INTO events (title, category, event_date, event_time, location, price, image_url, description, lat, lng) VALUES
('Концерт на набережной', 'События', '2024-12-15', '19:00', 'Набережная Амура', 'Бесплатно', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', 'Живая музыка на набережной реки Амур', 48.4803, 135.0790),
('Выставка современного искусства', 'Культура', '2024-12-18', '10:00', 'Музей им. Гродекова', '300 ₽', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', 'Экспозиция работ современных художников', 48.4799, 135.0586),
('Спектакль "Евгений Онегин"', 'Культура', '2024-12-20', '18:30', 'Театр драмы', '800 ₽', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', 'Классическая постановка по произведению Пушкина', 48.4827, 135.0700),
('Кафе "Амурский берег"', 'Заведения', '2024-12-31', '09:00', 'ул. Муравьёва-Амурского, 15', '500-1500 ₽', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', 'Уютное кафе с видом на реку', 48.4836, 135.0596),
('Зимний фестиваль', 'Развлечения', '2024-12-25', '12:00', 'Центральный парк', 'Бесплатно', 'https://images.unsplash.com/photo-1482575832494-771f74bf6857?w=800', 'Праздничные мероприятия для всей семьи', 48.4850, 135.0750),
('Кинопоказ "Рождество"', 'Афиша', '2024-12-23', '20:00', 'Кинотеатр "Совкино"', '400 ₽', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 'Праздничный кинопоказ', 48.4795, 135.0650),
('Исторический маршрут по центру', 'Маршруты', '2024-12-31', '10:00', 'Старт: площадь Ленина', 'Бесплатно', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', 'Пешеходная экскурсия по историческим местам города', 48.4835, 135.0838),
('Музей истории Хабаровска', 'Культура', '2024-12-31', '10:00', 'ул. Шевчено, 7', '200 ₽', 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800', 'Постоянная экспозиция по истории города', 48.4807, 135.0720);