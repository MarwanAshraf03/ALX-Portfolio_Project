import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (apiService.isAuthenticated()) {
      navigate('/auctions');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Auction Platform</h1>
        <p className="text-xl text-muted-foreground">
          Discover amazing items and place your bids
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/login')} size="lg">
            Login
          </Button>
          <Button onClick={() => navigate('/signup')} variant="outline" size="lg">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;