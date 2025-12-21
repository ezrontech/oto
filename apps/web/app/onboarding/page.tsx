"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@oto/ui";
import { ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: "",
        goals: [] as string[],
    });

    const nextStep = () => setStep(step + 1);

    const roles = ["Founder", "Freelancer", "Engineer", "Designer", "Other"];
    const goals = ["Automate Workflows", "Manage Knowledge", "Code Assistance", "Research Optimization"];

    const handleRoleSelect = (role: string) => {
        setFormData({ ...formData, role });
    };

    const handleGoalToggle = (goal: string) => {
        setFormData((prev) => ({
            ...prev,
            goals: prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal]
        }));
    };

    const finish = () => {
        router.push("/chat");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-lg">
                <div className="mb-8 flex justify-center">
                    {/* Progress Dots */}
                    <div className="flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-2 w-2 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Welcome to Oto</CardTitle>
                                    <CardDescription>First, define your role so Oto can adapt to you.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-3">
                                    {roles.map((role) => (
                                        <Button
                                            key={role}
                                            variant={formData.role === role ? "default" : "outline"}
                                            className="h-20 text-lg"
                                            onClick={() => handleRoleSelect(role)}
                                        >
                                            {role}
                                        </Button>
                                    ))}
                                </CardContent>
                                <div className="p-6 pt-0 flex justify-end">
                                    <Button onClick={nextStep} disabled={!formData.role}>
                                        Next <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>What are your goals?</CardTitle>
                                    <CardDescription>Select all that apply.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {goals.map((goal) => (
                                        <div
                                            key={goal}
                                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${formData.goals.includes(goal)
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:bg-muted/50"
                                                }`}
                                            onClick={() => handleGoalToggle(goal)}
                                        >
                                            <span className="font-medium">{goal}</span>
                                            {formData.goals.includes(goal) && <Check className="h-4 w-4 text-primary" />}
                                        </div>
                                    ))}
                                </CardContent>
                                <div className="p-6 pt-0 flex justify-end">
                                    <Button onClick={nextStep} disabled={formData.goals.length === 0}>
                                        Next <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>All set!</CardTitle>
                                    <CardDescription>Oto is ready to be your operating partner.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center py-8">
                                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-4xl">O</span>
                                    </div>
                                    <p className="text-center text-muted-foreground">
                                        We've set up your workspace for a <strong>{formData.role}</strong> focused on <strong>{formData.goals.join(", ")}</strong>.
                                    </p>
                                </CardContent>
                                <div className="p-6 pt-0 flex justify-end">
                                    <Button onClick={finish} size="lg" className="w-full">
                                        Enter Workspace
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
