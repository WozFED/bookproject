global with sharing class CartHandler {

    @AuraEnabled(cacheable=true)
    public static Cart__c displayCart(){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        String getContactId = u.ContactId;
        return [SELECT Name FROM Cart__c WHERE Contact__r.Id= :getContactId];
    }

    @AuraEnabled(cacheable=false)
    public static List<Cart_Item__c> displayCartItems(){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        String getContactId = u.ContactId;

        Cart__c cart = [SELECT Id FROM Cart__c WHERE Contact__r.Id= :getContactId];
        id cartId = cart.Id;
        List<Cart_Item__c> cartArray = [SELECT Name, Image__c, Quantity__c, Price__c, Book__c, Availability__c 
        FROM Cart_Item__c WHERE Cart__r.Id = :cartId];
        if(cartArray.size() == 0){
            
        }
        return cartArray;

    }
    @AuraEnabled(cacheable=true)
    public static Cart_Item__c takeItem(String bookId){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        id getContactId = u.ContactId;

        Id cartId = [SELECT Id FROM Cart__c WHERE Contact__r.Id= :getContactId].Id;
        return [SELECT Name, Quantity__c FROM Cart_Item__c WHERE Book__c= :bookId AND Cart__c= :cartId];
    }


    @AuraEnabled
    public static Boolean checkIsInCart(String bookId){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        id getContactId = u.ContactId;
        Cart__c cart = [SELECT Id FROM Cart__c WHERE Contact__r.Id= :getContactId];
        id cartId = cart.Id;
        List<Cart_Item__c> cartList = new List<Cart_Item__c>();
        cartList = [SELECT Name FROM Cart_Item__c WHERE Book__r.Id = :bookId AND Cart__r.Id= :cartId];
        if(cartList.size() > 0){
            return true;
        }
        else {
            return false;
        }
    }

    @AuraEnabled(cacheable=true)
    public static Cart__c createCart(){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        String getContactId = u.ContactId;
        Contact profil = [SELECT Id, FirstName FROM Contact WHERE Id= :getContactId];
        List<Cart__c> existing = [SELECT Name FROM Cart__c WHERE Contact__r.Id= :getContactId LIMIT 1];
        Cart__c cart = new Cart__c();
        
        if(existing.size() == 0){
        cart.Name = profil.FirstName;
        cart.Contact__c = profil.Id;
           try{
          insert cart;
        }
        catch (Exception e) {
            System.debug('unable to update the record due to'+e.getMessage());
        }  
        
         
        }

         return cart;
    }


    @AuraEnabled
    public static Cart_Item__c createCartItem(String bookId, Integer quantity){
        Book__c book = [SELECT Id, Name, Image__c, Price__c, Availability__c FROM Book__c WHERE Id=:bookId];
        Cart__c cart = createCart();
        Cart__c cart2 = displayCart();
        List<Cart_Item__c> exisintCartItem = [SELECT Id, Name, Image__c, Price__c, Quantity__c, Availability__c FROM Cart_Item__c WHERE Book__r.Id=:bookId AND Cart__r.Id =: cart2.Id LIMIT 1];
        Cart_Item__c cartItem = new Cart_Item__c();
        if(quantity > book.Availability__c){
            System.debug('niemozliwe');
            return cartItem;
        }
        
        else if(exisintCartItem.size() > 0){
            if(exisintCartItem.get(0).Quantity__c + quantity > book.Availability__c){
                return cartItem;
            }
            else {
                exisintCartItem.get(0).Quantity__c = exisintCartItem.get(0).Quantity__c + quantity;
                try {
                    update exisintCartItem.get(0);
                    
                } catch (Exception e) {
                    throw new AuraHandledException(e.getMessage());
                } 
                return exisintCartItem.get(0);
            }
        }

        else {
        cartItem.Name = book.Name;
        cartItem.Book__c = book.Id;
        cartItem.Cart__c = cart2.Id;
        cartItem.Price__c = book.Price__c;
        cartItem.Image__c = book.Image__c;
        cartItem.Availability__c = book.Availability__c;
        cartItem.Quantity__c = quantity;
        try {
            insert cartItem;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        } 
        }
        
        return cartItem;
    }


    
    @AuraEnabled
    public static Cart_Item__c deleteItem(String bookId){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        id getContactId = u.ContactId;   
        Cart__c existing = [SELECT Name FROM Cart__c WHERE Contact__r.Id= :getContactId];
        Cart_Item__c cartItem = [SELECT Name FROM Cart_Item__c WHERE Book__r.Id =: bookId AND Cart__r.Id =: existing.Id];
     
        delete cartItem;
        return cartItem;
    }

    @AuraEnabled
    public static List<Cart_Item__c> deleteAllItems(String bookId){
        List<Cart_Item__c> cartItems = [SELECT Name FROM Cart_Item__c];
        delete cartItems;
        return cartItems;
    }

    @AuraEnabled
    public static Cart_Item__c updateCartItems(String bookId, Integer quantity){
        id userId = UserInfo.getUserId();
        User u = [SELECT Id, ContactId FROM User Where ID= :userId];
        id getContactId = u.ContactId;
        Cart__c cartId = [SELECT Id FROM Cart__c WHERE Contact__r.Id= :getContactId];
        Cart_Item__c forCheckIsInsert = [SELECT Quantity__c, Availability__c, Book__c FROM Cart_Item__c WHERE Book__r.Id =:bookId AND Cart__r.Id = :cartId.Id];
        if(quantity > forCheckIsInsert.Availability__c){
            forCheckIsInsert.Quantity__c = forCheckIsInsert.Quantity__c;
        }
        else {
            forCheckIsInsert.Quantity__c = quantity;
        }
        
           
            try{
                update forCheckIsInsert;
              }
              catch (Exception e) {
                  System.debug('unable to update the record due to'+e.getMessage());
              }  
         return forCheckIsInsert;  
        }
    

    
}