import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Delta } from '@/components/ui/delta';
import { format, toZonedTime } from 'date-fns-tz';
import { Flow } from '@/types/campaign';
import { createFieldDelta } from '@/utils/deltaCalculations';

interface FlowsTableProps {
  flows: Flow[];
  isLoading?: boolean;
  dateRange?: string;
}

type SortField = keyof Flow;
type SortDirection = 'asc' | 'desc';

export const FlowsTable: React.FC<FlowsTableProps> = ({ flows, isLoading = false, dateRange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Helper function to get display name for date range
  const getDateRangeDisplayName = (range?: string) => {
    const rangeMap: Record<string, string> = {
      'last_7_days': 'Last 7 days',
      'last_30_days': 'Last 30 days',
    };
    return range ? rangeMap[range] || 'Last 30 days' : 'Last 30 days';
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedFlows = flows
    .filter(flow =>
      flow.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // ✅ Fix: Convert DB UTC string → Local timezone
  const formatDate = (dateString: string) => {
    try {
      // Ensure DB timestamp is parsed as UTC
      const utcDate = new Date(dateString.endsWith("Z") ? dateString : dateString + "Z");

      // Get user's timezone (e.g., Asia/Karachi)
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Convert UTC → Local
      const zonedDate = toZonedTime(utcDate, timeZone);

      // Format
      return format(zonedDate, "MMM d, yyyy h:mm a ", { timeZone });
    } catch {
      return "Invalid date";
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-3 w-3" /> : 
      <ArrowDown className="h-3 w-3" />;
  };

  const SkeletonRow = () => (
    <tr className="border-b border-border">
      <td className="p-3"><Skeleton className="h-4 w-16" /></td>
      <td className="p-3"><Skeleton className="h-4 w-32" /></td>
      <td className="p-3"><Skeleton className="h-4 w-16" /></td>
      <td className="p-3"><Skeleton className="h-4 w-16" /></td>
      <td className="p-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-10" />
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-3 w-10" />
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-3 w-10" />
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-3 w-10" />
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-3 w-10" />
        </div>
      </td>
    </tr>
  );

  return (
    <Card className="dashboard-card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold dashboard-text">Flows</h3>
            {dateRange && (
              <p className="text-sm dashboard-text-muted">
                Showing flows for: {getDateRangeDisplayName(dateRange)}
              </p>
            )}
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 dashboard-text-muted" />
            <Input
              placeholder={isLoading ? "Loading flows..." : "Search flows..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
              className="pl-10 dashboard-card border-dashboard-border dashboard-text"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border">
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[120px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('updated_at')}
                  >
                    Sent
                    <SortIcon field="updated_at" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[200px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    <SortIcon field="status" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('trigger_type')}
                  >
                    Trigger
                    <SortIcon field="trigger_type" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[120px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('recipients')}
                  >
                    Recipients
                    <SortIcon field="recipients" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('open_rate')}
                  >
                    Open%
                    <SortIcon field="open_rate" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('click_rate')}
                  >
                    Click%
                    <SortIcon field="click_rate" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[120px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('revenue')}
                  >
                    Revenue
                    <SortIcon field="revenue" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('rpr')}
                  >
                    RPR
                    <SortIcon field="rpr" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('aov')}
                  >
                    AOV
                    <SortIcon field="aov" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : filteredAndSortedFlows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-muted-foreground">
                    No flows found
                  </td>
                </tr>
              ) : (
                filteredAndSortedFlows.map((flow) => (
                  <tr 
                    key={flow.id} 
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-3 text-sm text-foreground font-medium tabular-nums">
                      {formatDate(flow.updated_at)}
                    </td>
                    <td className="p-3 text-sm text-foreground font-medium">
                      {flow.name}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        flow.status === 'live' ? 'bg-green-100 text-green-800' :
                        flow.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        flow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {flow.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      <span className="capitalize">{flow.trigger_type || 'N/A'}</span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground tabular-nums">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {flow.recipients >= 1000 
                            ? `${(flow.recipients / 1000).toFixed(0)}k`
                            : flow.recipients.toLocaleString()
                          }
                        </div>
                        <Delta delta={createFieldDelta(flow, 'recipients')} />
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground tabular-nums">
                      <div className="flex items-start justify-between gap-2">
                        <div>{formatPercentage(flow.open_rate)}</div>
                        <Delta delta={createFieldDelta(flow, 'open_rate')} />
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground tabular-nums">
                      <div className="flex items-start justify-between gap-2">
                        <div>{formatPercentage(flow.click_rate)}</div>
                        <Delta delta={createFieldDelta(flow, 'click_rate')} />
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground font-medium tabular-nums">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          ${flow.revenue >= 1000000 
                            ? `${(flow.revenue / 1000000).toFixed(1)}M`
                            : flow.revenue >= 1000
                            ? `${(flow.revenue / 1000).toFixed(0)}k`
                            : flow.revenue.toFixed(0)
                          }
                        </div>
                        <Delta delta={createFieldDelta(flow, 'revenue')} />
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground tabular-nums">
                      <div className="flex items-start justify-between gap-2">
                        <div>${flow.rpr.toFixed(2)}</div>
                        <Delta delta={createFieldDelta(flow, 'rpr')} />
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground tabular-nums">
                      <div className="flex items-start justify-between gap-2">
                        <div>${flow.aov.toFixed(0)}</div>
                        <Delta delta={createFieldDelta(flow, 'aov')} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};
