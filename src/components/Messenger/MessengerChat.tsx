import { useState, useRef, useEffect, useMemo } from "react";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "@/hooks/useAuth";
import { Camera, File, Info, Mic, Phone, Smile, Video } from "lucide-react";
import "@/styles/components/_messengerChat.scss";
import { formatRelativeTime } from "@/utils/formatTimestamp";
import { getMessages } from "@/services/chatService";
import {
	Conversation,
	Message,
	WebSocketMessageDTO,
} from "@/models/Conversation";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Link } from "react-router-dom";
import { UserDTO } from "@/models/UserModel";

interface MesssageChatProps {
	conversation: Conversation | null;
}

const MesssageChat = ({ conversation }: MesssageChatProps) => {
	const { user } = useAuth();
	const otherUser = conversation?.user;

	const userInfo = useMemo(() => {
		if (!user) return null;
		return {
			id: user.id,
			fullName: user.fullName,
			avatar: user.avatar ?? "",
			isBanned: false,
		};
	}, [user]);

	const participantInfo = useMemo(() => {
		if (!conversation?.user) return null;
		return {
			id: conversation.user.id,
			fullName: conversation.user.fullName,
			avatar: conversation.user.avatar ?? "",
			isBanned: false,
		};
	}, [conversation]);

	const [chat, setChat] = useState<Message[]>([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [text, setText] = useState("");
	const [emojiOpen, setEmojiOpen] = useState(false);
	const [img, setImg] = useState<{ file: File | null; url: string }>({
		file: null,
		url: "",
	});
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const endRef = useRef<HTMLDivElement | null>(null);

	const { connected, messages, sendMessage } = useWebSocket({
		token: localStorage.getItem("accessToken")!,
		userId: user?.id,
		channelId: conversation?.id,
	});

	const loadMessages = async (targetPage: number, appendToTop = false) => {
		if (!conversation || loading || !hasMore) return;
		setLoading(true);

		const container = scrollContainerRef.current;
		const prevScrollHeight = container?.scrollHeight || 0;

		try {
			const data = await getMessages(conversation.id, targetPage);

			if (data.content.length === 0) {
				setHasMore(false);
			} else {
				const newMessages = data.content.reverse();
				setChat((prev) =>
					appendToTop ? [...newMessages, ...prev] : [...prev, ...newMessages]
				);
				setPage(targetPage + 1);
			}
		} catch (err) {
			console.error("Load message failed:", err);
		} finally {
			setLoading(false);
			if (container && appendToTop) {
				const newScrollHeight = container.scrollHeight;
				container.scrollTop = newScrollHeight - prevScrollHeight;
			}
		}
	};
	// Khi đổi conversation, reset chat và scroll xuống cuối cùng
	useEffect(() => {
		if (!conversation) return;

		setChat([]);
		setPage(0);
		setHasMore(true);

		(async () => {
			await loadMessages(0, false);
			console.log(chat);

			setTimeout(() => {
				endRef.current?.scrollIntoView({ behavior: "auto" });
			}, 100);
		})();
	}, [conversation]);

	// Khi scroll container, nếu scroll lên đầu sẽ load thêm tin nhắn cũ
	const handleScroll = () => {
		const container = scrollContainerRef.current;
		if (!container || loading || !hasMore) return;

		if (container.scrollTop < 100) {
			loadMessages(page, true);
		}
	};

	useEffect(() => {
		if (!messages) return;
		const newMessages = Array.isArray(messages) ? messages : [messages];

		const container = scrollContainerRef.current;
		if (!container) return;

		const isNearBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight <
			100;

			const normalized = newMessages.map(normalizeMessage);
		setChat((prev) => [...prev, ...normalized]);

		if (isNearBottom) {
			setTimeout(() => {
				endRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 100);
		}
	}, [messages]);

	const handleEmoji = (e: { emoji: string }) => {
		setText((prev) => prev + e.emoji);
		setEmojiOpen(false);
	};

	const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImg({
				file: e.target.files[0],
				url: URL.createObjectURL(e.target.files[0]),
			});
		}
	};

	const normalizeMessage = (msg: WebSocketMessageDTO) => {
		const senderId = parseInt(msg.sender);

		let sender: UserDTO | null = null;

		if (senderId === userInfo?.id) {
			sender = userInfo;
		} else if (senderId === participantInfo?.id) {
			sender = participantInfo;
		}

		return {
			id: msg.id,
			content: msg.content,
			sender: sender ?? {
				id: senderId,
				fullName: "Unknown",
				avatar: "",
				isBanned: false,
			},
			createdAt: new Date(msg.timestamp).toISOString(),
			images: [],
			channelId: msg.channelId,
			type: msg.type || "CHAT",
		};
	};

	const handleSend = () => {
		if (!text.trim()) return;
		sendMessage(text.trim());
		setText("");
	};

	return (
		<>
			{conversation ? (
				<div className="message-chat">
					<div className="top">
						<div className="user">
							{otherUser && (
								<>
									<img src={otherUser.avatar} alt={otherUser.fullName} />
									<div className="texts">
										<span>
											<Link to={`/user/${otherUser.id}`}>
												{otherUser.fullName}
											</Link>
										</span>
										{/* <p>Đang hoạt động</p> */}
									</div>
								</>
							)}
						</div>
						<div className="icons">
							<Phone />
							<Video />
							<Info />
						</div>
					</div>

					<div
						className="center"
						onScroll={handleScroll}
						ref={scrollContainerRef}
					>
						{!hasMore && <p className="last-message">Tin nhắn cũ nhất</p>}
						{loading && <p className="loading-message">Đang tải thêm...</p>}
						{chat.map((message) => (
							<div
								key={message.id}
								className={
									message.sender.id === user?.id ? "message own" : "message"
								}
							>
								<img
									src={message.sender.avatar}
									alt={message.sender.fullName}
									className="avatar"
								/>
								<div className="texts">
									{message.images?.map((imgUrl, i) => (
										<img key={i} src={imgUrl} alt="attachment" />
									))}
									<p>{message.content}</p>
									<span>{formatRelativeTime(message.createdAt)}</span>
								</div>
							</div>
						))}
						{img.url && (
							<div className="message own">
								<div className="texts">
									<img src={img.url} alt="preview" />
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
							<input type="file" id="file" hidden onChange={handleImg} />
							<Camera />
							<Mic />
						</div>
						<input
							type="text"
							value={text}
							onChange={(e) => setText(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSend()}
							placeholder={connected ? "Type a message..." : "Connecting..."}
							disabled={!connected}
						/>
						<div className="emoji">
							<button onClick={() => setEmojiOpen(!emojiOpen)}>
								<Smile />
							</button>
							{emojiOpen && (
								<div className="picker">
									<EmojiPicker open={emojiOpen} onEmojiClick={handleEmoji} />
								</div>
							)}
						</div>
						<button className="sendButton" onClick={handleSend}>
							Send
						</button>
					</div>
				</div>
			) : (
				<div className="message-chat">
					<img src="" alt="" />
				</div>
			)}
		</>
	);
};

export default MesssageChat;
