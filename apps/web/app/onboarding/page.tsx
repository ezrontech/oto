"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@oto/ui";
import { ArrowRight, Check, Sparkles, Zap, Globe, Brain, Target, ArrowLeft, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [formData, setFormData] = useState({
        spaceName: "",
        spacePurpose: "",
        aiModel: "oto-ai",
        primaryGoals: [] as string[],
        interests: [] as string[],
        notificationPreferences: "important",
        useCustomAI: false
    });

    useEffect(() => {
        // Check if user is authenticated
        const user = localStorage.getItem("oto_user");
        const onboardingCompleted = localStorage.getItem("oto_onboarding_completed");
        
        if (!user) {
            router.push("/auth/login");
            return;
        }
        
        if (onboardingCompleted === "true") {
            router.push("/myhub");
            return;
        }
        
        setUserData(JSON.parse(user));
    }, [router]);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const spaceTypes = [
        { id: "team", name: "Team", icon: Brain, description: "For work collaboration and productivity" },
        { id: "community", name: "Community", icon: Globe, description: "For community engagement and growth" },
        { id: "club", name: "Club", icon: Zap, description: "For clubs and special interest groups" },
        { id: "creative", name: "Creative", icon: Sparkles, description: "For creators and freelancers" }
    ];

    const aiModels = [
        { id: "oto-ai", name: "Oto AI", description: "Our built-in AI model, optimized for your workflow" },
        { id: "gpt-4", name: "GPT-4", description: "Most capable model for complex tasks" },
        { id: "gpt-3.5", name: "GPT-3.5 Turbo", description: "Fast and efficient for most tasks" },
        { id: "claude", name: "Claude", description: "Great for writing and analysis" },
        { id: "local", name: "Local Model", description: "Private and self-hosted" }
    ];

    const goals = [
        "Automate repetitive tasks",
        "Generate content and ideas",
        "Analyze data and insights",
        "Manage knowledge base",
        "Communicate with customers",
        "Code assistance",
        "Research and learning",
        "Project management"
    ];

    const interests = [
        "Technology & AI",
        "Business & Strategy",
        "Marketing & Sales",
        "Content Creation",
        "Data Science",
        "Design & UX",
        "Finance & Investment",
        "Health & Wellness"
    ];

    const handleGoalToggle = (goal: string) => {
        setFormData(prev => ({
            ...prev,
            primaryGoals: prev.primaryGoals.includes(goal)
                ? prev.primaryGoals.filter(g => g !== goal)
                : [...prev.primaryGoals, goal]
        }));
    };

    const handleInterestToggle = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const completeOnboarding = async () => {
        setIsLoading(true);
        
        // Save onboarding data to database
        try {
            const res = await fetch('/api/user/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    completed_at: new Date().toISOString()
                })
            });
            
            const result = await res.json();
            
            // Always save to localStorage as backup
            const onboardingData = {
                ...formData,
                completedAt: new Date().toISOString(),
                userId: userData?.id
            };
            
            localStorage.setItem("oto_onboarding_data", JSON.stringify(onboardingData));
            localStorage.setItem("oto_onboarding_completed", "true");
            
            if (!res.ok) {
                console.warn('Database update failed:', result);
                if (result.error?.includes('Database columns missing')) {
                    console.error('DATABASE MIGRATION NEEDED: Onboarding columns not found');
                }
            } else {
                console.log('Onboarding saved successfully to database');
            }
            
            // Simulate setup process and proceed
            setTimeout(() => {
                router.push("/myhub");
            }, 2000);
            
        } catch (error) {
            console.error('Failed to save onboarding:', error);
            // Still proceed even if everything fails
            localStorage.setItem("oto_onboarding_completed", "true");
            setTimeout(() => {
                router.push("/myhub");
            }, 2000);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Setting up your space</h2>
                        <span className="text-sm text-muted-foreground">Step {step} of 5</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                        <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(step / 5) * 100}%` }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Welcome */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="p-8">
                                <CardHeader className="text-center pb-8">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl font-bold text-primary">
                                            {userData.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl">Welcome, {userData.name}!</CardTitle>
                                    <CardDescription className="text-lg">
                                        Let's set up your AI space to match your needs
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="bg-muted/50 rounded-lg p-6">
                                        <h3 className="font-semibold mb-2">Your account is ready</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Email: {userData.email}
                                        </p>
                                    </div>
                                    <Button onClick={nextStep} size="lg" className="w-full">
                                        Let's get started
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 2: Space Setup */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="p-8">
                                <CardHeader>
                                    <CardTitle>Create your space</CardTitle>
                                    <CardDescription>
                                        Tell us about your space so we can tailor Oto to your needs
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="spaceName">Space Name</Label>
                                        <Input
                                            id="spaceName"
                                            placeholder="My AI Space"
                                            value={formData.spaceName}
                                            onChange={(e) => setFormData({ ...formData, spaceName: e.target.value })}
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label>Space Type</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {spaceTypes.map((type) => (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, spacePurpose: type.id })}
                                                    className={`p-4 rounded-lg border text-left transition-all ${
                                                        formData.spacePurpose === type.id
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:bg-muted/50"
                                                    }`}
                                                >
                                                    <type.icon className="h-5 w-5 mb-2 text-primary" />
                                                    <div className="font-medium">{type.name}</div>
                                                    <div className="text-xs text-muted-foreground">{type.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={prevStep}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button onClick={nextStep} disabled={!formData.spaceName || !formData.spacePurpose} className="flex-1">
                                            Next
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 3: AI Model Selection */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="p-8">
                                <CardHeader>
                                    <CardTitle>Choose your AI setup</CardTitle>
                                    <CardDescription>
                                        Start with Oto AI or add your own models
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {!formData.useCustomAI ? (
                                        <div className="space-y-4">
                                            {/* Oto AI Option */}
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, aiModel: "oto-ai" })}
                                                className={`w-full p-6 rounded-lg border text-left transition-all ${
                                                    formData.aiModel === "oto-ai"
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border hover:bg-muted/50"
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                                                        <span className="text-white text-xl font-bold">O</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-lg">Continue with Oto AI</div>
                                                        <div className="text-sm text-muted-foreground">Our built-in AI model, optimized for your workflow</div>
                                                    </div>
                                                    {formData.aiModel === "oto-ai" && <Check className="h-5 w-5 text-primary" />}
                                                </div>
                                            </button>

                                            {/* Add Custom AI Option */}
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, useCustomAI: true })}
                                                className="w-full p-4 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                                            >
                                                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                    <Plus className="h-4 w-4" />
                                                    <span>Add AI Model</span>
                                                </div>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setFormData({ ...formData, useCustomAI: false, aiModel: "oto-ai" })}
                                                className="mb-4"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back to Oto AI
                                            </Button>

                                            <div className="space-y-3">
                                                {aiModels.slice(1).map((model) => (
                                                    <button
                                                        key={model.id}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, aiModel: model.id })}
                                                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                                                            formData.aiModel === model.id
                                                                ? "border-primary bg-primary/5"
                                                                : "border-border hover:bg-muted/50"
                                                        }`}
                                                    >
                                                        <div className="font-medium">{model.name}</div>
                                                        <div className="text-sm text-muted-foreground">{model.description}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={prevStep}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button onClick={nextStep} className="flex-1" disabled={!formData.aiModel}>
                                            Next
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 4: Goals & Interests */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="p-8">
                                <CardHeader>
                                    <CardTitle>What are your goals?</CardTitle>
                                    <CardDescription>
                                        Select your primary goals and interests to personalize your experience
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <Label className="text-base font-medium mb-3 block">Primary Goals (select at least 3)</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {goals.map((goal) => (
                                                <button
                                                    key={goal}
                                                    type="button"
                                                    onClick={() => handleGoalToggle(goal)}
                                                    className={`p-3 rounded-lg border text-left transition-all text-sm ${
                                                        formData.primaryGoals.includes(goal)
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:bg-muted/50"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{goal}</span>
                                                        {formData.primaryGoals.includes(goal) && <Check className="h-3 w-3 text-primary" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label className="text-base font-medium mb-3 block">Areas of Interest</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {interests.map((interest) => (
                                                <button
                                                    key={interest}
                                                    type="button"
                                                    onClick={() => handleInterestToggle(interest)}
                                                    className={`p-3 rounded-lg border text-left transition-all text-sm ${
                                                        formData.interests.includes(interest)
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:bg-muted/50"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{interest}</span>
                                                        {formData.interests.includes(interest) && <Check className="h-3 w-3 text-primary" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={prevStep}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button onClick={nextStep} disabled={formData.primaryGoals.length < 3} className="flex-1">
                                            Next
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 5: Complete */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="p-8">
                                <CardHeader className="text-center">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Target className="h-10 w-10 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">You're all set!</CardTitle>
                                    <CardDescription>
                                        Your AI space is ready. Let's start your journey with Oto.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                                        <h3 className="font-semibold">Your Configuration:</h3>
                                        <div className="space-y-2 text-sm">
                                            <div><strong>Space:</strong> {formData.spaceName}</div>
                                            <div><strong>AI Model:</strong> {aiModels.find(m => m.id === formData.aiModel)?.name}</div>
                                            <div><strong>Goals:</strong> {formData.primaryGoals.slice(0, 3).join(", ")}</div>
                                        </div>
                                    </div>
                                    
                                    <Button onClick={completeOnboarding} size="lg" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Setting up your space..." : "Enter Oto"}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
