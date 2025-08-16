import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Campaign {
  id: string;
  sent_at: string;
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
  const [sortField, setSortField] = useState<SortField>('sent_at');
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
            <thead>
              <tr className="border-b dashboard-border">
                <th className="text-left p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('sent_at')}
                    className="h-auto p-0 dashboard-text-muted hover:dashboard-text gap-1"
                  >
                    Sent Date
                    <SortIcon field="sent_at" />
                  </Button>
                </th>
                <th className="text-left p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('name')}
                    className="h-auto p-0 dashboard-text-muted hover:dashboard-text gap-1"
                  >
                    Campaign Name
                    <SortIcon field="name" />
                  </Button>
                </th>
                <th className="text-right p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('recipients')}
                    className="h-auto p-0 dashboard-text-muted hover:dashboard-text gap-1"
                  >
                    Recipients
                    <SortIcon field="recipients" />
                  </Button>
                </th>
                <th className="text-right p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('open_rate')}
                    className="h-auto p-0 dashboard-text-muted hover:dashboard-text gap-1"
                  >
                    Open Rate
                    <SortIcon field="open_rate" />
                  </Button>
                </th>
                <th className="text-right p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('click_rate')}
                    className="h-auto p-0 dashboard-text-muted hover:dashboard-text gap-1"
                  >
                    Click Rate
                    <SortIcon field="click_rate" />
                  </Button>
                </th>
                <th className="text-right p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('placed_orders')}
                    className="h-auto p-0 dashboard-text-muted hover:dashboard-text gap-1"
                  >
                    Orders
                    <SortIcon field="placed_orders" />
                  </Button>
                </th>
                <th className="text-right p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('revenue')}
                    className="h-auto p-0 dashboard-text-muted hover:dashboard-text gap-1"
                  >
                    Revenue
                    <SortIcon field="revenue" />
                  </Button>
                </th>
                <th className="text-right p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('rpr')}
                    className="h-auto p-0 dashboard-text-muted hover:dashboard-text gap-1"
                  >
                    RPR
                    <SortIcon field="rpr" />
                  </Button>
                </th>
                <th className="text-right p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('aov')}
                    className="h-auto p-0 dashboard-text-muted hover:dashboard-text gap-1"
                  >
                    AOV
                    <SortIcon field="aov" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCampaigns.map((campaign, index) => (
                <tr
                  key={campaign.id}
                  className={`border-b dashboard-border hover:bg-muted/30 transition-colors ${
                    index % 2 === 0 ? 'bg-muted/10' : ''
                  }`}
                >
                  <td className="p-3 dashboard-text text-sm">
                    {formatDate(campaign.sent_at)}
                  </td>
                  <td className="p-3 dashboard-text text-sm font-medium">
                    {campaign.name}
                  </td>
                  <td className="p-3 dashboard-text text-sm text-right tabular-nums">
                    {campaign.recipients.toLocaleString()}
                  </td>
                  <td className="p-3 dashboard-text text-sm text-right tabular-nums">
                    {formatPercentage(campaign.open_rate)}
                  </td>
                  <td className="p-3 dashboard-text text-sm text-right tabular-nums">
                    {formatPercentage(campaign.click_rate)}
                  </td>
                  <td className="p-3 dashboard-text text-sm text-right tabular-nums">
                    {campaign.placed_orders.toLocaleString()}
                  </td>
                  <td className="p-3 dashboard-text text-sm text-right tabular-nums">
                    {formatCurrency(campaign.revenue)}
                  </td>
                  <td className="p-3 dashboard-text text-sm text-right tabular-nums">
                    {campaign.rpr.toFixed(2)}
                  </td>
                  <td className="p-3 dashboard-text text-sm text-right tabular-nums">
                    {formatCurrency(campaign.aov)}
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