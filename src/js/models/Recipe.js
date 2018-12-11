import axios from 'axios';
import {key, proxy} from '../config';
import { parse } from 'url';

export default class Recipe {
    constructor(id){
        this.id = id;
    }
    async getRecipe(){
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            console.log(res);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch(err){
            console.log(err);
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings (){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        const newIngredients = this.ingredients.map(el => {
            //uniform the units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            //remove parenthese
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            //parse ingredients into count, unit and ingredients   
            let objIng;
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); 
            if(unitIndex > -1){
                //there is an unit
                const arrCount = arrIng.slice(0, unitIndex);//elements before unit is count
                let count;
                if(arrCount.length == 1){
                    count = eval(arrCount[0].replace('-', '+'));
                }else{
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count: count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            }else if(parseInt(arrIng[0], 10)){
                //there is no unit but first element is a number like 1 bread
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }else{
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //servings
        const newServings = type === 'dec' ? this.servings - 1: this.servings + 1;
        //ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings);
        });
        this.servings = newServings;
    }
}