export const elements = {
    searchForm : document.querySelector('.search'),
    searchInput : document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    searchResult: document.querySelector('.results'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe')
}
//for elements that are not on the page yet, ex the loader, so cannot select as above
export const elementsStrings = {
    loader : 'loader'
};
export const renderLoader = parent => {
    const loader = `
        <div  class="${elementsStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>   
     `;
     parent.insertAdjacentHTML('afterBegin', loader);
};

export const clearLoader = () => {
   const loader = document.querySelector(`.${elementsStrings.loader}`);
   if (loader) 
    loader.parentElement.removeChild(loader);
};