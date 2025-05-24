import React from 'react';
import MessengerList from '@/components/Messenger/MessengerList';
import MesssageChat from '@/components/Messenger/MessengerChat';
import '@/styles/pages/_messager.scss'

const Messenger: React.FC = () => {
  return (
    <div className="messanger">
      <MessengerList />
      <MesssageChat />
    </div>
  );
};

export default Messenger;