import { LightningElement, wire, api } from 'lwc';
import header from '@salesforce/resourceUrl/header'
import searchBook from '@salesforce/apex/BookListHandler.searchBook'
import search from '@salesforce/resourceUrl/searchBackground'
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

export default class HeaderSearch extends NavigationMixin(LightningElement) {
    text = ''
    next = 0;
    index = 0;
    @wire(searchBook, {text: '$text', next: '$next'}) books

    
    handleSearch(event){
          this.text = event.target.value
          searchBook({text: this.text, next: 0})
    }

    nextPage(){
        if(this.books.data.length < 5){
            return
        }
        else {
          this.next = this.next + 5;   
          this.index++;
        }
       
    
    }

    prevPage(){
        if(this.index === 0){
            return;
        }
        else {
            this.next = this.next - 5;  
            this.index--
         }
    }

    backToHeader(){
        this.dispatchEvent(new CustomEvent('header'));
    }

    handleNavigate(event){
        let selectedId = event.currentTarget.dataset.bookId
  
            this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
            name: 'Book_Detail__c',
            },
            state: {
                bookId: selectedId,
                source: 'homePage'
            }
        });
    }
  
}