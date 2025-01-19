import React, { useContext, useEffect, useState } from "react";
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
import { Users, Plus, UserPlus } from "lucide-react";
import { EthereumContext } from "@/lib/ContractContext";
import { log } from "console";
import Navbar from './navbar';

const CommunityDashboard = () => {
  // Sample data - replace with actual data from your backend

  const { contract, signer } = useContext(EthereumContext);
const [allCommunities, setAllCommunities] = useState<{id:number, name:string, members:number}[]>([]);
const [myCommunities, setMyCommunities] = useState<{id:number, date:number}[]>([]);
const [newCommunity, setNewCommunity] = useState<{name:string}>({
  name: "",
});
  useEffect(() => {
    async function getCommunities() {
      let communities = await contract.getAllCommunities();
      let prod:{id:number, name:string, members:number}[] = []

   
      
      for (let i = 0; i < Object.keys(communities[0]).length; i++) {
       prod.push({id:communities[0][i], name:communities[1][i], members:communities[3][i]})
      }
      setAllCommunities(prod); 

      communities = await contract.getUserCommunities(await signer.getAddress());
      let prod2:{id:number, date:number}[] = [];
      console.log(communities[0]);
      
  
      for (let i = 0; i < Object.keys(await communities[0]).length; i++) {
       prod2.push({id:communities[0][i], date:communities[1][i]})
      }
      setMyCommunities(prod2);


     console. log("All Communities", prod);
      console.log("My Communities", prod2);
    }

    if (contract) {
      getCommunities();
    }
  }, [contract]);



 



  const handleCreateCommunity = () => {
 
    contract.createCommunity(newCommunity.name);
  };

  const handleJoinCommunity = (communityId) => {
    // Add logic to join community

    contract.followCommunity(communityId);
  };

  return (
    <div>
      <Navbar/>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Community Dashboard</h1>

      {/* My Communities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            My Communities
          </CardTitle>
          <CardDescription>
            Communities you're currently a member of
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {myCommunities.map((community) => (
              <Card key={community.id} className="bg-secondary/20">
                <CardHeader>
                  <CardTitle>{allCommunities.filter((comm) => comm.id === community.id )[0].name}</CardTitle>
                  <CardDescription>{allCommunities.filter((comm) => comm.id === community.id)[0].members.toString()} members</CardDescription>
                </CardHeader>
              
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
            {allCommunities.map((community) => (
              <Card key={community.id} className="bg-secondary/20">
                <CardHeader>
                  <CardTitle>{community.name}</CardTitle>
                  <CardDescription>{community.members.toString()} members</CardDescription>
                </CardHeader>
                <CardContent>
              
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
                    onChange={(e) =>
                      setNewCommunity({
                        ...newCommunity,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter community name"
                  />
                </div>
             
                <Button onClick={handleCreateCommunity} className="w-full">
                  Create Community
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default CommunityDashboard;
