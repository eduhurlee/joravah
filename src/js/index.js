require("@babel/polyfill"); 
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from './view/searchView';
import Recipe from "./model/Recipe";

/*
*web app төлөв
- хайлтын query, үр дүн
-Тухайн зкззж байгаа жор
- лайкласан жорууд
- захиалж байгаа жорын найрлагууд
*/

const state = {};

const controlSearch = async () => {
  // console.log('дарагдлаа');
  // 1. вэбээс хайлтын түлхүүр үгийг гаргаж авах
    
    const query = searchView.getInput();
  
  // хоосон эсэхийг шалгах
  if (query) {
    // 2. Шинээр хайлтын обектийг үүсгэж өгнө
    state.search = new Search(query);

    // 3. хайлт хийхэд зориулж дэлгэцийг /UI/ бэлтгэнэ
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);
  
    // 4. Хайлтыг гүйцэтгэнэ
    await state.search.doSearch();

    // 5.Хайлтын үр дүнг дэлгэцэнд үзүүлнэ
    
    clearLoader();
    if (state.search.result === undefined) alert('Хайлт илэрцгүй....');
    else searchView.renderRecipes(state.search.result);

  }
};

//  хайх товч
elements.searchForm.addEventListener('submit', e => {
  e.preventDefault(); 
  controlSearch();
});

// дарсан товч олох
elements.pageButtons.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');

  if(btn) {
    // хуудас шилжих товч
    const gotoPageNumber = parseInt(btn.dataset.goto, 10); // бүхэлдэх тоо 10т тооллын систем
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

//туршилт
const r = new Recipe(47746);
r.getRecipe();