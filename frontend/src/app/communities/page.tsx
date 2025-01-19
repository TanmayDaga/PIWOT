"use client"
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('/api/communities');
      if (!response.ok) {
        throw new Error('Failed to fetch communities');
      }
      const data = await response.json();
      setCommunities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinToggle = async (communityId: string) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/communities/${communityId}/toggle`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to update membership');
      }
      setCommunities(communities.map(community => 
        community.id === communityId 
          ? { ...community, isJoined: !community.isJoined }
          : community
      ));
    } catch (err) {
      console.error('Error toggling membership:', err);
    }
  };

  const filterCommunities = (communities: Community[]) => {
    return communities.filter(community => 
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'all' || community.category === selectedCategory)
    );
  };

  const joinedCommunities = filterCommunities(communities.filter(c => c.isJoined));
  const exploreCommunities = filterCommunities(communities.filter(c => !c.isJoined));
  const categories = ['all', ...new Set(communities.map(c => c.category))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Communities</h1>

      <Tabs defaultValue="joined" className="mb-8">
        <TabsList>
          <TabsTrigger value="joined">
            My Communities ({joinedCommunities.length})
          </TabsTrigger>
          <TabsTrigger value="explore">
            Explore ({exploreCommunities.length})
          </TabsTrigger>
        </TabsList>

        <div className="my-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="joined">
          {joinedCommunities.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              You haven't joined any communities yet.
            </p>
          ) : (
            <CommunitiesGrid
              communities={joinedCommunities}
              onJoinToggle={handleJoinToggle}
            />
          )}
        </TabsContent>

        <TabsContent value="explore">
          <CommunitiesGrid
            communities={exploreCommunities}
            onJoinToggle={handleJoinToggle}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}