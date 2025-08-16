import React from 'react';
import { Card } from '@/components/ui/card';

interface ProductSubscription {
  sku: string;
  name: string;
  active_subs: number;
  mrr: number;
  mrr_share_pct: number;
}

interface SubscriptionTableProps {
  products: ProductSubscription[];
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ products }) => {
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Card className="dashboard-card p-6">
      <div className="space-y-4">
        <h4 className="text-base font-semibold dashboard-text">
          Top Products by Active Subscriptions
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dashboard-border">
                <th className="text-left p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  Product
                </th>
                <th className="text-right p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  Active Subs
                </th>
                <th className="text-right p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  MRR
                </th>
                <th className="text-right p-3 dashboard-text-muted text-xs font-medium uppercase tracking-wide">
                  % of MRR
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.sku}
                  className={`border-b dashboard-border hover:bg-muted/30 transition-colors ${
                    index % 2 === 0 ? 'bg-muted/10' : ''
                  }`}
                >
                  <td className="p-3">
                    <div>
                      <div className="dashboard-text text-sm font-medium">
                        {product.name}
                      </div>
                      <div className="dashboard-text-muted text-xs">
                        {product.sku}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 dashboard-text text-sm text-right tabular-nums">
                    {product.active_subs.toLocaleString()}
                  </td>
                  <td className="p-3 dashboard-text text-sm text-right tabular-nums">
                    {formatCurrency(product.mrr)}
                  </td>
                  <td className="p-3 dashboard-text text-sm text-right tabular-nums">
                    {formatPercentage(product.mrr_share_pct)}
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