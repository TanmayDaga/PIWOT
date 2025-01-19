import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navbar from './navbar';
import { Plus, MessageSquare, BarChart } from 'lucide-react';

// Types
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  createdAt: Date;
}

interface Post {
  id: string;
  content: string;
  createdAt: Date;
  author: string;
}

// Main Component
const CommunityFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPollOptions, setNewPollOptions] = useState(['', '']);

  // Handle voting
  const handleVote = (pollId: string, optionId: string) => {
    setPolls(currentPolls => 
      currentPolls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map(opt => ({
              ...opt,
              votes: opt.id === optionId ? opt.votes + 1 : opt.votes
            })),
            totalVotes: poll.totalVotes + 1
          };
        }
        return poll;
      })
    );
  };

  // Add new post
  const handleAddPost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      createdAt: new Date(),
      author: 'Current User' // In real app, get from auth context
    };
    setPosts(current => [newPost, ...current]);
    setIsCreateModalOpen(false);
  };

  // Add new poll
  const handleAddPoll = (question: string, options: string[]) => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      question,
      options: options.map((opt, index) => ({
        id: index.toString(),
        text: opt,
        votes: 0
      })),
      totalVotes: 0,
      createdAt: new Date()
    };
    setPolls(current => [newPoll, ...current]);
    setIsCreateModalOpen(false);
  };

  return (
    <div>
        <Navbar/>
        <div className="container mx-auto p-4 max-w-4xl mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Community Feed</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Content</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="post" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="post">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Post
                </TabsTrigger>
                <TabsTrigger value="poll">
                  <BarChart className="mr-2 h-4 w-4" />
                  Poll
                </TabsTrigger>
              </TabsList>

              <TabsContent value="post">
                <CreatePostForm onSubmit={handleAddPost} />
              </TabsContent>

              <TabsContent value="poll">
                <CreatePollForm 
                  options={newPollOptions}
                  setOptions={setNewPollOptions}
                  onSubmit={handleAddPoll}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {[...polls, ...posts]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map(item => {
            if ('question' in item) {
              return (
                <PollCard
                  key={item.id}
                  poll={item}
                  onVote={handleVote}
                />
              );
            }
            return (
              <PostCard
                key={item.id}
                post={item}
              />
            );
          })}
      </div>
    </div>
    </div>
  );
};

// Sub-components
const CreatePostForm: React.FC<{
  onSubmit: (content: string) => void
}> = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Write your post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        onClick={() => onSubmit(content)}
        disabled={!content.trim()}
        className="w-full"
      >
        Post
      </Button>
    </div>
  );
};

const CreatePollForm: React.FC<{
  options: string[]
  setOptions: (options: string[]) => void
  onSubmit: (question: string, options: string[]) => void
}> = ({ options, setOptions, onSubmit }) => {
  const [question, setQuestion] = useState('');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Poll question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((option, index) => (
        <Input
          key={index}
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}
      <Button
        variant="outline"
        onClick={handleAddOption}
        className="w-full"
      >
        Add Option
      </Button>
      <Button
        onClick={() => onSubmit(question, options)}
        disabled={!question.trim() || options.some(opt => !opt.trim())}
        className="w-full"
      >
        Create Poll
      </Button>
    </div>
  );
};

const PostCard: React.FC<{
  post: Post
}> = ({ post }) => (
  <Card>
    <CardContent className="pt-6">
      <p className="text-sm text-gray-500 mb-2">
        Posted by {post.author} • {post.createdAt.toLocaleDateString()}
      </p>
      <p>{post.content}</p>
    </CardContent>
  </Card>
);

const PollCard: React.FC<{
  poll: Poll
  onVote: (pollId: string, optionId: string) => void
}> = ({ poll, onVote }) => (
  <Card>
    <CardHeader>
      <CardTitle>{poll.question}</CardTitle>
    </CardHeader>
    <CardContent>
      <RadioGroup onValueChange={(value) => onVote(poll.id, value)}>
        {poll.options.map((option) => {
          const percentage = poll.totalVotes > 0
            ? Math.round((option.votes / poll.totalVotes) * 100)
            : 0;

          return (
            <div key={option.id} className="relative mb-4">
              <div className="flex items-center">
                <RadioGroupItem
                  value={option.id}
                  id={`option-${option.id}`}
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="ml-2 flex-grow"
                >
                  {option.text}
                </Label>
                <span className="text-sm text-gray-500">
                  {percentage}% ({option.votes} votes)
                </span>
              </div>
              <div
                className="absolute left-0 bottom-0 h-1 bg-blue-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          );
        })}
      </RadioGroup>
      <p className="text-sm text-gray-500 mt-4">
        Total votes: {poll.totalVotes} • Created {poll.createdAt.toLocaleDateString()}
      </p>
    </CardContent>
  </Card>
);

export default CommunityFeed;