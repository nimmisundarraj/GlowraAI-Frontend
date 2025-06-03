const SSO_PROVIDERS = ["google"];

const Login = () => {
  const handleSSOLogin = (provider: string) => {
    window.location.href = `${import.meta.env.VITE_API_URL_LOCAl}/auth/login/${provider}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 space-y-4">
      <h1 className="text-2xl font-bold">Login to GlowraAI</h1>
      {SSO_PROVIDERS.map((provider) => (
        <button
          key={provider}
          onClick={() => handleSSOLogin(provider)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md w-60 hover:bg-blue-700"
        >
          Login with {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default Login;
