const express = require('express');
const router = express.Router();
const User = require('../schemas/user.js');
const jwt = require('jsonwebtoken');

//로그인 API
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  //이메일이 일치하는 유저 찾기
  const user = await User.findOne({ email }); // 여기서 user는 어디서 확인해? 몽고디비 데이터에서 확인할꺼니까 맨 위에 연결해줘야겠지? const User = require('../schemas/user.js')
  //1. 이메일에 일치하는 유저가 존재하지 않거나
  //2. 유저를 찾았지만, 유저의 비밀번호와 입력 비밀번호가 다를때를 조건으로 걸어줌
  if (!user || user.password !== password) {
    //뒤의 password가 현재 입력받은 비번
    res.status(400).json({
      errorMessage: '로그인에 실패하였습니다.',
    });
    return;
  }
  //jwt를 생성, 생성하려면 맨 위에 또 jwt를 생성해줘야겠죠? const jwt = require("jsonwebtoken")
  const token = jwt.sign({ userId: user.userId }, 'customized-secret-key'); //userId를 token 내부에 할당했음
  res.cookie('Authorization', `Bearer ${token}`);
  res.status(200).json({ token });
});

module.exports = router;
