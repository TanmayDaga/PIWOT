import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
            <CardContent className="grid p-5 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center pt-4">
                    <h1 className="text-2xl font-bold">Welcome to BlueByte</h1>
                    <p className="text-gray-600 pt-4">
                    Login using your cryptocurrency wallet account
                    </p>
                </div>
                <Button type="submit" className="w-full">
                    Connect Wallet
                </Button>
                <div className="text-center text-sm">
                    Don&apos;t have a Metamask account?{" "}
                    <a href="https://support.metamask.io/start/getting-started-with-metamask/" target='_blank' className="underline underline-offset-4">
                    Create one
                    </a>
                </div>
                </div>
            </form>
            <div className="relative hidden bg-gray-100 md:block">
                <img
                src=""
                alt="Login decoration"
                className="absolute inset-0 h-full pl-10 object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            </CardContent>
        </Card>
    </div>
  );
};