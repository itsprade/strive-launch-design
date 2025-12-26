// Type definitions for dummy data

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'manager';
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'Google Ads' | 'Facebook' | 'LinkedIn' | 'Twitter' | 'Instagram';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  conversions: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  roi: number;
}

export interface Metric {
  id: string;
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  format?: 'number' | 'currency' | 'percentage';
}

export interface InsightCard {
  id: string;
  type: 'success' | 'warning' | 'info';
  platform?: string;
  metric?: string;
  value?: string;
  description: string;
  backgroundColor: string;
}

export interface QuickAction {
  id: string;
  label: string;
  category: string;
}
