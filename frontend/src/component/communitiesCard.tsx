import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface CommunityCardProps {
  community: Community;
  onJoinToggle: (communityId: string) => void;
}

const CommunityCard = ({ community, onJoinToggle }: CommunityCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <img 
            src={community.imageUrl} 
            alt={community.name} 
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg">{community.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Users className="w-4 h-4" />
              {community.memberCount.toLocaleString()} members
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{community.description}</p>
        <div className="mt-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {community.category}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={community.isJoined ? "outline" : "default"}
          onClick={() => onJoinToggle(community.id)}
          className="w-full"
        >
          {community.isJoined ? 'Leave Community' : 'Join Community'}
        </Button>
      </CardFooter>
    </Card>
  );
};
