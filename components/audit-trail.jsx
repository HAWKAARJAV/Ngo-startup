'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ScrollArea 
} from "@/components/ui/scroll-area";
import { 
  History, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCcw
} from "lucide-react";

const ACTION_ICONS = {
  'UPLOAD': Upload,
  'DOCUMENT_UPLOAD': Upload,
  'TRANCHE_REQUEST': Clock,
  'TRANCHE_APPROVED': CheckCircle2,
  'TRANCHE_REJECTED': XCircle,
  'TRANCHE_BLOCKED': AlertTriangle,
  'VERIFICATION': CheckCircle2,
  'APPROVAL': CheckCircle2,
  'REJECTION': XCircle,
  'DISBURSEMENT': DollarSign,
  'COMPLIANCE_CHECK': FileText,
};

const ACTION_COLORS = {
  'UPLOAD': 'bg-blue-100 text-blue-700',
  'DOCUMENT_UPLOAD': 'bg-blue-100 text-blue-700',
  'TRANCHE_REQUEST': 'bg-amber-100 text-amber-700',
  'TRANCHE_APPROVED': 'bg-green-100 text-green-700',
  'TRANCHE_REJECTED': 'bg-red-100 text-red-700',
  'TRANCHE_BLOCKED': 'bg-red-100 text-red-700',
  'VERIFICATION': 'bg-purple-100 text-purple-700',
  'APPROVAL': 'bg-green-100 text-green-700',
  'REJECTION': 'bg-red-100 text-red-700',
  'DISBURSEMENT': 'bg-emerald-100 text-emerald-700',
  'COMPLIANCE_CHECK': 'bg-slate-100 text-slate-700',
};

export default function AuditTrail({ 
  projectId, 
  ngoId, 
  showHeader = true, 
  maxHeight = "400px",
  compact = false
}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      if (ngoId) params.append('ngoId', ngoId);
      params.append('limit', '50');

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [projectId, ngoId]);

  // Only calculate time on client to avoid hydration mismatch
  const formatTimestamp = (timestamp) => {
    if (typeof window === 'undefined') return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 hour ago
    if (diff < 60 * 60 * 1000) {
      const mins = Math.floor(diff / (60 * 1000));
      return mins <= 1 ? 'Just now' : `${mins} mins ago`;
    }
    
    // Less than 24 hours ago
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Show full date with fixed locale to avoid server/client mismatch
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    const Icon = ACTION_ICONS[action] || History;
    return Icon;
  };

  const getActionColor = (action) => {
    return ACTION_COLORS[action] || 'bg-slate-100 text-slate-700';
  };

  const getActionDescription = (log) => {
    const meta = log.parsedMetadata || {};
    
    switch (log.action) {
      case 'TRANCHE_REQUEST':
        return `Requested release of ₹${meta.amount?.toLocaleString('en-IN') || 'N/A'} for ${meta.trancheName || 'tranche'}`;
      case 'TRANCHE_APPROVED':
        return `Approved release of ₹${meta.amount?.toLocaleString('en-IN') || 'N/A'} for ${meta.trancheName || 'tranche'}`;
      case 'TRANCHE_REJECTED':
        return `Rejected release request: ${meta.remarks || 'No reason specified'}`;
      case 'TRANCHE_BLOCKED':
        return `Blocked tranche: ${meta.remarks || 'No reason specified'}`;
      case 'DOCUMENT_UPLOAD':
      case 'UPLOAD':
        return `Uploaded ${meta.docName || meta.fileName || 'document'}`;
      case 'VERIFICATION':
        return `Verified ${log.docType || 'document'}`;
      case 'APPROVAL':
        return `Approved ${log.docType || 'document'}`;
      case 'REJECTION':
        return `Rejected ${log.docType || 'document'}: ${meta.remarks || 'No reason'}`;
      case 'DISBURSEMENT':
        return `Funds disbursed: ₹${meta.amount?.toLocaleString('en-IN') || 'N/A'}`;
      default:
        return log.action.replace(/_/g, ' ').toLowerCase();
    }
  };

  const displayedLogs = expanded ? logs : logs.slice(0, compact ? 3 : 5);

  if (loading) {
    return (
      <Card className={compact ? 'border-0 shadow-none' : ''}>
        {showHeader && (
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <History className="h-4 w-4" />
              Audit Trail
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={compact ? 'p-0' : ''}>
          <div className="flex items-center justify-center py-8">
            <RefreshCcw className="h-5 w-5 animate-spin text-slate-400" />
            <span className="ml-2 text-slate-500 text-sm">Loading audit trail...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? 'border-0 shadow-none' : ''}>
      {showHeader && (
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <History className="h-4 w-4" />
            Audit Trail
            {logs.length > 0 && (
              <Badge variant="secondary" className="ml-2 font-normal">
                {logs.length} entries
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchLogs}
            className="h-8 w-8 p-0"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </CardHeader>
      )}
      <CardContent className={compact ? 'p-0' : ''}>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <History className="h-10 w-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No audit entries yet</p>
          </div>
        ) : (
          <>
            <ScrollArea style={{ maxHeight: expanded ? '600px' : maxHeight }}>
              <div className="space-y-3">
                {displayedLogs.map((log, index) => {
                  const Icon = getActionIcon(log.action);
                  
                  return (
                    <div 
                      key={log.id} 
                      className={`flex gap-3 ${index !== displayedLogs.length - 1 ? 'pb-3 border-b border-slate-100' : ''}`}
                    >
                      {/* Icon */}
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getActionColor(log.action)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {getActionDescription(log)}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              by {log.actorName}
                              {log.ngo?.orgName && ` • ${log.ngo.orgName}`}
                            </p>
                          </div>
                          <span className="text-xs text-slate-400 whitespace-nowrap" suppressHydrationWarning>
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                        
                        {/* Show document type if relevant */}
                        {log.docType && log.docType !== 'GENERAL' && (
                          <Badge variant="outline" className="mt-1.5 text-xs font-normal">
                            {log.docType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            
            {/* Expand/Collapse button */}
            {logs.length > (compact ? 3 : 5) && (
              <Button
                variant="ghost"
                className="w-full mt-3 text-slate-500 hover:text-slate-700"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show All ({logs.length} entries)
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
