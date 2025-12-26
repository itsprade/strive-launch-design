// 🧪 Dummy Data: Mock data generators and fixtures
import { User, Campaign, Metric, InsightCard, QuickAction } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Pradeep',
    email: 'pradeep@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'manager',
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Search-Competitor-ForceAI',
    platform: 'Google Ads',
    status: 'active',
    budget: 5000,
    spent: 4800,
    conversions: 127,
    impressions: 45230,
    clicks: 2341,
    ctr: 5.2,
    cpc: 2.05,
    roi: 234,
  },
  {
    id: '2',
    name: 'Brand Awareness Q4',
    platform: 'Facebook',
    status: 'active',
    budget: 8000,
    spent: 6200,
    conversions: 89,
    impressions: 123400,
    clicks: 4567,
    ctr: 3.7,
    cpc: 1.36,
    roi: 178,
  },
  {
    id: '3',
    name: 'Lead Generation - Enterprise',
    platform: 'LinkedIn',
    status: 'paused',
    budget: 10000,
    spent: 8900,
    conversions: 45,
    impressions: 34200,
    clicks: 1234,
    ctr: 3.6,
    cpc: 7.21,
    roi: 145,
  },
];

export const mockMetrics: Metric[] = [
  {
    id: '1',
    label: 'Total Conversions',
    value: 1247,
    change: 12.5,
    changeType: 'increase',
    format: 'number',
  },
  {
    id: '2',
    label: 'Total Spend',
    value: 23400,
    change: -5.2,
    changeType: 'decrease',
    format: 'currency',
  },
  {
    id: '3',
    label: 'Average ROI',
    value: 189,
    change: 8.3,
    changeType: 'increase',
    format: 'percentage',
  },
  {
    id: '4',
    label: 'Active Campaigns',
    value: 12,
    format: 'number',
  },
];

export const mockInsightCards: InsightCard[] = [
  {
    id: '1',
    type: 'success',
    metric: '12%',
    value: 'increase',
    description: 'Organic traffic is up 12% with an increase of 8% in conversions since 10 posts were refreshed.',
    backgroundColor: '#eff1f7',
  },
  {
    id: '2',
    type: 'info',
    platform: 'Google Ads',
    description: 'Campaign "Search-Competitor-ForceAI" is performing well but capped by budget. Increase budget to untap more conversions.',
    backgroundColor: '#dff0fb',
  },
  {
    id: '3',
    type: 'warning',
    platform: 'Facebook',
    description: 'CTR has dropped by 15% in the last 7 days. Consider refreshing ad creatives.',
    backgroundColor: '#fff4e6',
  },
];

export const mockQuickActions: QuickAction[] = [
  {
    id: '1',
    label: 'Which campaign is performing below average this week and why?',
    category: 'performance',
  },
  {
    id: '2',
    label: 'Where is most of my ad spend being wasted?',
    category: 'optimization',
  },
  {
    id: '3',
    label: 'Can you summarize my top-performing campaigns across all channels?',
    category: 'analysis',
  },
  {
    id: '4',
    label: 'What keywords are driving the lowest ROI right now?',
    category: 'keywords',
  },
  {
    id: '5',
    label: 'How can I improve my conversion rate for the current ad set?',
    category: 'optimization',
  },
  {
    id: '6',
    label: 'How is my ad budget distributed across platforms?',
    category: 'budget',
  },
];
