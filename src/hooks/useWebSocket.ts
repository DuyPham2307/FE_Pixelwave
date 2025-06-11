import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEffect, useRef, useState } from "react";

interface WebSocketConfig {
	token: string;
	channelId: string;
	userId: number;
}

export function useWebSocket(config: WebSocketConfig) {
	const [connected, setConnected] = useState(false);
	const [messages, setMessages] = useState<any[]>([]);
	const clientRef = useRef<Client | null>(null);

	useEffect(() => {
		if (!config.token || !config.channelId) return;

		const socket = new SockJS("http://localhost:8080/ws");
		const client = new Client({
			webSocketFactory: () => socket,
			connectHeaders: {
				Authorization: `Bearer ${config.token}`,
			},
			onConnect: () => {
				setConnected(true);

				client.subscribe(
					`/topic/conversation/${config.channelId}`,
					(message) => {
						const body = JSON.parse(message.body);
            console.log("📨 Server returned:", body);
            console.log("📨 Server returned:", message);
            
						setMessages((prev) => [...prev, body]);
					}
				);

				client.subscribe(
					`/user/queue/notifications/${config.userId}`,
					(message) => {
						console.log("🔔 Notification:", JSON.parse(message.body));
					}
				);
			},
			onDisconnect: () => {
				setConnected(false);
				console.log("Disconnected");
			},
			debug: (str) => {
				console.log("STOMP DEBUG:", str);
			},
		});

		client.activate();
		clientRef.current = client;

		return () => {
			client.deactivate();
		};
	}, [config.token, config.channelId, config.userId]);

	const sendMessage = (text: string) => {
		if (!clientRef.current || !clientRef.current.connected) return;

		const message = {
			sender: config.userId.toString(),
			content: text,
		};

		clientRef.current.publish({
			destination: `/app/conversation/${config.channelId}`,
			body: JSON.stringify(message),
			headers: {
				Authorization: `Bearer ${config.token}`,
			},
		});
	};

	return { connected, messages, sendMessage };
}
