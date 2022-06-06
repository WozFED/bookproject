import { LightningElement, track } from 'lwc';
import registerUser from '@salesforce/apex/RegisterController.registerUser'

export default class TemplateRegister extends LightningElement {
    
    registerObject = [
        {label: 'FirstName',
        value: ''},
        {label: 'LastName',
        value: ''},
        {label: 'registerPassword',
        value: ''},
        {label: 'confirmRegisterPassword',
        value: '' },
        {label: 'Email',
        value: ''}
        ]
        registerToSend =[]
        
        
        get registerInputs(){
            return this.registerObject.map(el => ({...el, change: (event) => {
                el.value = event.target.value
            }}))
        }


        handleRegister(){
        this.registerObject.map((el, index) => this.registerToSend[index] = [el.label, el.value])
        registerUser({userData: JSON.stringify(Object.fromEntries(this.registerToSend))})
        .then((result) => {
            window.open(result, '_self')
        })
        .catch((error) => console.log(error))   
        }
}