import { useState, useEffect } from 'react';
import { useChat } from '../context/chat/UseChat';
import type { ChatroomType } from '../type';
import { FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

interface SearchBarProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}

export default function SearchBar({
  showSearch,
  setShowSearch,
}: SearchBarProps) {
  const { chatrooms, selectRoom } = useChat();
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<ChatroomType[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce local search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!query.trim()) {
        setFiltered([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = chatrooms.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase()),
      );
      setFiltered(res);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [query, chatrooms]);

  return (
    <div>
      {/* Trigger Button */}
      <div
        onClick={() => setShowSearch(true)}
        className="px-3 py-2 gap-3 flex items-center text-neutral-100 rounded-full
                   bg-slate-400 border-slate-300 hover:border-slate-200
                   dark:bg-zinc-900 border dark:border-neutral-800 cursor-pointer
                   dark:hover:border-neutral-700 hover:border-2 text-neutral-800
                   dark:text-neutral-200 font-bold"
      >
        <FiSearch strokeWidth={3} />
        <span className="text-sm">Search</span>
      </div>

      {/*Search Popup */}
      {showSearch && (
        <div className="fixed inset-0 z-100 bg-black/30 flex rounded-xl lg:rounded-none items-center justify-center">
          <div
            className="bg-white dark:bg-neutral-900 shadow-xl rounded-r-2xl lg:rounded-xl
                       w-full h-full lg:max-h-3/4 lg:max-w-md p-4 flex flex-col
                       lg:border-3 lg:border-neutral-300 lg:dark:border-neutral-700"
          >
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold dark:text-neutral-200 ">Search Chats</h2>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setQuery('');
                  setFiltered([]);
                }}
                className="p-2 -mt-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800
                          cursor-pointer transition-transform hover:scale-116 active:scale-90
                          text-neutral-900 dark:text-neutral-100"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-3xl border-3 border-neutral-300
                         dark:border-neutral-700 dark:bg-neutral-800 text-neutral-900
                         dark:text-neutral-100 focus:outline-none"
              autoFocus
            />

            {/* Results */}
            <div className="mt-4 flex-1 overflow-y-auto">
              {loading ? (
                <p className="text-sm text-neutral-500 text-center mt-4">
                  Searching...
                </p>
              ) : filtered.length > 0 ? (
                filtered.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => {
                      selectRoom(room.id);
                      setShowSearch(false);
                      setQuery('');
                    }}
                    className="py-2 rounded-3xl px-3 font-medium hover:bg-neutral-200 dark:hover:bg-neutral-80
                              cursor-pointer user-bubble border border-white border-b-neutral-300
                              dark:border-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {room.title}
                  </div>
                ))
              ) : query.length > 0 ? (
                <p className="text-sm text-neutral-500 text-center mt-4">
                  No matches found
                </p>
              ) : (
                <p className="text-sm text-neutral-500 text-center mt-4">
                  Start typing to search
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
