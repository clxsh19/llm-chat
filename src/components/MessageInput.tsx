import { useState, useEffect, useRef } from 'react';
import { TbUpload } from 'react-icons/tb';
import { FaArrowUp } from 'react-icons/fa';
import { useChat } from '../context/chat/UseChat';
import { useAuth } from '../context/auth/UseAuth';
import { generateAIResponse } from '../firebase/geminiService';

export default function MessageInput() {
  const {
    selectedRoom,
    addNewChat,
    sendMessage,
    aiThinking,
    selectAiThinking,
    selectRoom,
  } = useChat();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // reset
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px'; // max-height: 150px
    }
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!text.trim() || aiThinking) return;

    let chatId = selectedRoom;
    if (user && !selectedRoom) {
      const title =
        text.trim().length > 40
          ? text.trim().slice(0, 40) + '...'
          : text.trim();

      chatId = (await addNewChat(title)) || null;
      selectRoom(chatId);
    }

    if (!chatId) chatId = '-2';

    await sendMessage(chatId, text, 'user');
    setText('');

    try {
      selectAiThinking(true);
      const result = await generateAIResponse(text);
      if (result) {
        await sendMessage(chatId, result, 'ai');
      } else {
        console.error('No response received from the server');
      }
    } catch (err: any) {
      console.error(`Failed to fetch response: ${err.message}`);
    } finally {
      selectAiThinking(false);
    }
  };

  return (
    <div className="flex mx-2 mb-4">
      <div
        className="mx-auto  bg-neutral-100 max-w-3xl w-full flex flex-col border-2 
        border-neutral-300 shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:border-1 dark:bg-neutral-900 
        dark:border-neutral-800 rounded-3xl p-2"
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="custom-scrollbar-hidden w-full p-4 rounded-xl dark:bg-neutral-900
              text-black dark:text-white focus:outline-none resize-none"
          placeholder="What do you want to know?"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <div className="flex justify-between items-center p-1">
          <div></div>
          {/* <button */}
          {/*   className="p-2 text-gray-600 dark:text-gray-300 transition-transform  */}
          {/*              hover:scale-115 active:scale-90 cursor-pointer" */}
          {/* > */}
          {/*   <TbUpload size={18} strokeWidth={3} /> */}
          {/* </button> */}

          <button
            className="p-2 bg-neutral-800 text-neutral-200 dark:text-neutral-800 
            rounded-full transition-transform hover:scale-115 active:scale-90
            dark:bg-neutral-200 cursor-pointer disabled:bg-neutral-400"
            onClick={handleSend}
            disabled={aiThinking}
          >
            <FaArrowUp size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
