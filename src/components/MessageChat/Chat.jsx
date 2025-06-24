import { useState, useRef, useEffect } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";

const MesssageChat = () => {
	const [chat, setChat] = useState();
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const [img, setImg] = useState({
		file: null,
		url: "",
	});

	const endRef = useRef();

	useEffect(() => {
		endRef.current.scrollIntoView({ behavior: "smooth" });
	}, [endRef]);

	const handleEmoji = (e) => {
		setText((prev) => prev + e.emoji);
		setOpen(false);
	};

	const handleImg = (e) => {
		if (e.target.files[0]) {
			setImg({
				file: e.target.files[0],
				url: URL.createObjectURL(e.target.files[0]),
			});
		}
	};

	const handleSend = async () => {
	};

	return (
		<div className="message-chat">
			<div className="top">
				<div className="user">
					<img src={user?.avatar || "./avatar.png"} alt="" />
					<div className="texts">
						<span>{user?.username}</span>
						<p>Lorem ipsum</p>
					</div>
				</div>
				<div className="icons">
					<img src="./phone.png" alt="" />
					<img src="./video.png" alt="" />
					<img src="./info.png" alt="" />
				</div>
			</div>
			<div className="center">
				{chat?.messages?.map((message) => (
					<div className={message.senderId === currentUser.id ? "message own" : "message" } key={message?.createAt}>
						<div className="texts">
							{message?.img && <img src={message.img} alt="" />}
							<p>{message.text}</p>
							<span>{message.createdAt}</span>
						</div>
					</div>
				))}
				{img.url && <div className="message own">
					<div className="texts">
						<img src={img.url} alt="" />
					</div>
				</div>}
				<div ref={endRef}></div>
			</div>
			<div className="bottom">
				<div className="icons">
					<label htmlFor="file">
						<img src="./img.png" alt="" />
					</label>
					<input
						type="file"
						id="file"
						style={{ display: "none" }}
						onChange={handleImg}
					/>
					<img src="./camera.png" alt="" />
					<img src="./mic.png" alt="" />
				</div>
				<input
					type="text"
					value={text}
					placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" :  "Type some text..."}
					onChange={(e) => setText(e.target.value)}
					disabled={isCurrentUserBlocked || isReceiverBlocked}
				/>
				<div className="emoji">
					<img src="./emoji.png" alt="" onClick={() => setOpen(!open)} />
					<div className="picker">
						<EmojiPicker open={open} onEmojiClick={handleEmoji} />
					</div>
				</div>
				<button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
					Send
				</button>
			</div>
		</div>
	);
};

export default MesssageChat;
