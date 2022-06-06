import { LightningElement, wire, track } from 'lwc';
import filteredBooks from '@salesforce/apex/BookListHandler.filteredBooks'
import numberOfPages from '@salesforce/apex/BookListHandler.numberOfPages'

export default class TemplateListBooks extends LightningElement {

    @track bookList
    @track type = ''
    classname='tile'
    next = 0;
    index = 1;
    sold = false;
    price = false;
    @wire(numberOfPages, {type: '$type'}) pages

 

    @wire(filteredBooks, {type: '$type', next: '$next', sold: '$sold', price: "$price"})
    books(result) {
        if (result.data) {
            this.bookList = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }

    allBooks(event){
        let inputs = this.template.querySelectorAll('input')
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].name !== event.target.name && inputs[i].checked){
                inputs[i].checked = false;
            }
        }
        if(event.target.checked == false){
            this.type = ''
        }
        else {
          this.type = event.target.name
        }
    }

    nextPage(){
        if(this.bookList.length < 8){
            return;
        }
        else {
            this.index++
           this.next = this.next + 8; 
        }  
    }
    prevPage(){
        if(this.index === 1){
            return;
        }
        else {
            this.index--
           this.next = this.next - 8; 
        }
    }

    sortList(event){
        if(event.target.value == 0){
            this.price = true;
            this.sold = false;
        }
        else if(event.target.value == 1) {
            this.price = false;
            this.sold = false;
        }
        else {
            this.sold = true;
            this.price = false;
        }
    }
}