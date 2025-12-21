"use client";

import { useState } from "react";
import {
    User,
    Shield,
    Bell,
    Globe,
    Briefcase,
    Link as LinkIcon,
    Camera,
    Check,
    Save,
    Eye,
    Mail,
    Lock,
    Settings as SettingsIcon,
    Plus,
    X,
    Layout,
    Palette,
    Bot,
    Laptop
} from "lucide-react";
import {
    Button,
    Input,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Switch,
    Label,
    Separator,
    ContactCard,
    Textarea,
    Badge,
    cn
} from "@oto/ui";
import { MOCK_CURRENT_USER } from "../../../data/mock";

export default function SettingsPage() {
    const [user, setUser] = useState(MOCK_CURRENT_USER);
    const [activeTab, setActiveTab] = useState("profile");

    const handleToggleMessages = () => {
        setUser((prev: any) => ({
            ...prev,
            settings: {
                ...prev.settings,
                receiveMessagesFromAnyone: !prev.settings.receiveMessagesFromAnyone
            }
        }));
    };

    const handleVisibilityChange = (visibility: "public" | "private" | "professional") => {
        setUser((prev: any) => ({
            ...prev,
            contactCard: {
                ...prev.contactCard,
                visibility
            }
        }));
    };

    const handleAddLink = () => {
        setUser((prev: any) => ({
            ...prev,
            contactCard: {
                ...prev.contactCard,
                links: [...prev.contactCard.links, { platform: "LinkedIn", url: "" }]
            }
        }));
    };

    const handleRemoveLink = (index: number) => {
        setUser((prev: any) => ({
            ...prev,
            contactCard: {
                ...prev.contactCard,
                links: prev.contactCard.links.filter((_: any, i: number) => i !== index)
            }
        }));
    };

    const handleLinkChange = (index: number, field: "platform" | "url", value: string) => {
        setUser((prev: any) => {
            const newLinks = [...prev.contactCard.links];
            newLinks[index] = { ...newLinks[index], [field]: value };
            return {
                ...prev,
                contactCard: {
                    ...prev.contactCard,
                    links: newLinks
                }
            };
        });
    };

    const handleBioChange = (bio: string) => {
        setUser((prev: any) => ({
            ...prev,
            contactCard: {
                ...prev.contactCard,
                bio
            }
        }));
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 overflow-y-auto">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and digital contact card.
                    </p>
                </div>
                <Button className="gap-2 rounded-xl">
                    <Save className="h-4 w-4" /> Save Changes
                </Button>
            </div>

            <Tabs defaultValue="profile" className="space-y-6" onValueChange={setActiveTab}>
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="profile" className="rounded-lg gap-2">
                        <User className="h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="card" className="rounded-lg gap-2">
                        <ContactCardIcon /> Contact Card
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="rounded-lg gap-2">
                        <Shield className="h-4 w-4" /> Privacy & Security
                    </TabsTrigger>
                    <TabsTrigger value="agency" className="rounded-lg gap-2">
                        <SettingsIcon className="h-4 w-4" /> Agency
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Public Profile</CardTitle>
                            <CardDescription>How others see you across the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/20">
                                        <User className="h-10 w-10 text-primary/40" />
                                    </div>
                                    <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-6 w-6 text-white" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-medium text-sm">Profile Picture</h4>
                                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                                    <div className="flex gap-2 pt-2">
                                        <Button variant="outline" size="sm">Upload</Button>
                                        <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Display Name</Label>
                                    <Input defaultValue={user.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input defaultValue={user.email} disabled />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label>Professional Title</Label>
                                    <Input defaultValue={user.role} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label>Agent Nickname</Label>
                                    <Input defaultValue={user.agentNickname} placeholder="e.g. Sarah from TechCo" />
                                    <p className="text-xs text-muted-foreground">
                                        This name will appear to clients in chat, email, and social media interactions instead of your real name.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Contact Card Tab */}
                <TabsContent value="card" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle>Digital Contact Card</CardTitle>
                                <CardDescription>Your business card for networking within Spaces.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label>Card Visibility</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <VisibilityButton
                                            active={user.contactCard.visibility === "public"}
                                            onClick={() => handleVisibilityChange("public")}
                                            icon={<Globe className="h-4 w-4" />}
                                            label="Public"
                                            desc="Anyone can see"
                                        />
                                        <VisibilityButton
                                            active={user.contactCard.visibility === "professional"}
                                            onClick={() => handleVisibilityChange("professional")}
                                            icon={<Briefcase className="h-4 w-4" />}
                                            label="Professional"
                                            desc="Show work info"
                                        />
                                        <VisibilityButton
                                            active={user.contactCard.visibility === "private"}
                                            onClick={() => handleVisibilityChange("private")}
                                            icon={<Lock className="h-4 w-4" />}
                                            label="Private"
                                            desc="Hidden from all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Bio / Tagline</Label>
                                    <Textarea
                                        defaultValue={user.contactCard.bio}
                                        onChange={(e) => handleBioChange(e.target.value)}
                                        placeholder="Write a brief bio about yourself..."
                                        className="min-h-[100px] resize-none"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Social & Search Links</Label>
                                        <Button variant="outline" size="sm" className="h-8 gap-1 rounded-lg" onClick={handleAddLink}>
                                            <Plus className="h-3.5 w-3.5" /> Add Link
                                        </Button>
                                    </div>
                                    {user.contactCard.links.length === 0 && (
                                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                            <p className="text-xs text-muted-foreground mb-3 text-center">Quick add popular platforms:</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {['LinkedIn', 'Twitter', 'GitHub', 'Instagram', 'Facebook', 'Website'].map((platform) => (
                                                    <Button
                                                        key={platform}
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 text-xs rounded-lg"
                                                        onClick={() => {
                                                            setUser((prev: any) => ({
                                                                ...prev,
                                                                contactCard: {
                                                                    ...prev.contactCard,
                                                                    links: [...prev.contactCard.links, { platform, url: '' }]
                                                                }
                                                            }));
                                                        }}
                                                    >
                                                        {platform}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-3">
                                        {user.contactCard.links.map((link: any, index: number) => (
                                            <div key={index} className="flex gap-3 items-start animate-in fade-in slide-in-from-top-1">
                                                <div className="w-[140px]">
                                                    <Input
                                                        value={link.platform}
                                                        onChange={(e) => handleLinkChange(index, "platform", e.target.value)}
                                                        placeholder="Platform"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Input
                                                        value={link.url}
                                                        onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 text-destructive hover:bg-destructive/5 rounded-lg"
                                                    onClick={() => handleRemoveLink(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input defaultValue={user.contactCard.company} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Live Preview</Label>
                        <ContactCard
                            user={user}
                            visibility={user.contactCard.visibility as any}
                            isOwnCard={true}
                        />
                        <p className="text-[10px] text-muted-foreground text-center">
                            This is how your card appears to other users in Communities and Clubs.
                        </p>
                    </div>
                </TabsContent>

                {/* Privacy & Security Tab */}
                <TabsContent value="privacy" className="space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Privacy Controls</CardTitle>
                            <CardDescription>Manage who can see your information and interact with you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Open Messaging</p>
                                    <p className="text-xs text-muted-foreground">Allow anyone to send you messages</p>
                                </div>
                                <Switch checked={user.settings.receiveMessagesFromAnyone} onCheckedChange={handleToggleMessages} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Show in Directory</p>
                                    <p className="text-xs text-muted-foreground">Appear in the agency member directory</p>
                                </div>
                                <Switch checked={user.settings.showInDirectory} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Activity Status</p>
                                    <p className="text-xs text-muted-foreground">Show when you're online or active</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Protect your account with additional security measures.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <div className="flex gap-2">
                                    <Input type="password" value="••••••••••" disabled className="flex-1" />
                                    <Button variant="outline">Change Password</Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                                </div>
                                <Button variant="outline" size="sm">Enable</Button>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <Label>Active Sessions</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Laptop className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Windows • Chrome</p>
                                                <p className="text-xs text-muted-foreground">Current session • San Francisco, CA</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="text-[10px]">Active</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Data & Privacy</CardTitle>
                            <CardDescription>Control how your data is used and stored.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Analytics & Insights</p>
                                    <p className="text-xs text-muted-foreground">Help improve Oto with usage data</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Download Your Data
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Agency Tab */}
                <TabsContent value="agency" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Agency Profile</CardTitle>
                                    <CardDescription>Configure your agency's presence and global settings.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Agency Name</Label>
                                            <Input defaultValue="Antigravity Media" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Primary Domain</Label>
                                            <Input defaultValue="antigravity.agency" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Branding</Label>
                                        <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-muted/20">
                                            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-white font-bold">A</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Primary Brand Color</p>
                                                <p className="text-xs text-muted-foreground">Used for buttons, links, and accents.</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="h-8 w-8 rounded-full bg-[#6366f1] border-2 border-background shadow-sm ring-2 ring-primary" />
                                                <div className="h-8 w-8 rounded-full bg-[#ec4899] border-2 border-background shadow-sm" />
                                                <div className="h-8 w-8 rounded-full bg-[#ef4444] border-2 border-background shadow-sm" />
                                                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
                                                    <Palette className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold flex items-center gap-2">
                                            <Bot className="h-4 w-4 text-primary" /> Default AI Settings
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium">Auto-Welcome New Members</p>
                                                    <p className="text-xs text-muted-foreground">AI Agent will send a DM to new space members.</p>
                                                </div>
                                                <Switch checked />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs">Default AI Greeting</Label>
                                                <Textarea
                                                    className="min-h-[60px] resize-none"
                                                    defaultValue="Welcome to the workspace! I'm the Antigravity assistant. How can I help you get started today?"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Agency Pulse</Label>
                            <Card className="border-border/50 bg-primary/5">
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Layout className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">128 Members</p>
                                            <p className="text-[10px] text-muted-foreground">Across 8 active spaces</p>
                                        </div>
                                    </div>
                                    <Separator className="bg-primary/10" />
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Resource usage</span>
                                            <span className="font-medium text-primary">82%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[82%]" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ContactCardIcon() {
    return (
        <div className="h-4 w-4 border border-current rounded-[2px] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-current rounded-full" />
        </div>
    );
}

function VisibilityButton({ active, onClick, icon, label, desc }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-left",
                active ? "border-primary bg-primary/5" : "border-border hover:border-border/80 bg-muted/20"
            )}
        >
            <div className={cn("p-2 rounded-lg", active ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                {icon}
            </div>
            <div className="text-center">
                <p className="text-xs font-bold">{label}</p>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">{desc}</p>
            </div>
        </button>
    );
}
