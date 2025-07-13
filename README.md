# 🏃‍♀️ Runners-High

[![GitHub Repo](https://img.shields.io/badge/GitHub-frontend-blue?logo=github)](https://github.com/SQUAD-RUNNERS-HIGH/frontend)

> **러닝 크루 전용 애플리케이션**  
> 졸업작품으로 진행한 실시간 러닝 크루 플랫폼입니다.  
> 위치 기반 서비스, 실시간 경쟁 기능, 크루 생성/참여 기능 등을 통해 사용자들이 함께 달리고 경쟁할 수 있습니다.

---

## 기술 스택

- **Framework & Language**: React Native (Expo), TypeScript
- **상태 관리**: Zustand, React Query
- **폼 관리 및 유효성 검사**: React Hook Form, Zod
- **지도 및 위치 서비스**: Google Maps API, Google Places API, Expo-location
- **실시간 통신**: WebSocket (STOMP)
- **기타**: Axios, Reanimated 등

---
## 주요 기능
### 1. 지도 기반 코스 탐색 및 상세 정보 제공
- Google Maps 기반 지도 UI
- 현재 위치 기반 주변 러닝 코스 조회
- 각 코스에 대한 고도 그래프, 예상 소모 칼로리, 거리 제공
- 위치 검색 기능 (Google Places API)

### 2. 실시간 위치 추적 및 경쟁
- 사용자의 현재 위치와 속도 지속 추적
- 목표 속도 및 과거 러닝 기록과 실시간 비교
- 음성으로 경쟁 상황 피드백 제공
- STOMP 기반 실시간 위치 전송 및 상대 비교

### 3. 러닝 코스 기반 크루 러닝
- 동일 코스 내 다른 과거 사용자들과 함께 러닝
- 러닝 전 위치 공유 및 준비 상태 공유
- 러닝 중 각 사용자 위치/진행도 실시간 표시

### 4. 크루 시스템
- 크루 생성, 이미지 업로드 포함
- 크루 가입 신청 및 승인
- 크루 탈퇴, 삭제 등 관리 기능 제공

## 시연

# 목표 페이스 경쟁 러닝(코스만들기)
![페이스러닝_cropped (1) (1)](https://github.com/user-attachments/assets/8f904b1d-b574-4cb9-a7c7-c8ac57a2b5f2)

# 과거 경쟁자와 달리기
![경쟁자와 달리기 (2)](https://github.com/user-attachments/assets/c75b24c0-3fb7-4276-a07c-6cb8d991211a)

# 크루 가입 & 지원
![크루 가입   지원_cropped (1)](https://github.com/user-attachments/assets/907180b8-0ae2-446c-9333-5bebc32a6f4e)


