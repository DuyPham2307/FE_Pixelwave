import React, { useState } from "react";
import "@/styles/components/_messengerList.scss";
import { Search } from "lucide-react";
import { Conversation } from "@/models/Conversation";
import { formatRelativeTime } from "@/utils/formatTimestamp";

interface MessengerListProps {
  conversations: Conversation[];
  onSelectConversation: (conv: Conversation) => void;
  selectedConversationId: string;
}

const MessengerList: React.FC<MessengerListProps> = ({
	conversations,
	onSelectConversation,
	selectedConversationId,
}) => {
	const [searchUserName, setSearchUserName] = useState<string>("");

	const filteredChats = conversations.filter((chat) =>
		chat.user.fullName.match(searchUserName)
	);

	return (
		<div className="message-list">
			<div className="chatList">
				<div className="search">
					<div className="searchBar">
						<Search />
						<input
							type="text"
							placeholder="Search"
							onChange={(e) => setSearchUserName(e.target.value)}
						/>
					</div>
				</div>

				{conversations.length > 0 ? (
					filteredChats.map((chat) => (
						<div
							className={`item ${chat.id === selectedConversationId ? "active" : ""}`}
							key={chat.id}
							onClick={() => onSelectConversation(chat)}
						>
							<img src={chat.user.avatar} alt="" />
							<div className="texts">
								<span>{chat.user.fullName}</span>
								<p>{formatRelativeTime(chat.lastUpdated ?? "")}</p>
							</div>
						</div>
					))
				) : (
					<div
						className="item"
						// key={chat.sender.id}
					>
						<div className="texts">
							<span>Chưa có bạn bè hay cuộc trò chuyện nào</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MessengerList;
