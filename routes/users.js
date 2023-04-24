const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

// 회원가입 API //api/signup
router.post('/', async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;
  // 비번과 확인용 비번이 같은지 확인
  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: '패스워드가 패스워드 확인값과 다릅니다.',
    });
    return;
  }

  // email 또는 nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findOne({
    $or: [{ email }, { nickname }], //이메일 또는 닉네임이 일치할 때 조회한다. $or는 둘중 하나라도 일치한다면~의 뜻
  });
  if (existsUsers) {
    // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다. 만약 이메일 혹은 비번을 특정해주면 해킹범에게 더 많은 정보를 주게 되는 꼴.
    res.status(400).json({
      errorMessage: '이메일 또는 닉네임이 이미 사용중입니다.', //뭉뚱그려서 둘중 하나가 사용중이다, 라고 전달.
    });
    return; //return을 써서 다음코드로 진행되지 않도록
  }

  const user = new User({ email, nickname, password }); //원래는 password는 암호화해서 저장한다. 해킹시 바로 알게되지않게
  await user.save(); //DB에 저장한다.
  console.log(user);

  res.status(201).json({ message: '회원 가입이 완료 되었습니다.' });
});

module.exports = router;
