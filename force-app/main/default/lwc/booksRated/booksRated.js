import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import bestRated from '@salesforce/apex/BookListHandler.bestRated'

export default class BooksRated extends NavigationMixin(LightningElement) {
    @wire(bestRated) bestBooks
    classname = 'rate'
    
    handleEventClick(event){
        let selectedId = event.currentTarget.dataset.bookId
            this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
            name: 'Book_Detail__c',
            },
            state: {
                bookId: selectedId,
            }
        });

        
    }

}