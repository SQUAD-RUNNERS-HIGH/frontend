export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return '저체중';
  if (bmi < 23) return '정상체중'; // 아시아 기준
  if (bmi < 25) return '과체중';
  if (bmi < 30) return '경도비만';
  return '고도비만';
};

export function calculateBMI(weight: number | undefined, height: number | undefined): string | null {
  // 입력값 검증
  if (weight === undefined || height === undefined) {
    return null;
  }

  if (weight <= 0 || height <= 0) {
    return null;
  }
  const heightInMeters = height / 100; // cm를 m로 변환

  // BMI 계산 (체중(kg) / 신장(m)²)
  const bmi = weight / (heightInMeters * heightInMeters);
  console.log(bmi);
  const category = getBMICategory(bmi);
  // 소수점 둘째 자리까지 반올림
  return `${category} (${Math.round(bmi * 100) / 100})`;
}
