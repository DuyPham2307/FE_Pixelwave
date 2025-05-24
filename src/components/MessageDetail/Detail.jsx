import "./detail.css";

const MessageDetail = () => {

	return (
		<div className="message-detail">
			<div className="user">
				<img src={user?.avatar || "./avatar.png"} alt="" />
				<h2>{user?.username}</h2>
				<p>Lorem ipsum dolor</p>
			</div>
			<div className="info">
				<div className="option">
					<div className="title">
						<span>Chat Setting</span>
						<img src="./arrowUp.png" alt="" />
					</div>
				</div>
				<div className="option">
					<div className="title">
						<span>Share Photo</span>
						<img src="./arrowUp.png" alt="" />
					</div>
					<div className="photos">
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://www.life-source.org/wp-content/uploads/2022/11/The-Grieving-Process.jpg"
									alt=""
								/>
								<span>name photo</span>
							</div>
							<img src="./download.png" alt="" className="icon" />
						</div>
					</div>
					<div className="photos">
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://www.life-source.org/wp-content/uploads/2022/11/The-Grieving-Process.jpg"
									alt=""
								/>
								<span>name photo</span>
							</div>
							<img src="./download.png" alt="" className="icon" />
						</div>
					</div>
					<div className="photos">
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://www.life-source.org/wp-content/uploads/2022/11/The-Grieving-Process.jpg"
									alt=""
								/>
								<span>name photo</span>
							</div>
							<img src="./download.png" alt="" className="icon" />
						</div>
					</div>
					<div className="photos">
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://www.life-source.org/wp-content/uploads/2022/11/The-Grieving-Process.jpg"
									alt=""
								/>
								<span>name photo</span>
							</div>
							<img src="./download.png" alt="" className="icon" />
						</div>
					</div>
					<div className="photos">
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://www.life-source.org/wp-content/uploads/2022/11/The-Grieving-Process.jpg"
									alt=""
								/>
								<span>name photo</span>
							</div>
							<img src="./download.png" alt="" className="icon" />
						</div>
					</div>
				</div>
				<div className="option">
					<div className="title">
						<span>Shared Files</span>
						<img src="./arrowUp.png" alt="" />
					</div>
				</div>
				<button onClick={handleBlock}>
					{isCurrentUserBlocked
						? "You Are Blocked"
						: isReceiverBlocked
						? "User Blocked"
						: "Block User"}
				</button>
				<button className="logout" onClick={() => auth.signOut()}>
					Logout
				</button>
			</div>
		</div>
	);
};

export default MessageDetail;
