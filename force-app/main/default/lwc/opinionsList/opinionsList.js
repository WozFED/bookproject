import { LightningElement} from 'lwc';
import displayOpinions from '@salesforce/apex/OpinionHandler.displayOpinions'

export default class OpinionsList extends LightningElement {
    opinionsList
    marginIndex = 0;
    marginStyle = `margin-top: 10px`
    direction = true;
    blocksOnSite = 2

    moveOpinions(length){
        setInterval(()=>{
            if(this.direction){
                this.marginIndex = this.marginIndex + 1;
                if(this.marginIndex == length - this.blocksOnSite){
                    this.direction = false;
                }
            }
            else {
                this.marginIndex = this.marginIndex - 1;
                if(this.marginIndex == 0){
                    this.direction = true;
                }
            }
            this.marginStyle = `margin-top: ${this.marginIndex * (-210) + 'px'}`
        }, 5000)
        
    }

    connectedCallback(){

        displayOpinions()
        .then((value) => {
            this.opinionsList = value;
            this.moveOpinions(this.opinionsList.length)
        })
        .catch(err => console.log(err))
    }

}