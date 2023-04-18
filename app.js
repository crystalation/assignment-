const express = require("express");
const app = express();
const port = 3000;
const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");
const connect = require("./schemas");
connect();

app.use(express.json()); //실제로 body에 data가 들어왔을때 들어온 body data를 사용하게 해주는 미들웨어
app.use("/api", postsRouter); //전역 middleware로써 router를 등록한다
app.use("/api/posts/:_postId/comments", commentsRouter); //이렇게 쓰면 localhost:3000/comments 이렇게 되기때문에 안됌;;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
