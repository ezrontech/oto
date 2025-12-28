"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Input, Avatar, AvatarFallback, ScrollArea, Separator, Badge, cn } from "@oto/ui";

import { ControlPanel } from "@/components/os/ControlPanel";
import { useAuth } from "@/components/auth-provider";
import { useWindowManager } from "@/context/window-manager";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

// Dynamic imports for views
const LoginView = dynamic(() => import('@/components/views/auth/LoginView'), { loading: () => null });
const SignupView = dynamic(() => import('@/components/views/auth/SignupView'), { loading: () => null });
const SettingsView = dynamic(() => import('@/components/views/SettingsView'), { loading: () => null });
const FeedbackView = dynamic(() => import('@/components/views/FeedbackView'), { loading: () => null });
const ConversationsView = dynamic(() => import('@/components/views/ConversationsView'), { loading: () => null });
const BillingView = dynamic(() => import('@/components/views/BillingView'), { loading: () => null });

import {
    Bell, Megaphone, User, LogOut, Settings, Zap, ChevronDown,
    Twitter, Github, Linkedin, Sparkles, Bot, Send, ChevronRight, History,
    Shield, CreditCard, Layout, Sun, Moon
} from "lucide-react";

// Helper for Dropdowns
function HeaderDropdown({ trigger, children, align = "left" }: { trigger: React.ReactNode, children: React.ReactNode, align?: "left" | "right" }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "absolute top-full mt-2 w-56 rounded-xl border bg-popover text-popover-foreground shadow-lg overflow-hidden z-50",
                            align === "right" ? "right-0" : "left-0"
                        )}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Menu Item Component
function DropdownItem({ icon: Icon, children, onClick, active }: any) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground",
                active && "bg-accent/50 text-accent-foreground font-medium"
            )}
        >
            {Icon && <Icon className="h-4 w-4 opacity-70" />}
            {children}
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
        </div>
    );
}

interface MessageOption {
    label: string;
    action: string;
    value?: string;
    variant?: "default" | "outline" | "ghost" | "secondary";
}

interface ActionRequest {
    type: 'open_window';
    label: string;
    data: {
        id: string;
        title: string;
        component: React.ReactNode;
    };
    autoApproveKey?: string;
}

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    options?: MessageOption[];
    actionRequest?: ActionRequest;
}

// Action Card Component
function ActionCard({ request, onExecute }: { request: ActionRequest, onExecute: () => void }) {
    const [status, setStatus] = useState<'idle' | 'counting' | 'executed'>('idle');
    const [countdown, setCountdown] = useState(3);
    const [autoApprove, setAutoApprove] = useState(false);

    useEffect(() => {
        if (request.autoApproveKey) {
            const saved = localStorage.getItem(`auto_approve_${request.autoApproveKey}`);
            if (saved === 'true') {
                setAutoApprove(true);
                setStatus('counting');
            }
        }
    }, [request.autoApproveKey]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === 'counting') {
            if (countdown > 0) {
                timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            } else {
                execute();
            }
        }
        return () => clearTimeout(timer);
    }, [status, countdown]);

    const execute = () => {
        setStatus('executed');
        onExecute();
    };

    const toggleAutoApprove = () => {
        const newState = !autoApprove;
        setAutoApprove(newState);
        if (request.autoApproveKey) {
            localStorage.setItem(`auto_approve_${request.autoApproveKey}`, String(newState));
        }
    };

    if (status === 'executed') {
        return (
            <div className="flex items-center gap-2 text-sm text-green-500 font-medium mt-2">
                <Zap className="h-4 w-4" />
                Action Executed
            </div>
        );
    }

    if (status === 'counting') {
        return (
            <div className="flex items-center gap-3 mt-2 bg-muted/30 p-2 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Auto-opening in {countdown}s...
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-destructive/10 hover:text-destructive" onClick={() => setStatus('idle')}>
                    Cancel
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 mt-2">
            <Button
                onClick={execute}
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-lg"
            >
                {request.label} <ChevronRight className="h-3 w-3 opacity-50" />
            </Button>

            {request.autoApproveKey && (
                <HeaderDropdown
                    trigger={
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
                            <ChevronDown className="h-3 w-3" />
                        </Button>
                    }
                >
                    <div className="p-1 w-48">
                        <div
                            className="flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-accent rounded-md cursor-pointer select-none"
                            onClick={toggleAutoApprove}
                        >
                            <div className={cn("w-3 h-3 border rounded-sm flex items-center justify-center", autoApprove ? "bg-primary border-primary" : "border-muted-foreground")}>
                                {autoApprove && <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />}
                            </div>
                            <div className="flex flex-col">
                                <span>Auto-approve next time</span>
                                <span className="text-[10px] text-muted-foreground">Wait 3s then confirm</span>
                            </div>
                        </div>
                    </div>
                </HeaderDropdown>
            )}
        </div>
    );
}

export function OtoChatDesktop() {
    const { user, loading, signOut } = useAuth();
    const { openWindow } = useWindowManager();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [hasInteracted, setHasInteracted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [selectedModel, setSelectedModel] = useState("Oto AI 1.0 (Default)");
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Initialize Theme
    useEffect(() => {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem("theme");
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === "dark" || (!savedTheme && systemDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        processUserMessage(inputValue);
    };

    const processUserMessage = (content: string) => {
        setHasInteracted(true);

        const newMessage: Message = {
            id: messages.length + 1,
            role: "user",
            content: content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");

        if (!user) {
            handleGuestOnboarding(content);
        } else {
            setTimeout(() => {
                const responseMsg: Message = {
                    id: messages.length + 2,
                    role: "assistant",
                    content: "I'm processing that for you.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, responseMsg]);
            }, 1000);
        }
    }

    const handleOptionClick = (option: MessageOption) => {
        // User "says" the option label
        processUserMessage(option.label);
    };

    const handleGuestOnboarding = (userEffectiveInput: string) => {
        const lowerInput = userEffectiveInput.toLowerCase();

        setTimeout(() => {
            let responseMsg: Message = {
                id: Date.now(),
                role: "assistant",
                content: "",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            let nextStep = onboardingStep;

            if (onboardingStep === 0) {
                // Step 0: Welcoming Guide
                responseMsg.content = "Welcome to Oto! I'm here to help you organize your digital life and get things done. To get started, what's your main focus today?";
                responseMsg.options = [
                    { label: "Organize my Work", action: "work", variant: "default" },
                    { label: "Personal Projects", action: "personal", variant: "outline" },
                    { label: "Just Exploring", action: "explore", variant: "ghost" }
                ];
                nextStep = 1;
            } else if (onboardingStep === 1) {
                // Step 1: Contextual Response + Action Request
                if (lowerInput.includes("work")) {
                    responseMsg.content = "Excellent. I can help you manage projects, schedule meetings, and automate workflows.";
                    responseMsg.actionRequest = {
                        type: 'open_window',
                        label: 'Create Work Account',
                        data: { id: "signup", title: "Create Account", component: <SignupView /> },
                        autoApproveKey: 'auth_window'
                    };
                    nextStep = 2;
                } else if (lowerInput.includes("personal")) {
                    responseMsg.content = "Great choice. I can help you track habits, manage finances, and plan events. Let's create your personal account to get started.";
                    responseMsg.actionRequest = {
                        type: 'open_window',
                        label: 'Create Personal Account',
                        data: { id: "signup", title: "Create Account", component: <SignupView /> },
                        autoApproveKey: 'auth_window'
                    };
                    nextStep = 2;
                } else if (lowerInput.includes("explore")) {
                    responseMsg.content = "Feel free to look around! I can show you how to use Agents or manage your Knowledge Base. When you're ready to save your progress, you'll need an account.";
                    responseMsg.options = [
                        { label: "Create Account", action: "signup", variant: "default" },
                        { label: "I have an account", action: "login", variant: "outline" }
                    ];
                    nextStep = 2;
                } else {
                    // Fallback
                    responseMsg.content = "I'd love to help with that. To give you the full experience, let's get you set up with an account.";
                    responseMsg.actionRequest = {
                        type: 'open_window',
                        label: 'Create Account',
                        data: { id: "signup", title: "Create Account", component: <SignupView /> },
                        autoApproveKey: 'auth_window'
                    };
                    nextStep = 2;
                }
            } else if (onboardingStep === 2) {
                if (lowerInput.includes("create") || lowerInput.includes("signup")) {
                    responseMsg.content = "Perfect. Ready to create your account?";
                    responseMsg.actionRequest = {
                        type: 'open_window',
                        label: 'Open Sign Up',
                        data: { id: "signup", title: "Create Account", component: <SignupView /> },
                        autoApproveKey: 'auth_window'
                    };
                    nextStep = 3;
                } else if (lowerInput.includes("login") || lowerInput.includes("have")) {
                    responseMsg.content = "Welcome back. Opening the login window...";
                    responseMsg.actionRequest = {
                        type: 'open_window',
                        label: 'Open Sign In',
                        data: { id: "login", title: "Sign In", component: <LoginView /> },
                        autoApproveKey: 'auth_window'
                    };
                    nextStep = 3;
                } else {
                    responseMsg.content = "Please sign in or create an account to continue.";
                }
            } else {
                responseMsg.content = "Please complete the authentication process in the window.";
            }

            setMessages(prev => [...prev, responseMsg]);
            setOnboardingStep(nextStep);

        }, 600);
    };

    // Interactive Bouncing Ball
    function InteractiveBall() {
        const containerRef = useRef<HTMLDivElement>(null);
        const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

        const handleMouseMove = (e: React.MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const moveX = (e.clientX - centerX) / 10;
            const moveY = (e.clientY - centerY) / 10;
            setMousePos({ x: moveX, y: moveY });
        };

        return (
            <div
                ref={containerRef}
                className="h-20 w-full flex flex-col items-center justify-center cursor-pointer perspective-1000 relative"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            >
                {/* Bouncing Ball (O-Shape) with Golden Glow */}
                <motion.div
                    className="w-14 h-14 rounded-full border-[3px] border-foreground/60 bg-transparent relative z-10 box-border shadow-[0_0_20px_rgba(255,215,0,0.35)] dark:shadow-[0_0_25px_rgba(255,215,0,0.45)]"
                    animate={{
                        y: [-5, -18, -5], // Tight bounce
                        x: mousePos.x,
                        rotate: mousePos.x * 1.5
                    }}
                    transition={{
                        y: {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                        x: {
                            type: "spring",
                            stiffness: 80,
                            damping: 12
                        }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                />

                {/* Shadow below - syncs with ball position */}
                <motion.div
                    className="absolute bottom-3 w-9 h-1 rounded-[100%] bg-foreground/40 dark:bg-foreground/50 blur-[3px]"
                    animate={{
                        x: mousePos.x, // Shadow follows ball
                        scaleX: [1, 0.75, 1],
                        opacity: [0.4, 0.25, 0.4]
                    }}
                    transition={{
                        x: {
                            type: "spring",
                            stiffness: 80,
                            damping: 12
                        },
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>
        );
    }

    // Custom Saturn Icon
    function OtoLogo({ className }: { className?: string }) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <circle cx="12" cy="12" r="6" />
                <path d="M3 12h1m16 0h1m-9.5-8.5v1m0 15v1" opacity="0.2" />
                <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-15 12 12)" />
            </svg>
        );
    }
    // Helper to get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="flex h-full w-full bg-background overflow-hidden flex-col relative transition-all duration-700">

            {/* HEADER */}
            <motion.header
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-14 flex items-center justify-between px-6 bg-transparent absolute top-0 w-full z-50"
            >
                {/* Left: Model Selector */}
                <div className="flex items-center gap-3">
                    <HeaderDropdown
                        trigger={
                            <div className="flex items-center gap-3 hover:bg-muted/50 p-1.5 pr-3 rounded-xl transition-colors">
                                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <OtoLogo className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-sm leading-none">Oto</span>
                                    <span className="text-[10px] text-muted-foreground leading-none mt-1 flex items-center gap-1">
                                        {selectedModel} <ChevronDown className="h-2 w-2" />
                                    </span>
                                </div>
                            </div>
                        }
                    >
                        <div className="p-1">
                            <DropdownItem
                                icon={Sparkles}
                                onClick={() => setSelectedModel("Oto AI 1.0 (Default)")}
                                active={selectedModel === "Oto AI 1.0 (Default)"}
                            >
                                Oto AI 1.0
                            </DropdownItem>
                            <DropdownItem
                                icon={Zap}
                                onClick={() => setSelectedModel("GPT-4 Turbo")}
                                active={selectedModel === "GPT-4 Turbo"}
                            >
                                GPT-4 Turbo
                            </DropdownItem>
                            <DropdownItem
                                icon={Bot}
                                onClick={() => setSelectedModel("Claude 3 Opus")}
                                active={selectedModel === "Claude 3 Opus"}
                            >
                                Claude 3 Opus
                            </DropdownItem>
                            <Separator className="my-1" />
                            <DropdownItem icon={Settings} onClick={() => alert("Model Settings")}>
                                Manage Models
                            </DropdownItem>
                        </div>
                    </HeaderDropdown>
                </div>

                {/* Right: Actions & User */}
                <div className="flex items-center gap-2 md:gap-4">

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={toggleTheme}
                    >
                        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>

                    {/* Feedback */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => openWindow("feedback", "Feedback", <FeedbackView />)}>
                        <Megaphone className="h-4 w-4" />
                    </Button>

                    {/* Notifications */}
                    <HeaderDropdown align="right" trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-background"></span>
                        </Button>
                    }>
                        <div className="w-64">
                            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Updates</div>
                            <Separator />
                            <div className="max-h-64 overflow-y-auto">
                                <div className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-primary">New Feature</span>
                                        <span className="text-[10px] text-muted-foreground">Now</span>
                                    </div>
                                    <p className="text-xs">Agents Intelligence View is now live! Monitor your workforce.</p>
                                </div>
                                <div className="p-3 hover:bg-muted/50 cursor-pointer transition-colors border-t border-border/50">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-green-500">System</span>
                                        <span className="text-[10px] text-muted-foreground">2h ago</span>
                                    </div>
                                    <p className="text-xs">Maintenance completed successfully.</p>
                                </div>
                            </div>
                        </div>
                    </HeaderDropdown>

                    {/* User Menu */}
                    {!user && !loading ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openWindow("login", "Sign In", <LoginView />)}
                        >
                            Sign In
                        </Button>
                    ) : (
                        <HeaderDropdown align="right" trigger={
                            <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded-full transition-colors pl-2">
                                <div className="hidden md:flex flex-col items-end mr-1">
                                    <span className="text-xs font-semibold">{user?.name || "User"}</span>
                                    <span className="text-[10px] text-muted-foreground capitalize">{user?.plan || "Guest"}</span>
                                </div>
                                <Avatar className="h-8 w-8 border border-border">
                                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-purple-600 text-white">
                                        {user?.name?.slice(0, 2).toUpperCase() || "GU"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        }>
                            <div className="p-1 w-56">
                                <DropdownItem icon={History} onClick={() => openWindow("history", "Conversation History", <ConversationsView />)}>
                                    History
                                </DropdownItem>
                                <DropdownItem icon={User} onClick={() => openWindow("settings", "Settings", <SettingsView initialTab="profile" />)}>
                                    Profile
                                </DropdownItem>
                                <DropdownItem icon={Shield} onClick={() => openWindow("settings", "Settings", <SettingsView initialTab="security" />)}>
                                    Security
                                </DropdownItem>
                                <DropdownItem icon={CreditCard} onClick={() => openWindow("billing", "Billing & Plans", <BillingView />)}>
                                    Billing
                                </DropdownItem>
                                <DropdownItem icon={Zap} onClick={() => openWindow("labs", "Labs", <LabsView />)}>
                                    Labs
                                </DropdownItem>
                                <Separator className="my-1" />
                                <DropdownItem icon={LogOut} onClick={() => signOut()}>
                                    Sign Out
                                </DropdownItem>
                            </div>
                        </HeaderDropdown>
                    )}
                </div>
            </motion.header>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 relative flex flex-col justify-center">
                {hasInteracted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="absolute inset-0 top-14 bottom-32 overflow-hidden" // Adjusted bottom margin for footer
                    >
                        <ScrollArea className="h-full px-4" ref={scrollRef}>
                            <div className="space-y-6 max-w-3xl mx-auto py-8">
                                {messages.map((msg) => {
                                    const isUser = msg.role === "user";
                                    return (
                                        <div key={msg.id} className={cn(
                                            "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
                                            isUser ? "flex-row-reverse" : "flex-row"
                                        )}>
                                            <div className="w-8 h-8 flex-shrink-0 flex items-start justify-center mt-1">
                                                {isUser ? (
                                                    <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center">
                                                        <span className="text-[10px] font-bold">YOU</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Bot className="h-4 w-4 text-primary" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className={cn("flex flex-col gap-2 max-w-[80%]", isUser && "items-end")}>
                                                <div className={cn(
                                                    "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                    isUser
                                                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                        : "bg-card border border-border rounded-tl-sm"
                                                )}>
                                                    {msg.content}
                                                </div>

                                                {/* Action Request Card */}
                                                {!isUser && msg.actionRequest && (
                                                    <ActionCard
                                                        request={msg.actionRequest}
                                                        onExecute={() => {
                                                            if (msg.actionRequest?.type === 'open_window') {
                                                                openWindow(
                                                                    msg.actionRequest.data.id,
                                                                    msg.actionRequest.data.title,
                                                                    msg.actionRequest.data.component
                                                                );
                                                            }
                                                        }}
                                                    />
                                                )}

                                                {/* Interactive Options RENDERER */}
                                                {!isUser && msg.options && (
                                                    <div className="flex flex-wrap gap-2 mt-1 animate-in fade-in slide-in-from-top-1 duration-300">
                                                        {msg.options.map((option, idx) => (
                                                            <Button
                                                                key={idx}
                                                                variant={option.variant || "outline"}
                                                                size="sm"
                                                                className="rounded-xl h-8 text-xs gap-1"
                                                                onClick={() => handleOptionClick(option)}
                                                            >
                                                                {option.label}
                                                                <ChevronRight className="h-3 w-3 opacity-50" />
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </motion.div>
                )}

                {!hasInteracted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98, display: "none" }}
                        className="absolute top-[20%] left-0 right-0 flex flex-col items-center justify-center space-y-2 z-0"
                    >
                        <InteractiveBall />

                        <div className="flex flex-col items-center space-y-1 text-center max-w-lg px-4">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground/70">
                                {getGreeting()}{user ? `, ${user.name}` : ""}
                            </h1>
                            <p className="text-foreground/45 text-sm leading-relaxed max-w-sm">
                                {user ? "Your intelligent workspace is ready." : "Ask questions, get help with your work, and manage your tasks seamlessly with Oto!"}
                            </p>
                        </div>

                        {/* Context Snippets */}
                        <div className="flex gap-3 mt-2">
                            {user ? (
                                <>
                                    <Badge variant="secondary" className="px-3 py-1.5 h-auto text-xs font-normal bg-card/50 border-input/50 backdrop-blur-sm gap-2">
                                        <Bot className="h-3.5 w-3.5 text-primary" />
                                        <span>3 Agents Active</span>
                                    </Badge>
                                    <Badge variant="secondary" className="px-3 py-1.5 h-auto text-xs font-normal bg-card/50 border-input/50 backdrop-blur-sm gap-2">
                                        <Zap className="h-3.5 w-3.5 text-yellow-500" />
                                        <span>System Optimal</span>
                                    </Badge>
                                </>
                            ) : (
                                <>
                                    <Badge variant="outline" className="px-3 py-1.5 h-auto text-xs font-normal bg-card/50 backdrop-blur-sm cursor-pointer hover:bg-accent transition-colors gap-2" onClick={() => handleGuestOnboarding("start")}>
                                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                                        <span>Start New Journey</span>
                                    </Badge>
                                    <Badge variant="outline" className="px-3 py-1.5 h-auto text-xs font-normal bg-card/50 backdrop-blur-sm cursor-pointer hover:bg-accent transition-colors gap-2" onClick={() => handleGuestOnboarding("explore")}>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                        <span>Explore Capabilities</span>
                                    </Badge>
                                </>
                            )}
                        </div>
                    </motion.div>
                )
                }
            </div >

            {/* INPUT AREA & FOOTER */}
            {/* Wrapper for positioning input */}
            <motion.div
                layout
                className={cn(
                    "z-20 w-full max-w-2xl px-4 transition-all duration-700",
                    hasInteracted ? "relative mx-auto mb-4" : "absolute top-[52%] left-0 right-0 mx-auto"
                )}
            >
                <div className="w-full relative shadow-2xl rounded-[28px] bg-card border border-input/50 backdrop-blur-xl">
                    <div className="relative flex items-end gap-2 p-2 pl-3">
                        <div className="mb-1">
                            <ControlPanel />
                        </div>
                        <Separator orientation="vertical" className="h-8 mb-1 bg-border/40" />
                        <Input
                            placeholder={user ? "Ask me anything..." : "Say hello to start..."}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 min-h-[48px] py-3.5 text-base bg-transparent shadow-none"
                            autoFocus
                        />
                        <Button
                            size="icon"
                            onClick={handleSend}
                            className="h-10 w-10 shrink-0 mb-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-95"
                            disabled={!inputValue.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 flex flex-col items-center gap-1 text-[10px] text-muted-foreground font-medium text-center"
                >
                    <p>Powered by Oto.ai. Oto can make mistakes. Check important info.</p>
                </motion.div>
            </motion.div>

            {/* FOOTER - Only visible on initial screen */}
            <AnimatePresence>
                {!hasInteracted && (
                    <motion.footer
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-0 left-0 right-0 w-full grid grid-cols-2 md:grid-cols-3 items-center text-xs text-muted-foreground pb-4 px-8 pointer-events-none"
                    >
                        {/* Left Footer */}
                        <div className="flex items-center gap-4 justify-start pointer-events-auto">
                            <span className="hover:text-foreground cursor-pointer transition-colors">Oto © 2025</span>
                            <span className="hover:text-foreground cursor-pointer transition-colors hidden sm:inline">Privacy</span>
                            <span className="hover:text-foreground cursor-pointer transition-colors hidden sm:inline">Terms</span>
                        </div>

                        {/* Middle Footer (Hidden on Mobile) */}
                        <div className="hidden md:flex items-center gap-4 justify-center pointer-events-auto">
                            <div className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition-colors">
                                <Sparkles className="h-3 w-3" />
                                <span>AI Powered</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-border" />
                            <div className="hover:text-foreground cursor-pointer transition-colors">
                                v2.4.0 (Beta)
                            </div>
                        </div>

                        {/* Right Footer */}
                        <div className="flex items-center gap-4 justify-end pointer-events-auto">
                            <a href="#" className="hover:text-foreground transition-colors"><Twitter className="h-3 w-3" /></a>
                            <a href="#" className="hover:text-foreground transition-colors"><Github className="h-3 w-3" /></a>
                            <a href="#" className="hover:text-foreground transition-colors"><Linkedin className="h-3 w-3" /></a>
                        </div>
                    </motion.footer>
                )}
            </AnimatePresence>
        </div >

    );
}
