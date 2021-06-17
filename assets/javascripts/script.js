// get parent elements
const randomMealsWrapper = document.querySelector('.meal-cards');
const favoriteSection = document.querySelector('.favorite-section');
const favoriteMealsWrapper = document.querySelector('.favorite-list-wrapper');
// data from API
const randomMealApi_url = 'https://www.themealdb.com/api/json/v1/1/random.php';

// favorites
let favorites = [];
let buttonsDOM = [];

// getting the random meal
class Meals {
  async getRandomMeal() {
    try {
      let resp = await fetch(randomMealApi_url);
      let respData = await resp.json();
      let meals = respData.meals;
      meals = meals.map(meal => {
        const name = meal.strMeal;
        const id = meal.idMeal;
        const image = meal.strMealThumb;
        return {name, id, image};
      });
      return meals;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  // display meals
  displayMeals(meals) {
    let result = '';
    meals.forEach(meal => {
      result +=
        `
        <li class="meal-card-list">
          <div class="meal-card">
            <div class="meal-card__header">
              <picture class="meal-card__image-wrapper">
                <img src="${meal.image}" alt="${meal.name}" class="meal-card__image">
              </picture>
              <span class="meal-card__label">Recipe of the day</span>
            </div>
            <div class="meal-card__info">
              <h4 class="meal-card__meal-name">${meal.name}</h4>
              <ul class="meal-card__cta-container">
                <li class="meal-card__cta-list">
                  <button class="meal-card__cta fav-button" data-id="${meal.id}">
                    <i class="fas fa-heart"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </li>
      `
    });
    randomMealsWrapper.innerHTML = result;
  }

  getFavButtons() {
    const buttons = [...document.querySelectorAll('.fav-button')];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      button.addEventListener('click', (e) => {
        // check if the meal already in favorites
        let inFavorites = favorites.find(item => item.id === id);
        if (inFavorites) {
          this.removeFavoriteItem(id);
        } else {
          e.currentTarget.classList.add('favorite-meal');
          // get meal from meals
          let favItem = Storage.getMeal(id);
          // add meal to the favorites
          favorites = [...favorites, favItem];
          // save fav item in the storage
          Storage.saveFavorites(favorites);
          // display fav item
          this.addFavoriteItem(favItem);
          // show the favorites section
          this.showFavorite();
        }
      });
    });
  }

  // check and setup favorite list
  addFavoriteItem(item) {
    const element = document.createElement('li');
    // add class
    element.classList.add('favorite-list');
    // set attribute data-id
    element.setAttribute('data-id', `${item.id}`);
    element.innerHTML =
    `
      <div class="favorite-item">
        <picture class="favorite-item__thumbnail-wrapper">
          <img class="favorite-item__thumbnail" src="${item.image}">
        </picture>
        <span class="favorite-item__meal-name">${item.name}</span>
      </div>
    `;
    favoriteMealsWrapper.appendChild(element);
  }
  // show favorites section
  showFavorite() {
    favoriteSection.classList.add('favorite-section--show');
  }
  // setup app
  setupApp() {
    favorites = Storage.getFavorite();
    if (favorites.length < 1) {
      this.hideFavorite();
    } else {
      this.populateFavorites(favorites);
      this.showFavorite();
    }
  }
  populateFavorites(favorites) {
    favorites.forEach(item => this.addFavoriteItem(item));
  }
  // hide favorites section
  hideFavorite() {
    favoriteSection.classList.remove('favorite-section--show');
  }
  // remove favorite
  removeFavoriteItem(id) {
    favorites = favorites.filter(item => item.id !== id);
    Storage.saveFavorites(favorites);
    let button = this.getSingleButton(id);
    button.classList.remove('favorite-meal');
    let favoriteItem = this.getFavItems(id);
    favoriteMealsWrapper.removeChild(favoriteItem);
  }
  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
  getFavItems(id) {
    const favoritesItems = [...document.querySelectorAll('.favorite-list')];
    return favoritesItems.find(item => item.dataset.id === id);
  }
}

// local storage
class Storage {
  static saveMeals(meals) {
    localStorage.setItem('meals', JSON.stringify(meals));
  }
  static getMeal(id) {
    let meals = JSON.parse(localStorage.getItem('meals'));
    return meals.find(meal => meal.id === id);
  }
  static saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
  static getFavorite() {
    return localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [];
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const meals = new Meals();
  const ui = new UI();
  // setup app
  ui.setupApp();
  // get random meals
  meals.getRandomMeal()
    .then(meals => {
      ui.displayMeals(meals);
      Storage.saveMeals(meals);
    }).then(() => {
      ui.getFavButtons();
    });
});



