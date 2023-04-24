//제목, 작성자명, 비밀번호, 작성 내용을 입력하기
//전체적으로 입력하고 불러올 내용의 틀
//user, title, password, content, createdAt

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

const Post = mongoose.model('Posts', postSchema);
module.exports = Post;

// const Post = mongoose.model("Posts", postSchema);
//"Posts"라는 컬렉션은 postSchema에 따라 구성되고, Post변수를 사용해서 모델 사용
