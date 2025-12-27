"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    CreditCard,
    Database,
    Smartphone,
    Monitor,
    Moon,
    Sun,
    Palette
} from "lucide-react";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
    Button, Input, Label, Textarea, Switch, Separator, Badge,
    Tabs, TabsList, TabsTrigger, TabsContent, Avatar, AvatarFallback
} from "@oto/ui";
import { useAuth } from "@/components/auth-provider";

export default function SettingsPage() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState({
        name: "",
        email: "",
        bio: "",
        company: "",
        role: ""
    });

    useEffect(() => {
        if (user) {
            setUserProfile({
                name: user.name || "",
                email: user.email || "",
                bio: (user as any).bio || "",
                company: (user as any).company || "",
                role: (user as any).role || ""
            });
        }
    }, [user]);

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userProfile)
            });
            
            if (res.ok) {
                // Profile updated successfully
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="h-full overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your account and application preferences.</p>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="integrations">Integrations</TabsTrigger>
                        <TabsTrigger value="billing">Billing</TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Update your personal information and profile details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarFallback className="text-lg">
                                            {userProfile.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Button variant="outline" size="sm">
                                            <Camera className="h-4 w-4 mr-2" />
                                            Change Avatar
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            JPG, PNG or GIF. Max 2MB.
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={userProfile.name}
                                            onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={userProfile.email}
                                            onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company</Label>
                                        <Input
                                            id="company"
                                            value={userProfile.company}
                                            onChange={(e) => setUserProfile(prev => ({ ...prev, company: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input
                                            id="role"
                                            value={userProfile.role}
                                            onChange={(e) => setUserProfile(prev => ({ ...prev, role: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell us about yourself..."
                                        value={userProfile.bio}
                                        onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                                    />
                                </div>
                                <Button onClick={handleSaveProfile} disabled={loading}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Sign Out Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Actions</CardTitle>
                                <CardDescription>
                                    Manage your account session.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Sign Out</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Sign out of your account on this device.
                                        </p>
                                    </div>
                                    <Button variant="outline" onClick={handleSignOut}>
                                        Sign Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Security Settings
                                </CardTitle>
                                <CardDescription>
                                    Manage your password and security preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input id="current-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                                <Button>Update Password</Button>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Two-Factor Authentication</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Add an extra layer of security to your account.
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delete Account Section */}
                        <Card className="border-destructive/20">
                            <CardHeader>
                                <CardTitle className="text-destructive">Delete Account</CardTitle>
                                <CardDescription>
                                    Permanently delete your account and all data. This action cannot be undone.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-destructive">Delete Account</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Permanently delete your account and all data.
                                        </p>
                                    </div>
                                    <Button variant="destructive">
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notification Preferences
                                </CardTitle>
                                <CardDescription>
                                    Choose what notifications you want to receive.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Email Notifications</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Receive email updates about your account activity.
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Agent Notifications</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Get notified when agents complete tasks.
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Newsletter Updates</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Receive updates about new features and improvements.
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Integrations Tab */}
                    <TabsContent value="integrations" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LinkIcon className="h-5 w-5" />
                                    Connected Services
                                </CardTitle>
                                <CardDescription>
                                    Manage your third-party integrations and connections.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center py-8">
                                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No Integrations Yet</h3>
                                    <p className="text-muted-foreground mb-4">Connect your favorite tools and services</p>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Integration
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Billing Tab */}
                    <TabsContent value="billing" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Billing & Subscription
                                </CardTitle>
                                <CardDescription>
                                    Manage your subscription and payment methods.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">Free Plan</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Basic features with limited usage
                                        </p>
                                    </div>
                                    <Badge variant="secondary">Current Plan</Badge>
                                </div>
                                <Button className="w-full">
                                    Upgrade to Pro
                                </Button>
                                <Separator />
                                <div className="text-center py-8">
                                    <h3 className="text-lg font-semibold mb-2">No Payment Methods</h3>
                                    <p className="text-muted-foreground mb-4">Add a payment method to upgrade your plan</p>
                                    <Button variant="outline">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Payment Method
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
