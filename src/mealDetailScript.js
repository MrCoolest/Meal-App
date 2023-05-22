const mealDetailPage = function () {
    
    const mealImage = document.getElementById('meal_img')
    const mealName = document.getElementById('meal_name')
    const mealInstructions = document.getElementById('meal_instructions')
    const ingredientsUl = document.getElementById('ingredients-text')
    const detail_container = document.getElementById('detail-container')


    renderMealDetail();

    async function renderMealDetail(){
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('mealId');
        let result= '';
        if(myParam){
            result = await getMealById(myParam);    
        }else{
            result = await getRandomMeal(); 
        }
        console.log(result)   
        serveData(result);
    }

    function serveData(mealData){
        detail_container.style.display='block';
        mealImage.src = mealData.strMealThumb;
        mealName.innerText = mealData.strMeal;
        mealInstructions.innerText = mealData.strInstructions;

        for (let i = 1 ; i<=20; i++){
            if (mealData['strIngredient'+i]){
                let value = mealData['strIngredient'+i]+' - '+mealData['strMeasure'+i];
            const li = document.createElement('li');
            li.innerText= value;
            ingredientsUl.append(li);
            }

        }

    }

    async function getRandomMeal() {
        const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        const respData = await resp.json();
        const randomMeal = respData.meals[0];
        serveData(randomMeal);
    }


    async function getMealById(id) {
        const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

        const respData = await resp.json();
        const Meal = respData.meals[0];

        return Meal;

    }


}


mealDetailPage();