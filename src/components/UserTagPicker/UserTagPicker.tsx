import React, { useEffect, useState } from "react";
import { UserDTO } from "@/models/UserModel";
import { getListFriends } from "@/services/friendService";
import { useAuth } from "@/hooks/useAuth";
import '@/styles/components/_userTagPicker.scss'

interface Props {
	selectedUserIds: number[] | null;
	onClose: () => void;
	onSave: (selectedIds: number[]) => void;
}

const UserTagPicker: React.FC<Props> = ({selectedUserIds, onClose, onSave }) => {
	const [users, setUsers] = useState<UserDTO[]>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>(selectedUserIds || []);
  const {user} = useAuth();
  const userId = user?.id;

	useEffect(() => {
		const fetchFriend = async () => {
			if (userId !== undefined) {
				const data = await getListFriends(userId); // lấy danh sách tất cả người dùng
				setUsers(data);
			}
		};
		fetchFriend();
	}, [userId]);

  console.log(users);
  
	const toggleSelect = (id: number) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
		);
	};

	return (
		<div className="tag-user-modal">
			<h3>Tag Users</h3>
			<ul>
				{users.map((user) => (
					<li key={user.id} onClick={() => toggleSelect(user.id)}>
						<img src={user.avatar} alt={user.fullName} />
						<span>{user.fullName}</span>
						{selectedIds.includes(user.id) && <span>✔️</span>}
					</li>
				))}
			</ul>
			<div className="modal-actions">
				<button onClick={onClose}>Cancel</button>
				<button onClick={() => onSave(selectedIds)}>Save</button>
			</div>
		</div>
	);
};

export default UserTagPicker;
