'use strict';

const cartButton = document.getElementById("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.getElementById('#logInForm');
const loginInput = document.getElementById('#login');
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

let login = localStorage.getItem('gloDelivery');

const getData = async function(url) {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
     статус ошибка ${response.status}!`); //интерполяция - внутри сроки ${}вставлен JS код
  }
  return await response.json();

};


function toggleModal () {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
}

function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

function autorized() {
  
  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonOut.style.display = '';
    userName.style.display = '';
    buttonAuth.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();
  }
  console.log('Авторизован');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
}


function notAuthorized() {
  console.log('Не авторизован');

  function logIn(event) {
    event.preventDefault();

    if (loginInput.value) {
      loginInput.style.borderColor = '';
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
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAuthorized();
  }
}


function createCardRestaurant({ image, kitchen, 
  name, price, stars, products, 
  time_of_delivery: timeOfDelivery }) {

  const card = document.createElement('a');
  card.className.add('card-resraurant');
  card.products = products;
  card.info = [name, price, stars, kitchen];
 
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery}</span>
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
  cardsRestaurants.insertAdjacentElement('beforeend', card);
  }


function createCardGood({ description, image, name, price }) {

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="${name}" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}</div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">${price} ₽</strong>
        </div>
      </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend',card);
}

function openGoods(event) {
  const target = event.target;
  if (login) {
    const restaurant = target.closest('.card-restaurant');

    if (restaurant){

      const [name, price, stars, kitchen] = restaurant.info;


      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = 'От ${price} ₽';
      category.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(function(data) {
      data.forEach(createCardGood())
      });
    }
  } else {
      toggleModalAuth();
    }
}

function init() {
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardRestaurant())
  });
  
  cartButton.addEventListener('click', toggleModal);
  
  close.addEventListener('click', toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  
  logo.addEventListener('cklick', function(){
    containerPromo.classList.remove('hide')
    restaurants.classList.remove('hide')
    menu.classList.add('hide')
  });

  inputSearch.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      const target = event.target;
      const value = target.value.toLowerCase().trim();

      target.value = '';

      if (!value || value.length < 2) {
        target.style.backgroundColor = 'tomato';
        setTimeout(function(){
          target.style.backgroundColor = '';
        }, 2000);
        return;
      }

      const goods = [];
      getData('./db/partners.json')
        .then(function(data){
          const products = data.map(function(item) {
            return item.products;
          });
          products.forEach(function(product){
            getData(`./db/${products}`)
              .then(function(data){
                goods.push(...data);

                const searchGoods = goods.filter(function(item){
                  return item.name.toLowerCase().includes(value);

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

                
              })
              .then(function(data){
                goods.forEach(createCardGood);
              })
          })
        });
    }

  });
  


  checkAuth();
    
  new Swiper('.swiper-container', {
    loop:true,
    sliderPerView: 1,
    });
}

init();