import { useEffect, useRef } from "react";

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback); // 최신 콜백을 유지 (클로저 문제 해결)

  useEffect(() => {
    savedCallback.current = callback; 
  }, [callback]); // 콜백이 바뀔 때마다 최신값으로 업데이트

  useEffect(() => {
    function tick() {
      savedCallback.current(); // 항상 최신 콜백 호출
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id); // 컴포넌트 언마운트/업데이트 시 clear
    }
  }, [delay]); // delay가 바뀌면 새 interval 생성
}

export default useInterval;