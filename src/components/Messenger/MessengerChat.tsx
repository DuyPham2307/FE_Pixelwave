import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "@/hooks/useAuth";
import { Camera, File, Info, Mic, Phone, Smile, Video } from "lucide-react";
import "@/styles/components/_messengerChat.scss";
import { formatRelativeTime } from "@/utils/formatTimestamp";

interface MessageProps {
	chatUser: {
		id: number;
		avatar: string;
		fullName: string;
	};
	content: string;
	createdAt: string;
}

const MesssageChat = () => {
	const messageList: MessageProps[] = [
		{
			chatUser: {
				id: 1,
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
				fullName: "Alice Nguyen",
			},
			content: "Chào bạn! Hôm nay bạn thế nào?",
			createdAt: "2025-05-24T08:30:00Z",
		},
		{
			chatUser: {
				id: 2,
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
				fullName: "Minh Tran",
			},
			content: "Mình ổn, cảm ơn Alice. Còn bạn?",
			createdAt: "2025-05-24T08:31:00Z",
		},
		{
			chatUser: {
				id: 1,
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
				fullName: "Alice Nguyen",
			},
			content: "Mình cũng ổn. Trưa nay có muốn đi ăn không?",
			createdAt: "2025-05-24T08:32:10Z",
		},
		{
			chatUser: {
				id: 2,
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
				fullName: "Minh Tran",
			},
			content: "Có chứ! Đi đâu đây?",
			createdAt: "2025-05-24T08:33:30Z",
		},
		{
			chatUser: {
				id: 1,
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
				fullName: "Alice Nguyen",
			},
			content: "Thử quán phở mới ở góc đường Trần Hưng Đạo nhé?",
			createdAt: "2025-05-24T08:35:00Z",
		},
		{
			chatUser: {
				id: 2,
				avatar:
					"https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
				fullName: "Minh Tran",
			},
			content: "Nghe ngon đó. 12 giờ gặp nhé!",
			createdAt: "2025-05-24T08:36:15Z",
		},
	];

	const { user } = useAuth();

	const [chat, setChat] = useState<MessageProps[]>(messageList);
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const [img, setImg] = useState<{ file: File | null; url: string }>({
		file: null,
		url: "",
	});

	const endRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [endRef]);

	const handleEmoji = (e: { emoji: string }) => {
		setText((prev) => prev + e.emoji);
		setOpen(false);
	};

	const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImg({
				file: e.target.files[0],
				url: URL.createObjectURL(e.target.files[0]),
			});
		}
	};

	const handleSend = async () => {};

	return (
		<div className="message-chat">
			<div className="top">
				<div className="user">
					<img src={user?.avatar} alt="" />
					<div className="texts">
						<span>{user?.fullName}</span>
						<p>Lorem ipsum</p>
					</div>
				</div>
				<div className="icons">
					<Phone />
					<Video />
					<Info />
				</div>
			</div>
			<div className="center">
				{chat?.map((message) => (
					<div
						className={
							message.chatUser.id === user?.id ? "message own" : "message"
						}
						key={message?.createdAt}
					>
						<div className="texts">
							{/* {message?.img && <img src={message.img} alt="" />} */}
							<p>{message.content}</p>
							<span>{formatRelativeTime(message.createdAt)}</span>
						</div>
					</div>
				))}
				{img.url && (
					<div className="message own">
						<div className="texts">
							<img src={img.url} alt="" />
						</div>
					</div>
				)}
				<div ref={endRef}></div>
			</div>
			<div className="bottom">
				<div className="icons">
					<label htmlFor="file">
						<File />
					</label>
					<input
						type="file"
						id="file"
						style={{ display: "none" }}
						onChange={handleImg}
					/>
					<Camera />
					<Mic />
				</div>
				<input type="text" placeholder="Text somethings" />
				<div className="emoji">
					<button onClick={() => setOpen(!open)}>
						<Smile />
					</button>
					<div className="picker">
						<EmojiPicker open={open} onEmojiClick={handleEmoji} />
					</div>
				</div>
				<button className="sendButton" onClick={handleSend}>
					Send
				</button>
			</div>
		</div>
	);
};

export default MesssageChat;
