export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.likes.push(like);
        //persiste data in localStorage
        this.persisteData();
        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex( el => el.id === id);
        this.likes.splice(index, 1);
        //delete from localStorage
        this.persisteData();
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) > -1;
    }

    getNumLikes() {
        return this.likes.length;
    }
    persisteData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage){
            this.likes = storage;
        }

    }
}