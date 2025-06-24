import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEffect, useRef, useState } from "react";

interface MessageSocketConfig {
	token: string | null;
	userId: number | undefined | null;
	channelId: string | undefined | null;
}

export function useMessageSocket(config: MessageSocketConfig) {
	const subscriptionRef = useRef<StompSubscription | null>(null);
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
				const subscription = client.subscribe(
					`/topic/conversation/${config.channelId}`,
					(message) => {
						const body = JSON.parse(message.body);
						setMessages((prev) => [...prev, body]);
					}
				);
				console.log("📨 Connected to conversation channel:", config.channelId);
				// 👉 Lưu subscription để hủy khi channelId thay đổi
				clientRef.current = client;
				subscriptionRef.current = subscription;
			},
			onDisconnect: () => {
				setConnected(false);
				console.log("📨 Deconnect to conversation channel:", config.channelId);
				subscriptionRef.current?.unsubscribe();
			},
		});

		client.activate();
		clientRef.current = client;

		return () => {
			subscriptionRef.current?.unsubscribe();
			client.deactivate();
		};
	}, [config.token, config.channelId]);

	const sendMessage = (text: string) => {
		if (!clientRef.current?.connected) return;

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
