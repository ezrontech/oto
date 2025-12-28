"use client";

import { useState, useEffect } from "react";
import { Card, Badge, Button, Input, Separator, Sheet, SheetContent } from "@oto/ui";
import { Plus, Search, Filter, Users, Tag, MessageSquare, History, Sparkles, Send, ChevronRight, FileText, Phone, Mail } from "lucide-react";

export default function ContactsView() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [activeSegment, setActiveSegment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const res = await fetch("/api/contacts");
            if (res.ok) {
                const data = await res.json();
                setContacts(data.data || []);
            }
        } catch (error) {
            console.error("Failed to load contacts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredContacts = activeSegment
        ? contacts.filter(c => c.status === activeSegment.name.split(' ')[1] || c.status === activeSegment.name.split(' ')[0])
        : contacts;

    const segments = [
        { id: 'all', name: 'All Contacts', count: contacts.length },
        { id: 'leads', name: 'New Leads', count: contacts.filter(c => c.status === 'Lead').length },
        { id: 'clients', name: 'Active Clients', count: contacts.filter(c => c.status === 'Client').length },
        { id: 'prospects', name: 'Prospects', count: contacts.filter(c => c.status === 'Prospect').length },
    ];

    return (
        <div className="h-full flex flex-col md:flex-row overflow-hidden bg-background">
            {/* SIDEBAR: SEGMENTS */}
            <aside className="w-full md:w-56 border-r bg-muted/10 p-2 space-y-2 overflow-y-auto">
                <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">Segments</h3>
                    <div className="space-y-0.5">
                        <Button
                            variant={!activeSegment ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start gap-2 h-8"
                            onClick={() => setActiveSegment(null)}
                        >
                            <Users className="h-3.5 w-3.5" /> All Contacts
                        </Button>
                        {segments.map((segment: any) => (
                            <Button
                                key={segment.id}
                                variant={activeSegment?.id === segment.id ? "secondary" : "ghost"}
                                size="sm"
                                className="w-full justify-start gap-2 group h-8"
                                onClick={() => setActiveSegment(segment)}
                            >
                                <Tag className="h-3.5 w-3.5 text-primary" />
                                <span className="flex-1 text-left">{segment.name}</span>
                                <span className="text-[10px] text-muted-foreground">{segment.count}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-bold text-primary italic">Oto Tip</span>
                    </div>
                    <p className="text-[10px] leading-tight text-muted-foreground">
                        "I can automatically group contacts who haven't been messaged in 30 days."
                    </p>
                </div>
            </aside>

            {/* MAIN CONTENT: LIST */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="px-4 py-3 border-b flex justify-between items-center bg-background z-10 shrink-0">
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">CRM</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" className="h-8">
                            <Plus className="mr-2 h-3.5 w-3.5" /> Add
                        </Button>
                    </div>
                </header>

                <div className="p-4 overflow-hidden flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input placeholder="Search..." className="pl-8 h-8 text-sm" />
                        </div>
                        <Button variant="outline" size="sm" className="h-8 px-2">
                            <Filter className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <Card className="flex-1 overflow-hidden border-none shadow-none flex flex-col bg-transparent">
                        <div className="flex-1 overflow-y-auto pr-2">
                            <div className="space-y-1">
                                {filteredContacts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Users className="h-8 w-8 text-muted-foreground/50 mb-2" />
                                        <p className="text-sm text-muted-foreground">No contacts found</p>
                                    </div>
                                ) : (
                                    filteredContacts.map((contact) => (
                                        <div
                                            key={contact.id}
                                            className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border/50 group"
                                            onClick={() => {
                                                setSelectedContact(contact);
                                                setIsDetailOpen(true);
                                            }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-sm truncate">{contact.name}</span>
                                                    <Badge
                                                        variant={contact.status === "Client" ? "default" : "outline"}
                                                        className="text-[10px] h-5 px-1.5"
                                                    >
                                                        {contact.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                                                    {contact.tags?.[0] && (
                                                        <Badge variant="secondary" className="text-[10px] font-normal px-1 py-0 h-4">
                                                            {contact.tags[0]}
                                                        </Badge>
                                                    )}
                                                    <span className="truncate flex-1">{contact.email}</span>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground/30 ml-2 group-hover:text-muted-foreground" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </main>

            {/* DETAIL SHEET: CONTACT VIEW - Using Sheet for now, or could use another Window */}
            {/* Note: In a pure OS model, clicking a contact might open a new "Contact Window" */}
            {/* For now, keeping the Sheet logic as it works "within" the Contacts App Window */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent className="w-full sm:w-[400px] overflow-y-auto z-[60]">
                    {/* z-60 to be above Window (z-50) */}
                    {selectedContact && (
                        <div className="space-y-6 py-6 text-left">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                                    {selectedContact.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold tracking-tight text-foreground">{selectedContact.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="default" className="text-[10px]">{selectedContact.status}</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button size="sm" variant="outline" className="flex-1 gap-2 h-8 text-xs"><Phone className="h-3.5 w-3.5" /> Call</Button>
                                <Button size="sm" variant="outline" className="flex-1 gap-2 h-8 text-xs"><Mail className="h-3.5 w-3.5" /> Email</Button>
                            </div>

                            <Separator />

                            {/* NOTES SECTION */}
                            <div className="space-y-4 text-left">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-sm flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> Notes</h3>
                                </div>
                                <div className="space-y-3">
                                    {selectedContact.notes?.map((note: any) => (
                                        <div key={note.id} className="p-3 bg-muted/30 rounded-lg border border-border/50 text-left">
                                            <p className="text-xs leading-relaxed">{note.content}</p>
                                        </div>
                                    ))}
                                    {selectedContact.notes?.length === 0 && (
                                        <div className="text-center py-4 text-muted-foreground text-xs italic border rounded-lg border-dashed">
                                            No notes yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
