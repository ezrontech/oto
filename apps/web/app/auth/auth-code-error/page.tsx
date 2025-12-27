"use client";

import { Button } from "@oto/ui";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold">Authentication Error</h1>
                    <p className="text-muted-foreground mt-2">
                        There was an issue signing you in. Please try again.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <Button asChild className="w-full">
                        <Link href="/auth/login">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Link>
                    </Button>
                    
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/">
                            Return to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
