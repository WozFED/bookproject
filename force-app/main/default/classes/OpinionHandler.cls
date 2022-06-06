public with sharing class OpinionHandler {
    public OpinionHandler() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Opinion__c> displayOpinions(){
        return [SELECT Name, Value__c, Contact__c, Contact__r.Name FROM Opinion__c LIMIT 5];
    }

    @AuraEnabled
    public static Opinion__c createOpinion(String title, String text){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        id getContactId = u.ContactId;
        Contact user = [SELECT Id, Name FROM Contact WHERE Id= :getContactId];
        Opinion__c opinion = new Opinion__c();
        opinion.Name= title;
        opinion.Contact__c = getContactId;
        opinion.Value__c = text;
        try {
            insert opinion;
        }
        catch (Exception e) {
            System.debug('unable to update the record due to'+e.getMessage());
        }
        return opinion;
    }
}
