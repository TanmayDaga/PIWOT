import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  Users,
  Copy,
  ExternalLink,
  Settings
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Navbar from './navbar';

// TypeScript interfaces
interface UserProfile {
  id: string;
  username: string;
  walletId: string;
  avatarUrl: string;
  joinDate: string;
}

interface Balance {
  currency: string;
  amount: number;
  symbol: string;
}

interface Community {
  id: number;
  name: string;
  members: number;
  role: string;
  avatarUrl: string;
}

// API functions
const api = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await fetch('/api/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  getBalances: async (): Promise<Balance[]> => {
    const response = await fetch('/api/balances', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch balances');
    return response.json();
  },

  getMyCommunities: async (): Promise<Community[]> => {
    const response = await fetch('/api/communities/my-communities', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch communities');
    return response.json();
  }
};

const UserProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const [profileData, balancesData, communitiesData] = await Promise.all([
        api.getProfile(),
        api.getBalances(),
        api.getMyCommunities()
      ]);
      
      setProfile(profileData);
      setBalances(balancesData);
      setCommunities(communitiesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Wallet ID copied to clipboard",
    });
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
        <Navbar/>
        <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 mt-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{profile?.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{profile?.username}</h1>
            <p className="text-muted-foreground">Member since {new Date(profile?.joinDate || '').toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Wallet Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            Wallet Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary/20 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Wallet ID</p>
              <p className="font-mono">{profile?.walletId}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => copyToClipboard(profile?.walletId || '')}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => window.open(`https://explorer.example.com/wallet/${profile?.walletId}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Current Balances</CardTitle>
          <CardDescription>Your current holdings across different currencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {balances.map((balance) => (
              <div
                key={balance.currency}
                className="bg-secondary/20 p-4 rounded-lg"
              >
                <p className="text-sm text-muted-foreground">{balance.currency}</p>
                <p className="text-2xl font-bold">
                  {balance.symbol}{formatBalance(balance.amount)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            My Communities
          </CardTitle>
          <CardDescription>Communities you're currently participating in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communities.map((community) => (
              <div
                key={community.id}
                className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={community.avatarUrl} />
                    <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{community.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {community.members} members • {community.role}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default UserProfilePage;