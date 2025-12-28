"use client";

import { useState } from "react";
import { Button, Input, Label, Separator } from "@oto/ui";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, User } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useWindowManager } from "@/context/window-manager";

import dynamic from 'next/dynamic';

const LoginView = dynamic(() => import('./LoginView'), { loading: () => null });

export default function SignupView() {
    const { signUp, signInWithGoogle, loading } = useAuth();
    const { closeWindow, openWindow } = useWindowManager();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const { error } = await signUp(formData.email, formData.password, formData.name);

        if (error) {
            setError(error.message);
        } else {
            // Show success message or auto-login if supabase allows (usually requires email verify)
            setError("Please check your email to verify your account.");
            // Ideally we might want to show a "Check Email" state instead of just text
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
        }
    };

    const handleLoginClick = () => {
        closeWindow("signup");
        openWindow("login", "Sign In", <LoginView />);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full bg-background">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                    <p className="text-sm text-muted-foreground">Join Oto to start building your AI workforce</p>
                </div>

                <div className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <Chrome className="mr-2 h-4 w-4" />
                        Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="pl-10 pr-10"
                                    required
                                    minLength={6}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating account..." : "Create Account"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Already have an account?{" "}
                        <Button variant="link" className="p-0 h-auto font-semibold" onClick={handleLoginClick}>
                            Sign in
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
