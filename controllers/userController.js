const pool = require('../dbPool');

const generateToken = require('./authController');

// 사용자 정보 조회
exports.loadUserData = async (req, res, next) => {
  // 사용자 데이터 로드 로직 구현
  try {
    const { email, role } = req.body;
    // 필드 값이 null 또는 undefined인 경우 에러 반환
    if (email == null || role == null) {
      res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
      return;
    }
    let user = null;

    const connection = await pool.getConnection();

    if (role === 'administrators') {
      const [administrators] = await connection.execute(
        'SELECT * FROM administrators WHERE email = ?',
        [email],
      );
      user = administrators[0];
    } else if (role === 'therapists') {
      const [therapists] = await connection.execute(
        'SELECT * FROM therapists WHERE email = ?',
        [email],
      );
      user = therapists[0];
    }

    if (user != null) {
      // 사용자 데이터를 클라이언트로 응답으로 보냅니다.
      res.status(200).json({
        email: user.email,
        name: user.name,
        hospitalName: user.hospital,
        phoneNumber: user.hp,
      });
    } else {
      // 사용자를 찾을 수 없을 경우 적절한 응답을 보냅니다.
      res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    connection.release();
  } catch (error) {
    console.error('에러', error);
    res.status(500).json({ error: '데이터 불러오기 실패' });
  }
};
// 사용자 정보 업데이트
exports.updateData = async (req, res, next) => {
  // 사용자 정보 업데이트 로직 구현
  try {
    const { email, name, hospitalName, phoneNumber, role } = req.body;
    // 필드 값이 null 또는 undefined인 경우 에러 반환
    if (
      name == null ||
      email == null ||
      hospitalName == null ||
      phoneNumber == null ||
      role == null
    ) {
      res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
      return;
    }

    // MySQL 데이터베이스 연결
    const connection = await pool.getConnection();

    // 사용자 데이터 업데이트
    const [result] = await connection.execute(
      `UPDATE ${role} SET name = ?, hp = ?, hospital = ? WHERE email = ?`,
      [name, phoneNumber, hospitalName, email],
    );

    connection.release();

    if (result.affectedRows === 1) {
      // 업데이트가 성공한 경우
      const userData = {
        name: name,
        email: email,
        hospitalName: hospitalName,
        role: role,
      };
      const token = generateToken(userData);
      res
        .status(200)
        .json({ message: '사용자 데이터 업데이트 성공', token: token });
    } else {
      // 업데이트가 실패한 경우 (해당 이메일을 가진 사용자를 찾을 수 없음)
      res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('사용자 데이터 업데이트 에러:', error);
    res.status(500).json({ error: '데이터 업데이트 중 오류가 발생했습니다.' });
  }
};

exports.getAllTherapists = async (req, res) => {
  try {
    const hospital = req.params.hospital || null;

    // MySQL database connection
    const connection = await pool.getConnection();

    const [therapists] = await connection.execute(
      'SELECT * FROM therapists WHERE hospital = ?',
      [hospital || null],
    );

    connection.release();

    res.status(200).json({
      status: 'success',
      results: therapists.length,
      data: {
        data: therapists,
      },
    });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getUser = async (req, res, next) => {
  const user = {
    name: 'Usmon',
    email: 'usmon@gmail.com',
  };

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};
