public with sharing class ContactHandler {

    public class ContactWrapper
    {
        @AuraEnabled
        public String Firstname{get;set;}
        @AuraEnabled
        public String Lastname{get;set;}
        @AuraEnabled
        public String Email{get;set;}
        @AuraEnabled
        public String Phone{get;set;}
        @AuraEnabled
        public String City{get;set;}
        @AuraEnabled
        public String Street{get;set;}
        @AuraEnabled
        public String Code{get;set;}
    }

    @AuraEnabled(cacheable=true)
    public static Contact contactInfo(){
        id userId = UserInfo.getUserId();
        
        User u = [SELECT Id, ContactId FROM User WHERE Id= :userId];
        String getContactId = u.ContactId;
        return [SELECT FirstName, Id, LastName, Email, Phone, City__c, Street__c, Code__c FROM Contact WHERE Id= :getContactId];
    }

    @AuraEnabled
    public static Contact updateContact(String contactObject){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User WHERE Id= :userId];
        id getContactId = u.ContactId;
        ContactWrapper contact =(ContactWrapper)JSON.deserialize(contactObject,ContactWrapper.class);
        Contact user =  [SELECT FirstName, LastName, Email, Phone, City__c, Street__c, Code__c FROM Contact WHERE Id= :getContactId];
        user.FirstName=contact.Firstname;
        user.LastName=contact.Lastname;
        user.Email=contact.Email;
        user.Phone=contact.Phone;
        user.City__c=contact.City;
        user.Street__c=contact.Street;
        user.Code__c=contact.Code;

        try{
            update user;
          }
          catch (Exception e) {
              System.debug('unable to update the record due to'+e.getMessage());
          }  
          return user;
    }
        
}
