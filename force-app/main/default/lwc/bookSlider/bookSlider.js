import { LightningElement, api } from 'lwc';

export default class BookSlider extends LightningElement {
    @api show
    @api array
    @api object
    state = true;
    margin = 'slider'
    itemIndex = 0

    get background(){
        return `background-image: url(${this.object.background})`
    }

    move(){
        if(this.itemIndex < this.array.length - 1) {
          this.itemIndex = this.itemIndex + 1   
        }  
    }
    back(){
        if(this.itemIndex > 0) {
            this.itemIndex = this.itemIndex - 1  
        }
    }

    get classMargin(){
        return this.margin = `slider${this.itemIndex}`
    }

}