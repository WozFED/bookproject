import { LightningElement, api, track, wire } from 'lwc';
import updateCartItems from '@salesforce/apex/CartHandler.updateCartItems'
import deleteItem from '@salesforce/apex/CartHandler.deleteItem'
import { publish, MessageContext } from 'lightning/messageService';
import CART_NEW_MESSAGE from '@salesforce/messageChannel/CartOpen__c';

export default class CartItem extends LightningElement {
    @wire(MessageContext) messageContext;
    @track itemCart
    tooMany = false;

    @api set item(value){
        this.itemCart = value;
    };

    get item() {
        return this.itemCart
    }

    get value(){
        return !(this.itemCart.Quantity__c <= 1)
    }

    get totalValue(){
        return this.itemCart.Price__c * this.itemCart.Quantity__c
    }


    tooManyFunction(){
        this.tooMany = true;
        setTimeout(()=>{
            this.tooMany = false;
        }, 1500) 
    }

    handleClick(event){
        if(this.itemCart.Quantity__c >= event.currentTarget.dataset.avaiable){
            this.tooManyFunction()
        }
        else {
            updateCartItems({bookId: this.itemCart.Book__c, quantity: this.itemCart.Quantity__c + parseInt(event.target.value)})
            .then(result => {this.dispatchEvent(new CustomEvent('refresh'));})
            .catch(err => console.log(err)) 
        }
    }

    handleChange(event){
        console.log(event.target.value)
        if(event.target.value > parseInt(event.currentTarget.dataset.avaiable)){
               event.target.value = this.itemCart.Quantity__c    
               this.tooManyFunction()
        }
        if(event.target.value < 0){
            event.target.value = 1
            this.itemCart = {...this.itemCart, Quantity__c: parseInt(event.target.value)} 
        }
        else if(event.target.value) {
            this.itemCart = {...this.itemCart, Quantity__c: parseInt(event.target.value)} 
        }
       
    }
    
    handleChangeLostFocus(event){
        if(event.target.value == 0){
            event.target.value = 1
            this.itemCart = {...this.itemCart, Quantity__c: parseInt(event.target.value)}
        }
   
        event.target.value = this.itemCart.Quantity__c
        updateCartItems({bookId: this.itemCart.Book__c, quantity: this.itemCart.Quantity__c})
        .then(result =>{this.dispatchEvent(new CustomEvent('refresh'));})
        .catch(err => console.log(err))

        
         
        
            
    }

    handleDeleteClick(){
        deleteItem(({bookId: this.itemCart.Book__c}))
        .then(()=> {this.dispatchEvent(new CustomEvent('refresh'));})
        .catch(err => console.log(err))
    }


    

}