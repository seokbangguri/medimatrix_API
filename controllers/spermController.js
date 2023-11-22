// const { spawn } = require('child_process');
const { exec } = require('child_process');
const { dir } = require('console');
const fs = require('fs-extra');

exports.SpermVideosAnalyze = (req, res) => {
  if (!req.files || !req.files.files) {
    return res.status(400).send('파일이 업로드되지 않았습니다.');
  }

  const uploadedFile = req.files.files;
  let directoryPath = '';
  let arr = '';

  // 사용자가 업로드한 파일의 확장자를 확인
  uploadedFile.forEach(file => {
    const fileFormat = file.name.split('.').pop().toLowerCase();
    const supportedVideoFormats = ['mp4', 'csv' /* 기타 지원하는 확장자들 */];
    if (fileFormat === 'mp4') {
      arr = file.name.split("-");
    } else if (fileFormat === 'csv') {
      arr = file.name.split("_");
    }

    if (supportedVideoFormats.includes(fileFormat)) {
      directoryPath = `../files/${arr[0]}/`;
      console.log(directoryPath);

      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      const filePath = `${directoryPath}${file.name}`;
      file.mv(filePath, err => {
        if (err) {
          console.error('file save error', err);
          return res.status(500).send('파일 저장 중 에러발생.');
        }
      })
      //여기서 element를 './arr[0]/'에 저장
    } else {
      return res.status(400).send(file.name + ': 지원하지 않는 비디오 포맷입니다.');
    }
  });
  console.log(`../output/${arr[0]}`);

  // Python 코드 실행
  // exec(`python3 ../python/module1_test.py ${directoryPath}`, (error, stdout, stderr) => {
  exec(`python3 ../python/list_patient.py ${directoryPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(400).send(directoryPath + ': 파이썬 코드 에러');
    } else {
      const outputLines = stdout.split('\n');
      const chromosomePer = outputLines[outputLines.length - 3];
      const intfertilityPer = outputLines[outputLines.length - 2];
      const spermCounts = outputLines[outputLines.length - 4];

      console.log(`Python Output: ${stdout}`);
      // stdout을 클라이언트로 응답으로 전송
      fs.remove(directoryPath, err => {
        if (err) return console.error(err)
      });
      // output 삭제 (정자 count가 쌓임)
      // fs.remove(`../output/${arr[0]}`, err => {
      //   if (err) return console.error("output directory remove error!");
      // })
      res.status(200).json({ data: spermCounts, per: { chromosome: chromosomePer, intfertility: intfertilityPer } });
    }
  });
};

exports.getChromosome = (req, res) => {
  exec("python3 ../tracking_video/module_test/module_4.py 2>&1 | tee -a ../tracking_video/module_test/module4.log", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(400).send('module4 파이썬 코드 에러');
    } else {
      const output = stdout.split('\n');
      const accAuc = output[output.length - 2];
      res.status(200).json(JSON.parse(accAuc));
    }
  });
};

exports.getInfertility = (req, res) => {
  exec("python3 ../tracking_video/module_test/module_5.py 2>&1 | tee -a ../tracking_video/module_test/module5.log", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(400).send('module5 파이썬 코드 에러');
    } else {
      const output = stdout.split('\n');
      const accAuc = output[output.length - 2];
      res.status(200).json(JSON.parse(accAuc));
    }
  });
};