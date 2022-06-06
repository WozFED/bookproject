import { LightningElement, wire, track } from 'lwc';
import basePath from '@salesforce/community/basePath';
import logo from '@salesforce/resourceUrl/logo'
import isGuest from "@salesforce/user/isGuest";
import { NavigationMixin } from 'lightning/navigation';
import searchBook from '@salesforce/apex/BookListHandler.searchBook'

export default class Navbar extends NavigationMixin(LightningElement) {

    text = ''
    list = false;

    @wire(searchBook, {text: '$text'}) books

    logo = logo;
    arrayNav = [
        {   label: 'Home', apiName: 'Home', url: '/home', isGuest: isGuest},
        {   label: 'Login', apiName: 'Login', url: '/login', isGuest: true},
        {   label: 'Register', apiName: 'Register', url: '/register', isGuest: true},
        {   label: 'Books', apiName: 'Books__c', url: '', isGuest: isGuest},
        {   label: 'Cart', apiName: 'Cart__c', url: '', isGuest: false },
        {   label: 'Profile', apiName: 'Profile__c', url: '', isGuest: false},
        {   label: 'Logout', apiName: '', url: `${basePath.replace(/\/s$/i, '')}/secur/logout.jsp?retUrl=${basePath}`, isGuest: false, drop: false }]

    get navigationLogged(){
            return this.arrayNav.filter(el => el.isGuest === isGuest)
    }

    handleNavigate(){
       this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
        name: 'Home',
        }
    }); 
    }


    
    handleSearch(event){
          this.text = event.target.value  
    }
 
    handleOpen(event){
        this.list = true;
        event.stopPropagation()
    }
    

    handleClose(){
        this.list = false;
        this.text = ''
    }

    connectedCallback(){
        window.addEventListener('click', this.handleClose = this.handleClose.bind(this))
    }
    disconnectedCallback(){
        window.removeEventListener('click', this.handleClose)
    }

    handleContainerClick(event){
        event.stopPropagation()
    }
    


}