import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={post.author.avatarUrl} />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-sm text-gray-500">@{post.author.username}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.content}</p>
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            className="rounded-lg w-full object-cover max-h-96"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" className="flex gap-2">
          <Heart className="w-5 h-5" />
          {post.likes}
        </Button>
        <Button variant="ghost" size="sm" className="flex gap-2">
          <MessageCircle className="w-5 h-5" />
          {post.comments}
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="w-5 h-5" />
        </Button>
      </CardFooter>
    </Card>
  )};
