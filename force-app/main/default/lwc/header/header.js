import { LightningElement, wire } from 'lwc';
import bestSeller from '@salesforce/apex/BookListHandler.bestSeller';
import { NavigationMixin } from 'lightning/navigation';

export default class Header extends NavigationMixin(LightningElement) {
    @wire(bestSeller) bestseller
    marginAnimation = 0;
    search = false;

    get bestSellerBook(){
        return this.bestseller.data
    }

    showSearch(){
        this.search = !this.search;
    }

    handleBookList(){
        this[NavigationMixin.Navigate]({
         type: 'comm__namedPage',
         attributes: {
         name: 'Books__c',
         }
     }); 
     }
    
}