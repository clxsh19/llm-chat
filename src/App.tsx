import { useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import { AuthProvider } from './context/auth/AuthProvider';
import { ChatProvider } from './context/chat/ChatProvider';
import AuthModal from './components/AuthModal';
import ChatRoomView from './components/ChatRoomView';
import { ToastContainer } from 'react-toastify';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            isOpen={showAuthModal}
          />
        )}
        <ChatProvider>
          <Layout showAuthModal={() => setShowAuthModal(true)}>
            <ChatRoomView />
          </Layout>
        </ChatProvider>
      </AuthProvider>
    </>
  );
}

export default App;
