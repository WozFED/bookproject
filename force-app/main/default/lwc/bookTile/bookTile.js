import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class BookTile extends NavigationMixin(LightningElement) {
    @api book;
    @api classname;


    handleEventClick(event){
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