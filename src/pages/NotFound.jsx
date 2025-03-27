
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fade-in">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle size={48} className="text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <button 
          onClick={() => navigate("/")}
          className="btn-primary inline-flex items-center"
        >
          <Home size={18} className="mr-2" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
