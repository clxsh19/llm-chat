import { LuSquarePen } from 'react-icons/lu';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { MdClose } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import { SiBnbchain } from 'react-icons/si';
import { BiMessage } from 'react-icons/bi';
import { useChat } from '../context/chat/UseChat';
import { useAuth } from '../context/auth/UseAuth';
import SearchBar from './SearchBar';
import { ChatOptions } from './ChatOptions';
import { useState } from 'react';
import { type ChatroomType } from '../type';

type SideBarProps = {
  showSideBar: boolean;
  setShowSideBar: (value: boolean) => void;
  showMobileSideBar: boolean;
  setShowMobileSideBar: (value: boolean) => void;
};
const buttonAnimationStyle =
  'cursor-pointer transition-transform hover:scale-116 active:scale-90';
const darkStyle = 'dark:text-neutral-300 dark:hover:bg-neutral-800';
const lightStyle = 'text-neutral-800 hover:bg-neutral-200';

export default function SideBar({
  showSideBar,
  setShowSideBar,
  showMobileSideBar,
  setShowMobileSideBar,
}: SideBarProps) {
  const { chatrooms, selectRoom, selectedRoom } = useChat();
  const { user } = useAuth();
  const userChatRooms = chatrooms.filter((room) => room.userId === user?.uid);
  const [showSearch, setShowSearch] = useState(false);

  function onSetShowSearch(show: boolean) {
    setShowSearch(show);
  }

  return (
    <>
      {/* Desktop SideBar */}
      <div
        className={`hidden lg:flex flex flex-col h-screen border-r-gray-300 
        dark:bg-neutral-900 dark:border-r-stone-800 transition-all duration-300
        ${showSideBar ? 'w-64' : 'w-18'} border-r border-neutral-800 flex-shrink-0`}
      >
        {/* Minified icons only if sidebar is collapsed */}
        {!showSideBar && (
          <div className="mt-5 flex flex-col gap-4 items-center justify-between">
            <button
              onClick={() => setShowSideBar(true)}
              className={`p-2 ${lightStyle} ${darkStyle} rounded-full border-1
                          border-neutral-300 dark:border-neutral-800 rounded-lg ${buttonAnimationStyle}`}
            >
              <RiMenuUnfoldLine size={19} strokeWidth={1} />
            </button>
            <button
              onClick={() => {
                setShowSideBar(true);
                setShowSearch(true);
              }}
              className={`p-2 ${lightStyle} ${darkStyle} rounded-full border-1
                        border-neutral-300 dark:border-neutral-800 rounded-full ${buttonAnimationStyle}`}
            >
              <FiSearch size={18} strokeWidth={3} />
            </button>
            <button
              onClick={() => selectRoom(null)}
              className={`p-2 ${lightStyle} ${darkStyle} rounded-full border-1
                       border-neutral-300 dark:border-neutral-800 rounded-lg ${buttonAnimationStyle}`}
            >
              <LuSquarePen size={16} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Expanded content */}
        {showSideBar && (
          <SideBarInternals
            setShowSideBar={setShowSideBar}
            selectChatId={selectRoom}
            userChatRooms={userChatRooms}
            selectedRoom={selectedRoom}
            showSearch={showSearch}
            onSetShowSearch={onSetShowSearch}
          />
        )}
      </div>

      {/* Mobile */}
      <div className="fixed inset-0 z-20 lg:hidden pointer-events-none ">
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 esae-in-out 
                ${showMobileSideBar ? 'opacity-100 pointer-events-auto z-20' : 'opacity-0 pointer-events-none '}`}
          onClick={() => setShowMobileSideBar(false)}
        ></div>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-78 bg-white rounded-r-2xl dark:bg-neutral-900 p-1 
                transform transition-transform duration-400 ease-in-out
                ${showMobileSideBar ? 'translate-x-0  pointer-events-auto z-30' : '-translate-x-full pointer-events-none z-10'}`}
        >
          {showMobileSideBar && (
            <SideBarInternals
              setShowSideBar={setShowMobileSideBar}
              selectChatId={selectRoom}
              userChatRooms={userChatRooms}
              selectedRoom={selectedRoom}
              showSearch={showSearch}
              onSetShowSearch={onSetShowSearch}
            />
          )}
        </div>
      </div>
    </>
  );
}

function SideBarInternals({
  setShowSideBar,
  selectChatId,
  userChatRooms,
  selectedRoom,
  showSearch,
  onSetShowSearch,
}: {
  setShowSideBar: (value: boolean) => void;
  selectChatId: (id: string | null) => void;
  userChatRooms: ChatroomType[];
  selectedRoom: string | null;
  showSearch: boolean;
  onSetShowSearch: (show: boolean) => void;
}) {
  return (
    <div className="flex flex-col h-full gap-6 p-4">
      {/* close button and logo */}
      <div className="flex items-center justify-between">
        <div className="text-neutral-800 dark:text-neutral-300">
          <SiBnbchain size={26} />
        </div>
        <button
          onClick={() => setShowSideBar(false)}
          className={`p-2 flex items-center justify-center w-9 h-9 ${lightStyle}
                        border-neutral-300 dark:border-neutral-800 ${darkStyle}
                        border-1 ${buttonAnimationStyle} rounded-full`}
        >
          <MdClose size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {/* Search Bar */}
        <SearchBar showSearch={showSearch} setShowSearch={onSetShowSearch} />

        {/* New Chat */}
        <button
          onClick={() => selectChatId(null)}
          className="px-3 py-2 gap-3 flex items-center text-neutral-800 dark:text-neutral-100 
                     rounded-full bg-neutral-200 border-neutral-300 hover:border-neutral-100
                     dark:bg-neutral-800 border-1 dark:border-neutral-800 cursor-pointer
                     hover:border-2 dark:hover:border-neutral-700 text-neutral-800
                     dark:text-neutral-200 font-bold"
        >
          <LuSquarePen strokeWidth={3} />
          <span className="text-sm">Chat</span>
        </button>
      </div>

      {/* Recent Chats */}
      <div className="flex flex-col ml-2 gap-y-2 h-full overflow-y-auto">
        <h2
          className="flex font-bold items-center gap-2 dark:text-neutral-300
                       text-neutral-700"
        >
          <BiMessage size={16} strokeWidth={2} />
          <span>Recent</span>
        </h2>
        <div className="flex-1 flex flex-col gap-1">
          {userChatRooms.map((room) => (
            <div
              key={room.id}
              className={`flex items-center justify-between gap-1 hover:bg-neutral-200
                          text-left px-3 dark:hover:bg-neutral-800 rounded-full
                          ${
                            room.id == selectedRoom
                              ? 'bg-neutral-300 dark:bg-neutral-700 \
                          border-2 border-neutral-300 dark:border-neutral-600'
                              : ''
                          }`}
            >
              {/* Chat room button (left) */}
              <button
                onClick={() => {
                  selectChatId(room.id);
                }}
                className="py-2 flex-1 dark:text-neutral-100
                 text-sm cursor-pointer truncate text-left"
              >
                {room.title}
              </button>

              {/* Menu button (right) */}
              <ChatOptions title={room.title} chatId={room.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
