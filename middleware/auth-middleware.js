//사용자가 로그인을 해야만 접근할 수 있는 기능들을 담당하는 미들웨어
//로그인을 하면, 로그인시 발급된 JWT토큰을 이용해 사용자를 인증하고, 해당 사용자가 DB에 등록되어있는 유효한 사용자인지 검증함.
//검증이 완료되면 해당 사용자 정보를 다음 미들웨어로 넘기기 위해 res.locals.user에 담아두고, 다음 미들웨어로 진행됌

//내 게시글 작성, 조회, 수정, 삭제
//내 댓글 작성, 조회, 수정, 삭제

const jwt = require('jsonwebtoken');
const User = require('../schemas/user.js');

module.exports = async (req, res, next) => {
  console.log(req.cookies);

  const { Authorization } = req.cookies; // Authorization 쿠키에 jwt 토큰이 담겨있는지 확인

  if (!Authorization) {
    res.status(400).json({
      errorMessage: '로그인이 필요한 기능입니다.', //Authorization 자체가 전달되지 않았을경우, 즉 로그인이 안됌.
    });
    return;
  }

  const [authType, authToken] = (Authorization ?? '').split(' '); // Authorization이 존재하지 않으면 ''<빈 문자열 할당
  //즉 authorization이 undefined거나 null일경우 빈 문자열을 할당한다.
  //만약 'Bearer asldkfjasldfkjwelkfjasldfkjas;dfkjsa;fdksja;fkjsaljfasdf'이 authorization이라면,
  //authType = Bearer , authToken= asdlsdfsdfsdfsdflj
  console.log(authType, authToken);

  if (authType !== 'Bearer' || !authToken) {
    res.status(400).json({
      errorMessage: '토큰 타입이 일치하지 않거나, 토큰이 존재하지 않습니다.',
    });
    return;
  }

  //토큰이 유효하면
  try {
    //쿠키에서 JWT토큰을 가져온 후, JWT토큰에서 사용자 ID를 추출.
    const { userId } = jwt.verify(authToken, 'customized-secret-key'); //authToken 검증할 토큰, ''은 토큰을 생성할 때 사용된 비밀 키
    //jwt.verify()가 검증에 성공하면 해독된 JWT페이로드(payload)를 반환.
    //즉 userId라는 이름으로 반환된 페이로드의 userId값을 추출하여 변수에 할당. userId=토큰에 포함된 사용자 ID
    //추출된 사용자 ID를 사용하여 mongoDB의 'users'컬렉션에서 해당 사용자를 찾음
    const user = await User.findById(userId); //즉 user는 해당사용자

    if (!user) {
      // 유저 정보가 존재하지 않을 경우 에러 처리
      res.status(403).json({
        errorMessage: '로그인이 필요한 기능입니다.',
      });
      return;
    }

    res.locals.user = user; //user는 해당사용자
    console.log(user);
    next();
  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      // 토큰이 만료된 경우 에러 처리
      res.status(403).json({
        errorMessage: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
      });
    } else {
      // 그 외의 인증 에러인 경우 에러 처리
      res.status(403).json({
        errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.',
      });
    }
    return;
  }
};

// const jwt = require('jsonwebtoken');
// const User = require('../schemas/user.js');

// //자 async자꾸 붙이는 이유 알제? 데이터를 가져와서 사용할 것이기 때문임.
// module.exports = async (req, res, next) => {
//   const { authorization } = req.cookies; //cookies안에 있는 authorization가져올꺼야
//   //Bearer werwerw.erwerwerwer형태로 있었고 이것을 배열로 분리해줄꺼야
//   //존재하지 않으면 undefined.;이고 에러가 날 것임. 그래서 대비를 할꺼야
//   const [authType, authToken] = (authorization ?? '').split(); //??은 null병합 문자열 왼쪽에 있는 값이 비었거나 null일 경우 오른쪽에 있는 "" 즉 빈문자열로 대체해줄꺼야.

//   //authType === Bearer값인지 확인
//   //authToken 검증
//   if (authType !== 'Bearer' || !authToken) {
//     res.status(400).json({
//       errorMessage: '토큰 타입이 일치하지 않거나, 토큰이 존재하지 않습니다.'
//     });
//     return;
//   }

//   //try를 왜쓰는가? jwt 검증, 에러나서 서버가 멈추지않게 하기 위해
//   //검증실패했을때 실패했다고 알려주기 위해
//   try {
//     //자 여기서 JWT를 쓸꺼면 맨 위에다 추가해줘야겠죠? 추가 한 후에
//     //authToken이 만료되었는지, authToken이 서버가 발급한 토큰이 맞는지 verify로 확인
//     const { userId } = jwt.verify(authToken, 'customized-secret-key'); // 이 key는 이전에 auth에서 썼던거와 같은것
//     //authToken에 있는 userId에 해당하는 사용자가 실제로 db에 있는지
//     //확인하려면 data 가져와야하니까 await이랑, User 데이타 위에 추가해줘야겠지? const User = require("../schemas/user.js")
//     const user = await User.findById(userId);
//     res.locals.user = user; //실제 db에서 정보가져오지말고, express가 제공하는 안전한 변수에 담아두고 언제나 꺼내서 사용할 수 있게 함. 사용 후 소멸
//     next(); //이 미들 웨어 다음으로 보낸다.
//   } catch (error) {
//     console.error(error); //사용자 인증에 실패한 내용을 알 수 있지만 사용자가 많아지면 관리하기가 힘들 수 있다.
//     res
//       .status(400)
//       .json({ errorMessage: '로그인 후에 이용할 수 있는 기능입니다.' });
//     return;
//   }
// };

//토큰이 유효하면
//   try {
//     //쿠키에서 JWT토큰을 가져온 후, JWT토큰에서 사용자 ID를 추출.
//     const { userId } = jwt.verify(authToken, 'customized-secret-key'); //authToken 검증할 토큰, ''은 토큰을 생성할 때 사용된 비밀 키
//     const user = await User.findById(userId); //즉 user는 해당사용자

//     if (!user) {
//       // 유저 정보가 존재하지 않을 경우 에러 처리
//       res.status(403).json({
//         errorMessage: '로그인이 필요한 기능입니다.',
//       });
//       return;
//     }
