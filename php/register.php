<?php
header('Content-Type: application/json');

// Подключение к базе данных
$servername = "localhost";
$username = "root"; // Ваш пользователь БД
$password = ""; // Ваш пароль БД
$dbname = "bookstore";

// Создаем соединение
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверяем соединение
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Получаем данные из POST запроса
$name = $conn->real_escape_string($_POST['name']);
$email = $conn->real_escape_string($_POST['email']);
$password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Хешируем пароль
$country = isset($_POST['country']) ? $conn->real_escape_string($_POST['country']) : '';
$city = isset($_POST['city']) ? $conn->real_escape_string($_POST['city']) : '';
$age = isset($_POST['age']) ? intval($_POST['age']) : null;

// Проверяем, существует ли уже пользователь с таким email
$check_sql = "SELECT id FROM users WHERE email = '$email'";
$result = $conn->query($check_sql);

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Пользователь с таким email уже существует']);
    exit;
}

// SQL запрос для вставки данных
$sql = "INSERT INTO users (name, email, password, country, city, age) 
        VALUES ('$name', '$email', '$password', '$country', '$city', $age)";

if ($conn->query($sql) {
    // Получаем ID нового пользователя
    $user_id = $conn->insert_id;
    
    // Формируем ответ с данными пользователя (без пароля)
    $response = [
        'success' => true,
        'message' => 'Регистрация прошла успешно!',
        'user' => [
            'id' => $user_id,
            'name' => $name,
            'email' => $email,
            'country' => $country,
            'city' => $city,
            'age' => $age
        ]
    ];
    
    echo json_encode($response);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при регистрации: ' . $conn->error]);
}

$conn->close();
?>