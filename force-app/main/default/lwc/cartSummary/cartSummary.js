import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import contactInfo from '@salesforce/apex/ContactHandler.contactInfo'
import createOpinion from '@salesforce/apex/OpinionHandler.createOpinion'
import finishOrder from '@salesforce/apex/OrderHandler.finishOrder'
import displayOpinions from '@salesforce/apex/OpinionHandler.displayOpinions'
import { refreshApex } from '@salesforce/apex';

export default class CartSummary extends NavigationMixin(LightningElement) {
    @track itemsArray;
    @wire(contactInfo) contact
    @wire(displayOpinions) opinions  
    @track total
    @api set items(value){
        this.itemsArray = value.map(el => ({
            summary: el.Price__c * el.Quantity__c
        }));
    }
    
    openform = false;
    text = '';
    title = '';
    opinion = false;
    arrayForm
    get items(){
        return this.itemsArray
    }

    get totalValue(){
        this.total = this.itemsArray.reduce((a, b) => { 
        return a + b.summary
    }, 0)
        return this.total
    }

    get contactInformation(){
        this.arrayForm = [
        {label: 'Firstname',
        value: this.contact?.data?.FirstName},
        {label: 'Lastname',
        value: this.contact?.data?.LastName},
        {label: 'Email',
        value: this.contact?.data?.Email},
        {label: 'Phone',
        value: this.contact?.data?.Phone  },
        {label: 'City',
        value: this.contact?.data?.City__c},
        {label: 'Street',
        value: this.contact?.data?.Street__c},
        {label: 'Code',
        value: this.contact?.data?.Code__c},
        
        ]
        return this.arrayForm
    }
    
    handleClick(){
        if(this.arrayForm.some(el => el.value == undefined)){
            this.openform = true;
        }
        else {
            finishOrder({total: this.total})
            .then(()=> this.dispatchEvent(new CustomEvent('order')))
            .catch(err => err)
        }
        
        // this.opinion = true;
        // if(this.arrayForm.some(el => el.value == undefined)){
        //     this.openform = true;
        // }
        // else {
        //    this.opinion = true;
        // }
      
           
    }

    closeForm(){
        this.openform = false;
        refreshApex(this.contact)
    }

    handleTitleChange(event){
        this.title = event.target.value
    }

    handleChange(event){
        this.text = event.target.value
    }
    checkContact() {
      console.log(this.contact.data)
    }
    leave(){
        finishOrder({total: this.total})
        .then(()=> {this.dispatchEvent(new CustomEvent('order'))
    })
        .catch(err => err)
        this.opinion = false;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
             attributes: {
             name: 'Home',
             }
         })
    }

    // handleOpinion(){
    //     finishOrder({total: this.total})
    //     .then(()=> this.dispatchEvent(new CustomEvent('order')))
    //     .catch(err => err)
    //     createOpinion({title: this.title, text: this.text})
    //     .then(()=>{
    //         refreshApex(this.opinions)
    //         .then(()=>{
    //             this[NavigationMixin.Navigate]({
    //             type: 'comm__namedPage',
    //              attributes: {
    //              name: 'Home',
    //              }
    //          })
    //         })
    //         .catch(err => console.log(err))
    //         })
            
    //         .catch(err => {
    //             this.errorText = true;
    //             setTimeout(()=>{
    //                 this.errorText = false;
    //             }, 3000)
    //         })
    // }

  
}