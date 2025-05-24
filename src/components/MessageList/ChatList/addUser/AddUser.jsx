import "./addUser.css";
import { useState } from "react";

const AddUser = () => {
	const [user, setUser] = useState(null);
	const {currentUser} = useUserStore();

	const handleSearch = async (e) => {

	};

	const handleAdd = async () => {
	}

	return (
		<div className="addUser">
			<form onSubmit={handleSearch}>
				<input type="text" name="username" placeholder="Username" />
				<button>Search</button>
			</form>
			{user && <div className="user">
				<div className="detail">
					<img src={user.avatar || "./avatar.png"} alt="" />
					<p>{user.username}</p>
				</div>
				<button onClick={handleAdd}>Add User</button>
			</div>}
		</div>
	);
};

export default AddUser;
