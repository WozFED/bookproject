import { LightningElement, api, wire, track } from 'lwc';
import takeBook from '@salesforce/apex/BookListHandler.takeBook'
import createCartItem from '@salesforce/apex/CartHandler.createCartItem'
import deleteItem from '@salesforce/apex/CartHandler.deleteItem'
import displayCartItems from '@salesforce/apex/CartHandler.displayCartItems'
import { publish, MessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import CART_MESSAGE from '@salesforce/messageChannel/CartLengthUpdate__c';
import { refreshApex } from '@salesforce/apex';
import isGuest from "@salesforce/user/isGuest";
// import CART_ID_MESSAGE from '@salesforce/messageChannel/CartLengthUpdate__c';

export default class TemplateBookDetail extends LightningElement {

    islogged = !isGuest
    subscription = null
    @api bookId
    @api source
    @wire(MessageContext) messageContext;
    @wire(takeBook, { bookId: '$bookId' }) book
    @track cartItems
    quantity = 1;
    error = false;
    general = true;
    description = false;
    rating = false;

    @track pieces

    get thisItem(){
        this.pieces = this.cartItems?.filter(el => el.Name == this.book.data.Name).length > 0 ?
        this.cartItems?.filter(el => el.Name == this.book.data.Name)[0].Quantity__c :
        '0';
        return this.pieces
    }

    get grade(){
        return Number(this.book.data.Rating__c).toFixed(2)
    }

    get inCart(){
        return this.pieces > 0 || false;
    }

    showGeneral(){
        this.general = true;
        this.description = false;
        this.rating = false;
    }
    showDescription(){
        this.general = false;
        this.description = true;
        this.rating = false;
    }
    showRating(){
        this.general = false;
        this.description = false;
        this.rating = true;
    }

    fetchData(){
        displayCartItems()
        .then(result => this.cartItems = result)
        .catch(err => console.log(err))
    }

handleClick(){
    if(this.book.data.Availability__c == 0){
        this.error = true;  
    }
    else {
        createCartItem({ bookId: this.book.data.Id, quantity: this.quantity })
        .then((result)=> {
            if(Object.keys(result).length > 0){
                this.fetchData()
                this.error = false;
                const message = {
                    bookId: this.book.data.Id
                }
                publish(this.messageContext, CART_MESSAGE, message)
            }
            else {
                this.error=true;
                setTimeout(()=>{
                    this.error=false;
                }, 4000)
            }
        })
        .catch((err)=> { console.log(err)})
    }
}

handleChange(event){
    this.quantity = event.target.value
}

refreshBook(){
    refreshApex(this.book)
}

handleDelete(){
    deleteItem({bookId: this.book.data.Id})
    .then(()=> this.fetchData())
    .catch(err => console.log(err))
}

connectedCallback(){
    this.fetchData()
    refreshApex(this.book)
}



}