import { useNavigate } from 'react-router-dom';
export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center text-center p-6">
      <div>
        <h1 className="text-8xl font-extrabold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-text-muted mb-8">The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-primary mx-auto">Go Home</button>
      </div>
    </div>
  );
}
