function calculateBMI(weight: number | undefined, height: number | undefined): number | null {
  // 입력값 검증
  if (weight === undefined || height === undefined) {
    return null;
  }
  
  if (weight <= 0 || height <= 0) {
    return null;
  }
  
  // BMI 계산 (체중(kg) / 신장(m)²)
  const bmi = weight / (height * height);
  
  // 소수점 둘째 자리까지 반올림
  return Math.round(bmi * 100) / 100;
}

export default calculateBMI