global with sharing class CancelOrder {
   @InvocableMethod
   public static List<Order__c> bookToStore(List<String> ordersId){
    
    List<Book__c> books = [SELECT Availability__c, Sold__c FROM Book__c];
    List<Cart_Item__c> cartItems = [SELECT Name, Quantity__c, Book__c FROM Cart_Item__c WHERE Order__r.Id IN :ordersId];
    for(Integer i = 0; i < books.size(); i++){
        for(Integer j = 0; j < cartItems.size(); j++){
            if(books.get(i).Id == cartItems.get(j).Book__c){
                books.get(i).Availability__c = books.get(i).Availability__c + cartItems.get(j).Quantity__c;
                books.get(i).Sold__c = books.get(i).Sold__c - cartItems.get(j).Quantity__c;
            }
        }
    }
    try {
        update books;
    }
    catch (Exception e) {
        System.debug('unable to update the record due to'+e.getMessage());
    }
    return [SELECT Name FROM Order__c LIMIT 1];
   }
}
