global with sharing class BookListHandler {

    @AuraEnabled(cacheable=true)
   public static List<Book__c> displayBook(){
       return [SELECT Name, Author__c, Description__c, 
       Image__c, Price__c, Type__c ,ISBN__c FROM Book__c];
   }

   @AuraEnabled(cacheable=true)
   public static Book__c bestSeller(){
       return [SELECT Name, Author__c, Description__c, 
       Image__c, Price__c, Type__c ,ISBN__c, Sold__c FROM Book__c ORDER By Sold__c DESC].get(0);
   }

   @AuraEnabled(cacheable=true)
   public static List<Book__c> bestRated(){
       return [SELECT Name, Author__c,
       Image__c, Price__c, Rating__c FROM Book__c ORDER By Rating__c DESC LIMIT 5];
   }

   
   @AuraEnabled(cacheable=true)
   public static List<Book__c> searchBook(String text, Integer next, Integer lim){

       text = '%' + text + '%';

       return [SELECT Name, Author__c, Description__c, 
       Image__c, Price__c, Type__c ,ISBN__c 
       FROM Book__c 
       WHERE Name LIKE: text OR Author__c LIKE: text OR Type__c LIKE: text OR ISBN__c LIKE: text LIMIT 5 OFFSET: next];
       
   }
   @AuraEnabled(cacheable=true)
   public static Book__c takeBook(String bookId){
       return [SELECT Name, Author__c, Description__c, 
       Image__c, Price__c, Rating__c, Type__c ,ISBN__c, Availability__c
       FROM Book__c WHERE Id= :bookId];
   }

   @AuraEnabled(cacheable=true)
   public static List<Book__c> horrorBooks(){
       return  [SELECT Name, Author__c, Description__c, 
       Image__c, Price__c, Type__c ,ISBN__c FROM Book__c WHERE Type__c =: 'Horror'];
   }

   @AuraEnabled(cacheable=true)
   public static List<Book__c> scienceBooks(){
       return  [SELECT Name, Author__c, Description__c, 
       Image__c, Price__c, Type__c ,ISBN__c FROM Book__c WHERE Type__c =: 'Science'];
   }

   @AuraEnabled(cacheable=true)
   public static List<Book__c> fantasyBooks(){
       return  [SELECT Name, Author__c, Description__c, 
       Image__c, Price__c, Type__c ,ISBN__c FROM Book__c WHERE Type__c =: 'Fantasy'];
   }

   @AuraEnabled(cacheable=true)
   public static List<Book__c> filteredBooks(String type, Boolean sold, Boolean price, Integer next){
       String query = 'SELECT Name, Author__c, Description__c, Image__c, Price__c, Type__c ,ISBN__c, Sold__c FROM Book__c';
       if(type != ''){
        query += ' WHERE Type__c = \'' + type + '\'';
        }
       if(sold){
        query += ' ORDER BY Sold__c DESC';
        }
        else if(price){
        query += ' ORDER BY Price__c DESC'; 
        }
        else {
        query += ' ORDER BY Price__c';
        } 
        query += ' LIMIT 8 OFFSET ' + next;
       return Database.query(query);
}

   @AuraEnabled(cacheable=true)
   public static Decimal numberOfPages(String type){
    List<Book__c> books = new List<Book__c>();
       if(type == ''){
        books = [SELECT Name FROM Book__c];
       }
       else {
        books = [SELECT Name FROM Book__c WHERE Type__c =: type]; 
       }
       Decimal value = (books.size()) / 8;
       return value.round(System.RoundingMode.UP) + 1;
   }
}