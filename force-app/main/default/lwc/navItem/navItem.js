import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class NavigationMenu extends NavigationMixin(LightningElement) {

    @api item;
    @api index

    pageReference;

    drop = false;
    showId

    handleClick(evt){
        evt.stopPropagation();
        evt.preventDefault();

        if(this.item.label !== 'Logout'){
            this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
            name: this.item.apiName,
            }
        });
           
        }
        else {
            window.open(this.item.url, '_self');
        }
        
    }




    

}