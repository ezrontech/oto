"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Textarea } from "@oto/ui";
import { MessageSquare, Send, Check } from "lucide-react";

export default function FeedbackView() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <Check className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                    Your feedback has been received. We appreciate your help in making Oto better.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                    Send Another
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-4 sm:p-8 bg-gradient-to-br from-background to-muted/20">
            <div className="max-w-2xl mx-auto">
                <div className="flex flex-col items-center text-center space-y-4 mb-8">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Share Feedback</h1>
                        <p className="text-muted-foreground mt-2">
                            Help us improve. Report bugs, suggest features, or just say hello.
                        </p>
                    </div>
                </div>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-xl">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Feedback Type</Label>
                                    <select
                                        id="type"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="bug">Bug Report</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="improvement">Improvement</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <select
                                        id="priority"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="Brief summary of your feedback" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Please provide as much detail as possible..."
                                    className="min-h-[150px]"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                    {loading ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" /> Submit Feedback
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
