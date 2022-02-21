import uniqid from "uniqid";

export default class List {
    constructor () {
        this.items = [];
    }

    deleteItem(id) {
        // id гэдэг ID-тай орцын массиваас хайж олох
        const index = this.items.findIndex(el => el.id === id);

        //уг инд?кс дээрх элментийг массиваас устгана
        this.items.splice(index, 1);

    }

    addItems(item) {     
        
        // this.items.push(item);
        let newItem = {
            id: uniqid(),
            // item: item хялбар ES6
            item
        };            
        
        this.items.push(newItem);
        return newItem;
    }
}
