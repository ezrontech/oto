"use client";

import { use, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Separator, Tabs, TabsList, TabsTrigger, TabsContent, Sheet, SheetContent } from "@oto/ui";
import { Plus, Search, MoreHorizontal, Phone, Mail, Filter, Users, Tag, MessageSquare, History, Sparkles, Send, Share2, ChevronRight, FileText, Info, X } from "lucide-react";
import { MOCK_CONTACTS, MOCK_SEGMENTS } from "../../../data/mock";

export default function ContactsPage() {
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [activeSegment, setActiveSegment] = useState<any>(null);

    const filteredContacts = activeSegment
        ? MOCK_CONTACTS.filter(c => c.status === activeSegment.name.split(' ')[1] || c.status === activeSegment.name.split(' ')[0])
        : MOCK_CONTACTS;

    return (
        <div className="h-full flex flex-col md:flex-row overflow-hidden bg-background">

            {/* SIDEBAR: SEGMENTS */}
            <aside className="w-full md:w-64 border-r bg-muted/10 p-4 space-y-6 overflow-y-auto">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Segments</h3>
                    <div className="space-y-1">
                        <Button
                            variant={!activeSegment ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => setActiveSegment(null)}
                        >
                            <Users className="h-4 w-4" /> All Contacts
                        </Button>
                        {MOCK_SEGMENTS.map(segment => (
                            <Button
                                key={segment.id}
                                variant={activeSegment?.id === segment.id ? "secondary" : "ghost"}
                                className="w-full justify-start gap-2 group"
                                onClick={() => setActiveSegment(segment)}
                            >
                                <Tag className="h-4 w-4 text-primary" />
                                <span className="flex-1 text-left">{segment.name}</span>
                                <Badge variant="outline" className="text-[10px] group-hover:bg-background">{segment.count}</Badge>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-primary italic">Oto Tip</span>
                    </div>
                    <p className="text-[11px] leading-tight text-muted-foreground">
                        "I can automatically group contacts who haven't been messaged in 30 days."
                    </p>
                    <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-[11px] font-bold">Try it</Button>
                </div>
            </aside>

            {/* MAIN CONTENT: LIST */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="px-8 py-6 border-b flex justify-between items-center bg-background z-10">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Oto CRM</h1>
                        <p className="text-muted-foreground text-sm">
                            {activeSegment ? `Viewing ${activeSegment.name}` : "Manage leads, customers, and relationships."}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {activeSegment && (
                            <Button variant="outline" size="sm" className="gap-2">
                                <Send className="h-4 w-4" /> Broadcast to Segment
                            </Button>
                        )}
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Contact
                        </Button>
                    </div>
                </header>

                <div className="p-6 overflow-hidden flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search contacts by name, tag, or email..." className="pl-9 h-9" />
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" /> Filters
                        </Button>
                    </div>

                    <Card className="flex-1 overflow-hidden border-none shadow-sm flex flex-col">
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-muted/50 text-muted-foreground font-medium border-b sticky top-0 bg-background z-10">
                                    <tr>
                                        <th className="px-6 py-4">Name & Tags</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Latest Note</th>
                                        <th className="px-6 py-4 text-right">Activity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredContacts.map((contact) => (
                                        <tr
                                            key={contact.id}
                                            className="hover:bg-muted/30 transition-colors cursor-pointer group"
                                            onClick={() => {
                                                setSelectedContact(contact);
                                                setIsDetailOpen(true);
                                            }}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-foreground text-base">{contact.name}</div>
                                                <div className="flex gap-1 mt-1">
                                                    {contact.tags?.map((tag: any) => (
                                                        <Badge key={tag} variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant={contact.status === "Client" ? "default" : contact.status === "Lead" ? "outline" : "secondary"}
                                                    className="font-semibold"
                                                >
                                                    {contact.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="flex items-center gap-2 text-muted-foreground italic truncate">
                                                    <MessageSquare className="h-3 w-3 flex-shrink-0" />
                                                    {contact.notes?.[0]?.content || "No notes yet"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Last Seen</div>
                                                        <div className="text-xs font-medium">{contact.activity?.[0]?.date || "N/A"}</div>
                                                    </div>
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </main>

            {/* DETAIL SHEET: CONTACT VIEW */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent className="w-[450px] sm:w-[540px] overflow-y-auto">
                    {selectedContact && (
                        <div className="space-y-8 py-6 text-left">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                    {selectedContact.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{selectedContact.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="default" className="bg-primary/80">{selectedContact.status}</Badge>
                                        <span className="text-muted-foreground text-sm">• {selectedContact.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button size="sm" variant="outline" className="flex-1 gap-2"><Phone className="h-4 w-4" /> Call</Button>
                                <Button size="sm" variant="outline" className="flex-1 gap-2"><Mail className="h-4 w-4" /> Email</Button>
                                <Button size="sm" className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"><MessageSquare className="h-4 w-4" /> WhatsApp</Button>
                            </div>

                            <Separator />

                            {/* NOTES SECTION */}
                            <div className="space-y-4 text-left">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold flex items-center gap-2"><FileText className="h-4 w-4" /> Internal Notes</h3>
                                    <Button size="sm" variant="ghost" className="h-8 text-[11px] font-bold text-primary uppercase">+ Add Note</Button>
                                </div>
                                <div className="space-y-3">
                                    {selectedContact.notes?.map((note: any) => (
                                        <div key={note.id} className="p-3 bg-muted/30 rounded-lg border border-border/50 text-left">
                                            <p className="text-sm leading-relaxed">{note.content}</p>
                                            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground font-medium uppercase italic">
                                                <span>{note.author}</span>
                                                <span>•</span>
                                                <span>{note.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {selectedContact.notes?.length === 0 && (
                                        <div className="text-center py-6 text-muted-foreground text-sm italic border rounded-lg border-dashed">
                                            No personal notes for this contact.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ACTIVITY SECTION */}
                            <div className="space-y-4 text-left">
                                <h3 className="font-bold flex items-center gap-2"><History className="h-4 w-4" /> Timeline</h3>
                                <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
                                    {selectedContact.activity?.map((act: any) => (
                                        <div key={act.id} className="relative pl-7 text-left">
                                            <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                                                <div className="h-1 w-1 rounded-full bg-primary" />
                                            </div>
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-sm font-bold text-foreground capitalize">{act.type}</span>
                                                <span className="text-[10px] text-muted-foreground font-bold">{act.date}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-0.5">{act.summary}</p>
                                        </div>
                                    ))}
                                    {selectedContact.activity?.length === 0 && (
                                        <div className="pl-7 text-sm text-muted-foreground italic">
                                            Waiting for initial activity tracking.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AGENT INSIGHTS */}
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3 text-left">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <h4 className="text-xs font-bold text-primary uppercase">Agent Summary (Oto)</h4>
                                </div>
                                <p className="text-xs leading-relaxed italic text-foreground/80">
                                    "{selectedContact.name} is a high-value {selectedContact.status} from the {selectedContact.tags?.[1] || "general"} sector. I've noticed their sentiment is {selectedContact.sentiment}. I recommend a manual follow-up regarding the notes mentioned."
                                </p>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

        </div>
    );
}
