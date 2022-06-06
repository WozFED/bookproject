public with sharing class OrderHandler {
    public OrderHandler() {

    }

    @AuraEnabled
    public static Order__c createOrder(){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        id getContactId = u.ContactId;
        Order__c order = new Order__c();
        Integer randomNumber = Integer.valueof((Math.random() * 10));
        order.Name = [SELECT Name FROM Contact WHERE Id =: getContactId].Name;
        Contact profile = [SELECT Id From Contact WHERE Id =: getContactId];
        order.Contact__c = profile.Id;
        order.Status__c = 'NEW';
        try{
            insert order;
          }
          catch (Exception e) {
              System.debug('unable to update the record due to'+e.getMessage());
          }  
        
        return order;
    }

    @AuraEnabled(cacheable=true)
    public static List<Order__c> displayAllOrders(){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        id getContactId = u.ContactId;
        List<Order__c> orders = [SELECT Id, Name, Status__c, UserName__c, UserLastname__c, CreatedDate, Total_Amount__c, City__c, Time__c, Street__c, Code__c,
         (SELECT Id,Name, Quantity__c FROM Cart_Items__r) FROM Order__c WHERE Contact__r.Id =: getContactId ORDER BY CreatedDate];
        for(Order__c a : orders){
        List<Cart_Item__c> cartItems = a.Cart_Items__r;
        }
        return orders; 
       
    }

    @AuraEnabled
    public static Order__c displayOrder(){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        id getContactId = u.ContactId;
        return [SELECT Name, Status__c FROM Order__c WHERE Contact__r.Id= :getContactId];
    }

    // @AuraEnabled
    // public static List<Order__c> fillOrder(){
    //     id userId = UserInfo.getUserId();
    //     User u = [SELECT Id, ContactId FROM User Where ID= :userId];
    //     id getContactId = u.ContactId;
    //     Cart__c cart = [SELECT Id FROM Cart__c WHERE Contact__r.Id= :getContactId];
    //     ID cartID = cart.Id;
    //     List<Cart_Item__c> itemsList = [SELECT Name, Quantity__c, Price__c FROM Cart_Item__c WHERE Cart__r.Id=:cartID]; 
    //     List<Order__c> orderList = [SELECT Name FROM Order__c WHERE Status__c =: 'NEW' AND Contact__r.Id =: getContactId];
    //     List<Order__c> lastOrders = [SELECT Name FROM Order__c WHERE Status__c !=: 'NEW' AND Contact__r.Id =: getContactId];
    //     if(orderList.size() == 0){
    //         Order__c order = createOrder();
    //         for(Integer i = 0; i < itemsList.size(); i++){
    //             itemsList.get(i).Order__c = order.Id;
    //         }
    //         try{
    //             update itemsList;
    //          }
    //           catch (Exception e) {
    //               System.debug('unable to update the record due to'+e.getMessage());
    //           }

    //     }
    //     else {
    //         Order__c incompleteOrder = [SELECT Name FROM Order__c WHERE Status__c =: 'NEW' AND Contact__r.Id =:getContactId];
    //         List<Cart_Item__c> itemsList2 = [SELECT Name, Quantity__c, Price__c FROM Cart_Item__c WHERE Order__r.Id=:incompleteOrder.Id]; 
    //         for(Integer i = 0; i < itemsList2.size(); i++){
    //             itemsList.get(i).Order__c = incompleteOrder.Id;
    //         }
    //         try{
    //             update itemsList2;
    //             update incompleteOrder;
    //          }
    //           catch (Exception e) {
    //               System.debug('unable to update the record due to'+e.getMessage());
    //           }
            
    //     }
         
       
    //     return orderList;
    // }

    @AuraEnabled
    public static Order__c finishOrder(Integer total){
        Order__c createOrder = createOrder();
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        Id getContactId = u.ContactId;
        Contact user = [SELECT FirstName, LastName, City__c, Code__c, Street__c, Phone FROM Contact WHERE Id =:getContactId];
        Cart__c actualCart = [SELECT Id FROM Cart__c WHERE Contact__r.Id= :getContactId];
        Order__c incompleteOrder = [SELECT Name, Status__c, UserName__c, UserLastname__c, Street__c, City__c FROM Order__c WHERE Status__c =: 'NEW' AND Contact__r.Id =: getContactId];
        List<Cart_Item__c> cartItems = [SELECT Id, Name, Book__c, Quantity__c, Price__c FROM Cart_Item__c WHERE Cart__r.Id =: actualCart.Id];
        List<Book__c> books = [SELECT Id, Availability__c,Sold__c, Name FROM Book__c];
        for(Integer i = 0; i< books.size(); i++){
            for(Integer j = 0; j < cartItems.size(); j++){
                 if(books.get(i).Id == cartItems.get(j).Book__c){
      	            books.get(i).Availability__c = books.get(i).Availability__c - cartItems.get(j).Quantity__c;
                    books.get(i).Sold__c = books.get(i).Sold__c + cartItems.get(j).Quantity__c;
                
               
                }
            }
               
        }
        try{
            update books;
         }
        catch (Exception e) {
              System.debug('unable to update the record due to'+e.getMessage());
          }

        incompleteOrder.UserName__c = user.FirstName;
        incompleteOrder.UserLastname__c = user.Lastname;
        incompleteOrder.Street__c = user.Street__c;
        incompleteOrder.City__c = user.City__c;
        incompleteOrder.Status__c = 'IN PROGRESS';
        incompleteOrder.Total_Amount__c = total;

        for(Integer i = 0; i < cartItems.size(); i++){
            cartItems.get(i).Order__c = incompleteOrder.Id;
        }
        try{
            update incompleteOrder;
         }
        catch (Exception e) {
              System.debug('unable to update the record due to'+e.getMessage());
          }
          try{
            update cartItems;
          }
 
         catch (Exception e) {
               System.debug('unable to update the record due to'+e.getMessage());
           }
        try{
           delete actualCart;
         }

        catch (Exception e) {
              System.debug('unable to update the record due to'+e.getMessage());
          }
        
          return incompleteOrder;
    }

}
