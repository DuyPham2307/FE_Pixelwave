import { useAuth } from "@/hooks/useAuth";
import '@/styles/components/_userCard.scss'

const UserCardPost = () => {
  const { user } = useAuth();
  const { fullName, avatar } = user;
  return (
    <div className="userCardPost">
      <img src={avatar} alt="Avatar" className="avatar" />
      <span className="fullname">{fullName}</span>
    </div>
  );
};

export default UserCardPost;
