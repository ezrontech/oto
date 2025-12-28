"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@oto/ui";
import { Check, Zap, Rocket, Shield, Globe, Users, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";
import { PLAN_LIMITS, Plan } from "@/lib/plans";

export default function BillingView() {
    const { user } = useAuth();
    const [currentPlan, setCurrentPlan] = useState<Plan>('Community');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadUserPlan();
        }
    }, [user]);

    const loadUserPlan = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('plan')
            .eq('id', user?.id)
            .single();

        if (!error && data) {
            setCurrentPlan(data.plan as Plan);
        }
        setLoading(false);
    };

    const handleUpgrade = async (plan: Plan) => {
        setUpdating(plan);
        try {
            const { error } = await supabase
                .from('users')
                .update({ plan })
                .eq('id', user?.id);

            if (!error) {
                setCurrentPlan(plan);
                alert(`Successfully upgraded to ${plan} plan!`);
            } else {
                alert("Failed to upgrade plan.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    const plans = [
        {
            name: 'Community' as Plan,
            price: '$0',
            description: 'Perfect for individuals and small groups getting started.',
            features: [
                'Up to 3 Spaces',
                '10 Members per Space',
                'Core Social Features',
                'Standard AI Access',
                'Public Communities'
            ],
            icon: Globe,
            color: 'text-blue-500',
            buttonText: 'Current Plan'
        },
        {
            name: 'Creator' as Plan,
            price: '$29',
            description: 'For growing creators and professional teams.',
            features: [
                'Up to 10 Spaces',
                '50 Members per Space',
                'Advanced AI Agents',
                'Native Integrations (WhatsApp, Gmail)',
                'Priority Support',
                'Custom Branding'
            ],
            icon: Zap,
            color: 'text-purple-500',
            buttonText: 'Upgrade to Creator'
        },
        {
            name: 'Campaign' as Plan,
            price: '$99',
            description: 'For agencies and large-scale operations.',
            features: [
                'Up to 100 Spaces',
                '500 Members per Space',
                'Custom AI API Access (Bring your own AI)',
                'Full Labs Access (Custom Tools)',
                'Dedicated Account Manager',
                'Bulk Management Tools'
            ],
            icon: Rocket,
            color: 'text-orange-500',
            buttonText: 'Scale with Campaign'
        }
    ];

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="h-full overflow-y-auto p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Choose Your Path</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Unlock powerful tools, larger communities, and advanced AI agents tailored to your scale.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        const isCurrent = currentPlan === plan.name;

                        return (
                            <Card key={plan.name} className={`relative flex flex-col border-2 transition-all duration-300 ${isCurrent ? 'border-primary ring-1 ring-primary/20 scale-105 z-10' : 'border-border/50 hover:border-primary/30'}`}>
                                {isCurrent && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="px-4 py-1">Active Plan</Badge>
                                    </div>
                                )}
                                <CardHeader className="text-center pb-8 pt-6">
                                    <div className={`mx-auto h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-6`}>
                                        <Icon className={`h-8 w-8 ${plan.color}`} />
                                    </div>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <div className="mt-4 flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground">/month</span>
                                    </div>
                                    <CardDescription className="mt-4">{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col pt-0">
                                    <div className="space-y-4 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <div key={feature} className="flex items-start gap-3 text-sm">
                                                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Check className="h-3 w-3 text-primary" />
                                                </div>
                                                <span className="text-foreground/80">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        className="mt-auto w-full font-bold h-12"
                                        variant={isCurrent ? "secondary" : "default"}
                                        disabled={isCurrent || updating !== null}
                                        onClick={() => handleUpgrade(plan.name)}
                                    >
                                        {updating === plan.name ? 'Processing...' : plan.buttonText}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="bg-muted/30 border border-border/50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" /> Secure Payments
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-md">
                            We use Stripe for secure payment processing. You can cancel or change your plan at any time from your settings.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline">Billing FAQ</Button>
                        <Button variant="outline">Contact Sales</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
