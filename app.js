const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const postsRouter = require('./routes/posts.js');
const usersRouter = require('./routes/users.js');
const loginRouter = require('./routes/login.js');

// const commentsRouter = require("./routes/comments.js");
const connect = require('./schemas');
connect();

app.use(express.json()); //실제로 body에 data가 들어왔을때 들어온 body data를 사용하게 해주는 미들웨어
// app.use('/api', usersRouter);
app.use(cookieParser());
app.use('/api/posts', [postsRouter, loginRouter]); //전역 middleware로써 router를 등록한다
// app.use("/api/posts", commentsRouter);
app.use('/api/signup', usersRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
