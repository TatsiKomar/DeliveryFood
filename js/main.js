'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo =document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');
const cardInfo = document.querySelector('.card-info');


let login = localStorage.getItem('gloDelivery');

//Корзина заказов для сохранения в 'localStorage'
const cart = [];

//Блок функций

//Привязываем товары в корзине к логину
const loadCart = () => {
  if(localStorage.getItem(login)) {
    JSON.parse(localStorage.getItem(login)).forEach(item => {
      cart.push(item)
    });
  }
};

const saveCart = () => {
  localStorage.setItem(login, JSON.stringify(cart));
};

/* asynk делает функцию ассинхронной (позволяет 
  не останавливать работу сайта, пока идет выполнение запроса) 
  */
const getData = async (url) => {
  const response = await fetch(url); //fetch - делаем запрос

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
     статус ошибки ${response.status}!`); 
     //интерполяция - внутри сроки ${}вставлен JS код
     // throw позволяет самостоятельно создать и описать ошибку
  }
  return await response.json();
  // возвращаем данные json в место вызова функции
};

getData('./db/partners.json');
  // Функция валидации с применением регулярного выражения (маска для логина)
const valid = str => {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};



const toggleModal = () => {
  modal.classList.toggle("is-open");
};
 
// навешиваем метод 'toggle' для класса 'is-open'
const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open'); // класс добавлен
  loginInput.style.borderColor = ''; // класс удален. Строка очищена
};

const returnMain = () => {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
};

const autorized = () => {
  
  const logOut = () => {
    login = null;
    cart.length = 0;
    localStorage.removeItem('gloDelivery');

    buttonOut.style.display = '';
    userName.style.display = '';
    buttonAuth.style.display = '';
    cartButton.style.display = '';

    buttonOut.removeEventListener('click', logOut);

    checkAuth();
    returnMain();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
  loadCart();
};


const notAuthorized = () => {
  console.log('Не авторизован');

  const logIn = event => {
    event.preventDefault();

    //проверяем факт ввода логина
    if (valid(loginInput.value.trim())) { //trim удаляет пробелы
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();

      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      
      loginInput.style.borderColor = 'tomato';
      }
  }
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
};

const checkAuth = () => login ? autorized() : notAuthorized();
  

const createCardRestaurant = restaurant => { 
  const { image, 
          kitchen, 
          name, 
          price, 
          stars, 
          products, 
          time_of_delivery: timeOfDelivery 
  } = restaurant;

  const card = document.createElement('a');
  card.className = 'card card-restaurant';
  card.products = products;
  card.info = [name, price, stars, kitchen];
  
  card.insertAdjacentHTML('afterbegin', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
    `);
    
  cardsRestaurants.insertAdjacentElement('afterbegin', card);
};

// Создаем элемент меню и добавляем его на страницу
const createCardGood = ({ description, id, image, name, price }) => {

  //создаем элемент div
  const card = document.createElement('div');
  //добавляем класс card элементу card
  card.className = 'card';
  //вставляем версту в созданный элемент
  card.insertAdjacentHTML('afterbegin', `
      <img src="${image}" alt="${name}" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}</div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart" id="${id}">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price card-price-bold">${price} ₽</strong>
        </div>
      </div>
  `);
  // добавляем card на страницу
  cardsMenu.insertAdjacentElement('beforeend',card);
};

//Отрыть меню ресторана
const openGoods = event => {
  const target = event.target; 
  // target для события определяет, на каком элементе произошло событие

  if (login) {
    const restaurant = target.closest('.card-restaurant');

    if (restaurant){
      
      const [name, price, stars, kitchen] = restaurant.info;

      // очищаем блок с классом card-menu от дублирующего контента
      cardsMenu.textContent = '';
      // добавляем класс hide, чтобы скрыть блок при условии
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      //удаляем класс hide
      menu.classList.remove('hide');

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} ₽`;
      category.textContent = kitchen;

      getData(`../db/${restaurant.products}`)
        .then(data => data.forEach(createCardGood));
    }
  } else {
      toggleModalAuth();
    }
};

const addToCart = event => {

  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  
  if(buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(item => item.id === id);
    
    if (food) {
      food.count += 1;
    } else {
        cart.push({
          id,
          title,
          cost,
          count: 1
        });
    }
  }
  saveCart();
};

const renderCart = () => {
  modalBody.textContent = '';

  cart.forEach(function({ id, title, cost, count }){
    const itemCart = `
    <div class="food-row">
    <span class="food-name">${title}</span>
    <strong class="food-price">${cost} ₽</strong>
    <div class="food-counter">
      <button class="counter-button counter-minus" data-id="${id}">-</button>
      <span class="counter">${count}</span>
      <button class="counter-button counter-plus" data-id="${id}">+</button>
    </div>
  </div>
  `;

  modalBody.insertAdjacentHTML('beforeend', itemCart);
  });

  const totalPrice = cart.reduce(function(result, item,){
    return result + (parseFloat(item.cost) * item.count);

  },0);

  modalPrice.textContent = totalPrice + ' ₽';
};

const changeCount = event => {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find((item) => {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if(food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if(target.classList.contains('counter-plus')) food.count++;
    renderCart();
  }
  saveCart();
};

// Блок обработчиков событий
function init() {
  getData('../db/partners.json').then(data => {
    data.forEach(createCardRestaurant);
  });
  
  cartButton.addEventListener('click', renderCart);
  cartButton.addEventListener('click', toggleModal);

  buttonClearCart.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
  });

  modalBody.addEventListener('clock', changeCount);

  cardsMenu.addEventListener('click', addToCart);
  
  close.addEventListener('click', toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  
  logo.addEventListener('cklick', function(){

    containerPromo.classList.remove('hide')
    restaurants.classList.remove('hide')
    menu.classList.add('hide')
  });

  inputSearch.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      const target = event.target;
      const value = target.value.toLowerCase().trim();

      target.value = ''; //чистим поле ввода 

      //форматирование рамки при неверном вводе логина
      if (!value || value.length < 2) {
        target.style.backgroundColor = 'tomato';
        setTimeout(function(){
          target.style.backgroundColor = '';
        }, 2000);
        return;
      }

      const goods = [];

      getData('../db/partners.json')
        .then(function(data){

          const products = data.map(item => item.products);
          
          products.forEach(function(product){
            getData(`../db/${products}`)
              .then(function(data){
                goods.push(...data);

                const searchGoods = goods.filter( item => {
                  if(item.name.toLowerCase().includes(value)) {
                      return item.name.toLowerCase().includes(value);
                  } else {
                      cardInfo.textContent = 'По вашему запросу ничего не найдено';
                  }
                 
                });

                console.log(searchGoods);
                cardsMenu.textContent = '';

                containerPromo.classList.add('hide');
                restaurants.classList.add('hide');
                menu.classList.remove('hide');
          
                restaurantTitle.textContent = 'Результат поиска';
                rating.textContent = '';
                minPrice.textContent = '';
                category.textContent = '';

                return searchGoods;
                
              }).then(data => data.forEach(createCardGood));
            });
        });
    }

  });
  


  checkAuth();
    
  new Swiper('.swiper-container', {
    loop:true,
    autoplay: true,
    sliderPerView: 1,
    });
}

init();