import { LightningElement, wire, track } from 'lwc';
import contactInfo from '@salesforce/apex/ContactHandler.contactInfo'
import updateContact from '@salesforce/apex/ContactHandler.updateContact'
import { refreshApex } from '@salesforce/apex';
import displayAllOrders from '@salesforce/apex/OrderHandler.displayAllOrders'

export default class TemplateProfile extends LightningElement {

    @wire(contactInfo) contact
    @wire(displayAllOrders) 
    wiredOrders({data, error}){
        if(data){
            this.orderArray = data.map((el, id) => ({
                name: el.Id,
                username: el.UserName__c,
                userlastname: el.UserLastname__c,
                street: el.Street__c,
                city: el.City__c,
                total: el.Total_Amount__c,
                status: el.Status__c,
                details: el.Cart_Items__r.map(item => ({ ...item})),
                id: id,
                date: el.Time__c,
                show: false,
            }))
        }
        else if(error){
            console.log(error)
        }
    }
    contactObject = []
    arrayForm
    flag = false;
    @track orderArray

    // get orderData(){
    //     this.orderArray = this.orders?.data?.map((el, id) => ({
    //         name: el.Id,
    //         username: el.UserName__c,
    //         userlastname: el.UserLastname__c,
    //         street: el.Street__c,
    //         city: el.City__c,
    //         total: el.Total_Amount__c,
    //         status: el.Status__c,
    //         details: el.Cart_Items__r.map(item => ({ ...item})),
    //         id: id,
    //         show: 'halo',
    //     }))
    //     return this.orderArray
    // }

   handleDetails(event) {
    let selectedId = event.currentTarget.dataset.id;
    let objIndx = this.orderArray.findIndex((item => item.id == selectedId));
    this.orderArray[objIndx].show = !this.orderArray[objIndx].show;
    console.log(JSON.stringify(this.orderArray))
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

    createObjectToSend(event){
        this.arrayForm.map((el, index) => 
        this.contactObject[index] = el.label === event.detail.label ? [event.detail.label, event.detail.value] 
        : [el.label, el.value]
        )
    }
    handleInput(event){
        for(let i = 0; i < this.arrayForm.length; i++){
            if(this.arrayForm[i].label === event.target.name){
            this.arrayForm[i].value = event.target.value   
            }  
        }
    }
    updateData(){
        this.arrayForm.map((el, index) => this.contactObject[index] = [el.label, el.value !== undefined ? el.value : undefined])
        console.log(JSON.stringify(Object.fromEntries(this.contactObject)))
        updateContact({contactObject: JSON.stringify(Object.fromEntries(this.contactObject))})
        .then((result) => refreshApex(this.contact))
        .catch((error) => console.log(error))
    }

}

