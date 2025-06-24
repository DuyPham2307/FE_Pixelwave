import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEffect } from "react";
import { NotificationDTO } from "@/models/Notification";

interface NotificationSocketConfig {
  token: string;
  userId: number | undefined | null;
  onNotification: (noti: NotificationDTO) => void;
}

export function useNotificationSocket({ token, userId, onNotification }: NotificationSocketConfig) {
  useEffect(() => {
    if (!token || !userId) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        client.subscribe(
          `/user/queue/notifications/${userId}`,
          (message) => {
            const body = JSON.parse(message.body);
            onNotification(body);
          }
        );       
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, [token, userId]);
}
