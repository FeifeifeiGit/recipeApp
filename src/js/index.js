import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';
import * as recipeView from './views/recipeView';

/*global state 
* Search object
* Current recipe object
* Shopping list object
* Linked recipe
*/
const state = {};
const controlSearch = async () => {
    //get the query from the view
    const query = searchView.getInput();
    if(query){
        //new search object is added to state
        state.search = new Search(query);
        //prepare UI for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);
        try{
            //search for recipes
            await state.search.getResults();
            clearLoader();
            //render results to UI
            searchView.renderResults(state.search.result);
        }catch(err){
            console.log('Something went wrong when searching');
            clearLoader();
        }
    }
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, gotoPage);
    }
});


/*RECIPE CONTROLLER*/
const controlRecipe = async() => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');
    if(id){
        //prepare UI for changes
        renderLoader(elements.recipe);
        //Create new recipe object
        state.recipe = new Recipe(id);
        //highlight recipe
        if(state.search){
            searchView.highlightsSelected(id);
        }
        
        try{
            //get recipe data
            await state.recipe.getRecipe();
            window.r = state.recipe;
            //calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            state.recipe.parseIngredients();
            //render recipe
            clearLoader();
            recipeView.clearRecipe();
            recipeView.renderRecipe(state.recipe);
        }catch(err){
            console.log('Error processing recipe');
            console.log(err);
        }  
    }
    
}

//add event listener if use refresh the page
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.searvings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
           
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
} );