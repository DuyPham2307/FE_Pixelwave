import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";
import "@/styles/components/_messengerList.scss";
import { Search } from "lucide-react";

interface User {
	id: number;
	avatar: string;
	fullName: string;
}
interface ChatProps {
	sender: User;
	content: string;
	createAt: string;
	updateAt: string;
}

const MessengerList: React.FC = () => {
	const sampleData: ChatProps[] = [
		{
			sender: {
				id: 1,
				fullName: "Test",
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
			},
			createAt: "2025-05-20T10:12:34Z",
			updateAt: "2025-05-20T10:12:34Z",
			content: "Hello! How are you?",
		},
		{
			sender: {
				id: 1,
				fullName: "Test",
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
			},
			createAt: "2025-05-20T10:12:34Z",
			updateAt: "2025-05-20T10:12:34Z",
			content: "Hello! How are you?",
		},
		{
			sender: {
				id: 1,
				fullName: "Test",
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
			},
			createAt: "2025-05-20T10:12:34Z",
			updateAt: "2025-05-20T10:12:34Z",
			content: "Hello! How are you?",
		},
		{
			sender: {
				id: 1,
				fullName: "Test",
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
			},
			createAt: "2025-05-20T10:12:34Z",
			updateAt: "2025-05-20T10:12:34Z",
			content: "Hello! How are you?",
		},
		{
			sender: {
				id: 1,
				fullName: "Test",
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
			},
			createAt: "2025-05-20T10:12:34Z",
			updateAt: "2025-05-20T10:12:34Z",
			content: "Hello! How are you?",
		},
		{
			sender: {
				id: 1,
				fullName: "Test",
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
			},
			createAt: "2025-05-20T10:12:34Z",
			updateAt: "2025-05-20T10:12:34Z",
			content: "Hello! How are you?",
		},
	];

	const { user } = useAuth();

	const [chats, setChats] = useState<ChatProps[]>(sampleData);
	const [input, setInput] = useState("");
	const [selectedChat, setSelectedChat] = useState<number | null>(null);

	// const filteredChats = chats.filter((chat) => chat.sender.fullName === input);

	const handleSelect = (userId: number) => {
		setSelectedChat(userId);
		console.log(selectedChat);
	};

	return (
		<div className="message-list">
			{/* <div className="userInfo">
				<div className="user">
					<img src={user?.avatar || ""} alt="" />
					<h2>{user?.fullName}</h2>
				</div>
			</div> */}
			<div className="chatList">
				<div className="search">
					<div className="searchBar">
						<Search />
						<input
							type="text"
							placeholder="Search"
							onChange={(e) => setInput(e.target.value)}
						/>
					</div>
				</div>

				{chats.map((chat) => (
					<div
						className="item"
						// key={chat.sender.id}
						onClick={() => handleSelect(chat.sender.id)}
					>
						<img src={chat.sender.avatar} alt="" />
						<div className="texts">
							<span>{chat.sender.fullName}</span>
							<p>{chat.content}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default MessengerList;
