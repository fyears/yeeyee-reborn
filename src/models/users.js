export default class User {
  constructor(user_id = '') {
    this.user_id = user_id;
    this.email = 'hello@example.com';
    this.default_campus = 'univ';
    this.alt_emails = [];
  }

  static from_email(email = '') {
    return new Promise((resolve, reject) => {
      if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
        reject(new UserException('email not found'));
      }
      try {
        let user_id = 'u1';
        let user = new User(user_id);
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  static from_id(user_id = '') {
    return new Promise((resolve, reject) => {
      try {
        let user = new User(user_id);
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  static from_auth_hash(hash_val = '') {
    return new Promise((resolve, reject) => {
      if (hash_val.length <= 0) {
        reject(new UserException('hash value not correct'));
      }
      try {
        let user_id = 'u1';
        let user = new User(user_id);
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  toString() {
    return JSON.stringify(this.get_info(), null, '  ');
  }

  get_info() {
    return {
      'user_id': this.user_id,
      'email': this.email,
      'default_campus': this.default_campus,
      'date_created': `${Date.now()}`
    }
  }

}

export class UserException {
  constructor(message) {
    this.message = message;
  }

  toString() {
    return String(this.message);
  }
}
