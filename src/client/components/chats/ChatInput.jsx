import React, { useState } from 'react';

function ChatInput({ chatId, addMessage }) {
  const [textInputs, setTextInputs] = useState('');

  const onChangeChatInput = ({ target: { value } }) => {
    //用来control用户在聊天中的输入
    event.preventDefault();
    setTextInputs(value);
  };

  const handleKeyPress = ({ key }) => {
    //用来响应回车事件

    if (key === 'Enter' && textInputs.length) {
      addMessage({
        variables: { message: { text: textInputs, chatId } },
        optimisticResponse: {
          //指定fake的返回值,一定写否则不会更新页面
          __typename: 'mutation',
          addMessage: {
            __typename: 'Message',
            text: textInputs,
            id: -1,
            user: {
              __typename: 'User',
              id: -1,
            },
          },
        },
      }).then(() => {
        setTextInputs('');
      });
    }
  }; //回车时候才发送addMessage mutation

  return (
    <div className='input'>
      <input
        type='text'
        value={textInputs}
        onChange={onChangeChatInput}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}

export default ChatInput;
