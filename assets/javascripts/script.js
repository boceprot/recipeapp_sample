// get parent elements
const randomMealsWrapper = document.querySelector('.meal-cards');
const favoriteSection = document.querySelector('.favorite-section');
const favoriteMealsWrapper = document.querySelector('.favorite-list-wrapper');

// display all items when page load
window.addEventListener("DOMContentLoaded", function () {
  getRandomMeal();
  setupFavoriteList();
});

// fetch data from API
async function getRandomMeal() {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  addMeal(randomMeal, true);
}

// add random meal to the list
function addMeal(mealData) {
  const mealList = document.createElement('li');
  mealList.classList.add('meal-card-list');

  mealList.innerHTML =
  `
    <div class="meal-card">
      <div class="meal-card__header">
        <picture class="meal-card__image-wrapper">
          <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" class="meal-card__image">
        </picture>
        <span class="meal-card__label">Recipe of the day</span>
      </div>
      <div class="meal-card__info">
        <h4 class="meal-card__meal-name">${mealData.strMeal}</h4>
        <ul class="meal-card__cta-container">
          <li class="meal-card__cta-list">
            <button class="meal-card__cta fav-button">
              <i class="fas fa-heart"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  `
  randomMealsWrapper.appendChild(mealList);

  // add/remove to favorite
  const favButtons = document.querySelectorAll('.fav-button');

  favButtons.forEach(function(favButton) {
    favButton.addEventListener('click', (e) => {
      e.preventDefault;
      const button = e.currentTarget;
      if (button.classList.contains('favorite-meal')) {
        button.classList.remove('favorite-meal');
        removeMealFromLocalStorage(mealData);
      } else {
        button.classList.add('favorite-meal');
        addMealToLocalStorage(mealData);
      }
      setBackToDefault();
    });
  });
}

// check and setup favorite list
function setupFavoriteList() {
  const mealIds = getMealFromLocalStorage();

  if (mealIds.length > 0) {
    mealIds.forEach(function(meal) {
      createFavoriteList(meal);
    });
    favoriteSection.classList.add('favorite-section--show');
  } else if (mealIds.length === 0) {
    favoriteSection.classList.add('favorite-section--show');
  } else {
    return createFavoriteList(meal);
  }
}

// render favorite item
function createFavoriteList(item) {
  const element = document.createElement('li');
  // add class
  element.classList.add('favorite-list');
  // add id
  element.innerHTML =
  `
    <div class="favorite-item">
      <picture class="favorite-item__thumbnail-wrapper">
        <img class="favorite-item__thumbnail" src="${item.strMealThumb}">
      </picture>
      <span class="favorite-item__meal-name">${item.strMeal}</span>
    </div>
  `
  favoriteMealsWrapper.appendChild(element);
}

// local storage
// set back to default
function setBackToDefault() {
  favoriteSection.innerHTML = '';
}

function getMealFromLocalStorage() {
  return localStorage.getItem('mealIds') ? JSON.parse(localStorage.getItem('mealIds')) : [];
}

function addMealToLocalStorage(mealId) {
  let mealIds = getMealFromLocalStorage();
  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
  mealIds.push(mealId);
}

function removeMealFromLocalStorage(mealId) {
  let mealIds = getMealFromLocalStorage();
  localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}



