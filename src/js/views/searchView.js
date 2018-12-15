import {elements} from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {elements.searchInput.value = ''};

export const highlightsSelected = (id) => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => el.classList.remove('results__link--active'));
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}
//render results to the product list
const renderRecipe = recipe => {
    const markup = `
                 <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page + 1}>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                </button>`;


const renderButtons = (page, numOfResults, resPerPage) => {
    const pages = Math.ceil(numOfResults / resPerPage);
    let button;

    if(pages > 1){
        if(page ===1){
            //only next button
            button = createButton(page, 'next');
        }else if(page === pages){
            //only prev button
            button = createButton(page, 'prev');
        }else{
            //both buttons
            button = `
                ${createButton(page,'prev')}
                ${createButton(page, 'next')}
            `;
        }

        elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
    }
};


export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render result of current page
    const start = (page - 1)* resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};
export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length + 1;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
}