document.addEventListener('DOMContentLoaded', () => {
    // Переменные для модального окна
    const productCards = document.querySelectorAll('.product-card');
    const modal = document.getElementById('product-modal');
    const closeModal = document.querySelector('.close');
    const modalName = document.getElementById('modal-product-name');
    const modalGallery = document.querySelector('.image-gallery');
    const modalDescription = document.getElementById('modal-description');
    const categoryTreeContainer = document.getElementById('category-tree');
    const searchInput = document.getElementById('search-input');
    let activeCategory = "";

    // Проверка наличия всех элементов
    if (!modal) console.error('Модальное окно (#product-modal) не найдено.');
    if (!closeModal) console.error('Кнопка закрытия (.close) не найдена.');
    if (!modalName) console.error('Название товара (#modal-product-name) не найдено.');
    if (!modalGallery) console.error('Галерея изображений (.image-gallery) не найдена.');
    if (!modalDescription) console.error('Описание товара (#modal-description) не найдено.');

    // Открытие модального окна только при клике на изображение
    if (productCards.length > 0 && modal && closeModal && modalName && modalGallery && modalDescription) {
        productCards.forEach(card => {
            const image = card.querySelector('img'); // Выбираем только изображение внутри карточки
            if (image) {
                image.addEventListener('click', () => {
                    const id = card.dataset.id;
                    const name = card.querySelector('h3').textContent;
                    const description = card.querySelector('.product-description').textContent;
                    const imageSrc = image.src;

                    // Обновляем содержимое модального окна
                    modalName.textContent = name || 'Название отсутствует';
                    modalGallery.innerHTML = `<img src="${imageSrc}" alt="${name || 'Товар'}" class="modal-image">`;
                    modalDescription.textContent = description || 'Описание отсутствует';

                    // Показываем модальное окно
                    modal.style.display = 'block';

                    // Блокировка бэкграунда при открытии модального окна
                    document.body.style.overflow = 'hidden';

                    // Обновляем кнопки управления количеством и добавления в корзину
                    setupModalQuantityControls(card);
                });
            } else {
                console.error('Изображение в карточке товара не найдено.');
            }
        });

        // Закрытие модального окна
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Возвращаем скролл
        });

        // Закрытие модального окна при клике вне его содержимого
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Возвращаем скролл
            }
        });
    } else {
        console.error('Один или несколько элементов модального окна не найдены.');
    }

    // Управление количеством на главном экране
    const increaseButtons = document.querySelectorAll('.increase');
    const decreaseButtons = document.querySelectorAll('.decrease');

    if (increaseButtons.length > 0 && decreaseButtons.length > 0) {
        increaseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const quantityElement = btn.previousElementSibling;
                const productCard = btn.closest('.product-card');

                if (!productCard) {
                    console.error('Кнопка увеличения не принадлежит карточке товара.');
                    return;
                }

                const maxQuantity = parseInt(productCard.dataset.maxQuantity || '0');
                if (quantityElement) {
                    let currentQuantity = parseInt(quantityElement.textContent || '0');
                    if (currentQuantity < maxQuantity) {
                        quantityElement.textContent = currentQuantity + 1;
                    } else {
                        alert('Нельзя добавить больше, чем остаток на складе.');
                    }
                } else {
                    console.error('Элемент отображения количества не найден.');
                }
            });
        });

        decreaseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const quantityElement = btn.nextElementSibling;
                const productCard = btn.closest('.product-card');

                if (!productCard) {
                    console.error('Кнопка уменьшения не принадлежит карточке товара.');
                    return;
                }

                if (quantityElement) {
                    let currentQuantity = parseInt(quantityElement.textContent || '0');
                    if (currentQuantity > 0) {
                        quantityElement.textContent = currentQuantity - 1;
                    }
                } else {
                    console.error('Элемент отображения количества не найден.');
                }
            });
        });
    } else {
        console.error('Кнопки управления количеством не найдены.');
    }

    // Обработка кнопок "Добавить в корзину" на главном экране
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const productCard = btn.closest('.product-card');
                if (!productCard) {
                    console.error('Кнопка "Добавить в корзину" не принадлежит карточке товара.');
                    return;
                }

                const quantityElement = productCard.querySelector('.quantity');
                if (!quantityElement) {
                    console.error('Элемент отображения количества для добавления в корзину не найден.');
                    return;
                }

                const quantity = parseInt(quantityElement.textContent || '0');
                const maxQuantity = parseInt(productCard.dataset.maxQuantity || '0');

                if (quantity > maxQuantity) {
                    alert('Нельзя добавить больше, чем остаток на складе.');
                    return;
                }

                alert(`Товар "${productCard.querySelector('h3').textContent}" добавлен в корзину в количестве ${quantity}!`);
                productCard.dataset.maxQuantity = maxQuantity - quantity;
                quantityElement.textContent = '0'; // Сбрасываем количество после добавления
            });
        });
    } else {
        console.error('Кнопки "Добавить в корзину" не найдены.');
    }

    /**
     * Настройка кнопок управления количеством и добавления в корзину внутри модального окна
     */
    function setupModalQuantityControls(productCard) {
        const modalQuantityElement = modal.querySelector('.quantity');
        const modalIncreaseButton = modal.querySelector('.increase');
        const modalDecreaseButton = modal.querySelector('.decrease');
        const modalAddToCartButton = modal.querySelector('.add-to-cart');

        if (!modalQuantityElement || !modalIncreaseButton || !modalDecreaseButton || !modalAddToCartButton) {
            console.error('Элементы управления количеством в модальном окне не найдены.');
            return;
        }

        const maxQuantity = parseInt(productCard.dataset.maxQuantity || '0');
        modalQuantityElement.textContent = '1'; // Сбрасываем количество при открытии модального окна

        // Увеличение количества
        modalIncreaseButton.onclick = () => {
            let currentQuantity = parseInt(modalQuantityElement.textContent || '0');
            if (currentQuantity < maxQuantity) {
                modalQuantityElement.textContent = currentQuantity + 1;
            } else {
                alert('Нельзя добавить больше, чем остаток на складе.');
            }
        };

        // Уменьшение количества
        modalDecreaseButton.onclick = () => {
            let currentQuantity = parseInt(modalQuantityElement.textContent || '0');
            if (currentQuantity > 1) {
                modalQuantityElement.textContent = currentQuantity - 1;
            }
        };

        // Добавление в корзину
        modalAddToCartButton.onclick = () => {
            const quantityToAdd = parseInt(modalQuantityElement.textContent || '0');
            if (quantityToAdd > maxQuantity) {
                alert('Нельзя добавить больше, чем остаток на складе.');
                return;
            }

            alert(`Товар "${productCard.querySelector('h3').textContent}" добавлен в корзину в количестве ${quantityToAdd}!`);
            productCard.dataset.maxQuantity = maxQuantity - quantityToAdd;
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Возвращаем скролл
        };
    }

    // Построение дерева категорий на основе карточек
    const categories = buildCategoryTreeFromCards(productCards);
    if (categoryTreeContainer) {
        const categoryElements = renderCategories(categories);
        categoryTreeContainer.appendChild(categoryElements);
    } else {
        console.error('Контейнер для дерева категорий не найден.');
    }

    /**
     * Создание дерева категорий на основе атрибутов data-category карточек
     */
    function buildCategoryTreeFromCards(cards) {
        const tree = {};
        cards.forEach(card => {
            const categoryPath = card.dataset.category.split('/');
            let currentLevel = tree;
            categoryPath.forEach(category => {
                if (!currentLevel[category]) {
                    currentLevel[category] = {};
                }
                currentLevel = currentLevel[category];
            });
        });
        return tree;
    }

    /**
     * Рендеринг дерева категорий
     */
    function renderCategories(categories, path = "", level = 0) {
        const fragment = document.createDocumentFragment();

        Object.keys(categories).forEach(category => {
            const newPath = path ? `${path}/${category}` : category;

            const categoryItem = document.createElement('div');
            categoryItem.classList.add('category-item');
            categoryItem.style.paddingLeft = `${level * 15}px`;

            const button = document.createElement('button');
            button.className = `category-button ${level > 0 ? 'subcategory-button' : ''}`;
            button.textContent = category;

            // Контейнер для подкатегорий
            const subcategoriesContainer = document.createElement('div');
            subcategoriesContainer.classList.add('subcategory-container');
            subcategoriesContainer.style.display = 'none'; // Изначально подкатегории скрыты

            button.addEventListener('click', () => {
                const isVisible = subcategoriesContainer.style.display === 'block';
                subcategoriesContainer.style.display = isVisible ? 'none' : 'block';

                // Установка активной категории для фильтрации
                activeCategory = isVisible ? "" : newPath;
                filterProducts();
            });

            categoryItem.appendChild(button);

            if (Object.keys(categories[category]).length > 0) {
                const subcategories = renderCategories(categories[category], newPath, level + 1);
                subcategoriesContainer.appendChild(subcategories);
            }

            categoryItem.appendChild(subcategoriesContainer);
            fragment.appendChild(categoryItem);
        });

        return fragment;
    }

    /**
     * Фильтрация товаров
     */
    function filterProducts() {
        const searchQuery = searchInput.value.toLowerCase();

        document.querySelectorAll('.product-card').forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productCategory = card.dataset.category.toLowerCase();

            const matchesCategory = !activeCategory || productCategory.startsWith(activeCategory.toLowerCase());
            const matchesSearch = !searchQuery || productName.includes(searchQuery);

            card.style.display = matchesCategory && matchesSearch ? '' : 'none';
        });
    }

    // Фильтрация при изменении текста поиска
    searchInput.addEventListener('input', () => {
        filterProducts();
    });
    document.getElementById('go-to-cart').addEventListener('click', () => {
        window.location.href = '/cart'; // Убедитесь, что маршрут '/cart' настроен в вашем приложении
    });
});