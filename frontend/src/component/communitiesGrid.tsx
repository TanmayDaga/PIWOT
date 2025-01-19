interface CommunitiesGridProps {
    communities: Community[];
    onJoinToggle: (communityId: string) => void;
  }
  
  const CommunitiesGrid = ({ communities, onJoinToggle }: CommunitiesGridProps) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((community) => (
          <CommunityCard
            key={community.id}
            community={community}
            onJoinToggle={onJoinToggle}
          />
        ))}
      </div>
    );
  };