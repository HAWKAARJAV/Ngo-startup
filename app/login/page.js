"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { login } from "./actions"; // Import the server action

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign in to NGO Connect</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to access your dashboard
                    </CardDescription>
                </CardHeader>
                <form action={login}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required defaultValue="csr@techgiant.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" placeholder="••••••••" defaultValue="password" />
                            <p className="text-xs text-muted-foreground">Any password works for this demo.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign In</Button>
                        <div className="text-center text-sm text-slate-500">
                            <p>Demo Credentials:</p>
                            <p className="font-mono text-xs">csr@techgiant.com</p>
                            <p className="font-mono text-xs">info@pratham.org</p>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
