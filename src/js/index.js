require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import { renderRecipe, clearRecipe, highLightSelectedRecipe } from "./view/recipeView";
import List from "./model/List";
import * as listView from "./view/listView";
import Like from "./model/Like";
import * as likeView from "./view/likesView";

/**
 * Web app төлөв
 * - Хайлтын query, үр дүн
 * - Тухайн үзүүлж байгаа жор
 * - Лайкласан жорууд
 * - Захиалж байгаа жорын найрлаганууд
 */

const state = {};

/* эхэнд ажиллах тул доош нь зөөсөн
//Лайк цэсийг хаах
likeView.toggleLikeMenu(0);
*/

/**
 * Хайлтын контроллер = Model ==> Controller <== View
 */
const controlSearch = async () => {
  // 1) Вэбээс хайлтын түлхүүр үгийг гаргаж авна.
  const query = searchView.getInput();

  if (query) {
    // 2) Шинээр хайлтын обьектийг үүсгэж өгнө.
    state.search = new Search(query);

    // 3) Хайлт хийхэд зориулж дэлгэцийг UI бэлтгэнэ.
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);

    // 4) Хайлтыг гүйцэтгэнэ
    await state.search.doSearch();

    // 5) Хайлтын үр дүнг дэлгэцэнд үзүүлнэ.
    clearLoader();
    if (state.search.result === undefined) alert("Хайлтаар илэрцгүй...");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

/**
 * Жорын контролллер
 */
const controlRecipe = async () => {
  // 1) URL-аас ID-ийг салгаж
  const id = window.location.hash.replace("#", "");
  /* window ачааллагдах үед ачааллах хэрэгтэй учир доош зөөсөн
     //хайлт хийх үед лайк шаардаж байгаа тул нэмж хийсэн
  if (!state.likes) state.likes = new Like();
  */

  //дөнгөж эхлэж байхад сум эргэлдээд байна зогсоох if ашиглаж бусад код хийж өгөх // URL дээр id байгаа эсэхийг шалгана
  if (id) {
    // 2) Жорын моделийг үүсгэж өгнө.
  state.recipe = new Recipe(id);

  // 3) UI дэлгэцийг бэлтгэнэ.
  clearRecipe();
  // эргэлддэг сум
  renderLoader(elements.recipeDiv);
  highLightSelectedRecipe(id);

  // 4) Жороо татаж авчирна.
  await state.recipe.getRecipe();

  // 5) Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно
  clearLoader();
  state.recipe.calcTime();
  state.recipe.calcHuniiToo();

  // 6) Жороо дэлгэцэнд гаргана
  //renderRecipe(state.recipe);

  //like байгаа эсэхийг харуулах
  renderRecipe(state.recipe, state.likes.isLiked(id));
  }  
};
/*
// url өөрчлөлт авах
window.addEventListener("hashchange", controlRecipe);

// refresh хийх үед гаргасан хуудасаа хэвээр хадгалах load
window.addEventListener("load", controlRecipe);

Массивт хийж давталтаар ажиллуулах 
дараа өргөтгөх боломжтой
*/
["hashchange", "load"].forEach(e => window.addEventListener(e, controlRecipe));

//
window.addEventListener('load', e =>{ 
  // апп дөнгөж ачааллагдахад лайк модел ачааллагдана
  if (!state.likes) state.likes = new Like();

  //Лайк цэсийг гаргах эсэхийг шийдэх
likeView.toggleLikeMenu(state.likes.getNumberOfLikes());

// Лайк байвал цэсэнд нэмэх
state.likes.likes.forEach(like => likeView.renderLike(like));
});

/**
 * Найрлаганы контроллер --- сагсанд хийх товч дарах үед ажиллах
 */

const controlList = () => {
  
 // state.recipe.ingredients ---массивт найрлагууд байгаа
 // 1. Найрлаганы мод?лийг үүсгэнэ
 state.List = new List();
 // Өмнөх найрлагыг дэлгэцнээс цэвэрлэх
 listView.clearItems();

 //2. уг мод?л руу одоо харгдаж байгаа жонны бүх найрлагыг авч хийнэ
 state.recipe.ingredients.forEach(n => { 
   // Тухайн найрлагыг модел руу хийнэ
   const item = state.List.addItems(n);
   // Тухайн найрлагыг дэлгэцэнд гаргана
   listView.renderItem(item);
});
};

/**
 * Like controller
 */
const controlLike = () => {  
  // Дарагдсан жорыг модел руу хийх
  // 1. Лайкийн мод?лийг үүсгэнэ
 
  if (!state.likes) state.likes = new Like();

  //2. одоо харагдаж байгаа жорын ID олж авах
  const currentRecipeid = state.recipe.id;

  // 3. Энэ жорыг лайкласан эсэхийг шалгах
  if (state.likes.isLiked(currentRecipeid)){

    // - Лайктай бол лайкийг болиулна
    state.likes.deleteLike(currentRecipeid);

    //console.log('Like hiisen....')
    // console.log(state.likes)
    
    // Лайкийн цэснээс байгаа цэснээс устгах
    likeView.deleteLike(currentRecipeid)

    //лайк товчны лайкалсан байдлыг болиулах
    likeView.toggleLikeBtn(false);
  } else {

    // - Лайклаагүй бол лайклана
   //console.log('Like hiigeegui....')
    const newLike = state.likes.addLike(currentRecipeid, 
      state.recipe.title, 
      state.recipe.publisher,
      state.recipe.image_url
    );
      // Лайк цэсэнд лайз оруулах
    likeView.renderLike(newLike);
    // лайк товчины лайкалсан байдлыг харуулах
    likeView.toggleLikeBtn(true);

  }

  likeView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener('click', e => {
    //matches()--- css шүүх
   if(e.target.matches('.recipe__btn, .recipe__btn *' )) {
    controlList();
    // like товчлуур
  } else if (e.target.matches('.recipe__love, .recipe__love *' )){
    controlLike();
  }
});

elements.shoppingList.addEventListener('click', e => {
  //click хийсэн li элментийн data=itemid аттрибутийг шүүж гаргаж авах
  const id = e.target.closest('.shopping__item').dataset.itemid;
  
  // олдсон ID-тэй орцыг мод?лоос устгана
  state.List.deleteItem(id);

  // Дэлгэцэн дээрээс орцыг устгана
  listView.deleteItem(id);
});