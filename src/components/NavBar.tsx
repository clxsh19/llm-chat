import { FaCircle } from 'react-icons/fa6';
import { HiOutlineMoon } from 'react-icons/hi2';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { logout } from '../firebase/authService';
import { useAuth } from '../context/auth/UseAuth';
import { useChat } from '../context/chat/UseChat';

type NavBarProps = {
  isDark: boolean;
  toggleDarkMode: () => void;
  setShowMobileSideBar: () => void;
  showAuthModal: () => void;
};

export default function NavBar({
  setShowMobileSideBar,
  isDark,
  toggleDarkMode,
  showAuthModal,
}: NavBarProps) {
  const { user } = useAuth();
  const { selectRoom } = useChat();
  const buttonAnimationStyle =
    'cursor-pointer transition-transform hover:scale-116 active:scale-90';
  const darkStyle = 'dark:text-neutral-300 dark:hover:bg-neutral-800';
  const lightStyle = 'text-neutral-800 hover:bg-neutral-200';

  async function handleLogout() {
    await logout();
    selectRoom(null);
  }

  return (
    <header className="flex-shrink-0 p-4 bg-white dark:bg-neutral-900 flex justify-between items-center">
      {/* Left group */}
      <div>
        {/* Mobile only sidebar toggle */}
        <button
          className={`p-2 ${lightStyle} ${darkStyle} rounded-full border-neutral-300 border-1
                      lg:hidden dark:border-neutral-800 rounded-lg ${buttonAnimationStyle}`}
          onClick={setShowMobileSideBar}
        >
          <RiMenuUnfoldLine size={19} strokeWidth={1} />
        </button>
      </div>

      {/* Right group dark mode toggle and auth button */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleDarkMode}
          className="border-1 border-neutral-400 dark:border-neutral-300 rounded-full cursor-pointer mt-1"
        >
          {isDark ? (
            <FaCircle
              className="transition-transform scale-90 hover:scale-70 text-neutral-300
                         active:scale-140"
              size={24}
            />
          ) : (
            <HiOutlineMoon
              className="transition-transform p-1 hover:scale-130 text-neutral-800
                          active:scale-80"
              size={26}
            />
          )}
        </button>

        <button
          onClick={user ? handleLogout : showAuthModal}
          className="py-1 px-4 text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 
                    dark:hover:text-neutral-100 rounded-full border-1 font-extrabold border-neutral-300
                    dark:border-neutral-700 cursor-pointer transition-transform hover:scale-105
                    active:scale-94"
        >
          {user ? 'LogOut' : 'LogIn'}
        </button>
      </div>
    </header>
  );
}
