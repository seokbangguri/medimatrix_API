const { spawn } = require('child_process');
const fs = require('fs-extra');

exports.SpermVideosAnalyze = (req, res) => {
    if (!req.files || !req.files.files) {
      return res.status(400).send('파일이 업로드되지 않았습니다.');
    }
  
    const uploadedFile = req.files.files;
    let directoryPath = '';
  
    // 사용자가 업로드한 파일의 확장자를 확인
    uploadedFile.forEach(file => {
      const arr = file.name.split("-");
      const fileFormat = file.name.split('.').pop().toLowerCase();
      const supportedVideoFormats = ['mp4' /* 기타 지원하는 확장자들 */];
  
      if(supportedVideoFormats.includes(fileFormat)) {
        directoryPath = `./videos/${arr[0]}/`;
  
        if (!fs.existsSync(directoryPath)) {
          fs.mkdirSync(directoryPath, { recursive: true });
        }
  
        const filePath = `${directoryPath}${file.name}`;
        file.mv(filePath, err=> {
          if(err) {
            console.log('file save error', err);
            return res.status(500).send('파일 저장 중 에러발생.');
          }
        })
        //여기서 element를 './arr[0]/'에 저장
      } else {
        return res.status(400).send(file.name + ': 지원하지 않는 비디오 포맷입니다.');
      }
    });
    
    const pythonFilePath = './testVideo.py';
    const AImodule1 = spawn('python3', [pythonFilePath], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });
  
    AImodule1.stdin.write(directoryPath);
    AImodule1.stdin.end();
  
    let responseFromPython = '';
    AImodule1.stdout.on('data', (data) => {
      responseFromPython += data.toString('utf-8');
    });
  
    AImodule1.on('close', async () => {
        try {
            // 영상파일 삭제
//            await fs.remove(directoryPath);
            console.log(directoryPath + '삭제완료');
            // 성공 내역 response
            res.status(200).send(responseFromPython);
        } catch (err) {
            console.error(`디렉토리 삭제 중 오류 발생: ${err}`);
        }
    });
  };
