import { LightningElement, track, wire } from 'lwc';
import displayCartItems from '@salesforce/apex/CartHandler.displayCartItems'
import { subscribe, unsubscribe, MessageContext, publish } from 'lightning/messageService';
import CART_MESSAGE from '@salesforce/messageChannel/CartLengthUpdate__c';
import { NavigationMixin } from 'lightning/navigation';
import deleteAllItems from '@salesforce/apex/CartHandler.deleteAllItems'
import takeBook from '@salesforce/apex/BookListHandler.takeBook'

export default class NavCart extends NavigationMixin(LightningElement) {
    cartItems
    subscription = null;
    show = false;
    @track bookId;
    @track book
    @wire(MessageContext) messageContext;

    fetchBook(message){
      takeBook({bookId: message.bookId})
      .then(result => this.book = result)
      .catch(err => console.log(err))
    }

    handleClose(){
      this.show = false;
      this.bookId= {}
    }

    handleContainerClick(event){
      event.stopPropagation()
  }

    handleNavigate(){
      this.show = !this.show
      this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
            name: 'Cart__c',
            }
        });
    }

    connectedCallback() {
      window.addEventListener('click', this.handleClose = this.handleClose.bind(this))
        this.subscription = subscribe(
          this.messageContext,
          CART_MESSAGE,
          (message) => {
              this.handleMessage(message);
          });
    }
  
      disconnectedCallback() {
      unsubscribe(this.subscription);
      this.subscription = null;
    }
  
      handleMessage(message) {
      this.fetchBook(message)
      this.show = true;
    }
}