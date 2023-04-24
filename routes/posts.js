const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware.js');

const Post = require('../schemas/post.js');

//게시글등록 //로그인 필요 //userId->게시글을 할당
router.post('/posts/create', authMiddleware, async (req, res) => {
  const { title, password, content } = req.body;
  const { user } = res.locals; // 미들웨어에서 쿠키에서 추출한 user 정보를 가져옴

  try {
    // 게시글 생성
    const post = await Post.create({
      user: user._id, // 유저 정보를 post schema에 추가
      title,
      password,
      content,
    });

    res.status(201).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errorMessage: '게시글 작성 중 오류가 발생했습니다.',
    });
  }
});

// 게시글 전체 목록 조회하기
router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({}).select('-password -content'); //Post 스키마 안에 있는 password를 제외한 모든 데이터
    res.status(200).json({ posts: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: '게시글 전체 목록 조회 실패' });
  }
});

// 게시글 상세조회
router.get('posts/:_postId', authMiddleware, async (req, res) => {
  try {
    const { _postId } = req.params;
    const detail = await Post.findOne({ _id: _postId }).select('-password');
    console.log(detail);

    if (!detail) {
      return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
    }
    res.json({ detail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '게시글 조회에 실패하였습니다.' });
  }
});

//게시글 수정 //비밀번호 있어야함
router.put('posts/:_postId', authMiddleware, async (req, res) => {
  try {
    const { _postId } = req.params;
    const { content, password } = req.body;

    const existsPost = await Post.findById(_postId);
    if (!existsPost) {
      return res.status(403).json({ message: '해당 ID의 게시글이 없습니다.' });
    }

    if (existsPost.author !== req.user.id) {
      return res
        .status(403)
        .json({ errorMessage: '게시글 수정의 권한이 존재하지 않습니다.' });
    }

    if (existsPost.password !== password) {
      return res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });
    }

    await Post.updateOne(
      { _id: _postId },
      {
        $set: {
          content,
          updatedAt: Date.now(), // 수정 시점
        },
      }
    );
    res.json({ success: true, message: '게시글 수정이 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '게시글 수정에 실패했습니다.' });
  }
});

//게시글 삭제 //비밀번호 있어야함
router.delete('posts/:_postId', authMiddleware, async (req, res) => {
  try {
    const { _postId } = req.params;
    const { password } = req.body;

    const post = await Post.findById(_postId);
    if (post) {
      if (post.password !== password) {
        return res
          .status(400)
          .json({ message: '비밀번호가 일치하지 않습니다.' });
      }

      await Post.deleteOne({ _id: _postId });
      res.json({ success: true, message: '게시글 삭제가 완료되었습니다.' });
    } else {
      return res.status(400).json({ message: '해당 ID의 게시글이 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '게시글 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
