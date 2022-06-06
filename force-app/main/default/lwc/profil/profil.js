import { LightningElement, wire, track } from 'lwc';
import contactInfo from '@salesforce/apex/ContactHandler.contactInfo'
import updateContact from '@salesforce/apex/ContactHandler.updateContact'
import { refreshApex } from '@salesforce/apex';

export default class Profil extends LightningElement {

    @wire(contactInfo)
    wiredFunction({ data, error }) {
        if (data) {
            this.firstname = data.FirstName,
            this.lastname =  data.LastName,
            this.phone =  data.Phone ,
            this.city =  data.City__c ,
            this.street =  data.Street__c,
            this.mail =  data.Email,
            this.code =  data.Code__c
        }
        else if (error) {
            console.log(error)
        }
    }
    @track firstname
    @track lastname 
    @track phone 
    @track city 
    @track street 
    @track mail
    @track code 
    contactObject = []
    mailFormat = new RegExp('[/\S+@\S+\.\S+/]')
    zipFormat = new RegExp('/^[0-9]{2}-[0-9]{3}/')

    get inputs() {
        return  [
        {label: 'Firstname',
        value: this.firstname,
        length: 10,
        change: (event) => [...this.inputs].map(el => el.label == event.target.name ?  [...event.target.value].some(el => '0123456789'.includes(el)) ? 
        this.firstname = '' : this.firstname = event.target.value : null)
        },

        {label: 'Lastname',
        value: this.lastname,
            length: 15,
        change: (event) => 
            [...this.inputs].map(el=> el.label == event.target.name ? [...event.target.value].some(el => '0123456789'.includes(el) 
            ? this.lastname = '' : this.lastname = event.target.value) : null )
        },
        {label: 'Email',
        value: this.mail,
            length: 25,
        change: (event) => 
            [...this.inputs].map(el=> el.label == event.target.name ? !this.mailFormat.test(event.target.value) ? this.mail = ''
            : this.mail = event.target.value : null )
        },
        {label: 'Phone',
        value: this.phone ,
        length: 9,
        change: (event) => 
            [...this.inputs].map(el=> el.label == event.target.name ? [...event.target.value].some(el => !'0123456789'.includes(el) 
            ? this.phone = '' : this.phone = event.target.value) : null )
         },
        {label: 'City',
        value: this.city,
        length: 10,
        change: (event) => 
            [...this.inputs].map(el=> el.label == event.target.name ? [...event.target.value].some(el => '0123456789'.includes(el) 
            ? this.city = '' : this.city = event.target.value) : null )
        },
        {label: 'Street',
        value: this.street,
        length: 20,
        change: (event) => 
            [...this.inputs].map(el=> el.label == event.target.name ? [...event.target.value].some(el => '0123456789'.includes(el) 
            ? this.street = '' : this.street = event.target.value) : null )
        },
        {label: 'Code',
        value: this.code,
        length: 6,
        change: (event) => 
        [...this.inputs].map(el=> el.label == event.target.name ? !this.zipFormat.test(event.target.value) ? this.code = ''
        : this.code = event.target.value : null )
        },
        
        ]

    }
    createObjectToSend(event){
        [...this.arrayForm].map((el, index) => 
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
        // [...this.inputs].map((el, index) => this.contactObject[index] = [el.label, el.value !== undefined ? el.value : 'test'])
        // console.log(JSON.stringify(Object.fromEntries(this.contactObject)))
        updateContact({contactObject: JSON.stringify( {'Firstname': this.firstname,
        'Lastname': this.lastname,
        'Phone': this.phone,
        'City': this.city,
        'Street': this.street,
        'Code': this.code,
        'Email': this.mail})})
        .then((result) => {
            this.dispatchEvent(new CustomEvent('closeform'))
        }
        )
        .catch((error) => console.log(error))
    }

    closeForm(){
        this.dispatchEvent(new CustomEvent('closeform'))
    }

}