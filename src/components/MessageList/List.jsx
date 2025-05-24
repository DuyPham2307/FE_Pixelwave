import './list.css'
import UserInfo from './UserInfo/UserInfo';
import ChatList from './ChatList/ChatList';

const MessageList = () => {
  return (
    <div className='message-list'>
      <UserInfo />
      <ChatList />
    </div>
  )
}

export default MessageList
