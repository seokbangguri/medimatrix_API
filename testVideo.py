# import sys
# import json

# def handle_video_data(video_data):
#     # 동영상 파일 데이터를 받아 처리하는 로직을 여기에 추가하세요.
#     # video_data는 바이너리 데이터로 전달됩니다.
#     # 예를 들어, 파일을 분석하거나 가공하는 코드를 작성할 수 있습니다.
#     # 이 예제에서는 간단히 파일을 받았다고 가정하고 "true" 반환합니다.
#     res = {
#         "status": True,
#         "response": {
#             "data": 1,
#             "data2": 2
#             }
#     }
#     return json.dumps(res)

# if __name__ == "__main__":
#     # stdin에서 동영상 파일 데이터를 받아옴
#     video_data = sys.stdin.buffer.read()

#     try:
#         # 동영상 파일 데이터를 받아 처리하고 결과를 출력
#         result = handle_video_data(video_data)
#         print(result)
#     except Exception as e:
#         print(f"Error: {e}")
#         print("false")

# script.py

import sys
import json

# 부모 프로세스로부터 데이터 읽기
# data_from_parent = sys.stdin.read()

def returnTestData():
    data = {
            "chromosomeAge": {
                "low": "80",
                "high": "20"
                },
            "chromosomeAll": {
                "low": "50",
                "high": "50"
                },
            "spermAnalysis": {
                "total": {
                    "speed": "0.056",
                    "distance": "55.987",
                    "count": "220"
                    },
                "aClass": {
                    "speed": "0.021",
                    "distance": "21.987",
                    "count": "60"
                    },
                "bClass": {
                    "speed": "0.034",
                    "distance": "23.987",
                    "count": "120"
                    },
                "cClass": {
                    "speed": "0.021",
                    "distance": "18.987",
                    "count": "30"
                    },
                "dClass": {
                    "speed": "0.011",
                    "distance": "10.987",
                    "count": "10"
                    }
                },
            "group": {
                "speed": "[0.02, 0.05, 0.08]",
                "distance": "[12, 23, 34]",
                "count": "[150, 200, 110]"
                },
            "classCompare": {
                "count": "[350, 200, 110, 99]",
                "speed": "[0.02, 0.05, 0.08, 00.3]",
                "distance": "[12, 23, 34, 45]"
                },
            "relativePosition": {
                "ageAClass": "20",
                "ageBClass": "50",
                "ageCClass": "70",
                "ageDClass": "30",
                "allAClass": "10",
                "allBClass": "20",
                "allCClass": "60",
                "allDClass": "40"
                }
            }

    return json.dumps(data)
# 부모 프로세스로부터 받은 데이터 출력
# print(f"Received data from parent process: {data_from_parent}")

# 작업 수행 후 결과를 부모 프로세스로 전송 (stdout으로 출력하면 부모 프로세스에서 읽을 수 있음)
# print("Hello from child process!")

if __name__ == "__main__":
    data_from_parent = sys.stdin.read()

    try:
        result = returnTestData()
        print(result)
    except Exception as e:
        print(f"에러: {e}")

