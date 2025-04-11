document.addEventListener('DOMContentLoaded', function() {
    // Инициализация данных в localStorage, если их нет
    if (!localStorage.getItem('users')) {
        const initialUsers = [
            {
                id: 1,
                name: 'Иван Иванов',
                email: 'ivan@example.com',
                password: 'password123', // В реальном приложении пароли должны быть хешированы
                country: 'Россия',
                city: 'Москва',
                age: 30
            },
            {
                id: 2,
                name: 'Петр Петров',
                email: 'petr@example.com',
                password: 'password123',
                country: 'Россия',
                city: 'Санкт-Петербург',
                age: 25
            }
        ];
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem('books')) {
        const initialBooks = [
            { id: 1, title: 'Властелин колец', author: 'Дж. Р. Р. Толкин', price: 1200, genre: 'fantasy', rating: 4.8 },
            { id: 2, title: 'Гарри Поттер и философский камень', author: 'Дж. К. Роулинг', price: 800, genre: 'fantasy', rating: 4.7 },
            { id: 3, title: '1984', author: 'Джордж Оруэлл', price: 600, genre: 'science', rating: 4.5 },
            { id: 4, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', price: 750, genre: 'romance', rating: 4.6 },
            { id: 5, title: 'Код да Винчи', author: 'Дэн Браун', price: 550, genre: 'romance', rating: 4.2 }
        ];
        localStorage.setItem('books', JSON.stringify(initialBooks));
    }

    if (!localStorage.getItem('reviews')) {
        const initialReviews = [
            { id: 1, bookId: 1, userId: 1, userName: 'Иван Иванов', rating: 5, comment: 'Отличная книга, рекомендую!', date: '2023-05-15' },
            { id: 2, bookId: 2, userId: 1, userName: 'Иван Иванов', rating: 4, comment: 'Хорошее начало серии', date: '2023-04-20' },
            { id: 3, bookId: 1, userId: 2, userName: 'Петр Петров', rating: 5, comment: 'Шедевр фэнтези-литературы', date: '2023-06-01' },
            { id: 4, bookId: 3, userId: 2, userName: 'Петр Петров', rating: 3, comment: 'Интересно, но тяжело читается', date: '2023-05-28' }
        ];
        localStorage.setItem('reviews', JSON.stringify(initialReviews));
    }

    // Состояние пользователя
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    // Элементы авторизации
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userGreeting = document.getElementById('user-greeting');
    const accountNavItem = document.getElementById('account-nav-item');

    // Модальные окна
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');

    // Формы
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Обновление состояния авторизации
    function updateAuthState() {
        if (currentUser) {
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            userGreeting.classList.remove('hidden');
            userGreeting.textContent = `Привет, ${currentUser.name}`;
            accountNavItem.style.display = 'block';
            
            // Обновляем данные в личном кабинете
            document.getElementById('user-name').textContent = currentUser.name;
            document.getElementById('user-email').textContent = currentUser.email;
            document.getElementById('user-country').textContent = currentUser.country || 'Не указано';
            document.getElementById('user-city').textContent = currentUser.city || 'Не указано';
            document.getElementById('user-age').textContent = currentUser.age || 'Не указано';
            
            // Заполняем форму редактирования
            document.getElementById('edit-name').value = currentUser.name;
            document.getElementById('edit-email').value = currentUser.email;
            document.getElementById('edit-country').value = currentUser.country || '';
            document.getElementById('edit-city').value = currentUser.city || '';
            document.getElementById('edit-age').value = currentUser.age || '';
        } else {
            loginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
            userGreeting.classList.add('hidden');
            accountNavItem.style.display = 'none';
        }
    }

    // Показать модальное окно
    function showModal(modal) {
        modal.classList.remove('hidden');
    }

    // Скрыть модальное окно
    function hideModal(modal) {
        modal.classList.add('hidden');
    }

    // Обработчики событий для кнопок авторизации
    loginBtn.addEventListener('click', () => showModal(loginModal));
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        updateAuthState();
        alert('Вы вышли из системы');
    });

    // Переключение между модальными окнами
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(loginModal);
        showModal(registerModal);
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(registerModal);
        showModal(loginModal);
    });

    // Закрытие модальных окон
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hideModal(loginModal);
            hideModal(registerModal);
        });
    });

    // Обработка формы входа
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Получаем пользователей из localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Проверяем наличие пользователя
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                country: user.country,
                city: user.city,
                age: user.age
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            hideModal(loginModal);
            updateAuthState();
            alert('Вы успешно вошли в систему');
        } else {
            alert('Неверный email или пароль');
        }
    });

    // Обработка формы регистрации
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const country = document.getElementById('register-country').value;
        const city = document.getElementById('register-city').value;
        const age = document.getElementById('register-age').value;

        // Получаем пользователей из localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Проверяем, существует ли уже пользователь с таким email
        if (users.some(u => u.email === email)) {
            alert('Пользователь с таким email уже существует');
            return;
        }
        
        // Создаем нового пользователя
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name,
            email,
            password, // В реальном приложении пароль должен быть хеширован
            country,
            city,
            age: age ? parseInt(age) : null
        };
        
        // Добавляем пользователя и сохраняем
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Автоматически входим под новым пользователем
        currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            country: newUser.country,
            city: newUser.city,
            age: newUser.age
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        hideModal(registerModal);
        updateAuthState();
        alert('Регистрация прошла успешно! Вы вошли в систему.');
        
        // Очищаем форму
        this.reset();
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            hideModal(loginModal);
        }
        if (e.target === registerModal) {
            hideModal(registerModal);
        }
    });

    // Сохранение изменений в профиле
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!currentUser) return;
            
            const name = document.getElementById('edit-name').value;
            const email = document.getElementById('edit-email').value;
            const password = document.getElementById('edit-password').value;
            const country = document.getElementById('edit-country').value;
            const city = document.getElementById('edit-city').value;
            const age = document.getElementById('edit-age').value;
            
            // Получаем пользователей из localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Находим текущего пользователя
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex === -1) return;
            
            // Обновляем данные пользователя
            users[userIndex].name = name;
            users[userIndex].email = email;
            if (password) users[userIndex].password = password;
            users[userIndex].country = country;
            users[userIndex].city = city;
            users[userIndex].age = age ? parseInt(age) : null;
            
            // Сохраняем обновленных пользователей
            localStorage.setItem('users', JSON.stringify(users));
            
            // Обновляем текущего пользователя
            currentUser = {
                id: currentUser.id,
                name,
                email,
                country,
                city,
                age: age ? parseInt(age) : null
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateAuthState();
            alert('Изменения сохранены!');
        });
    }

    // Остальной код (навигация, загрузка книг, корзина, отзывы) остается таким же, как в вашем оригинальном script.js
    // ...

    // Инициализация
    updateAuthState();
    loadBooks();
    loadReviews();
});

// Функции для работы с книгами, корзиной и отзывами (остаются без изменений)
function loadBooks() {
    const booksGrid = document.querySelector('.books-grid');
    if (!booksGrid) return;

    booksGrid.innerHTML = '';

    // Получаем книги из localStorage
    const books = JSON.parse(localStorage.getItem('books')) || [];

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-cover">${book.title}</div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-price">${book.price} руб</div>
                <button class="add-to-cart" data-id="${book.id}">В корзину</button>
            </div>
        `;
        booksGrid.appendChild(bookCard);
    });

    // Добавление в корзину
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = parseInt(this.getAttribute('data-id'));
            addToCart(bookId);
        });
    });
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(bookId) {
    // Получаем книги из localStorage
    const books = JSON.parse(localStorage.getItem('books')) || [];
    
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const existingItem = cart.find(item => item.id === bookId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: book.id,
            title: book.title,
            price: book.price,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPrice = document.getElementById('total-price');

    if (!cartItems || !cartCount || !totalPrice) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        cartCount.textContent = '0';
        totalPrice.textContent = '0';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-cover">${item.title.charAt(0)}</div>
                <div>
                    <div class="cart-item-title">${item.title}</div>
                    <div>${item.quantity} × ${item.price} руб</div>
                </div>
            </div>
            <div class="cart-item-price">${item.price * item.quantity} руб</div>
            <button class="remove-item" data-id="${item.id}">×</button>
        `;
        cartItems.appendChild(cartItem);

        total += item.price * item.quantity;
    });

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalPrice.textContent = total;

    // Удаление из корзины
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            cart = cart.filter(item => item.id !== itemId);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    });
}

function loadReviews() {
    const reviewsList = document.querySelector('.reviews-list');
    if (!reviewsList) return;

    reviewsList.innerHTML = '';

    // Получаем отзывы из localStorage
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.innerHTML = `
            <div class="review-header">
                <div>
                    <span class="review-author">${review.userName}</span>
                    <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                </div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-text">
                <strong>${review.bookTitle || 'Книга'}</strong>
                <p>${review.comment}</p>
            </div>
            <div class="review-actions">
                ${currentUser && currentUser.id === review.userId ? `
                <button>Редактировать</button>
                <button>Удалить</button>
                ` : ''}
            </div>
        `;
        reviewsList.appendChild(reviewElement);
    });
}

// Обработка отправки отзыва
const submitReviewBtn = document.querySelector('.submit-review');
if (submitReviewBtn) {
    submitReviewBtn.addEventListener('click', function() {
        if (!currentUser) {
            alert('Для добавления отзыва необходимо войти в систему');
            return;
        }

        const rating = document.querySelectorAll('.star.active').length;
        const comment = document.querySelector('.add-review textarea')?.value;

        if (rating === 0 || !comment?.trim()) {
            alert('Пожалуйста, поставьте оценку и напишите отзыв');
            return;
        }

        // Получаем отзывы из localStorage
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        
        // Создаем новый отзыв
        const newReview = {
            id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
            bookId: 1, // Здесь должен быть ID книги, к которой относится отзыв
            userId: currentUser.id,
            userName: currentUser.name,
            rating,
            comment,
            date: new Date().toISOString().split('T')[0]
        };
        
        // Добавляем отзыв и сохраняем
        reviews.push(newReview);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        
        alert('Ваш отзыв успешно добавлен!');
        const textarea = document.querySelector('.add-review textarea');
        if (textarea) textarea.value = '';
        
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('active');
            star.textContent = '☆';
        });

        loadReviews();
    });
}