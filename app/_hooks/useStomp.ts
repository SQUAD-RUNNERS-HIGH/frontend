import { useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';

type LocationData = {
  longitude: number;
  latitude: number;
};

export function useStomp(courseId: string, onMessage: (data: LocationData) => void) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://runners-high.shop/running',
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      forceBinaryWSFrames: true, 
      appendMissingNULLonIncoming: true, 
  heartbeatOutgoing: 10000,
  debug: (str) => console.log(`[STOMP DEBUG] ${str}`),
    });
    
    client.activate();
    clientRef.current = client;
    client.onStompError = (frame) => {
      console.error('[STOMP] Broker reported error:', frame.headers['message']);
      console.error('[STOMP] Additional details:', frame.body);
    };
    client.onConnect = () => {
      console.log('Client Connected?', clientRef.current?.connected); // 여기서 true여야 정상
      // 개인 위치 응답 구독
      client.subscribe('/user/queue/reply', (message: IMessage) => {
        const data: LocationData = JSON.parse(message.body);
        onMessage(data);
        console.log('connect');
      });
    };
    client.onDisconnect =  () => {
      console.log('웹소켓 연결이 끊어졌어용');
    },
    client.onWebSocketClose = (event: CloseEvent) => {
      console.warn('[STOMP] WebSocket closed:', event);
      console.warn('[STOMP] Code:', event.code);
      console.warn('[STOMP] Reason:', event.reason);
      console.warn('[STOMP] WasClean:', event.wasClean);
    };
    client.onWebSocketError = (event) => {
      console.error('[STOMP] WebSocket error:', event);
    };
    


    return () => {
      client.deactivate();
    };
  }, [courseId, onMessage]);

  const sendLocation = (location: LocationData) => {
    if (clientRef.current && clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/${courseId}`,
        body: JSON.stringify(location),
      });
    } else {
      console.warn('STOMP client not connected');
    }
  };

  return {
    sendLocation,
  };
}
