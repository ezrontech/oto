"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Separator } from "@oto/ui";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function SignupPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle, loading } = useAuth();
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
            // User will need to verify email, then they can login
            router.push("/auth/login?message=Please check your email to verify your account");
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await signInWithGoogle();
        
        if (error) {
            setError(error.message);
        }
        // Navigation will be handled by auth state change listener
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - About Oto */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 to-primary/5 p-12 items-center justify-center">
                <div className="max-w-lg space-y-8">
                    <div className="space-y-4">
                        <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">O</span>
                        </div>
                        <h1 className="text-4xl font-bold">Join Oto</h1>
                        <p className="text-lg text-muted-foreground">
                            Create your account and start building your AI-powered workforce today.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                            <span className="text-sm">AI-powered automation</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                            <span className="text-sm">Multi-channel communication</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                            <span className="text-sm">Advanced analytics</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Account</CardTitle>
                            <CardDescription>Join Oto to start building your AI workforce</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Google Signup */}
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

                            {/* Email Signup Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground mt-6">
                        <p>Already have an account? <Link href="/auth/login" className="text-primary hover:underline">Sign in</Link></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
