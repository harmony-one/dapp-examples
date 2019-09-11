// zien add class validate
class Validate {
  validateEmail(email) {
    var re = /^(?=.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9])(?=.(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/i;
    return re.test(String(email).toLowerCase());
  }

  validateNumber(s) {
    const reg = /^\d+$/;
    return reg.test(String(s.trim()))
  }
}

export const VALIDATE = new Validate();
