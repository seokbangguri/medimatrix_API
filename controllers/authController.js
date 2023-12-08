/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../dbPool');

const jwtSecret = process.env.JWT_SECRET;
const saltRounds = parseInt(process.env.HASH_SALT, 10);

// 토큰 생성
const generateToken = (payload) => {
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '5h' });
  console.log('Token generated:', token);
  return token;
};

// 토큰 검증
async function verifyToken(req, res) {
  try {
    const token = req.headers['x-auth-token'];

    if (!token) {
      res.status(401).json({ error: 'There is no token.' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const { email, name, hospitalName, role, exp, iat } = decoded;

    res
      .status(200)
      .json({ decoded: { email, name, hospitalName, role, exp, iat } });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token expired:', error.message);
      res.status(401).json({ error: '토큰이 만료되었습니다.' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token:', error.message);
      res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    } else {
      console.error('Unexpected error:', error.message);
      res.status(400).json({ error: '에러가 발생했습니다.' });
    }
  }
}

// Sign in
async function signin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    const connection = await pool.getConnection();

    const [therapists] = await connection.execute(
      'SELECT * FROM therapists WHERE email = ?',
      [email],
    );

    // administrators 테이블에서 이메일로 사용자 정보 검색
    const [administrators] = await connection.execute(
      'SELECT * FROM administrators WHERE email = ?',
      [email],
    );

    connection.release();
    let user = null;
    let role = '';

    if (therapists.length > 0) {
      // therapists 테이블에서 사용자 발견
      user = therapists[0];
      role = 'therapists';
    } else if (administrators.length > 0) {
      // administrators 테이블에서 사용자 발견
      user = administrators[0];
      role = 'administrators';
    }

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const userData = {
          name: user.name,
          email: user.email,
          hospitalName: user.hospital,
          role: role,
        };

        const token = generateToken(userData);
        return res.status(200).header('x-auth-token', token).json({
          status: 'success',
          message: '로그인 성공',
          user: userData,
        });
      }
    }

    // Incorrect email or password
    return res
      .status(401)
      .json({ message: '유효하지 않은 이메일 또는 비밀번호입니다.' });
  } catch (error) {
    console.error('에러', error);
    return res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
  }
}

// Sign up
async function signup(req, res) {
  try {
    const { name, email, password, hospitalName, phoneNumber, role } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !hospitalName ||
      !phoneNumber ||
      !role
    ) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    const connection = await pool.getConnection();

    try {
      // Check for duplicate email in both tables
      const [existingTherapist] = await connection.execute(
        'SELECT * FROM therapists WHERE email = ?',
        [email],
      );
      const [existingAdmin] = await connection.execute(
        'SELECT * FROM administrators WHERE email = ?',
        [email],
      );

      if (existingTherapist.length > 0 || existingAdmin.length > 0) {
        // 중복된 이메일이 이미 존재하는 경우
        res.status(400).json({ error: '중복된 이메일입니다.' });
      }

      // Hash password asynchronously
      const hash = await bcrypt.hash(password, saltRounds);

      // Use a transaction for consistency
      await connection.beginTransaction();

      // Insert user into the appropriate table
      await connection.execute(
        // eslint-disable-next-line prettier/prettier
        `INSERT INTO ${role === 'administrators'
            ? 'administrators (name, email, password, hospital, hp) VALUES (?, ?, ?, ?, ?)'
            : 'therapists (name, email, password, hospital, hp) VALUES (?, ?, ?, ?, ?)'
        }`,
        [name, email, hash, hospitalName, phoneNumber],
      );

      await connection.commit();

      const userData = {
        name,
        email,
        hospitalName,
        role,
      };

      const token = generateToken(userData);

      // Registration success
      res
        .status(201)
        .header('x-auth-token', token)
        .json({ status: 'success', message: '회원가입 성공' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('에러', error);
    res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
  }
}

// Update password

async function updatePassword(req, res) {
  try {
    const { currentPW, newPW, email, role } = req.body;

    if (!email || !currentPW || !newPW || !role) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    const connection = await pool.getConnection();

    try {
      // Retrieve user information with a single query
      const [users] = await connection.execute(
        `SELECT * FROM ${role} WHERE email = ?`,
        [email],
      );

      const user = users[0];

      if (!user) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }

      const passwordMatch = await bcrypt.compare(currentPW, user.password);

      if (passwordMatch) {
        const hash = await bcrypt.hash(newPW, saltRounds);

        if (!(await bcrypt.compare(currentPW, newPW))) {
          const [result] = await connection.execute(
            `UPDATE ${role} SET password = ? WHERE email = ?`,
            [hash, email],
          );

          if (result.affectedRows === 1) {
            return res.status(200).json({ message: '비밀번호 변경 완료' });
          }
          return res.status(500).json({ error: '비밀번호 변경 실패' });
        }
        return res
          .status(400)
          .json({ error: '새로운 비밀번호와 현재 비밀번호가 똑같습니다.' });
      }
      return res.status(400).json({ error: '현재 비밀번호가 맞지 않습니다.' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('에러', error);
    return res
      .status(500)
      .json({ error: '데이터 업데이트 중 오류가 발생했습니다.' });
  }
}

module.exports = {
  generateToken,
  updatePassword,
  signin,
  signup,
  verifyToken,
};
