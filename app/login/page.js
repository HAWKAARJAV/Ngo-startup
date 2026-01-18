"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { login } from "./actions"; // Import the server action
import { useRef } from "react";

export default function LoginPage() {
    const formRef = useRef(null);
    const emailInputRef = useRef(null);

    const quickLogin = (email) => {
        if (emailInputRef.current) {
            emailInputRef.current.value = email;
        }
        // Auto-submit the form
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign in to NGO Connect</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to access your dashboard
                    </CardDescription>
                </CardHeader>
                <form ref={formRef} action={login}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                ref={emailInputRef}
                                id="email" 
                                name="email" 
                                type="email" 
                                placeholder="m@example.com" 
                                required 
                                defaultValue="csr@techgiant.com" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" placeholder="••••••••" defaultValue="password" />
                            <p className="text-xs text-muted-foreground">Any password works for this demo.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Sign In</Button>
                        <div className="text-center text-sm text-slate-500">
                            <p className="font-semibold mb-2">Quick Login:</p>
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => quickLogin('csr@techgiant.com')}
                                    className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 p-3 rounded-lg transition-colors text-left"
                                >
                                    <p className="font-semibold text-blue-700 text-sm">Corporate Dashboard</p>
                                    <p className="font-mono text-xs text-blue-600">csr@techgiant.com</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => quickLogin('info@deepalaya.org')}
                                    className="w-full bg-green-50 hover:bg-green-100 border border-green-200 p-3 rounded-lg transition-colors text-left"
                                >
                                    <p className="font-semibold text-green-700 text-sm">NGO Dashboard</p>
                                    <p className="font-mono text-xs text-green-600">info@deepalaya.org</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => quickLogin('admin@ngoconnect.com')}
                                    className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 p-3 rounded-lg transition-colors text-left"
                                >
                                    <p className="font-semibold text-purple-700 text-sm">Admin Dashboard</p>
                                    <p className="font-mono text-xs text-purple-600">admin@ngoconnect.com</p>
                                </button>
                            </div>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
