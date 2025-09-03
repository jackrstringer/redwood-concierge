import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
}

type SortField = keyof Campaign;
type SortDirection = 'asc' | 'desc';

export const CampaignsTable: React.FC<CampaignsTableProps> = ({ campaigns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  return (
    <Card className="dashboard-card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold dashboard-text">Campaigns</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 dashboard-text-muted" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredAndSortedCampaigns.map((campaign) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};