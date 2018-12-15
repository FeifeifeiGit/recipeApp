import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';
import * as recipeView from './views/recipeView';
import List from './models/List';
import * as listView from './views/listView';
import Likes from './models/Likes';
import * as likesView from './views/likesView';

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

/*
LIKES Controller
*/

const constrolLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    if(!state.likes.isLiked(currentID)){
        //user had not liked current recipe
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //toggle the like button
        likesView.toggleLikeBtn(true);
        //add like to the ui like
        likesView.renderLike(newLike);
    }else{//user has liked the current recipe
        //remove like from the state
        state.likes.deleteLike(currentID);
        //toggle the like button
        likesView.toggleLikeBtn(false);
        //remove from UI 
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

//Restore Liked recipe on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //render the existing likes menu
    state.likes.likes.forEach(like => likesView.renderLike(like));
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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        }catch(err){
            console.log('Error processing recipe');
            console.log(err);
        }  
    }
    
}
//List Controller
const controlList = () => {
    //create a new list if there is none
    if(!state.list){
        state.list = new List();
    }
    state.recipe.ingredients.forEach(el => {
       const item =  state.list.addItem(el.count, el.unit, el.ingredient);
       listView.renderItem(item);
    });
}

//handle delete and update the shopping list
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //handle the delete 
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);
        //delete from UI
        listView.deleteItem(id);
    }else if(e.target.matches('.shppoing__count--value')){
        const newCount = e.target.value;
        state.list.updateCount(id, newCount);
    }
});

//add event listener if use refresh the page
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }    
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn-add, .recipe__btn-add *')){
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        //Like controller
        constrolLike();
    }
} );

