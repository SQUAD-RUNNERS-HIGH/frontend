# Background Running Implementation Notes

## 목적

러닝 중 앱이 foreground를 벗어나도 기록이 끊기지 않도록 Expo 기반 백그라운드 위치 수집 구조를 추가했다.  
단순 위치 추적이 아니라, foreground 복귀 후 거리/시간/경로를 실제 러닝 상태에 다시 합치는 흐름까지 포함한다.

## 기존 문제

- `watchPositionAsync()` 만으로는 앱이 background로 전환되면 GPS 추적이 사실상 끊겼다.
- iOS/Android 모두 background 상태에서 WebSocket 연결 지속을 신뢰하기 어려웠다.
- background 동안 쌓인 좌표를 foreground store에 다시 반영하는 경로가 없었다.

## 구현한 것

### 1. Background location task 분리

- `tasks/locationTask.ts` 에서 `TaskManager.defineTask()` 를 모듈 최상위에 등록
- 러닝 중일 때만 background 위치 이벤트를 수신
- 좌표는 Zustand store에 직접 쓰지 않고 `AsyncStorage` 에 버퍼링
- 장시간 러닝을 고려해 background 좌표 버퍼를 최대 `5000`개로 제한

### 2. Foreground / background 추적 역할 분리

- `hooks/useLocationTracking.ts`
- 평소에는 foreground 위치 추적 유지
- 러닝 시작 시 `startLocationUpdatesAsync()` 로 background 위치 수집 시작
- 러닝 종료 시 background task 중지 및 임시 key 정리

### 3. Foreground 복귀 동기화

- `lib/syncBackgroundLocations.ts`
- background 동안 저장된 좌표 배열을 읽어서 거리와 경과 시간을 계산
- foreground 복귀 시 Zustand 러닝 상태에 누적 반영
- 솔로 러닝 기록 경로와 진행 거리 배열도 함께 append

### 4. STOMP 위치 전송 보완

- `hooks/running/useStomp.ts`
- 앱이 active 상태가 아니거나 소켓이 끊긴 경우 위치 frame을 즉시 버리지 않고 buffer에 저장
- foreground 복귀 또는 재연결 후 순서대로 flush

### 5. Android foreground notification

- 러닝 중 Android foreground service notification 표시
- 알림 body에 `거리 / 시간 / 페이스` 표시
- foreground에서는 주기적으로, background에서는 위치 이벤트 기준으로 알림 내용 갱신
- Android 13+ 대응을 위해 `POST_NOTIFICATIONS` 권한 요청 추가

### 6. Background 진입 직전 알림 갱신

- 앱이 `active -> background` 로 바뀌는 순간
- 현재 거리/시간 기준으로 notification body를 먼저 갱신
- 그 다음 background offset / 위치 버퍼를 저장하도록 순서 조정

## 주요 기술 선택 이유

### `expo-task-manager` + `expo-location`

- Expo managed workflow 안에서 background location 을 구현하려면 표준 경로에 가깝다.
- foreground 전용인 `watchPositionAsync()` 를 그대로 유지하는 것보다 러닝 앱 요구사항에 맞다.

### `AsyncStorage` 버퍼링

- background task 내부에서 store 직접 접근을 피할 수 있다.
- foreground 복귀 시점에 안전하게 거리/시간/좌표를 재계산할 수 있다.

### STOMP 재전송 buffer

- iOS/Android background 상태에서 WebSocket 지속 연결을 신뢰하지 않는 방향이 더 안전하다.
- 실시간성이 잠깐 깨져도, foreground 복귀 후 전송 유실을 줄일 수 있다.

## 구현하면서 신경 쓴 점

- background task 안에서 Zustand store 직접 접근 금지
- AppState 전환 시점과 background task 시점을 분리
- foreground UX는 최대한 유지하고 러닝 중일 때만 background 추적 로직 활성화
- Android notification 갱신 주기를 과도하게 짧게 두지 않고 throttle 적용

## 현재 남아 있는 한계

- GPS drift 필터가 완전하지 않아 정지 상태에서도 작은 거리 증가가 생길 수 있다.
- 알림 갱신은 초단위 실시간 ticker가 아니라 위치 이벤트 + throttle 기반이다.
- Expo dev build 환경 기준이며 Expo Go 에서는 background location / task 검증이 어렵다.
- Android 제조사별 배터리 정책, 알림 정책 차이로 실제 표시 방식이 달라질 수 있다.

## 이력서용 포인트

- Expo 기반 러닝 앱에서 foreground 중심 위치 추적을 background 지속 추적으로 확장
- background 위치 버퍼링과 foreground 복귀 동기화 구조 설계
- WebSocket 비연속 구간을 고려한 위치 frame buffer / 재전송 흐름 구현
- Android foreground notification 에 러닝 지표 연동

## 블로그용 포인트

- `watchPositionAsync()` 만으로는 러닝 앱 background 요구사항을 만족하기 어려운 이유
- Expo managed workflow 에서 `TaskManager.defineTask()` 를 어디에 둬야 하는지
- background task 에서 store를 직접 쓰지 않고 `AsyncStorage` 를 중간 버퍼로 둔 이유
- foreground 복귀 후 거리/시간/경로를 다시 합치는 방식
- Android foreground service notification 을 러닝 지표와 연결한 과정
