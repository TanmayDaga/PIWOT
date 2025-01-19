import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { User, Home, Wallet } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
    const navigate = useNavigate();
    
    return (
        <div className="w-full border-b">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Left section */}
                    
                    <div className="flex-shrink-0">
                        <img 
                            src="/logo.png" 
                            alt="Product Logo" 
                            className="h-9 w-9 object-contain cursor-pointer"
                        />
                    </div>

                    <span className='text-xl font-semibold pl-4 pr-8'>BlueByte</span>

                    <div className="flex-shrink-0">
                        <Button 
                            variant="ghost" 
                            className="flex items-center space-x-2"
                            onClick={() => navigate('/feed')}
                        >
                            <span className='text-lg pr-8'>Feed</span>
                        </Button>
                    </div>

                    <div className="flex-shrink-0">
                        <Button 
                            variant="ghost" 
                            className="flex items-center space-x-2"
                            onClick={() => navigate('/communities')}
                        >
                            <span className='text-lg'>All Communities</span>
                        </Button>
                    </div>

                    {/* Center section - can be used for search or other items */}
                    <div className="flex-1 flex justify-center">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {/* Add any center items here if needed */}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center space-x-4">
                        <Avatar 
                            className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate('/profile')}
                        >
                            <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                            <AvatarFallback>
                                <User size={32} />
                            </AvatarFallback>
                        </Avatar>

                        <Button 
                            variant="outline" 
                            className="flex items-center space-x-2"
                        >
                            <Wallet size={18} />
                            <span>Connect Wallet</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}