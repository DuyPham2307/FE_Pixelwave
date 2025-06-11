import React, { useEffect, useState } from "react";
import MessengerList from "@/components/Messenger/MessengerList";
import MesssageChat from "@/components/Messenger/MessengerChat";
import "@/styles/pages/_messager.scss";
import { Conversation } from "@/models/Conversation";
import { getConversations } from "@/services/chatService";

const Messenger: React.FC = () => {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation | null>(null);

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const data = await getConversations(); // gọi API
				setConversations(data);
			} catch (err) {
				console.error("Lỗi khi lấy danh sách trò chuyện", err);
			}
		};

		fetchConversations();
	}, []);

	useEffect(() => {
		if (conversations) setSelectedConversation(conversations[0]);
		console.log(conversations);
		
	}, [conversations]);

	return (
		<div className="messanger">
			<MessengerList
				conversations={conversations}
				onSelectConversation={setSelectedConversation}
				selectedConversationId={selectedConversation?.id || ""}
			/>

			<MesssageChat conversation={selectedConversation} />
		</div>
	);
};

export default Messenger;
