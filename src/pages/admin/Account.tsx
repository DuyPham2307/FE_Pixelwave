import React, { useState } from "react";
import "@/styles/pages/_account.scss";
import {
	ArrowLeftFromLine,
	CircleSlash,
	MailWarning,
	Search,
} from "lucide-react";

type UserDTO = {
	id: number;
	fullName: string;
	avatar: string;
};

const mockUsers: UserDTO[] = [
	{
		id: 1,
		fullName: "Alice Johnson",
		avatar: "https://i.pravatar.cc/100?img=1",
	},
	{ id: 2, fullName: "Bob Smith", avatar: "https://i.pravatar.cc/100?img=2" },
	{
		id: 3,
		fullName: "Charlie Brown",
		avatar: "https://i.pravatar.cc/100?img=3",
	},
	{
		id: 4,
		fullName: "Diana Prince",
		avatar: "https://i.pravatar.cc/100?img=4",
	},
	{
		id: 5,
		fullName: "Edward Norton",
		avatar: "https://i.pravatar.cc/100?img=5",
	},
	{
		id: 6,
		fullName: "Fiona Gallagher",
		avatar: "https://i.pravatar.cc/100?img=6",
	},
	{
		id: 7,
		fullName: "George Clooney",
		avatar: "https://i.pravatar.cc/100?img=7",
	},
	{
		id: 8,
		fullName: "Hannah Baker",
		avatar: "https://i.pravatar.cc/100?img=8",
	},
	{
		id: 9,
		fullName: "Ian Somerhalder",
		avatar: "https://i.pravatar.cc/100?img=9",
	},
	{
		id: 10,
		fullName: "Julia Roberts",
		avatar: "https://i.pravatar.cc/100?img=10",
	},
	{
		id: 11,
		fullName: "Kevin Hart",
		avatar: "https://i.pravatar.cc/100?img=11",
	},
	{
		id: 12,
		fullName: "Laura Palmer",
		avatar: "https://i.pravatar.cc/100?img=12",
	},
	{
		id: 13,
		fullName: "Michael Scott",
		avatar: "https://i.pravatar.cc/100?img=13",
	},
	{
		id: 14,
		fullName: "Nina Dobrev",
		avatar: "https://i.pravatar.cc/100?img=14",
	},
	{
		id: 15,
		fullName: "Oscar Isaac",
		avatar: "https://i.pravatar.cc/100?img=15",
	},
	{
		id: 16,
		fullName: "Pam Beesly",
		avatar: "https://i.pravatar.cc/100?img=16",
	},
	{
		id: 17,
		fullName: "Quentin Tarantino",
		avatar: "https://i.pravatar.cc/100?img=17",
	},
	{
		id: 18,
		fullName: "Rachel Green",
		avatar: "https://i.pravatar.cc/100?img=18",
	},
	{
		id: 19,
		fullName: "Steve Rogers",
		avatar: "https://i.pravatar.cc/100?img=19",
	},
	{ id: 20, fullName: "Tina Fey", avatar: "https://i.pravatar.cc/100?img=20" },
];

const Account: React.FC = () => {
	const [users] = useState<UserDTO[]>(mockUsers);
	const [selectedUser, setSelectedUser] = useState<UserDTO | null>(1);
	const [query, setQuery] = useState<string>("");

	// Danh sách lọc theo từ khóa
	const filteredUsers = users.filter((user) =>
		user.fullName.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<div className="account">
			<div className="search-bar">
				<Search size={18} />
				<input
					type="text"
					placeholder="Search by name..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</div>

			<div className="account-container">
				<div className={`user-list ${selectedUser ? "shrinked" : ""}`}>
					{filteredUsers.map((user) => (
						<div
							key={user.id}
							className="user-card"
							onClick={() => setSelectedUser(user)}
						>
							<img src={user.avatar} alt={user.fullName} />
							<span>{user.fullName}</span>
						</div>
					))}
				</div>

				<div className={`user-detail ${selectedUser ? "expanded" : ""}`}>
					{selectedUser && (
						<>
							<button
								onClick={() => setSelectedUser(null)}
								style={{ marginBottom: "1rem" }}
							>
								<ArrowLeftFromLine />
							</button>
							<img src={selectedUser.avatar} alt={selectedUser.fullName} />
							<h3>{selectedUser.fullName}</h3>
							<p>ID: {selectedUser.id}</p>
							<p>Times reported: nth times</p>
							<p>
								List reported post:{" "}
								<button>
									<i>View more</i>
								</button>
							</p>
							<div className="actions">
								<button className="ban-btn">
									<CircleSlash /> Ban
								</button>
								<button className="warn-btn">
									<MailWarning /> Warning
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Account;
