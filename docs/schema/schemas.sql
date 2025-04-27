CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15) NOT NULL
);

CREATE TABLE Foods (
    user_id INT NOT NULL,
    food_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    protein INT NOT NULL,
    fat INT NOT NULL,
    carbohydrates INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Programs (
    user_id INT NOT NULL,
    program_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Splits (
    program_id INT NOT NULL,
    split_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    days_of_week VARCHAR(50) NOT NULL,
    FOREIGN KEY (program_id) REFERENCES Programs(program_id)
);

CREATE TABLE Exercises (
    split_id INT NOT NULL,
    exercise_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    rest_time INT NOT NULL,
    FOREIGN KEY (split_id) REFERENCES Splits(split_id)
);

CREATE TABLE ProgressPhotos (
    user_id INT NOT NULL,
    photo_id INT PRIMARY KEY,
    date_taken DATE NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
);

CREATE ProgressPhotosCategories (
    photo_id INT NOT NULL,
    category_id INT PRIMARY KEY,
    FOREIGN KEY (photo_id) REFERENCES ProgressPhotos(photo_id),
    FOREIGN KEY (category_id) REFERENCES PhotoCategories(category_id)
);

CREATE TABLE PhotoCategories (
    user_id INT NOT NULL,
    category_id INT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
