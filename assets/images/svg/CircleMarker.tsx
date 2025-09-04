import { hexToRgba } from '@/lib/hexToRgba';
import React from 'react';
import Svg, { Circle, SvgProps } from 'react-native-svg';

interface GlowingCircleMarkerProps extends SvgProps {
  size?: number;
  color?: string;
  glowColor?: string;
}




const CircleMarker = ({
  size = 24,
  color = '#6500A8', // 기본 보라색
  glowColor,         // glowColor를 직접 받을 수도 있음
  ...props
}: GlowingCircleMarkerProps) => {
  const center = 12;
  const glowRadius = 11;
  const circleRadius = 8;

  // color prop을 기반으로 glowColor를 자동으로 생성합니다. (투명도 40%)
  const derivedGlowColor = hexToRgba(color, 0.4);

  // 사용자가 glowColor를 직접 전달하면 그 값을 사용하고,
  // 전달하지 않으면 위에서 자동으로 계산한 값을 사용합니다.
  const finalGlowColor = glowColor || derivedGlowColor;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      <Circle
        cx={center}
        cy={center}
        r={glowRadius}
        fill={finalGlowColor} // 최종 glowColor 적용
      />
      <Circle
        cx={center}
        cy={center}
        r={circleRadius}
        fill={color}
      />
    </Svg>
  );
};

export default CircleMarker;