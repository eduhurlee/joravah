import { concat } from "lodash";
import { elements } from "./base";

// далдлагдсан private function
const renderRecipe = recipe => {
    // console.log(recipe.title);
    console.log(recipe);
    const markup = `
    <li>
         <a class="results__link" href="${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
                    </figure>
                    <div class="results__data">
                        <h4 class="results__name">${recipe.title}</h4>
                        <p class="results__author">${recipe.publisher}</p>
                    </div>
        </a>
    </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);    
    
};

export const clearSearchQuery = () => {
    elements.searchInput.value = '';
};

export const clearSearchResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.pageButtons.innerHTML = '';
}

export const getInput = () => elements.searchInput.value;
export const renderRecipes = (recipes, page = 1, resPerPage = 10) => {
    // Хайлтын үр дүнг хуудаслах
        // худасны массивийн хэдээс хэддүгээр хувьсанчийг үзүүлэх (page = 2 бол start = 10, end = 20 болно)
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    // recipes.forEach(renderRecipe);
    // худасаа таслах
    recipes.slice(start, end).forEach(renderRecipe);

    // Хуудасны товчгуудыг гаргаж ирэх
    const totalsPages = Math.ceil (recipes.length / resPerPage);
    renderButtons(page, totalsPages); 
};

// type ===> prev, next 
// товчны код давтагдах учир 
const createBotton = (page, type, direction ) => 
`<button class="btn-inline results__btn--${type}" data-goto=${page}>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${direction}"></use>
</svg>
<span>Хуудас ${page}</span>
</button>
`;

const renderButtons = (currentPage, totalsPages) => {
    let buttonHTML ;

    if (currentPage === 1 && totalsPages > 1) {
        // 1-р хуудас дээр байна. 2-р хуудас гэдэг товчийг гарга
        buttonHTML = createBotton(2, 'next', 'right');
    } else if ( currentPage < totalsPages) {
        // дунд хуудас байна. өмнөх болон дараагийн хуудасыг харуул
        buttonHTML = createBotton(currentPage + 1, 'next', 'right') +  createBotton(currentPage - 1, 'prev', 'left');

    } else if ( currentPage === totalsPages) {
        // хамгийн сүүлийн хуудас дээр байна. Өмнөх рүү шилжүүлэх товчийг гарга
        buttonHTML = createBotton(currentPage - 1, 'prev', 'left');
    };

    elements.pageButtons.insertAdjacentHTML('afterbegin', buttonHTML);
};
