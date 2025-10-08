import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import SideBar from './SideBar';
import MessageInput from './MessageInput';
import { ToastContainer } from 'react-toastify';

export default function Layout({
  showAuthModal,
  children,
}: {
  showAuthModal: () => void;
  children: React.ReactNode;
}) {
  const [showSideBar, setShowSideBar] = useState(false);
  const [showMobileSideBar, setShowMobileSideBar] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('isDark') === 'true';
  });

  useEffect(() => {
    // get the root and toggle the dark class on it
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // toggle isDark value in localStorage for presistence
    localStorage.setItem('isDark', isDark.toString());
  }, [isDark]);

  return (
    <div className="flex bg-white dark:bg-neutral-900 flex h-screen w-full overflow-hidden">
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        theme={isDark ? 'dark' : 'light'}
      />
      <SideBar
        showSideBar={showSideBar}
        setShowSideBar={setShowSideBar}
        showMobileSideBar={showMobileSideBar}
        setShowMobileSideBar={setShowMobileSideBar}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar
          isDark={isDark}
          toggleDarkMode={() => setIsDark(!isDark)}
          setShowMobileSideBar={() => setShowMobileSideBar(true)}
          showAuthModal={showAuthModal}
        />

        <main className="p-4 flex-1 w-full text-center bg-white dark:bg-neutral-900 overflow-y-auto">
          {children}
        </main>
        <MessageInput />
      </div>
    </div>
  );
}
