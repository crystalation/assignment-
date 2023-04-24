const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    // 중복되면안됌
    type: String,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    match: /^[A-Za-z0-9]+$/, // 알파벳 대소문자(a~z, A~Z), 숫자(0~9)만 허용
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    validate: {
      validator: function (value) {
        return value.indexOf(this.nickname) === -1;
      },
      message: '비밀번호는 닉네임과 같은 값이 포함될 수 없습니다. ',
    },
  },
});

UserSchema.virtual('userId').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true, //JSON 형태로 가공할 때 userId를 출력 시켜준다.
});

module.exports = mongoose.model('USER', UserSchema);
