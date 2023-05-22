export default class Helper {

    static isValidEmail(email) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //   console.log("isvalid",reg.test(username))
      return reg.test(email);
    }

    static isValidPassword(password) {
      if( password.length >= 6 && password.length <= 15){
        return password;
      }
      return false;
    }
}