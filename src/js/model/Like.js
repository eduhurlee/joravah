export default class Like {
    constructor() {
        this.readDataFromLocalStorage();
        if (!this.likes) this.likes =[];
    }
    addLike (id, title, publisher, img) {
        const like = {id, title, publisher, img};
        this.likes.push(like);

        // storage руу хадгалана
        this.saveDataToLocalStorage();
        return like;
    }

    deleteLike(id){
        // id гэдэг ID-тай like массиваас хайж олох
        const index = this.likes.findIndex(el => el.id === id);

        //уг like дээрх элментийг массиваас устгана
        this.likes.splice(index, 1);

        // storage руу хадгалана
        this.saveDataToLocalStorage();
    }

    // жорыг лайктай эсэхийг шалгах
    isLiked(id) {
        /*
        if (this.likes.findIndex(el => el.id === id) === -1) return false;
        else return true;*/

        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    //нийт жор лайктай
    getNumberOfLikes() {
        return this.likes.length;
    }

    // хадгалах // JSON.stringify давталт хийж байгаад массив дахь утгыг тэмдэгт болгоод өгнө. Түүнийгээ JSON болгоод storage дотороо хадаглахад бэлднэ
    saveDataToLocalStorage(){
        localStorage.setItem("likes", JSON.stringify(this.likes));
    }

    readDataFromLocalStorage() {
        // data г JS обект болно /массив/
       this.likes = JSON.parse( localStorage.getItem('likes'));
    }
};
