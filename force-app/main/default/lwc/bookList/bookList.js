import { LightningElement, api } from 'lwc';
import filteredBooks from '@salesforce/apex/BookListHandler.filteredBooks'
import booksimage from '@salesforce/resourceUrl/booklist'
export default class BookList extends LightningElement {
    bookList
    state= true;
    test = booksimage
    @api set book(value){
        this.bookList = value
    }

    get book(){
        return this.bookList
    }
}