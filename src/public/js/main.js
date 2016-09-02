import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

class PostForm extends React.component {
  static defaultProps = {
  };

  static propTypes = {
  }

  state = {
  };

  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div></div>
    );
  };
};

class PostList extends React.component {
  static defaultProps = {
  };

  static propTypes = {
  }

  state = {
  };

  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div></div>
    );
  };
}

var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        <Comment author="Pete Hunt">This is one comment</Comment>
        <Comment author="Jordan Walke">This is *another* comment</Comment>
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});


var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }
});


ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
