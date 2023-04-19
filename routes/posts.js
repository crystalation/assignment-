const express = require("express");
const router = express.Router();
const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

//게시글 목록 조회
// router.get("/posts", (req, res) => {
//   res.status(200).json({ posts: posts });
// });

// 게시글 전체 목록 조회하기
router.get("/", async (req, res) => {
  const posts = await Post.find({}).select("-password -content"); //Post 스키마 안에 있는 password를 제외한 모든 데이터
  res.status(200).json({ posts: posts });
});

// 게시글 상세조회
router.get("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const detail = await Post.findOne({ _id: _postId }).select("-password"); //data에 _postId와 _id 대응되는 값 = detail
  console.log(detail);

  if (!detail) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  res.json({ detail });
});

//게시글 수정
router.put("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { content } = req.body;

  const existsPost = await Post.findById(_postId); //existsPost-->단일 게시물이므로 post로 받아서 찾아보자
  if (existsPost) {
    await Post.updateOne({ _id: _postId }, { $set: { content } });
    res.json({ success: true }); //게시글이 찾아졌고 수정이 완료되었을 때에만 응답을 보내도록 if 블록 안으로 이동
  } else {
    return res.status(400).json({ message: "해당 ID의 게시글이 없습니다." });
  }
});

//게시글 삭제 //비밀번호 있어야함
router.delete("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { password } = req.body; // 요청 본문에서 비밀번호를 추출합니다.

  const post = await Post.findById(_postId);
  if (post) {
    if (post.password !== password) {
      // 비밀번호 검증 절차입니다.
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    await Post.deleteOne({ _id: _postId });
    res.json({ success: true });
  } else {
    return res.status(400).json({ message: "해당 ID의 게시글이 없습니다." });
  }
});

//게시글등록
router.post("/create", async (req, res) => {
  const { user, title, password, content, createdAt } = req.body;
  console.log(user, title, password, content, createdAt);

  try {
    const createdPosts = await Post.create({
      user,
      title,
      password,
      content,
      createdAt,
    });
    console.log(createdPosts);
    res
      .status(200)
      .json({ message: "게시글을 등록하였습니다.", posts: createdPosts });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "게시글 등록에 실패하였습니다." });
  }
});

//게시물의 댓글들 조회
router.get("/:_postId/comments/", async (req, res) => {
  const _postId = req.params._postId;
  const comments = await Comment.find({ _postId }).select("-password");
  res.status(200).json({ comments: comments });
});

//댓글 상세조회
router.get("/:_postId/comments/:_commentsId", async (req, res) => {
  const { _postId, _commentsId } = req.params;
  const detail = await Comment.findOne({ _id: _commentsId, _postId }); //

  if (!detail) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  res.json({ detail });
});

//댓글 등록
router.post("/:_postId/comments/create", async (req, res) => {
  const { user, password, content, createdAt } = req.body;
  const _postId = req.params._postId;

  try {
    const createdComments = await Comment.create({
      user,
      password,
      content,
      createdAt,
      _postId,
    });

    const post = await Post.findOneAndUpdate(
      { _id: _postId },
      { $push: { comments: createdComments.id } }
    );

    res
      .status(200)
      .json({ message: "댓글을 등록하였습니다.", comments: createdComments });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "댓글 등록에 실패하였습니다." });
  }
});

//댓글 수정
router.put("/:_postId/comments/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { content, password } = req.body;

  const existsComment = await Comment.findById(_commentId); //existsPost-->단일 게시물이므로 post로 받아서 찾아보자
  if (!existsComment) {
    return res.status(400).json({ message: "댓글을 찾을 수 없습니다." });
  }

  if (existsComment.password !== password) {
    return res.status(400).json({ message: "비밀번호가 올바르지 않습니다." });
  }

  existsComment.content = content;
  await existsComment.save();

  res.status(200).json({ message: "댓글을 수정했습니다.", existsComment });
});

//댓글삭제
router.delete("/:_postId/comments/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password } = req.body; // 요청 본문에서 비밀번호를 추출합니다.

  const comment = await Comment.findById(_postId);
  if (comment) {
    if (comment.password !== password) {
      // 비밀번호 검증 절차입니다.
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    await Comment.deleteOne({ _id: _commentId });
    res.json({ success: true });
  } else {
    return res.status(400).json({ message: "해당 ID의 게시글이 없습니다." });
  }
});

module.exports = router;
