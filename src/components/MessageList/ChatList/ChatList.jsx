import { useEffect, useState } from "react";
import "./chatList.css";

const ChatList = () => {
	const [addMode, setAddMode] = useState(false);
	const [chats, setChats] = useState([]);
	const [input, setInput] = useState("");

	useEffect(() => {
		console.log("Updated chats:", chats);
	}, [chats]);

	const filteredChats = chats.filter((c) =>
		c.user.username.toLowerCase().includes(input.toLowerCase())
	);

	return (
		<div className="chatList">
			<div className="search">
				<div className="searchBar">
					<img src="./search.png" alt="" />
					<input
						type="text"
						placeholder="Search"
						onChange={(e) => setInput(e.target.value)}
					/>
				</div>
				<img
					src={addMode ? "./minus.png" : "./plus.png"}
					alt=""
					className="add"
					onClick={() => setAddMode(!addMode)}
				/>
			</div>

			{filteredChats.map((chat) => (
				<div
					className="item"
					key={chat.chatdId}
					onClick={() => handleSelect(chat)}
					style={{
						backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
					}}
				>
					<img
						src={
							chat.user.blocked.includes(currentUser.id)
								? "./avatar.png"
								: chat.user.avatar || "./avatar.png"
						}
						alt=""
					/>
					<div className="texts">
						<span>
							{chat.user.blocked.includes(currentUser.id)
								? "User"
								: chat.user.username}
						</span>
						<p>{chat.lastMessage}</p>
					</div>
				</div>
			))}
			{addMode && <AddUser />}
		</div>
	);
};

export default ChatList;
