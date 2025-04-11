document.addEventListener('DOMContentLoaded', function() {
    // Навигация по разделам
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Скрыть все разделы
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // Показать целевой раздел
            document.getElementById(targetId).classList.remove('hidden');
            
            // Обновить активную ссылку в навигации
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // По умолчанию показываем каталог
    document.getElementById('catalog').classList.remove('hidden');
    navLinks[0].classList.add('active');
    
    // Табы в личном кабинете
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Удалить активный класс у всех кнопок и контента
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавить активный класс текущей кнопке и контенту
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Рейтинг в отзывах
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            
            // Обновить отображение звезд
            stars.forEach((s, index) => {
                if (index < value) {
                    s.classList.add('active');
                    s.textContent = '★';
                } else {
                    s.classList.remove('active');
                    s.textContent = '☆';
                }
            });
        });
    });
    
    // Загрузка книг (имитация)
    function loadBooks() {
        const booksGrid = document.querySelector('.books-grid');
        booksGrid.innerHTML = '';
        
        // В реальном приложении здесь был бы запрос к API
        const books = [
            { id: 1, title: 'Властелин колец', author: 'Дж. Р. Р. Толкин', price: 1200, genre: 'fantasy', rating: 4.8 },
            { id: 2, title: 'Гарри Поттер и философский камень', author: 'Дж. К. Роулинг', price: 800, genre: 'fantasy', rating: 4.7 },
            { id: 3, title: '1984', author: 'Джордж Оруэлл', price: 600, genre: 'science', rating: 4.5 },
            { id: 4, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', price: 750, genre: 'romance', rating: 4.6 },
            { id: 5, title: 'Код да Винчи', author: 'Дэн Браун', price: 550, genre: 'romance', rating: 4.2 }
        ];
        
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
                const bookId = this.getAttribute('data-id');
                addToCart(bookId);
            });
        });
    }
    
    // Корзина
    let cart = [];
    
    function addToCart(bookId) {
        // В реальном приложении здесь был бы запрос к API
        const books = [
            { id: 1, title: 'Властелин колец', price: 1200 },
            { id: 2, title: 'Гарри Поттер и философский камень', price: 800 },
            { id: 3, title: '1984', price: 600 },
            { id: 4, title: 'Мастер и Маргарита', price: 750 },
            { id: 5, title: 'Код да Винчи', price: 550 }
        ];
        
        const book = books.find(b => b.id == bookId);
        
        const existingItem = cart.find(item => item.id == bookId);
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
        
        updateCart();
    }
    
    function updateCart() {
        const cartItems = document.querySelector('.cart-items');
        const cartCount = document.getElementById('cart-count');
        const totalPrice = document.getElementById('total-price');
        
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
                const itemId = this.getAttribute('data-id');
                cart = cart.filter(item => item.id != itemId);
                updateCart();
            });
        });
    }
    
    // Загрузка отзывов (имитация)
    function loadReviews() {
        const reviewsList = document.querySelector('.reviews-list');
        reviewsList.innerHTML = '';
        
        // В реальном приложении здесь был бы запрос к API
        const reviews = [
            { id: 1, bookTitle: 'Властелин колец', userName: 'Иван Иванов', rating: 5, comment: 'Отличная книга, рекомендую!', date: '2023-05-15' },
            { id: 2, bookTitle: 'Гарри Поттер и философский камень', userName: 'Иван Иванов', rating: 4, comment: 'Хорошее начало серии', date: '2023-04-20' },
            { id: 3, bookTitle: 'Властелин колец', userName: 'Петр Петров', rating: 5, comment: 'Шедевр фэнтези-литературы', date: '2023-06-01' },
            { id: 4, bookTitle: '1984', userName: 'Петр Петров', rating: 3, comment: 'Интересно, но тяжело читается', date: '2023-05-28' }
        ];
        
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
                    <strong>${review.bookTitle}</strong>
                    <p>${review.comment}</p>
                </div>
                <div class="review-actions">
                    <button>Редактировать</button>
                    <button>Удалить</button>
                </div>
            `;
            reviewsList.appendChild(reviewElement);
        });
    }
    
    // Отправка отзыва
    document.querySelector('.submit-review').addEventListener('click', function() {
        const rating = document.querySelectorAll('.star.active').length;
        const comment = document.querySelector('.add-review textarea').value;
        
        if (rating === 0 || !comment.trim()) {
            alert('Пожалуйста, поставьте оценку и напишите отзыв');
            return;
        }
        
        // В реальном приложении здесь был бы запрос к API
        alert('Ваш отзыв успешно добавлен!');
        document.querySelector('.add-review textarea').value = '';
        stars.forEach(star => {
            star.classList.remove('active');
            star.textContent = '☆';
        });
        
        // Обновить список отзывов
        loadReviews();
    });
    
    // Фильтрация отзывов
    document.getElementById('review-rating').addEventListener('change', function() {
        loadReviews();
    });
    
    // Сохранение изменений в профиле
    document.querySelector('.settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // В реальном приложении здесь был бы запрос к API
        alert('Изменения сохранены!');
    });
    
    // Инициализация
    loadBooks();
    loadReviews();
});