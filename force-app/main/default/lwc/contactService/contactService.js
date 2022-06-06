import { LightningElement, wire, track } from 'lwc';
import contactInfo from '@salesforce/apex/ContactHandler.contactInfo'
import isGuest from '@salesforce/user/isGuest';
import sendEmailToController from '@salesforce/apex/EmailController.sendEmailToController'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactService extends LightningElement {

    @wire(contactInfo)
    wiredFunction({ data, error }) {
        if (data) {
            this.name = !isGuest ? data.FirstName : '',
                this.mail = !isGuest ? data.Email : ''
        }
        else if (error) {
            console.log(error)
        }
    }

    error = false;
    errorMessage = false;
    logged = !isGuest
    mailFormat = new RegExp('[/\S+@\S+\.\S+/]')
    name = ''
    mail = ''
    title = ''
    description = ''
    @track inputs = [
        {
            label: 'Name',
            type: 'text',
            value: this.name,
            error: false,
            errorMessage: 'No digits',
            change: (event) => [...this.inputs].map(el => el.label === event.target.name ?
                [...event.target.value].some(el => '0123456789'.includes(el)) ? (el.error = true, el.value = event.target.value) :
                    (el.error = false, el.value = event.target.value) : null)

        },
        {
            label: 'Your e-mail',
            type: 'text',
            value: this.mail,
            error: false,
            errorMessage: 'No valid email',
            change: (event) => [...this.inputs].map(el => el.label === event.target.name ?
                !this.mailFormat.test(event.target.value) ? (el.error = true, el.value = event.target.value)
                    : (el.error = false, el.value = event.target.value)
                : null)

        },
        {
            label: 'Title',
            type: 'text',
            value: this.title,
            error: false,
            change: (event) => [...this.inputs].map(el => el.label === event.target.name ? el.value = event.target.value : null)
        }
    ]


    bodyMessage(event) {
        this.description = event.target.value
    }

    sendMail() {
        // if (this.name.length === 0 || this.mail.length === 0 || this.title.length === 0 || this.description.length === 0) {
        //     this.error = true
        // }
     if (this.inputs.some(el => el.error == true)) {
            return
        }
      
        else {
            this.error = false;
            sendEmailToController({ addressee: 'woztrn@gmail.com', name: this.name, sender: this.mail, title: this.title, description: this.description })
                .then(res => {
                    console.log(res)
                })
                .catch(err => console.log(err))
        }


    }




}