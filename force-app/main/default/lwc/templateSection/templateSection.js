import { LightningElement, wire, track, api } from 'lwc';
import bestSeller from '@salesforce/apex/BookListHandler.bestSeller'

export default class TemplateSection extends LightningElement {
    @wire(bestSeller) bestseller

    get bestSellerBook(){
        return this.bestseller.data
    }
}