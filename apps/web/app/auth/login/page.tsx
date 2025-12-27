"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Separator } from "@oto/ui";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
    const router = useRouter();
    const { signIn, signInWithGoogle, loading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
            setError(error.message);
        }
        // Navigation will be handled by auth state change listener
    };

    const handleGoogleLogin = async () => {
        setError("");
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
                        <h1 className="text-4xl font-bold text-foreground">
                            Your AI Operating Partner
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Oto orchestrates specialized AI agents to handle complex tasks, 
                            automate workflows, and amplify your productivity.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-primary font-semibold">1</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Intelligent Agent Orchestration</h3>
                                <p className="text-muted-foreground">Create and manage specialized AI agents for different tasks and domains</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-primary font-semibold">2</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Knowledge Management</h3>
                                <p className="text-muted-foreground">RAG-enabled knowledge base with intelligent document indexing</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-primary font-semibold">3</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Business Intelligence</h3>
                                <p className="text-muted-foreground">Advanced analytics and insights to drive data-informed decisions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Logo for mobile */}
                    <div className="lg:hidden text-center space-y-4">
                        <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                            <span className="text-white text-xl font-bold">O</span>
                        </div>
                        <h1 className="text-2xl font-bold">Welcome to Oto</h1>
                        <p className="text-muted-foreground">Your AI operating partner</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sign in</CardTitle>
                            <CardDescription>Choose your preferred sign in method</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Google Login */}
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

                            {/* Email/Password Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email or Username</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="text"
                                            placeholder="Enter your email or username"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="pl-10 pr-10"
                                            required
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
                                    {loading ? "Signing in..." : "Sign in"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>

                            <div className="text-center text-sm text-muted-foreground">
                                <Button variant="ghost" onClick={handleGoogleLogin} disabled={loading} className="w-full">
                                    <Chrome className="mr-2 h-4 w-4" />
                                    Continue with Google
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground">
                        <p>Don't have an account? <Link href="/auth/signup" className="text-primary hover:underline">Sign up</Link></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
