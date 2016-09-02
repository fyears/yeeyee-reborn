import User, {UserException} from './users';

class Price {
  constructor({price = '0', currency = 'USD', factor = 2} = {}) {
    this.price = String(price);
    this.currency = String(currency);
    this.factor = Math.abs(Number.parseInt(factor, 10));
  }

  getRealPrice() {
    let priceStr = this.price;
    let factor = this.factor;
    if (factor == 0) {
      return priceStr;
    }
    if (priceStr.length <= factor) {
      priceStr = '0'.repeat(factor - priceStr.length + 1) + priceStr;
    }
    let res = priceStr.slice(0, -factor) + '.' + priceStr.slice(-factor);
    return res;
  }

  toDict() {
    return {
      price: this.price,
      currency: this.currency,
      factor: this.factor
    }
  }
}


let PostsDB = {
  pid: {
    p1: {
      userID: 'u1',
      postType: 'sell',
      dateCreated: `${Date.now()}`,
      dateModified: `${Date.now()}`,
      contents: 'selling a book',
      campusID: 'univ',
      price: (new Price({price: 1234})).toDict()
    },
    p2: {
      userID: 'u1',
      postType: 'buy',
      dateCreated: `${Date.now()}`,
      dateModified: `${Date.now()}`,
      contents: 'buying another book',
      campusID: 'univ',
      price: (new Price({price: 0})).toDict()
    }
  },

  uid: {
    u1: ['p1', 'p2'],
    u2: []
  }
};
let postsIDCnt = 4;

export default class Post {
  constructor(postID) {
    let post = PostsDB.pid[postID];
    this.postID = postID;
    this.userID = post.userID;
    this.postType = post.postType;
    this.dateCreated = post.dateCreated;
    this.contents = post.contents;
    this.campusID = post.campusID;
    this.price = post.price;
  }

  static createPost({
      userID = '',
      postType = '',
      contents = '',
      price = '0',
      campusID = '',
      tags = []
    } = {}) {
    return new Promise((resolve, reject) => {
      User.fromID(userID).then(user => {
        if (campusID === '') {
          campusID = user.getInfo().defaultCampus;
        }
        if (postType !== 'buy' && postType !== 'sell') {
          return reject(new PostException('post type not supported'));
        }

        let postID = `p${postsIDCnt}`;
        postsIDCnt += 1;

        PostsDB.pid[postID] = {
          userID: userID,
          postType: postType,
          dateCreated: `${Date.now()}`,
          dateModified: `${Date.now()}`,
          contents: contents,
          campusID: campusID,
          price: (new Price({price: price})).toDict()
        };

        if (userID in PostsDB.uid) {
          PostsDB.uid[userID].push(postID);
        } else {
          PostsDB.uid[userID] = [postID];
        }

        return resolve(postID);
      }, error => {
        return reject(error);
      });
    });
  }

  static fromID(postID) {
    return new Promise((resolve, reject) => {
      try {
        let post = new Post(postID);
        return resolve(post);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static getPostsListOfUser({
      userID = '',
      expand = true
    } = {}) {
    return new Promise((resolve, reject) => {
      User.fromID(userID).then(user => {
        console.log(user);
        let res = PostsDB.uid[user.userID];
        if (expand) {
          let expandedRes = {};
          res.forEach(x => {
            expandedRes[x] = PostsDB.pid[x];
          });
          res = expandedRes;
        }
        return resolve(res);
      }, error => {
        return reject(error);
      });
    });
  }

  getInfo(showUserID = false) {
    let res = {
      userID: this.userID,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      campusID: this.campusID,
      postType: this.postType,
      contents: this.contents,
      price: this.price
    };

    if (!showUserID) {
      delete res.userID;
    }

    User.fromID(this.userID).then(user => {
      let email = user.getInfo().email;
      res.email = email;
    }, error => {
      // pass
    });

    return res;
  }

  toString() {
    return JSON.stringify(this.getInfo(), null, '  ');
  }
}

export class PostException {
  constructor(message) {
    this.message = message;
  }

  toString() {
    return String(this.message);
  }
}
