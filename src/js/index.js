require("@babel/polyfill"); 
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from './view/searchView';

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
    //const query = 'pizza';
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
    // console.log(state.search.result);
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