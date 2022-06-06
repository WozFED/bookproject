public with sharing class RatingHandler {
    public RatingHandler() {

    }
    @AuraEnabled
    public static Rating__c createRate(String bookId, String title, Integer grade, String description){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        id getContactId = u.ContactId; 
        Decimal sum = 0;
        Rating__c rating = new Rating__c();
        Book__c book = [SELECT Rating__c FROM Book__c WHERE Id= :bookId];

        rating.Book__c = bookId;
        rating.Rate__c = grade;
        rating.Opinion__c = description;
        rating.Name = title;
        try {
            insert rating;
        }
        catch (Exception e) {
            System.debug('unable to update the record due to'+e.getMessage());
        }  

        List<Rating__c> rates = [SELECT Rate__c FROM Rating__c WHERE Book__r.Id= :bookId];
        for(Integer i = 0; i < rates.size(); i++){
            sum += rates.get(i).Rate__c;
        }
        if(rates.size() == 0){
            book.Rating__c = grade;
        }
        else {
            book.Rating__c = sum/rates.size();
        }

        try {
            update book;
        }
        catch (Exception e) {
            System.debug('unable to update the record due to'+e.getMessage());
        } 
        
        return rating;  
    }

    @AuraEnabled(cacheable=true)
    public static List<Rating__c> ratesForBook(String bookId){
        List<Rating__c> rates = [SELECT Name, Rate__c, Opinion__c FROM Rating__c WHERE Book__r.Id= :bookId];
        return rates;
    }
}
