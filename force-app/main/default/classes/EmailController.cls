public with sharing class EmailController {
    public EmailController() {

    }
 
    @AuraEnabled(cacheable=true)
        public static void sendEmailToController(String addressee,String name, String sender, String title, String description){
            try{
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                String[] toAddresses = new String[] {addressee};
                mail.setToAddresses(toAddresses);
                mail.setSubject(title);
                mail.setHtmlBody('<h2>'+ 'Hi, I am' + ' ' + name + '</h2>' + 
                                '<p>' + description + '</p>' + 
                                '<p>' + 'My mail is:' + ' ' + sender + '</p>');
                Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
            }catch(Exception ex){
                throw new AuraHandledException(ex.getMessage());
            }
        }

        @AuraEnabled(cacheable=true)
        public static void sendEmailAfterOrder(Order__c order){
            id userId = UserInfo.getUserId();
            User u = [SELECT Id, ContactId FROM User Where ID= :userId];
            String getContactId = u.ContactId;
            Contact userForMail = [SELECT Name, Email FROM Contact WHERE Id= :getContactId];
            List<Cart_Item__c> cartItems = [SELECT Name, Quantity__c FROM Cart_Item__c WHERE Order__r.Id =:order.Id];
            String listOfCartItems = '';
            for (Integer i = 0; i <= cartItems.size(); i++) {          
                listOfCartItems += cartItems.get(i).Name + ' ' + cartItems.get(i).Quantity__c + ', ';
            }
            try{
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                String[] toAddresses = new String[] {userForMail.Email};
                mail.setToAddresses(toAddresses);
                mail.setSubject('New Order');
                mail.setHtmlBody('<h2>'+ 'Hi, you order book' + '</h2>' +
                                '<p>' + 'OrderID:' + order.Id + '</p>' + 
                                '<p>' + 'Total value:' + order.Total_Amount__c + '$' + '</p>' +
                                '<p>' + 'Your items:' + listOfCartItems + '</p>');
                Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
            }catch(Exception ex){
                throw new AuraHandledException(ex.getMessage());
            }
        }

}
