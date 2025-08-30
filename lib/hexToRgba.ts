/**
 * Hex 색상 코드를 RGBA 문자열로 변환하는 헬퍼 함수
 * @param hex - #RRGGBB 형식의 색상 코드
 * @param alpha - 0과 1 사이의 투명도 값
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  // # 기호 제거
  let c = hex.substring(1);
  
  // 3자리 hex코드(#F03)를 6자리(#FF0033)로 확장
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }

  // 16진수를 10진수로 변환
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};