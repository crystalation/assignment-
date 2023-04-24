const mongoose = require('mongoose');

//어떤 게시글의 댓글인지 표기
//게시글의 id를 string화 해서 연결

const CommentSchema = new mongoose.Schema({
  user: {
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
  _postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
});

const Comment = mongoose.model('Comments', CommentSchema);
module.exports = Comment;

// var NoticeSchema = new mongoose.Schema({
// 	writer: String, // 쓴 사람의 token
// 	title: String, // 글 제목
// 	content: String, // 글 내용
// 	noticeToken: String, // 글 고유 값
// 	writeDate: { type: Date, default: new Date() }, // 글 작성 날짜
// 	comment: [
// 		{
// 			username: String, // 댓글 작성자 이름
// 			content: String, // 댓글 내용
// 			date: { type: Date, default: new Date() }, // 작성 시간
// 		},
// 	], // 댓글
// });
