import "./userInfo.css";
const UserInfo = () => {
	return (
		<div className="userInfo">
			<div className="user">
				<img src={currentUser?.avatar || ""} alt="" />
				<h2>{currentUser?.username}</h2>
			</div>
			<div className="icons">
				<img src="" alt="" />
				<img src="" alt="" />
				<img src="" alt="" />
			</div>
		</div>
	);
};

export default UserInfo;
