export const MOCK_AGENTS = [
    {
        id: "1",
        name: "Customer Support",
        role: "Service & Triaging",
        description: "Handles initial inquiries and manages WhatsApp tickets.",
        status: "active",
        avatar: "CS",
    },
    {
        id: "2",
        name: "Sales Lead",
        role: "Sales & CRM",
        description: "Qualifies leads and updates contact records.",
        status: "active",
        avatar: "SL",
    },
    {
        id: "3",
        name: "Social Manager",
        role: "Marketing",
        description: "Content creation (Canva) and scheduling.",
        status: "idle",
        avatar: "SM",
    },
    {
        id: "4",
        name: "Ops Admin",
        role: "Inventory & Admin",
        description: "Manages inventory logs and routine reporting.",
        status: "idle",
        avatar: "OP",
    },
];

export const MOCK_MESSAGES = [
    {
        id: 1,
        role: "user",
        content: "Check if we have any urgent messages on WhatsApp.",
        timestamp: "10:30 AM",
    },
    {
        id: 2,
        role: "assistant",
        content: "Checking Business WhatsApp API...",
        timestamp: "10:30 AM",
    },
    {
        id: 3,
        role: "assistant",
        isTool: true,
        toolName: "WhatsApp Integration",
        toolOutput: "Found 1 urgent message from +1 (555) 012-3456: 'Need to speak to the owner instantly regarding bulk order.'",
        timestamp: "10:31 AM",
    },
    {
        id: 4,
        role: "assistant",
        content: "It looks like a high-value lead requiring escalation. I can escalate this to your personal WhatsApp or email.",
        timestamp: "10:31 AM",
    },
    {
        id: 5,
        role: "user",
        content: "Send it to my personal WhatsApp and reply to them that the owner will call shortly.",
        timestamp: "10:32 AM",
    },
    {
        id: 6,
        role: "assistant",
        isTool: true,
        toolName: "Escalation Manager",
        toolOutput: "Forwarded to Owner (+1 415...). Auto-reply sent to customer.",
        timestamp: "10:32 AM",
    },
];

export const MOCK_FILES = [
    { id: "1", name: "Q3-Sales-Report.pdf", size: "2.4 MB", status: "Indexed" },
    { id: "2", name: "Inventory-Log-Dec.xlsx", size: "1.1 MB", status: "Processing" },
    { id: "3", name: "Customer-Feedback.txt", size: "12 KB", status: "Indexed" },
];

export const MOCK_CONTACTS = [
    {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1 (555) 000-1111",
        status: "Client",
        sentiment: "High",
        tags: ["High Value", "Tech"],
        notes: [
            { id: 1, content: "Interested in Q4 scaling strategy.", date: "Dec 18", author: "Oto AI" },
            { id: 2, content: "Prefers WhatsApp for quick updates.", date: "Dec 15", author: "Ezron" }
        ],
        activity: [
            { id: 1, type: "call", date: "Dec 19", summary: "Follow-up on proposal" },
            { id: 2, type: "email", date: "Dec 17", summary: "Sent brand guidelines" }
        ]
    },
    {
        id: 2,
        name: "Bob Smith",
        email: "bob@corp.com",
        phone: "+1 (555) 000-2222",
        status: "Customer",
        sentiment: "Neutral",
        tags: ["Retail"],
        notes: [],
        activity: []
    },
    {
        id: 3,
        name: "Charlie Brown",
        email: "charlie@startup.io",
        phone: "+1 (555) 000-3333",
        status: "Lead",
        sentiment: "High",
        tags: ["New Biz"],
        notes: [
            { id: 1, content: "Met at industry mixer. Wants a demo.", date: "Dec 20", author: "Sarah J." }
        ],
        activity: []
    },
];

export const MOCK_SEGMENTS = [
    { id: 1, name: "High Value Leads", criteria: "Status: Lead, Sentiment: High", count: 12 },
    { id: 2, name: "Active Clients", criteria: "Status: Client", count: 45 },
    { id: 3, name: "Re-engagement List", criteria: "Last activity > 30 days", count: 89 },
];

export const MOCK_CLIENTS = [
    { id: 1, name: "Acme Corp", industry: "Retail", status: "Active" },
    { id: 2, name: "TechStart Inc", industry: "SaaS", status: "Onboarding" },
    { id: 3, name: "Global Logistics", industry: "Transport", status: "Active" },
];

export const MOCK_TEAM = [
    { id: 1, name: "Ezron", role: "Owner" },
    { id: 2, name: "Sarah J.", role: "Account Manager" },
    { id: 3, name: "Mike T.", role: "Content Specialist" },
];

export const MOCK_TASKS = [
    { id: 1, title: "Q1 Marketing Strategy", client: "Acme Corp", assignee: "Sarah J.", status: "In Progress", due: "Dec 24" },
    { id: 2, title: "Logo Redesign", client: "TechStart Inc", assignee: "Mike T.", status: "Pending", due: "Dec 30" },
    { id: 3, title: "Monthly Report", client: "Global Logistics", assignee: "Oto AI", status: "Completed", due: "Dec 20" },
    { id: 4, title: "Social Media Audit", client: "Acme Corp", assignee: "Oto AI", status: "In Progress", due: "Dec 22" },
];

export const MOCK_SPACES = [
    { id: "1", name: "Acme Brand Strategy", type: "Team", members: 4, description: "Campaign planning for Q4.", role: "Admin" },
    { id: "2", name: "Agency Creators", type: "Community", members: 1240, description: "A public space for agency owners to share tips.", role: "Member" },
    { id: "3", name: "Weekend Golf Club", type: "Club", members: 12, description: "Tee times and events.", role: "Admin" },
];

export const MOCK_FEED = [
    {
        id: 1,
        user: { name: "Alice Strategy", handle: "@alice", avatar: "bg-indigo-100" },
        content: "Just launched a new campaign using Oto's automated agents. The ROI is looking incredible so far! 🚀 #AgencyLife #AI",
        time: "2h",
        likes: 124, comments: 12, shares: 5,
        type: "text"
    },
    {
        id: 2,
        user: { name: "Creative Dir", handle: "@danny_design", avatar: "bg-pink-100" },
        content: "Here are the initial moodboards for the Q1 rebrand. What do we think? I'm leaning towards the darker aesthetic.",
        time: "4h",
        likes: 89, comments: 34, shares: 2,
        type: "image",
        mediaUrl: "https://placehold.co/600x400/2a2a2a/FFF?text=Moodboard+V1"
    },
    {
        id: 3,
        user: { name: "Sarah Dev", handle: "@sarah_code", avatar: "bg-blue-100" },
        content: "Quick walkthrough of the new 'Club' features in the latest update. The shared calendar is a game changer for our team retreats.",
        time: "5h",
        likes: 245, comments: 56, shares: 12,
        type: "video",
        mediaUrl: "https://placehold.co/600x350/1e1e1e/FFF?text=Video+Walkthrough"
    },
];

export const MOCK_GOALS = [
    { id: 1, title: "Reach 10k Monthly Active Users", progress: 65, category: "Growth" },
    { id: 2, title: "Launch Oto v2.0 (Supabase)", progress: 40, category: "Product" },
    { id: 3, title: "Reduce Agent Response Latency < 1s", progress: 85, category: "Engineering" },
];

export const MOCK_CONTENT_PLAN = [
    { id: 1, title: "Blog: How AI Ops Managers are replacing traditional CX", status: "Drafting", date: "Dec 22" },
    { id: 2, title: "Twitter Stream: Live Agent Building", status: "Scheduled", date: "Dec 23" },
    { id: 3, title: "Newsletter: Why 'Spaces' are the new workplace", status: "To Do", date: "Dec 25" },
];

export const MOCK_EVENTS = [
    { id: 1, title: "Content Strategy Meeting", date: "Dec 21", time: "10:00 AM", type: "meeting" },
    { id: 2, title: "Instagram Post: Product Launch", date: "Dec 22", time: "09:00 AM", type: "content" },
    { id: 3, title: "LinkedIn Article: Industry Trends", date: "Dec 23", time: "11:00 AM", type: "content" },
    { id: 4, title: "Client Review: Acme Corp", date: "Dec 24", time: "02:00 PM", type: "meeting" },
];

export const MOCK_PRODUCTIVITY = {
    hoursSaved: 12.5,
    inquiriesResolved: 142,
    tasksAutomated: 48,
    efficiencyGain: 24, // percentage
};

export const MOCK_NOTES = [
    {
        id: 1,
        title: "Social Insight: Trending",
        content: "Your recent post about 'AI Ops' is gaining traction on LinkedIn. I recommend engaging with the 12 new comments to boost reach.",
        type: "social"
    },
    {
        id: 2,
        title: "News: Marketing Trends",
        content: "Industry News: New privacy updates for IG Ads arriving Q1. Should I review your current assets for compliance?",
        type: "news"
    },
    {
        id: 3,
        title: "Growth Tip",
        content: "Try connecting your 'Knowledge Base' to the Sales Agent to handle 30% more technical inquiries automatically.",
        type: "tip"
    }
];

export const MOCK_CONVERSATIONS = [
    {
        id: "conv_1",
        channel: "WhatsApp",
        contact: "Alice Johnson",
        messages: [
            { id: 1, role: "agent", content: "Hello! The owner will be with you shortly regarding the bulk order inquiry.", sender: "Oto Agent", timestamp: "10:30 AM" },
            { id: 2, role: "owner", content: "Hey Alice, I just saw this. I can jump on a call in 10 mins.", sender: "Alex from Antigravity", timestamp: "10:35 AM" },
            { id: 3, role: "user", content: "Perfect, 10 mins works for me. Speak then!", sender: "Alice Johnson", timestamp: "10:36 AM" }
        ]
    },
    {
        id: "conv_2",
        channel: "Instagram",
        contact: "creative_mind",
        messages: [
            { id: 1, role: "user", content: "Love your latest moodboard! Do you offer commissions?", sender: "@creative_mind", timestamp: "11:00 AM" },
            { id: 2, role: "agent", content: "Thanks for reaching out! Yes, commissions are open. What did you have in mind?", sender: "Oto Agent", timestamp: "11:05 AM" }
        ]
    }
];

export const MOCK_CURRENT_USER = {
    id: "usr_ezron",
    name: "Alex Rivera",
    email: "alex@antigravity.agency",
    role: "Agency Director",
    agentNickname: "Alex from Antigravity", // Client-facing name
    avatar: "bg-indigo-600",
    settings: {
        receiveMessagesFromAnyone: true,
        showInDirectory: true,
        theme: "dark",
        notifications: {
            email: true,
            push: true,
            marketing: false
        }
    },
    contactCard: {
        visibility: "professional", // "public" | "private" | "professional"
        bio: "Director at Antigravity Media. Specialized in AI automation and omnichannel strategy for growth-stage startups.",
        title: "Agency Director",
        company: "Antigravity Media",
        connections: 1240,
        tags: ["AI Strategy", "Growth", "Automation"],
        links: [
            { platform: "LinkedIn", url: "https://linkedin.com/in/alexrivera" },
            { platform: "Twitter", url: "https://twitter.com/alex_rivera" },
            { platform: "GitHub", url: "https://github.com/alexrivera" },
            { platform: "Website", url: "https://antigravity.agency" }
        ]
    }
};
