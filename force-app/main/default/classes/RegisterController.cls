public with sharing class RegisterController {
    public RegisterController() {

    }
    
    public class UserWrapper {
        @AuraEnabled
        public string FirstName {get; set;}
        @AuraEnabled
        public string LastName {get; set;}
        @AuraEnabled
        public string registerPassword {get; set;}
        @AuraEnabled
        public string confirmRegisterPassword {get; set;}
        @AuraEnabled
        public string Email {get; set;}
    }
    @AuraEnabled
    public static String registerUser(String userData){
        UserWrapper userObject =(UserWrapper)JSON.deserialize(userData,UserWrapper.class);
        try {
            User newUser = new User();
            newUser.Email = userObject.Email;
            newUser.FirstName = userObject.FirstName;
            newUser.LastName = userObject.LastName;
            newUser.UserName = userObject.Email;
            newUser.CommunityNickname = newUser.Username;

            String newUserPassword = userObject.registerPassword;

            Id newUserId = Site.createPortalUser(newUser, null, newUserPassword);

            return Site.login(userObject.Email, newUserPassword, null).getUrl();
   

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
            
        } 
       
    }

}
