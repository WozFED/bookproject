import { LightningElement, api, wire } from 'lwc';
import createRate from '@salesforce/apex/RatingHandler.createRate'
import ratesForBook from '@salesforce/apex/RatingHandler.ratesForBook'
import { refreshApex } from '@salesforce/apex';
import isGuest from "@salesforce/user/isGuest";

export default class Rating extends LightningElement {
    @api bookId;

    @wire(ratesForBook, {bookId: '$bookId'}) rates
    grades = [1, 2, 3, 4, 5]
    text = ''
    title = ''
    rate = 5
    islogged = !isGuest
    get rateLogged(){
        return islogged ? 'rate' : 'rate__not-logged'
    }

    updateText(event){
        this.text = event.target.value
    }

    updateTitle(event){
        this.title = event.target.value
    }

    changeRate(event){
        
        this.rate = event.target.value
    }

    addRate(){
        createRate({bookId: this.bookId, title: this.title, grade: this.rate, description: this.text})
        .then(()=> {
            refreshApex(this.rates)
            .then(()=>  this.dispatchEvent(new CustomEvent('refresh')))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }

}