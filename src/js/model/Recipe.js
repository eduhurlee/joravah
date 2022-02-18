import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    // id татах
    async getRecipe () {
        const result = await axios('https://forkify-api.herokuapp.com/api/get?rId=' + this.id);

        //console.log(result);

        this.publisher = result.data.recipe.publisher;
        this.ingredients = result.data.recipe.ingredients;
        this.source_url = result.data.recipe.source_url;
        this.image_url = result.data.recipe.image_url;
        this.publisher_url = result.data.recipe.publisher_url;
        this.title = result.data.recipe.title;
        this.social_url = result.data.recipe.social_url;
        // console.log(this.title);
        // console.log(this,this.ingredients);
    }
};