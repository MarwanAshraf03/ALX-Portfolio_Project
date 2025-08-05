import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Auction {
  id: string;
  title: string;
  description?: string;
  startingPrice: number;
  currentBid?: number;
  bidIncrement: number;
  startDate?: string;
  endDate: string;
  imageUrl?: string;
  status?: string;
  createdBy?: string;
}

const Auctions = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!apiService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    fetchAuctions();
  }, [navigate]);

  const fetchAuctions = async () => {
    try {
      const response = await apiService.getAuctions();
      if (response.success && Array.isArray(response.data)) {
        setAuctions(response.data as Auction[]);
      } else {
        toast({ 
          title: 'Error', 
          description: 'Failed to load auctions',
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Something went wrong',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBid = async (auctionId: string) => {
    try {
      const response = await apiService.placeBid(auctionId);
      if (response.success) {
        toast({ title: 'Bid placed successfully!' });
        fetchAuctions(); // Refresh auction list
      } else {
        toast({ 
          title: 'Bid failed',
          description: response.message || 'Failed to place bid',
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Something went wrong',
        variant: 'destructive' 
      });
    }
  };

  const handleLogout = async () => {
    await apiService.logOut();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div>Loading auctions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Auction Platform</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin')} variant="outline">
              Admin Panel
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Active Auctions</h2>
          <p className="text-muted-foreground">Place your bids on available items</p>
        </div>

        {auctions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No auctions available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <Card key={auction.id} className="overflow-hidden">
                {auction.imageUrl && (
                  <div className="aspect-video bg-muted">
                    <img 
                      src={auction.imageUrl} 
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{auction.title}</CardTitle>
                    {auction.status && (
                      <Badge variant="secondary">{auction.status}</Badge>
                    )}
                  </div>
                  {auction.description && (
                    <CardDescription>{auction.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Starting Price:</span>
                      <span className="font-semibold">${auction.startingPrice}</span>
                    </div>
                    {auction.currentBid && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Bid:</span>
                        <span className="font-semibold text-green-600">${auction.currentBid}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bid Increment:</span>
                      <span>${auction.bidIncrement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">End Date:</span>
                      <span>{formatDate(auction.endDate)}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleBid(auction.id)} 
                    className="w-full"
                    disabled={auction.status === 'ended'}
                  >
                    {auction.status === 'ended' ? 'Auction Ended' : 'Place Bid'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Auctions;