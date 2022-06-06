import { LightningElement, wire, track } from 'lwc';
import displayCartItems from '@salesforce/apex/CartHandler.displayCartItems'
import displayCart from '@salesforce/apex/CartHandler.displayCart'
import finishOrder from '@salesforce/apex/OrderHandler.finishOrder'
import { refreshApex } from '@salesforce/apex';

export default class TemplateCart extends LightningElement {

    @track cartItems

    get show(){
            return this.cartItems?.length > 0
    }

    fetchData(){
        displayCartItems()
        .then(result => this.cartItems = result)
        .catch(err => this.cartItems = [])
    }



    handleRefresh(event){
        this.fetchData()
    }

    
    connectedCallback(){
        this.fetchData()
    }
}