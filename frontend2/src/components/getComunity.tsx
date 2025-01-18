import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, UserPlus } from 'lucide-react';

const CommunityDashboard = () => {
  // Sample data - replace with actual data from your backend
  const [myCommunities, setMyCommunities] = useState([
    { id: 1, name: 'Tech Enthusiasts', members: 234, description: 'A community for tech lovers' },
    { id: 2, name: 'Book Club', members: 156, description: 'Discuss your favorite books' }
  ]);

  const [availableCommunities, setAvailableCommunities] = useState([
    { id: 3, name: 'Fitness Group', members: 567, description: 'Share fitness tips and progress' },
    { id: 4, name: 'Cooking Club', members: 890, description: 'Exchange recipes and cooking tips' }
  ]);

  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: ''
  });

  const handleCreateCommunity = () => {
    // Add logic to create community
    console.log('Creating community:', newCommunity);
    setNewCommunity({ name: '', description: '' });
  };

  const handleJoinCommunity = (communityId) => {
    // Add logic to join community
    const communityToJoin = availableCommunities.find(c => c.id === communityId);
    if (communityToJoin) {
      setMyCommunities([...myCommunities, communityToJoin]);
      setAvailableCommunities(availableCommunities.filter(c => c.id !== communityId));
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Community Dashboard</h1>
      
      {/* My Communities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            My Communities
          </CardTitle>
          <CardDescription>Communities you're currently a member of</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {myCommunities.map((community) => (
              <Card key={community.id} className="bg-secondary/20">
                <CardHeader>
                  <CardTitle>{community.name}</CardTitle>
                  <CardDescription>{community.members} members</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{community.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Communities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Available Communities
          </CardTitle>
          <CardDescription>Discover new communities to join</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {availableCommunities.map((community) => (
              <Card key={community.id} className="bg-secondary/20">
                <CardHeader>
                  <CardTitle>{community.name}</CardTitle>
                  <CardDescription>{community.members} members</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{community.description}</p>
                  <Button 
                    onClick={() => handleJoinCommunity(community.id)}
                    className="w-full"
                  >
                    Join Community
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Community Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-6 w-6" />
            Create Community
          </CardTitle>
          <CardDescription>Start your own community</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Create New Community</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Community</DialogTitle>
                <DialogDescription>
                  Fill in the details to create your new community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Community Name
                  </label>
                  <Input
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity({
                      ...newCommunity,
                      name: e.target.value
                    })}
                    placeholder="Enter community name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Description
                  </label>
                  <Textarea
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity({
                      ...newCommunity,
                      description: e.target.value
                    })}
                    placeholder="Describe your community"
                  />
                </div>
                <Button 
                  onClick={handleCreateCommunity}
                  className="w-full"
                >
                  Create Community
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityDashboard;