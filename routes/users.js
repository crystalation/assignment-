const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

// 회원가입 API //api/signup
router.post('/signup', async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  //닉네임 길이 제한
  if (nickname.length < 3) {
    res.status(412).json({ errorMessage: '닉네임 형식이 일치하지 않습니다.' });
    return;
  }

  //닉네임 알파벳 대소문자, 숫자
  const nickNameRegex = /^[a-zA-Z0-9]+$/;
  if (!nickNameRegex.test(nickname)) {
    res.status(412).json({ errorMessage: '닉네임 형식이 일치하지 않습니다.' });
    return;
  }

  //닉네임 4자리 이상, 닉네임과 같은 값 포함
  if (password.length < 4 || password.includes(nickname)) {
    res
      .status(412)
      .json({ errorMessage: '패스워드 형식이 일치하지 않습니다.' });
    return;
  }

  //비번 재확인
  if (password !== confirmPassword) {
    res.status(412).json({
      errorMessage: '패스워드가 일치하지 않습니다.',
    });
    return;
  }

  // email 또는 nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
  const existsNickname = await User.findOne({ nickname }); //이메일 또는 닉네임이 일치할 때 조회한다. $or는 둘중 하나라도 일치한다면~의

  if (existsNickname) {
    // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다. 만약 이메일 혹은 비번을 특정해주면 해킹범에게 더 많은 정보를 주게 되는 꼴.
    res.status(412).json({ errorMessage: '중복된 닉네임입니다.' });
    return; //return을 써서 다음코드로 진행되지 않도록
  }
  try {
    const user = new User({ nickname, password });
    await user.save();
    return res.status(201).json({ message: '회원가입에 성공하였습니다.' });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ errorMessage: '요청한 데이터 형식이 올바르지 않습니다.' });
    return;
  }
});

module.exports = router;
