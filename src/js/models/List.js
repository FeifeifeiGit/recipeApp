import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items = [];
    }

    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        //splice delect the subarray and return, the oringinal array got mutated, but slice does not mutate the original array
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }

    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    }
}