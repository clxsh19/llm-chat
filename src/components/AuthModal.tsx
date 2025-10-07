import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdClose } from 'react-icons/md';
import { useAuth } from '../context/auth/UseAuth';
import { signup, login, loginWithGoogle } from '../firebase/authService';

// define schema for form
const authSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Use 6 characters at least' }),
});

type AuthFormData = z.infer<typeof authSchema>;
type AuthModalProps = {
  onClose: () => void;
  isOpen: boolean;
};

export default function AuthModal({ onClose, isOpen }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLogin) {
        await login(data.email, data.password);
      } else {
        await signup(data.email, data.password);
      }
      alert('Success!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      alert('Google login success!');
    } catch (err: any) {
      alert(err.message);
    }
  };
  const buttonAnimationStyle =
    'cursor-pointer transition-transform scale-96 hover:scale-100 active:scale-90';
  const darkStyle = 'dark:text-neutral-300 dark:hover:bg-neutral-800';
  const lightStyle = 'text-neutral-800 hover:bg-neutral-200';

  if (!isOpen || user) return null;

  return (
    /* full-screen container catches outside clicks */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose} // <-- click anywhere in this container closes modal
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="relative w-full max-w-sm bg-neutral-100 dark:bg-neutral-900 border-3 
                   border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-lg 
                   transition-all duration-300 p-8
                   md:h-auto h-9/10 flex flex-col justify-center"
        onClick={(e) => e.stopPropagation()} // <-- do NOT close when clicking inside here
      >
        <button
          onClick={onClose}
          className={`p-2 absolute top-3 right-4 ${lightStyle}
                        border-neutral-300 dark:border-neutral-800 ${darkStyle}
                        border-1 ${buttonAnimationStyle} rounded-full`}
        >
          <MdClose size={18} />
        </button>

        {/* form content here */}
        <h2 className="mt-1 text-neutral-900 dark:text-neutral-100 text-xl font-bold text-center">
          {isLogin ? 'LogIn' : 'SignUp'}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="p-3 outline-2 outline-neutral-200 dark:outline-neutral-800 rounded-xl w-full
                       text-neutral-900 dark:text-neutral-100 hover:outline-neutral-200
                       dark:hover:outline-neutral-800 hover:outline-3"
          />
          {errors.email && (
            <p className="text-red-500 font-bold text-sm">
              {errors.email.message}
            </p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register('password')}
            className="p-3 outline-2 outline-neutral-200 dark:outline-neutral-800 rounded-xl w-full
                       text-neutral-900 dark:text-neutral-100 hover:outline-neutral-200
                       dark:hover:outline-neutral-800 hover:outline-3"
          />
          {errors.password && (
            <p className="text-red-500 font-bold text-sm">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${buttonAnimationStyle} bg-slate-300 dark:bg-slate-800 w-full rounded-3xl
                        p-3 outline-2 outline-slate-300 dark:outline-slate-700 rounded-xl w-full
                       text-neutral-900 dark:text-neutral-100 hover:outline-slate-400
                       dark:hover:outline-slate-600 hover:outline-2 font-bold`}
          >
            {isLogin ? 'LogIn' : 'SignUp'}
          </button>
        </form>
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 dark:text-blue-400 underline cursor-pointer"
          >
            {isLogin ? 'SignUp' : 'LogIn'}
          </button>
        </p>
        <span className="my-3 text-center font-bold text-gray-600 dark:text-gray-300">
          or
        </span>
        <button
          type="button"
          onClick={handleGoogle}
          className={`${buttonAnimationStyle} bg-red-400 dark:bg-red-900 w-full rounded-3xl
                        p-3 outline-2 outline-red-300 dark:outline-red-700 rounded-xl w-full
                       text-neutral-900 dark:text-neutral-100 hover:outline-red-500
                       dark:hover:outline-red-600 hover:outline-2 font-bold`}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
