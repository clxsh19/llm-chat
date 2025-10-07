import { useChat } from '../context/chat/UseChat';
import { useEffect, useRef } from 'react';
import { type MessageType } from '../type';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function ChatRoomView() {
  const { messages, aiThinking } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Always render the container, show welcome conditionally inside
  return (
    <div className="md:px-3 mb-4 flex-1 flex-col mx-auto max-w-3xl">
      {!messages || messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-blue-500 dark:text-blue-600">
            What can i do for you?
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Send a message to start chatting.
          </p>
        </div>
      ) : (
        <>
          {messages.map((m) => (
            <MessageBubble key={m.createdAt + m.sender} message={m} />
          ))}
          {aiThinking && (
            <div className="flex items-start space-x-2 animate-[slideUp_0.4s_ease-out]">
              <div className="p-3 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-blue-500 dark:bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 dark:bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 dark:bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>
                  <span className="text-gray-600 dark:text-neutral-300 text-sm">
                    Thinking
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

function MessageBubble({ message }: { message: MessageType }) {
  const isUser = message.sender === 'user';

  const align = isUser ? 'items-end' : 'items-start';
  const textAlign = isUser ? 'text-right' : 'text-left';

  return (
    <div className={`flex flex-col ${align} w-full`}>
      <div
        className={`${
          isUser
            ? 'mb-2 px-5 py-3 max-w-[80%] bg-zinc-100 dark:bg-zinc-900 text-gray-800 dark:text-gray-200 \
               border-2 border-zinc-200 dark:border-zinc-800 rounded-l-3xl rounded-b-3xl user-bubble'
            : 'mt-2 p-2 w-full bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 markdown-container'
        } whitespace-normal break-all text-pretty text-justify `}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {message.text}
        </ReactMarkdown>
      </div>
      <div className={`text-xs text-gray-600 dark:text-gray-400 ${textAlign}`}>
        {new Date(message.createdAt).toLocaleTimeString()}
      </div>
    </div>
  );
}
