"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    Inbox, CheckCircle, AlertTriangle, FileText, MessageCircle, 
    TrendingUp, Clock, ArrowRight, Filter, Bell, XCircle
} from 'lucide-react';
import Link from 'next/link';
import socketManager from '@/lib/socket';

const ACTION_TYPES = {
    TRANCHE_REQUEST: {
        icon: TrendingUp,
        color: 'text-amber-600 bg-amber-100',
        label: 'Tranche Release',
        priority: 'high'
    },
    DOCUMENT_REQUEST: {
        icon: FileText,
        color: 'text-blue-600 bg-blue-100',
        label: 'Document Request',
        priority: 'high'
    },
    DOCUMENT_UPLOADED: {
        icon: CheckCircle,
        color: 'text-green-600 bg-green-100',
        label: 'Document Uploaded',
        priority: 'medium'
    },
    COMPLIANCE_ALERT: {
        icon: AlertTriangle,
        color: 'text-red-600 bg-red-100',
        label: 'Compliance Alert',
        priority: 'critical'
    },
    CHAT_MESSAGE: {
        icon: MessageCircle,
        color: 'text-purple-600 bg-purple-100',
        label: 'New Message',
        priority: 'medium'
    },
    PROJECT_CREATED: {
        icon: Inbox,
        color: 'text-blue-600 bg-blue-100',
        label: 'New Project',
        priority: 'high'
    },
    TRANCHE_APPROVED: {
        icon: CheckCircle,
        color: 'text-green-600 bg-green-100',
        label: 'Tranche Approved',
        priority: 'medium'
    },
    TRANCHE_REJECTED: {
        icon: XCircle,
        color: 'text-red-600 bg-red-100',
        label: 'Tranche Rejected',
        priority: 'high'
    }
};

export default function ActionInbox({ userId, userRole }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, completed
    const [typeFilter, setTypeFilter] = useState('all');

    // Load tasks from notifications
    const loadTasks = async () => {
        try {
            const res = await fetch(`/api/notifications?userId=${userId}&limit=50`);
            const data = await res.json();
            
            if (data.notifications) {
                const formatted = data.notifications.map(n => ({
                    ...n,
                    config: ACTION_TYPES[n.type] || ACTION_TYPES.CHAT_MESSAGE
                }));
                setTasks(formatted);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadTasks();
        }
    }, [userId]);

    // Real-time updates
    useEffect(() => {
        if (!userId) return;

        const handleNewNotification = (notification) => {
            setTasks(prev => [{
                ...notification,
                config: ACTION_TYPES[notification.type] || ACTION_TYPES.CHAT_MESSAGE
            }, ...prev]);
        };

        socketManager.on('notification', handleNewNotification);

        return () => {
            socketManager.off('notification', handleNewNotification);
        };
    }, [userId]);

    // Mark as read/completed
    const markAsRead = async (taskId) => {
        try {
            await fetch('/api/notifications/manage', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationIds: [taskId] })
            });

            setTasks(prev => prev.map(t => 
                t.id === taskId ? { ...t, isRead: true } : t
            ));
        } catch (error) {
            console.error('Error marking task as read:', error);
        }
    };

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending' && task.isRead) return false;
        if (filter === 'completed' && !task.isRead) return false;
        if (typeFilter !== 'all' && task.type !== typeFilter) return false;
        return true;
    });

    const pendingCount = tasks.filter(t => !t.isRead).length;
    const criticalCount = tasks.filter(t => !t.isRead && t.config?.priority === 'critical').length;

    // Only calculate time on client to avoid hydration mismatch
    const getTimeAgo = (date) => {
        if (typeof window === 'undefined') return '';
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="py-16 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Inbox className="h-5 w-5 text-blue-600" />
                            Action Inbox
                            {pendingCount > 0 && (
                                <Badge className="bg-blue-600">{pendingCount} pending</Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Tasks and notifications requiring your attention
                        </CardDescription>
                    </div>
                    {criticalCount > 0 && (
                        <Badge className="bg-red-500 animate-pulse">
                            {criticalCount} Critical
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Tabs value={filter} onValueChange={setFilter} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
                            <TabsTrigger value="pending">
                                Pending ({tasks.filter(t => !t.isRead).length})
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                Completed ({tasks.filter(t => t.isRead).length})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex gap-2 flex-wrap mt-2">
                        <Button 
                            variant={typeFilter === 'all' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setTypeFilter('all')}
                        >
                            All Types
                        </Button>
                        <Button 
                            variant={typeFilter === 'TRANCHE_REQUEST' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setTypeFilter('TRANCHE_REQUEST')}
                        >
                            Tranches
                        </Button>
                        <Button 
                            variant={typeFilter === 'DOCUMENT_REQUEST' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setTypeFilter('DOCUMENT_REQUEST')}
                        >
                            Documents
                        </Button>
                        <Button 
                            variant={typeFilter === 'CHAT_MESSAGE' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setTypeFilter('CHAT_MESSAGE')}
                        >
                            Messages
                        </Button>
                    </div>
                </div>

                {/* Task List */}
                <ScrollArea className="h-[500px] pr-4">
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">All caught up!</p>
                            <p className="text-sm text-slate-400">No pending tasks matching your filter</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredTasks.map((task) => {
                                const config = task.config;
                                const Icon = config?.icon || Bell;
                                const isUnread = !task.isRead;

                                return (
                                    <div
                                        key={task.id}
                                        className={`relative border rounded-lg p-4 transition-all hover:shadow-md ${
                                            isUnread 
                                                ? 'bg-white border-l-4 border-l-blue-500' 
                                                : 'bg-slate-50 border-slate-200'
                                        } ${config?.priority === 'critical' && isUnread ? 'ring-2 ring-red-200' : ''}`}
                                    >
                                        <div className="flex gap-4">
                                            {/* Icon */}
                                            <div className={`shrink-0 p-2 rounded-lg ${config?.color || 'bg-slate-100 text-slate-600'}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <div>
                                                        <Badge variant="outline" className="text-xs mb-1">
                                                            {config?.label || task.type}
                                                        </Badge>
                                                        <h4 className={`font-semibold ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                                                            {task.title}
                                                        </h4>
                                                    </div>
                                                    {isUnread && (
                                                        <div className="h-2 w-2 bg-blue-600 rounded-full shrink-0" />
                                                    )}
                                                </div>

                                                <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                                                    {task.message}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-400 flex items-center gap-1" suppressHydrationWarning>
                                                        <Clock className="h-3 w-3" />
                                                        {getTimeAgo(task.createdAt)}
                                                    </span>

                                                    <div className="flex gap-2">
                                                        {task.link && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                asChild
                                                                onClick={() => markAsRead(task.id)}
                                                            >
                                                                <Link href={task.link}>
                                                                    Take Action
                                                                    <ArrowRight className="h-3 w-3 ml-1" />
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        {isUnread && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="ghost"
                                                                onClick={() => markAsRead(task.id)}
                                                            >
                                                                Mark Done
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
