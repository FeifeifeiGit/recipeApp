import axios from 'axios';
import key from '../config';

export default class Search {
    constructor(query){
        this.query = query;
    }
    async getResults(query){
        const key = '317f842dd7f5faa80beeb72a324ba91a';
        try {
         const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
         this.result = res.data.recipes;
         console.log(this.result);
        } catch(error){
          console.log(error);
        }
     }
}

