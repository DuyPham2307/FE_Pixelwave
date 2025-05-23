import { UserDTO } from "@/models/UserModel";
import {
	getBlockedUsers,
	getFollowers,
	getListFriends,
} from "@/services/friendService";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import '@/styles/components/_listUserRelationshipModal.scss'

interface ListUserRelationshipProps {
	userId: number;
	type: string;
	onClose: () => void;
}

const ListUserRelationship: React.FC<ListUserRelationshipProps> = ({
	userId,
	type,
	onClose,
}) => {
	const [listUsers, setListUsers] = useState<UserDTO[]>([]);

	useEffect(() => {
		const fetchUserList = async (): Promise<void> => {
			try {
				if (type === "friend") {
					const data = await getListFriends(userId);
					setListUsers(data);
				} else if (type === "follower") {
					const data = await getFollowers(userId);
					setListUsers(data);
				} 
        // else if (type === "block") {
				// 	const data = await getBlockedUsers(userId);
				// 	setListUsers(data);
				// }
        console.log("Relation type: ", type);
        console.log("list: ", listUsers)  ;
        
        
        toast.success("get user relationship success!")
			} catch (error) {
				console.log(error);
				toast.error("get user relationship fail!");
			}
		};

    fetchUserList()
	}, [type, userId]);

	return (
		<div className="list-relationship-modal">
			<div className="modal-overlay" onClick={onClose}></div>
			<div className="list-relationships">
        <h1>{type}</h1>
				{listUsers.map((dataItem) => (
					<div className="item-relationship" key={dataItem.id}>
						<img src={dataItem.avatar} alt="" />
						<span className="item-name"><a href={`/user/${dataItem.id}`}>{dataItem.fullName}</a></span>
					</div>
				))}
			</div>
		</div>
	);
};

export default ListUserRelationship;
