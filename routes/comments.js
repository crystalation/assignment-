const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware.js');

const Comment = require('../schemas/comment.js');

//게시물의 댓글들 조회
router.get('/posts/:_postId/comments/', authMiddleware, async (req, res) => {
  const _postId = req.params._postId;
  const comments = await Comment.find({ _postId }).select('-password');
  res.status(200).json({ comments: comments });
});

//댓글 상세조회
router.get(
  '/posts/:_postId/comments/:_commentsId',
  authMiddleware,
  async (req, res) => {
    try {
      const { _postId, _commentsId } = req.params;
      const detail = await Comment.findOne({ _id: _commentsId, _postId }); //

      if (!detail) {
        return res
          .status(400)
          .json({ message: '해당 댓글을 조회할 수 없습니다.' });
      }
      res.json({ detail });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '해당 댓글을 조회할 수 없습니다..' });
    }
  }
);

//댓글 등록
router.post(
  '/posts/:_postId/comments/create',
  authMiddleware,
  async (req, res) => {
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
        .json({ message: '댓글을 등록하였습니다.', comments: createdComments });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: '댓글 등록에 실패하였습니다.' });
    }
  }
);

//댓글 수정
router.put(
  '/posts/:_postId/comments/:_commentId',
  authMiddleware,
  async (req, res) => {
    try {
      const { _commentId } = req.params;
      const { content, password } = req.body;

      const existsComment = await Comment.findById(_commentId);

      if (!existsComment) {
        return res.status(400).json({ message: '댓글을 찾을 수 없습니다.' });
      }

      if (existsComment.password !== password) {
        return res
          .status(400)
          .json({ message: '비밀번호가 올바르지 않습니다.' });
      }

      existsComment.content = content;
      await existsComment.save();

      res.status(200).json({ message: '댓글을 수정했습니다.', existsComment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '댓글 수정에 실패했습니다.' });
    }
  }
);

//댓글삭제
router.delete(
  '/posts/:_postId/comments/:_commentId',
  authMiddleware,
  async (req, res) => {
    try {
      const { _commentId } = req.params;
      const { password } = req.body; // 요청 본문에서 비밀번호를 추출합니다.

      const comment = await Comment.findById(_postId);
      if (comment) {
        if (comment.password !== password) {
          // 비밀번호 검증 절차입니다.
          return res
            .status(400)
            .json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        await Comment.deleteOne({ _id: _commentId });
        res.json({ success: true });
      } else {
        return res
          .status(400)
          .json({ message: '해당 ID의 게시글이 없습니다.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ errorMessage: '댓글 삭제에 실패하였습니다.' });
    }
  }
);
module.exports = router;
