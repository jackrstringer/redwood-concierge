import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Campaign {
  id: string;
  updated_at: string;
  name: string;
  recipients: number;
  open_rate: number;
  click_rate: number;
  placed_orders: number;
  revenue: number;
  rpr: number;
  aov: number;
}

interface CampaignsTableProps {
  campaigns: Campaign[];
  isLoading?: boolean;
  dateRange?: string;
}

type SortField = keyof Campaign;
type SortDirection = 'asc' | 'desc';

export const CampaignsTable: React.FC<CampaignsTableProps> = ({ campaigns, isLoading = false, dateRange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Helper function to get display name for date range
  const getDateRangeDisplayName = (range?: string) => {
    const rangeMap: Record<string, string> = {
      'today': 'Today',
      'wtd': 'Week-to-date',
      'mtd': 'Month-to-date',
      'last_7_days': 'Last 7 days',
      'last_30_days': 'Last 30 days',
      'custom': 'Custom'
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

  const filteredAndSortedCampaigns = campaigns
    .filter(campaign =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <td className="p-3"><Skeleton className="h-4 w-12" /></td>
      <td className="p-3"><Skeleton className="h-4 w-10" /></td>
      <td className="p-3"><Skeleton className="h-4 w-10" /></td>
      <td className="p-3"><Skeleton className="h-4 w-12" /></td>
      <td className="p-3"><Skeleton className="h-4 w-16" /></td>
      <td className="p-3"><Skeleton className="h-4 w-10" /></td>
      <td className="p-3"><Skeleton className="h-4 w-10" /></td>
    </tr>
  );

  return (
    <Card className="dashboard-card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold dashboard-text">Campaigns</h3>
            {dateRange && (
              <p className="text-sm dashboard-text-muted">
                Showing campaigns for: {getDateRangeDisplayName(dateRange)}
              </p>
            )}
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 dashboard-text-muted" />
            <Input
              placeholder={isLoading ? "Loading campaigns..." : "Search campaigns..."}
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
                    onClick={() => handleSort('recipients')}
                  >
                    Recipients
                    <SortIcon field="recipients" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('open_rate')}
                  >
                    Open%
                    <SortIcon field="open_rate" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('click_rate')}
                  >
                    Click%
                    <SortIcon field="click_rate" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('placed_orders')}
                  >
                    Orders
                    <SortIcon field="placed_orders" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('revenue')}
                  >
                    Revenue
                    <SortIcon field="revenue" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[60px]">
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort('rpr')}
                  >
                    RPR
                    <SortIcon field="rpr" />
                  </button>
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[60px]">
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
                // Show skeleton rows while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : filteredAndSortedCampaigns.length === 0 ? (
                // Show empty state when no campaigns
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground">
                    No campaigns found
                  </td>
                </tr>
              ) : (
                // Show actual campaign data
                filteredAndSortedCampaigns.map((campaign) => (
                  <tr 
                    key={campaign.id} 
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                  <td className="p-3 text-sm text-foreground font-medium tabular-nums">
                    {formatDate(campaign.updated_at)}
                  </td>
                  <td className="p-3 text-sm text-foreground font-medium">
                    {campaign.name}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground tabular-nums">
                    {campaign.recipients >= 1000 
                      ? `${(campaign.recipients / 1000).toFixed(0)}k`
                      : campaign.recipients.toLocaleString()
                    }
                  </td>
                  <td className="p-3 text-sm text-muted-foreground tabular-nums">
                    {formatPercentage(campaign.open_rate)}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground tabular-nums">
                    {formatPercentage(campaign.click_rate)}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground tabular-nums">
                    {campaign.placed_orders >= 1000 
                      ? `${(campaign.placed_orders / 1000).toFixed(1)}k`
                      : campaign.placed_orders.toLocaleString()
                    }
                  </td>
                  <td className="p-3 text-sm text-muted-foreground font-medium tabular-nums">
                    ${campaign.revenue >= 1000000 
                      ? `${(campaign.revenue / 1000000).toFixed(1)}M`
                      : campaign.revenue >= 1000
                      ? `${(campaign.revenue / 1000).toFixed(0)}k`
                      : campaign.revenue.toFixed(0)
                    }
                  </td>
                  <td className="p-3 text-sm text-muted-foreground tabular-nums">
                    ${campaign.rpr.toFixed(2)}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground tabular-nums">
                    ${campaign.aov.toFixed(0)}
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