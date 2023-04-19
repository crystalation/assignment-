// const express = require("express");
// const router = express.Router();
// const Comment = require("../schemas/comment.js");

// //댓글 조회
// router.get("/comments", async (req, res) => {
//   const comments = await Comment.find({}).select("-password -content");
//   res.status(200).json({ comments: comments });
// });
// //댓글 등록
// router.post("/comments/create", async (req, res) => {
//   const { user, password, content, createdAt } = req.body;
//   console.log(user, password, content, createdAt);

//   try {
//     const createdComments = await Comment.create({
//       user,
//       password,
//       content,
//       createdAt,
//     });
//     console.log(createdComments);
//     res
//       .status(200)
//       .json({ message: "댓글을 등록하였습니다.", comments: createdComments });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "댓글 등록에 실패하였습니다." });
//   }
// });

// module.exports = router;
