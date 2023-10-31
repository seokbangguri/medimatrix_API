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

# 부모 프로세스로부터 데이터 읽기
data_from_parent = sys.stdin.read()

# 부모 프로세스로부터 받은 데이터 출력
print(f"Received data from parent process: {data_from_parent}")

# 작업 수행 후 결과를 부모 프로세스로 전송 (stdout으로 출력하면 부모 프로세스에서 읽을 수 있음)
print("Hello from child process!")