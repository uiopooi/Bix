import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-indigo-600">Bix</h1>
          <p className="mt-2 text-sm text-gray-600">Share your moments with the world</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}