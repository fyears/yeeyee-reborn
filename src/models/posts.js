import User, {UserException} from './users';

export default class Post {
  constructor(post_id) {
    this.post_id = post_id;
    this.user_id = 'u1';
  }

  static create_post(user_id,
    post_type,
    contents,
    campus_id = '',
    tags = [],
    ...kwargs) {
    return new Promise((resolve, reject) => {
      User.from_id(user_id).then(user => {
        if (campus_id === '') {
          campus_id = user.get_info()['default_campus'];
        }

        let post_id = 'p2';
        resolve(new Post(post_id));
      }, error => {
        reject(error);
      });
    });
  }

  static from_id(post_id) {
    return new Promise((resolve, reject) => {
      try {
        let post = new Post(post_id);
        resolve(post);
      } catch (error) {
        reject(error);
      }
    });
  }

  get_info() {
    return {
      'user_id': this.user_id,
      'post_id': this.post_id,
      'date_created': `${Date.now()}`,
      'date_modified': `${Date.now()}`,
      'campus_id': 'univ',
      'post_type': 'buy or sell',
      'contents': 'contents',
      'price': '0.00',
      'currency': 'USD'
    }
  }

  toString() {
    return JSON.stringify(this.get_info(), null, '  ');
  }
}

class PostException {
  constructor(message) {
    this.message = message;
  }

  toString() {
    return String(this.message);
  }
}
