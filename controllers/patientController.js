const pool = require('../dbPool');

// 환자 정보등록
exports.patientE = async (req, res) => {
  // 사용자 데이터 로드 로직 구현
  try {
    const { name, id, hospital, sex, therapists } = req.body;
    // 필드 값이 null 또는 undefined인 경우 에러 반환
    if (
      name == null ||
      id == null ||
      hospital == null ||
      sex == null ||
      therapists == null
    ) {
      res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
      return;
    }
    let p;

    const connection = await pool.getConnection();

    const [patient] = await connection.execute(
      'SELECT * FROM patients WHERE patientNo = ? AND name = ? AND hospital = ? AND sex = ? AND therapists = ?',
      [id, name, hospital, sex, therapists],
    );

    if (patient[0] != null) {
      p = patient[0];
      // 사용자 데이터를 클라이언트로 응답으로 보냅니다.
      res.status(200).json({
        patientNo: p.patientNo,
        hospitalName: p.hospital,
      });
    } else {
      // 사용자를 찾을 수 없을 경우 적절한 응답을 보냅니다.// 데이터베이스에 회원 정보 추가
      // eslint-disable-next-line no-unused-vars
      const [result] = await connection.execute(
        `INSERT INTO patients (patientNo, name, sex, hospital, therapists) VALUES (?,?,?,?,?)`,
        [id, name, sex, hospital, therapists],
      );
      res.status(201).json({ message: '신규환자 입니다.' });
    }

    connection.release();
  } catch (error) {
    console.error('에러', error);
    res.status(500).json({ error: '데이터 불러오기 실패' });
  }
};

// 치료사 담당 환자 조회
exports.patientL = async (req, res) => {
  // 사용자 데이터 로드 로직 구현
  try {
    const { name, email, hospital } = req.body;
    // 필드 값이 null 또는 undefined인 경우 에러 반환
    if (name == null || email == null || hospital == null) {
      res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
      return;
    }
    let p;

    const connection = await pool.getConnection();

    const [patient] = await connection.execute(
      'SELECT * FROM patients WHERE hospital = ? AND therapists = ?',
      [hospital, email],
    );

    if (patient[0] != null) {
      p = patient;
      // 사용자 데이터를 클라이언트로 응답으로 보냅니다.
      res.status(200).json({
        patients: p,
      });
    } else {
      res.status(404).json({ error: '조회된 환자가 없습니다.' });
    }

    connection.release();
  } catch (error) {
    console.error('에러', error);
    res.status(500).json({ error: '데이터 불러오기 실패' });
  }
};
// 치료사 담당 환자 데이터 조회
exports.loadPatientData = async (req, res) => {
  // 사용자 데이터 로드 로직 구현
  try {
    const { id, hospital } = req.body;
    // 필드 값이 null 또는 undefined인 경우 에러 반환
    if (id == null || hospital == null) {
      res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
      return;
    }
    // eslint-disable-next-line no-unused-vars
    const user = null;

    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'SELECT * FROM testData WHERE patientNo = ? AND hospital = ?',
      [id, hospital],
    );

    if (result.length >= 0) {
      // 사용자 데이터를 클라이언트로 응답으로 보냅니다.
      res.status(200).json({
        testData: result,
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
