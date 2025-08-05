import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [createForm, setCreateForm] = useState({
    title: '',
    startingPrice: '',
    endDate: '',
    bidIncrement: '',
    startDate: '',
    imageUrl: '',
    description: '',
    createdBy: '',
    status: '',
  });

  const [updateForm, setUpdateForm] = useState({
    createdBy: '',
    title: '',
    endDate: '',
    imageUrl: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auctionData = {
        title: createForm.title,
        startingPrice: Number(createForm.startingPrice),
        endDate: createForm.endDate,
        bidIncrement: Number(createForm.bidIncrement),
        ...(createForm.startDate && { startDate: createForm.startDate }),
        ...(createForm.imageUrl && { imageUrl: createForm.imageUrl }),
        ...(createForm.description && { description: createForm.description }),
        ...(createForm.createdBy && { createdBy: createForm.createdBy }),
        ...(createForm.status && { status: createForm.status }),
      };

      const response = await apiService.createAuction(auctionData);
      
      if (response.success) {
        toast({ title: 'Auction created successfully!' });
        setCreateForm({
          title: '',
          startingPrice: '',
          endDate: '',
          bidIncrement: '',
          startDate: '',
          imageUrl: '',
          description: '',
          createdBy: '',
          status: '',
        });
      } else {
        toast({ 
          title: 'Failed to create auction',
          description: response.message,
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

  const handleUpdateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auctionData = {
        createdBy: updateForm.createdBy,
        title: updateForm.title,
        ...(updateForm.endDate && { endDate: updateForm.endDate }),
        ...(updateForm.imageUrl && { imageUrl: updateForm.imageUrl }),
        ...(updateForm.description && { description: updateForm.description }),
      };

      const response = await apiService.updateAuction(auctionData);
      
      if (response.success) {
        toast({ title: 'Auction updated successfully!' });
        setUpdateForm({
          createdBy: '',
          title: '',
          endDate: '',
          imageUrl: '',
          description: '',
        });
      } else {
        toast({ 
          title: 'Failed to update auction',
          description: response.message,
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Button onClick={() => navigate('/auctions')} variant="outline">
            Back to Auctions
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Auction</TabsTrigger>
            <TabsTrigger value="update">Update Auction</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Auction</CardTitle>
                <CardDescription>
                  Fill in the details to create a new auction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAuction} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={createForm.title}
                        onChange={handleCreateInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startingPrice">Starting Price *</Label>
                      <Input
                        id="startingPrice"
                        name="startingPrice"
                        type="number"
                        value={createForm.startingPrice}
                        onChange={handleCreateInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bidIncrement">Bid Increment *</Label>
                      <Input
                        id="bidIncrement"
                        name="bidIncrement"
                        type="number"
                        value={createForm.bidIncrement}
                        onChange={handleCreateInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="datetime-local"
                        value={createForm.endDate}
                        onChange={handleCreateInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="datetime-local"
                        value={createForm.startDate}
                        onChange={handleCreateInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={createForm.imageUrl}
                        onChange={handleCreateInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="createdBy">Created By</Label>
                      <Input
                        id="createdBy"
                        name="createdBy"
                        value={createForm.createdBy}
                        onChange={handleCreateInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Input
                        id="status"
                        name="status"
                        value={createForm.status}
                        onChange={handleCreateInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={createForm.description}
                      onChange={handleCreateInputChange}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Auction'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="update" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Update Existing Auction</CardTitle>
                <CardDescription>
                  Update auction details by providing the creator and title
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateAuction} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="updateCreatedBy">Created By *</Label>
                      <Input
                        id="updateCreatedBy"
                        name="createdBy"
                        value={updateForm.createdBy}
                        onChange={handleUpdateInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="updateTitle">Title *</Label>
                      <Input
                        id="updateTitle"
                        name="title"
                        value={updateForm.title}
                        onChange={handleUpdateInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="updateEndDate">End Date</Label>
                      <Input
                        id="updateEndDate"
                        name="endDate"
                        type="datetime-local"
                        value={updateForm.endDate}
                        onChange={handleUpdateInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="updateImageUrl">Image URL</Label>
                      <Input
                        id="updateImageUrl"
                        name="imageUrl"
                        value={updateForm.imageUrl}
                        onChange={handleUpdateInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="updateDescription">Description</Label>
                    <Textarea
                      id="updateDescription"
                      name="description"
                      value={updateForm.description}
                      onChange={handleUpdateInputChange}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Auction'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;