'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"
import { useState } from "react"
import { approveTranche } from "@/app/actions/project-actions"
import Link from "next/link"

export default function NeedsAttentionCard({ initialProjects }) {
    const [projects, setProjects] = useState(initialProjects)
    const [loadingId, setLoadingId] = useState(null)

    const handleVerify = async (projectId) => {
        setLoadingId(projectId)

        // Server Action
        const res = await approveTranche(projectId)

        if (res.success) {
            // Trigger Confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#2563eb', '#fca5a5', '#10b981'] // Blue, Red, Green
            })

            // Optimistic Update (or wait for revalidate)
            setProjects(prev => prev.map(p =>
                p.id === projectId
                    ? { ...p, status: 'VERIFIED', raisedAmount: res.newRaised }
                    : p
            ))
        }
        setLoadingId(null)
    }

    return (
        <Card className="border-border shadow-sm">
            <CardHeader>
                <CardTitle>Needs Your Attention</CardTitle>
                <CardDescription>New projects and tranche disbursals pending approval.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {projects.map((project) => {
                        const isVerified = project.status === 'VERIFIED' || project.raisedAmount >= project.targetAmount
                        const isNew = project.isNewForCorporate === true

                        return (
                            <div 
                                key={project.id} 
                                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                                    isNew ? 'border-blue-300 bg-blue-50/50 ring-1 ring-blue-200' : ''
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                                        isNew ? 'bg-blue-100 text-blue-700' : 'bg-primary/10 text-primary'
                                    }`}>
                                        {isNew ? <Sparkles size={18} /> : project.ngo.orgName.substring(0, 2)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                                            {project.ngo.orgName}
                                            {isNew && (
                                                <Badge className="text-xs bg-blue-500 text-white animate-pulse">
                                                    NEW PROJECT
                                                </Badge>
                                            )}
                                            {isVerified && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">{project.title} • {project.location}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-foreground">₹{project.targetAmount.toLocaleString('en-IN')}</div>

                                    {isVerified ? (
                                        <div className="flex items-center justify-end gap-1 text-green-600 text-sm font-medium mt-1">
                                            <CheckCircle2 size={16} /> Disbursed
                                        </div>
                                    ) : (
                                        <Link href={`/dashboard/projects/${project.id}`}>
                                            <Button
                                                size="sm"
                                                variant={isNew ? "default" : "link"}
                                                className={isNew ? "bg-blue-600 hover:bg-blue-700 text-white h-8" : "text-primary h-auto p-0"}
                                            >
                                                {isNew ? 'Review Project →' : 'Verify Docs →'}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
            <CardFooter>
                <Link href="/dashboard/projects" className="w-full">
                    <Button variant="outline" className="w-full">View All Projects</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
