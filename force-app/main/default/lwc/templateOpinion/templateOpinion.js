import { LightningElement, wire } from 'lwc';
import displayOpinions from '@salesforce/apex/OpinionHandler.displayOpinions'

export default class TemplateOpinion extends LightningElement {
    @wire(displayOpinions) opinionsList

    
}