import { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { GoPencil } from 'react-icons/go';
import { MdDeleteOutline } from 'react-icons/md';
import { useChat } from '../context/chat/UseChat';

interface ChatOptionsProps {
  title: string;
  chatId: string;
}

export const ChatOptions = ({ title, chatId }: ChatOptionsProps) => {
  const { removeChat, renameTitle } = useChat();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'menu' | 'rename' | 'deleteConfirm'>('menu');
  const [newTitle, setNewTitle] = useState(title);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonAnimationStyle =
    'cursor-pointer transition-transform hover:scale-110 active:scale-90';

  // Close dropdown/modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setMode('menu');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRenameConfirm = async () => {
    if (newTitle.trim() !== '') {
      await renameTitle(newTitle, chatId);
    }
    setOpen(false);
    setMode('menu');
  };

  const handleDeleteConfirm = async () => {
    await removeChat(chatId);
    setOpen(false);
    setMode('menu');
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          setOpen(!open);
          setMode('menu');
        }}
        className="rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700 p-1
                   dark:text-neutral-300 cursor-pointer"
      >
        <BsThreeDotsVertical />
      </button>

      {/* Modal for rename/delete */}
      {open && (mode === 'rename' || mode === 'deleteConfirm') ? (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div
            className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg w-11/12 max-w-md shadow-lg
                          border-2 border-neutral-300 dark:border-neutral-800"
          >
            {mode === 'rename' && (
              <div className="flex flex-col gap-4">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter new title..."
                  className="p-2 rounded border border-gray-300 dark:border-stone-800 border-2
                             dark:bg-neutral-800 focus:outline-none w-full dark:text-neutral-100"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setMode('menu')}
                    className={`px-4 py-2 text-sm rounded-3xl dark:text-neutral-400 font-bold
                               hover:dark:bg-neutral-800 ${buttonAnimationStyle} hover:dark:text-neutral-100
                               `}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRenameConfirm}
                    className={`px-4 py-2 text-sm rounded-3xl border-1 dark:border-stone-700 
                               dark:text-neutral-100 font-bold ${buttonAnimationStyle} border-neutral-400`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
            {mode === 'deleteConfirm' && (
              <div className="flex flex-col gap-1">
                <span className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                  This will delete the chat. Are you sure?
                </span>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setMode('menu')}
                    className={`px-4 py-2 text-sm rounded-3xl dark:text-neutral-400 font-bold
                               hover:bg-neutral-300 hover:dark:bg-neutral-800 ${buttonAnimationStyle}
                               hover:dark:text-neutral-100`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className={`px-4 py-2 text-sm rounded-3xl border-1 dark:border-stone-700 
                               dark:text-neutral-100 font-bold ${buttonAnimationStyle} border-neutral-400
                               text-red-600 hover:bg-red-200 dark:hover:text-black dark:hover:bg-red-600
                               hover:border-red-300 hover:dark:border-red-800`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Small menu dropdown
        open && (
          <div
            className="absolute right-0 mt-2 z-50 w-38 bg-neutral-100 dark:bg-neutral-900 border-2
                       border-neutral-300 dark:border-neutral-800 rounded-xl shadow-lg"
          >
            <button
              onClick={() => setMode('rename')}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-neutral-200
                        dark:text-neutral-100 dark:hover:bg-neutral-700 cursor-pointer rounded-t-xl"
            >
              <GoPencil size={16} />
              Rename
            </button>
            <button
              onClick={() => setMode('deleteConfirm')}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 
                         hover:bg-red-200 dark:hover:text-black dark:hover:bg-red-600
                         rounded-b-lg cursor-pointer"
            >
              <MdDeleteOutline size={16} />
              Delete
            </button>
          </div>
        )
      )}
    </div>
  );
};
