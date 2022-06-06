public with sharing class LoginController {
    public LoginController() {

    }

    @AuraEnabled
    public static string doLogin(String username, String password){
        try {
            
            String startUrl = System.Label.Community_Url;
            ApexPages.PageReference pageRef = Site.login(username, password, startUrl);

            if(pageRef != null) return pageRef.getUrl();

            return null;


        } catch (Exception e) {
            system.debug('e.getMessagelogin+   '+e.getMessage());
            throw new AuraHandledException(e.getMessage());

            return null;
        }
    }
}
