let UsersDB = {
  id: {
    u1: {
      email: 'u1@example.com',
      defaultCampus: 'ucb',
      password: '123',
      altEmails: [],
      dateCreated: `${Date.now()}`
    },
    u2: {
      email: 'u2@example.org',
      defaultCampus: 'harvard',
      password: '456',
      altEmails: [],
      dateCreated: `${Date.now()}`
    }
  },
  email: {
    'u1@example.com': 'u1',
    'u2@example.org': 'u2'
  }
};
let usersIDCnt = 3;


export default class User {
  constructor(userID = '') {
    let user = UsersDB.id[userID];
    this.userID = userID;
    this.email = user.email;
    this.defaultCampus = user.defaultCampus;
    this.altEmails = user.altEmails;
    this.dateCreated = user.dateCreated;
  }

  static fromEmail(email = '') {
    return new Promise((resolve, reject) => {
      if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
        return reject(new UserException('email invalid'));
      }
      try {
        let userID = UsersDB.email[email];
        let user = new User(userID);
        return resolve(user);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static fromID(userID = '') {
    return new Promise((resolve, reject) => {
      try {
        let user = new User(userID);
        return resolve(user);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static fromAuthHash(hashVal = '') {
    return new Promise((resolve, reject) => {
      if (hashVal.length <= 0) {
        return reject(new UserException('hash value not correct'));
      }
      try {
        let userID = 'u1';
        let user = new User(userID);
        return resolve(user);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static createUser({
      email = '',
      password = '',
      campusID = ''
    } = {}) {
    return new Promise((resolve, reject) => {
      if (UsersDB.email[email]) {
        return reject(new UserException('user already exist'));
      }
      if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
        return reject(new UserException('email invalid'));
      }
      let userID = `u${usersIDCnt}`;
      let dateCreated = `${Date.now()}`;
      let altEmails = [];
      campusID = campusID === ''? 'ucsd': campusID;
      UsersDB.id[userID] = {
        email: email,
        defaultCampus: campusID,
        password: password,
        altEmails: altEmails,
        dateCreated: dateCreated
      }
      UsersDB.email[email] = userID;
      usersIDCnt += 1;
      return resolve(UsersDB);
    });
  }

  validPassword(password = '') {
    res = true;
    if (password !== this.password) {
      res = false;
    }
    
    return new Promise((resolve, reject) => {
      if (res) {
        return resolve(this);
      } else {
        return reject(new UserException('password invalid'));
      }
    });
  }

  getInfo(showID = false) {
    let res = {
      userID: this.userID,
      email: this.email,
      defaultCampus: this.defaultCampus,
      dateCreated: this.dateCreated
    }
    if (!showID) {
      delete res.userID;
    }
    return res;
  }

  toString() {
    return JSON.stringify(this.getInfo(), null, '  ');
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
