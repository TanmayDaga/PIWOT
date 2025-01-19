// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PollPaymentSystem {
    address private owner;

    struct Community {
        uint256 id;
        string name;
        bool isActive;
        uint256 memberCount;
    }

    struct PostItem {
        address creator;
        string content;
        uint256 communityId;
        uint256 createdAt;
        bool isActive;
    }

    struct PollItem {
        address creator;
        string question;
        string[] options;
        uint256[] voteCounts;
        uint256 totalVotes;
        uint256 communityId;
        uint256 createdAt;
        bool isActive;
    }

    struct CommunityContent {
        PostItem[] posts;
        PollItem[] polls;
    }

    struct UserCommunity {
        bool isFollowing;
        uint256 joinedAt;
    }

    struct Poll {
        address creator;
        string question;
        string[] options;
        mapping(uint => uint) votesCount;
        mapping(address => bool) hasVoted;
        uint totalVotes;
        bool isActive;
        uint reward;
        uint256 communityId;  // New field
        uint256 createdAt;
    }

    struct ContentItem {
        uint256 id;
        string contentType;  // "post" or "poll"
        address creator;
        string content;      // post content or poll question
        uint256 communityId;
        uint256 createdAt;
        bool isActive;
        // Poll specific fields
        string[] options;    // empty for posts
        uint256[] voteCounts; // empty for posts
        uint256 totalVotes;  // 0 for posts
    }

    struct Post {
        uint256 id;
        address creator;
        string content;
        uint256 communityId;
        bool isActive;
        uint256 createdAt;
    }

    mapping(uint => Poll) public polls;
    mapping(address => uint) public userWallet;
    mapping(address => bool) public registeredUsers;
    mapping(uint256 => Community) public communities;
    mapping(address => mapping(uint256 => UserCommunity)) public userCommunities;
    mapping(uint256 => Post) public posts;
    uint256 public postCount;
    uint256 public communityCount;
    uint public constant POST_CREATION_FEE = 50 * 1 ether; // 50 tokens in wei
    uint public pollCount;

    event PollCreated(uint pollId, address creator, string question, uint256 communityId);
    event VoteCasted(uint pollId, address voter, uint option);
    event RewardClaimed(address user, uint amount);
    event UserRegistered(address user);
    event CommunityCreated(uint256 communityId, string name);
    event CommunityFollowed(uint256 communityId, address user);
    event CommunityUnfollowed(uint256 communityId, address user);
    event PostCreated(uint256 postId, address creator, uint256 communityId);
    event PostContent(uint256 postId, string content); // Separate event for content to keep main event lean

    constructor(address _initialOwner) {
        require(_initialOwner != address(0), "Invalid owner address");
        owner = _initialOwner;
        registeredUsers[_initialOwner] = true;
        emit UserRegistered(_initialOwner);
        createDefaultCommunities();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    modifier onlyPollCreator(uint _pollId) {
        require(polls[_pollId].creator == msg.sender, "Not the poll creator");
        _;
    }

    modifier notPollCreator(uint _pollId) {
        require(polls[_pollId].creator != msg.sender, "Poll creator cannot vote");
        _;
    }

    modifier pollExists(uint _pollId) {
        require(_pollId < pollCount, "Poll does not exist");
        _;
    }

    modifier pollActive(uint _pollId) {
        require(polls[_pollId].isActive, "Poll is not active");
        _;
    }

    modifier hasNotVoted(uint _pollId) {
        require(!polls[_pollId].hasVoted[msg.sender], "Already voted");
        _;
    }

    function createPost(string memory _content, uint256 _communityId) external onlyRegistered {
        require(bytes(_content).length > 0, "Content cannot be empty");
        require(_communityId > 0 && _communityId <= communityCount, "Invalid community ID");
        require(userCommunities[msg.sender][_communityId].isFollowing, "Must follow community to post");

        uint256 newPostId = postCount + 1;
        Post storage newPost = posts[newPostId];
        
        newPost.id = newPostId;
        newPost.creator = msg.sender;
        newPost.content = _content;
        newPost.communityId = _communityId;
        newPost.isActive = true;
        newPost.createdAt = block.timestamp;
        
        postCount++;
        
        emit PostCreated(newPostId, msg.sender, _communityId);
        emit PostContent(newPostId, _content);
    }

    function createDefaultCommunities() private {
        string[5] memory defaultNames = [
            "Technology",
            "Science",
            "Arts",
            "Sports",
            "Entertainment"
        ];

        for(uint256 i = 0; i < 5; i++) {
            Community storage newCommunity = communities[i + 1];
            newCommunity.id = i + 1;
            newCommunity.name = defaultNames[i];
            newCommunity.isActive = true;
            newCommunity.memberCount = 0;
            communityCount++;
            
            emit CommunityCreated(i + 1, defaultNames[i]);
        }
    }

        // Create a new community (only owner can create additional communities)
    function createCommunity(string memory _name) external onlyOwner {
        require(bytes(_name).length > 0, "Community name cannot be empty");
        
        uint256 newCommunityId = communityCount + 1;
        Community storage newCommunity = communities[newCommunityId];
        
        newCommunity.id = newCommunityId;
        newCommunity.name = _name;
        newCommunity.isActive = true;
        newCommunity.memberCount = 0;
        
        communityCount++;
        
        emit CommunityCreated(newCommunityId, _name);
    }

    // Follow a community
    function followCommunity(uint256 _communityId) external onlyRegistered {
        require(_communityId > 0 && _communityId <= communityCount, "Invalid community ID");
        require(communities[_communityId].isActive, "Community is not active");
        require(!userCommunities[msg.sender][_communityId].isFollowing, "Already following this community");

        UserCommunity storage userCommunity = userCommunities[msg.sender][_communityId];
        userCommunity.isFollowing = true;
        userCommunity.joinedAt = block.timestamp;

        communities[_communityId].memberCount++;
        
        emit CommunityFollowed(_communityId, msg.sender);
    }

    // Unfollow a community
    function unfollowCommunity(uint256 _communityId) external onlyRegistered {
        require(_communityId > 0 && _communityId <= communityCount, "Invalid community ID");
        require(userCommunities[msg.sender][_communityId].isFollowing, "Not following this community");

        UserCommunity storage userCommunity = userCommunities[msg.sender][_communityId];
        userCommunity.isFollowing = false;

        communities[_communityId].memberCount--;
        
        emit CommunityUnfollowed(_communityId, msg.sender);
    }

    // Get all communities
    function getAllCommunities() external view returns (
        uint256[] memory ids,
        string[] memory names,
        bool[] memory activeStates,
        uint256[] memory memberCounts
    ) {
        ids = new uint256[](communityCount);
        names = new string[](communityCount);
        activeStates = new bool[](communityCount);
        memberCounts = new uint256[](communityCount);

        for (uint256 i = 1; i <= communityCount; i++) {
            Community storage community = communities[i];
            ids[i-1] = community.id;
            names[i-1] = community.name;
            activeStates[i-1] = community.isActive;
            memberCounts[i-1] = community.memberCount;
        }

        return (ids, names, activeStates, memberCounts);
    }

    // Check if user follows a specific community
    function isFollowingCommunity(address _user, uint256 _communityId) external view returns (bool) {
        require(_communityId > 0 && _communityId <= communityCount, "Invalid community ID");
        return userCommunities[_user][_communityId].isFollowing;
    }

    // Get user's followed communities
    function getUserCommunities(address _user) external view returns (
        uint256[] memory communityIds,
        uint256[] memory joinDates
    ) {
        uint256 followedCount = 0;
        
        // First, count how many communities the user follows
        for (uint256 i = 1; i <= communityCount; i++) {
            if (userCommunities[_user][i].isFollowing) {
                followedCount++;
            }
        }

        communityIds = new uint256[](followedCount);
        joinDates = new uint256[](followedCount);
        
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= communityCount; i++) {
            if (userCommunities[_user][i].isFollowing) {
                communityIds[currentIndex] = i;
                joinDates[currentIndex] = userCommunities[_user][i].joinedAt;
                currentIndex++;
            }
        }

        return (communityIds, joinDates);
    }

    // Register user function - can only be called by owner
    function registerUser(address _userAddress) external onlyOwner {
        require(_userAddress != address(0), "Invalid address");
        require(!registeredUsers[_userAddress], "User already registered");
        
        registeredUsers[_userAddress] = true;
        emit UserRegistered(_userAddress);
    }

    // Connect wallet function - can be called by any unregistered user
    function connectWallet() external {
        require(!registeredUsers[msg.sender], "Wallet already connected");
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    // Create a new poll
    function createPoll(string memory _question, string[] memory _options, uint256 _communityId) external payable onlyRegistered {
        require(msg.value == POST_CREATION_FEE, "Incorrect payment amount");
        require(_options.length >= 2, "Minimum 2 options required");
        require(_communityId > 0 && _communityId <= communityCount, "Invalid community ID");
        require(userCommunities[msg.sender][_communityId].isFollowing, "Must follow community to create poll");

        uint pollId = pollCount;
        Poll storage newPoll = polls[pollId];
        
        newPoll.creator = msg.sender;
        newPoll.question = _question;
        newPoll.options = _options;
        newPoll.isActive = true;
        newPoll.reward = 1 * 10**17; // 0.1 tokens per vote as reward
        newPoll.communityId = _communityId;
        newPoll.createdAt = block.timestamp;
        
        pollCount++;
        
        emit PollCreated(pollId, msg.sender, _question, _communityId);
    }

    function getPost(uint256 _postId) external view returns (
        address creator,
        string memory content,
        uint256 communityId,
        bool isActive,
        uint256 createdAt
    ) {
        require(_postId > 0 && _postId <= postCount, "Invalid post ID");
        Post storage post = posts[_postId];
        return (
            post.creator,
            post.content,
            post.communityId,
            post.isActive,
            post.createdAt
        );
    }

    function getCommunityContent(uint256 _communityId) external view returns (CommunityContent memory) {
        require(_communityId > 0 && _communityId <= communityCount, "Invalid community ID");

        // First, count content in community
        uint256 totalPosts = 0;
        uint256 totalPolls = 0;
        
        for(uint256 i = 1; i <= postCount; i++) {
            if(posts[i].communityId == _communityId) {
                totalPosts++;
            }
        }
        for(uint256 i = 0; i < pollCount; i++) {
            if(polls[i].communityId == _communityId) {
                totalPolls++;
            }
        }

        // Initialize return arrays
        PostItem[] memory communityPosts = new PostItem[](totalPosts);
        PollItem[] memory communityPolls = new PollItem[](totalPolls);
        
        // Current indices for filling arrays
        uint256 postIndex = 0;
        uint256 pollIndex = 0;

        // Add posts
        for(uint256 i = 1; i <= postCount; i++) {
            if(posts[i].communityId == _communityId) {
                Post storage post = posts[i];
                
                communityPosts[postIndex] = PostItem({
                    creator: post.creator,
                    content: post.content,
                    communityId: post.communityId,
                    createdAt: post.createdAt,
                    isActive: post.isActive
                });
                
                postIndex++;
            }
        }

        // Add polls
        for(uint256 i = 0; i < pollCount; i++) {
            if(polls[i].communityId == _communityId) {
                Poll storage poll = polls[i];
                
                // Get vote counts for each option
                uint256[] memory voteCounts = new uint256[](poll.options.length);
                for(uint256 j = 0; j < poll.options.length; j++) {
                    voteCounts[j] = poll.votesCount[j];
                }

                communityPolls[pollIndex] = PollItem({
                    creator: poll.creator,
                    question: poll.question,
                    options: poll.options,
                    voteCounts: voteCounts,
                    totalVotes: poll.totalVotes,
                    communityId: poll.communityId,
                    createdAt: poll.createdAt,
                    isActive: poll.isActive
                });
                
                pollIndex++;
            }
        }

        return CommunityContent({
            posts: communityPosts,
            polls: communityPolls
        });
    }
    
    // Cast a vote in a poll
    function castVote(uint _pollId, uint _option) external 
        onlyRegistered
        pollExists(_pollId) 
        pollActive(_pollId)
        hasNotVoted(_pollId)
        notPollCreator(_pollId)
    {
        require(_option < polls[_pollId].options.length, "Invalid option");
        
        Poll storage poll = polls[_pollId];
        poll.votesCount[_option]++;
        poll.hasVoted[msg.sender] = true;
        poll.totalVotes++;
        
        // Add reward to user's wallet
        userWallet[msg.sender] += poll.reward;
        
        emit VoteCasted(_pollId, msg.sender, _option);
    }

    // Get poll details
    function getPollDetails(uint _pollId) external view 
        pollExists(_pollId) 
        returns (
            address creator,
            string memory question,
            string[] memory options,
            uint totalVotes,
            bool isActive
        ) 
    {
        Poll storage poll = polls[_pollId];
        return (
            poll.creator,
            poll.question,
            poll.options,
            poll.totalVotes,
            poll.isActive
        );
    }

    // Get votes for a specific option
    function getVotesForOption(uint _pollId, uint _option) external view 
        pollExists(_pollId) 
        returns (uint) 
    {
        require(_option < polls[_pollId].options.length, "Invalid option");
        return polls[_pollId].votesCount[_option];
    }

    // Close a poll
    function closePoll(uint _pollId) external 
        onlyRegistered
        pollExists(_pollId) 
        onlyPollCreator(_pollId) 
    {
        polls[_pollId].isActive = false;
    }

    // Withdraw rewards to Ethereum wallet
    function withdrawRewards() external onlyRegistered {
        uint amount = userWallet[msg.sender];
        require(amount > 0, "No rewards to withdraw");
        
        userWallet[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit RewardClaimed(msg.sender, amount);
    }

    // Check contract balance
    function getContractBalance() external view onlyRegistered returns (uint) {
        return address(this).balance;
    }

    // Check if an address is registered
    function isRegistered(address _user) external view returns (bool) {
        return registeredUsers[_user];
    }
}