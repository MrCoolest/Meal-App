const app = function () {

    const search_btn = document.getElementById('search_btn');
    const search_input = document.getElementById('search_input');
    const meals_div = document.getElementById('meals-div');
    const fav_meal = document.getElementById('fav-meal-container');
    const fav_meal_parent = document.getElementById('fav-meal-parent');
    const search_meals_heading = document.getElementById('search_meals_heading');



    fetchFavMeals();

    search_btn?.addEventListener('click', searchEvent);

    meals_div?.addEventListener('click', mealDivClickEvents)

    fav_meal?.addEventListener('click', favMealEventHandel)


    function favMealEventHandel(event) {
        const dataSet = event.target.dataset;
        if ('removeFav' in dataSet) {
            removeMealToLS(dataSet['removeFav'])
            removeMealToFav(dataSet['removeFav']);
            document.getElementById(`meal_${dataSet['removeFav']}`)?.classList?.remove('heart-icon-active')
            checkMealofLs();
        }else if ('favMealId' in dataSet){
            window.location.href = `/mealDetail.html?mealId=${dataSet['favMealId']}`
            
        }

    }

    async function mealDivClickEvents(event) {
        const dataSet = event.target.dataset;
        if ('favMeal' in dataSet) {
            if (event.target.classList.contains('heart-icon-active')) {
                removeMealToLS(dataSet['favMeal'])
                event.target.classList.remove('heart-icon-active');
                removeMealToFav(dataSet['favMeal']);
            } else {
                addMealToLS(dataSet['favMeal']);
                event.target.classList.add('heart-icon-active');
                const meal = await getMealById(dataSet['favMeal']);
                addMealToFav(meal);
            }
            checkMealofLs();
        }
    }

    async function searchEvent(event) {
        event.preventDefault();
        console.log((window.location.pathname?.search('index.html')) == -1)
        renderLoader();
        search_value = search_input.value;
        const result = await getMealBySearch(search_value);
        if(result?.length>0){
            search_meals_heading.innerText="Meals"
        }else{
        search_meals_heading.innerText="Sorry, No Result Found!"
        }
        renderSearchMeals(result);
    }




    function renderLoader() {
        meals_div.classList.add('justify-content-center');
        meals_div.classList.remove('justify-content-between');
        meals_div.innerHTML = `<div class="text-center">
        <div class="spinner-border" style="width: 5rem; height: 5rem;" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>`
        return;
    }

    function renderSearchMeals(result) {
        const mealIds = getMealsFromLS();
        meals_div.innerHTML = '';
        meals_div.classList.remove('justify-content-center');
        meals_div.classList.add('justify-content-between');
        result.map(item => {
            meals_div.innerHTML += `
            <div class="card mb-4" style="width: 18rem;">
            <img class="card-img-top" src=${item.strMealThumb} alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${item.strMeal}</h5>
              <p class="card-text">${item.strInstructions.slice(0, 40)}...</p>
              <div class='d-flex flex-row justify-content-between align-items-center'>
              <a href="./mealDetail.html?mealId=${item.idMeal}" class="btn btn-primary">View</a>
              <i class="fa-solid fa-heart fa-xl heart-color-white heart-icon ${mealIds.includes(item.idMeal) ? 'heart-icon-active' : ""}" data-fav-meal=${item.idMeal} id=meal_${item.idMeal}></i>
              </div>
            </div>
          </div>
            `
        })

        return;

    }



    async function getMealBySearch(term) {
        const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);

        const respData = await resp.json();
        const Meal = respData.meals;

        return Meal;
    }



    async function getMealById(id) {
        const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

        const respData = await resp.json();
        const Meal = respData.meals[0];

        return Meal;

    }



    function addMealToLS(mealId) {
        const mealIds = getMealsFromLS();

        localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));

    }


    function removeMealToLS(mealId) {
        const mealIds = getMealsFromLS();

        localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));

    }


    function getMealsFromLS() {
        const mealIds = JSON.parse(localStorage.getItem('mealIds'));
        return mealIds === null ? [] : mealIds;
    }


    function checkMealofLs(){
        const mealIds = getMealsFromLS();
        if(mealIds.length > 0){
            fav_meal_parent.style.display  = 'block';
        }else{
            fav_meal_parent.style.display  = 'none';
        }
    }

    async function fetchFavMeals() {
        fav_meal.innerHTML = "";
        const mealIds = getMealsFromLS();

        if (mealIds.length > 0) {
            fav_meal_parent.style.display = 'block';

            for (let i = 0; i < mealIds.length; i++) {
                const mealId = mealIds[i];
                const meal = await getMealById(mealId);
                addMealToFav(meal);
            }
        } else {
            fav_meal_parent.style.display = 'none';
        }
        return;
    }

    function addMealToFav(mealData) {

        fav_meal.innerHTML += `<div class="position-relative m-2 fav-meal" data-fav-meal-id=${mealData.idMeal} id='mealId-${mealData.idMeal}'>
        <div class="position-relative"
            style="width: 100px; height:100px; border-radius:50%; border: 2px solid #e84118; padding: 1px;">
            <img src=${mealData.strMealThumb} alt="..."
                class="img-fluid rounded-circle" data-fav-meal-id=${mealData.idMeal}>
            <span
                class="position-absolute top-0 start-100 translate-middle border border-light rounded-circle hide-cross">
                <i class="fa-sharp fa-solid fa-circle-xmark" data-remove-fav=${mealData.idMeal}></i>
            </span>
        </div>
        <div class="m-2 text-small text-center">${mealData.strMeal.slice(0, 10)}...</div>
    </div>`;

    }

    function removeMealToFav(mealId) {
        const favMealObj = document.getElementById(`mealId-${mealId}`);
        favMealObj.remove();

    }


}


app();