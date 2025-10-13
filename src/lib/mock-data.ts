import type { User, StockItem, ActivityLog } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@tallysync.pro', avatarUrl: 'https://picsum.photos/seed/user1/100/100', role: 'Admin' },
  { id: '2', name: 'Sales Person', email: 'sales@tallysync.pro', avatarUrl: 'https://picsum.photos/seed/user2/100/100', role: 'Sales' },
  { id: '3', name: 'Store Keeper', email: 'store@tallysync.pro', avatarUrl: 'https://picsum.photos/seed/user3/100/100', role: 'Store' },
  { id: '4', name: 'Alia Reddy', email: 'alia.r@tallysync.pro', avatarUrl: 'https://picsum.photos/seed/user4/100/100', role: 'Sales' },
  { id: '5', name: 'Ben Carter', email: 'ben.c@tallysync.pro', avatarUrl: 'https://picsum.photos/seed/user5/100/100', role: 'Store' },
];

const categories = ['Chairs', 'Tables', 'Sofas', 'Storage', 'Beds'];
const warehouses = ['Main Warehouse', 'North Depot', 'South Depot'];

export const mockStockItems: StockItem[] = PlaceHolderImages.map((img, index) => ({
  id: (index + 1).toString(),
  name: img.description,
  barcode: (123456789012 + index).toString(),
  category: categories[index % categories.length],
  warehouse: warehouses[index % warehouses.length],
  quantity: Math.floor(Math.random() * 100),
  rate: Math.floor(Math.random() * (50000 - 5000 + 1)) + 5000,
  gst: 18,
  imageUrl: img.imageUrl,
  imageHint: img.imageHint,
}));

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    user: { name: 'Sales Person', role: 'Sales' },
    action: 'Create Invoice',
    details: 'Invoice #INV-003 for Prestige Constructions'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    user: { name: 'Store Keeper', role: 'Store' },
    action: 'Stock Check',
    details: 'Scanned item: Oak Dining Table (123456789013)'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 62 * 60 * 1000),
    user: { name: 'Admin User', role: 'Admin' },
    action: 'Add User',
    details: 'Created new user: Alia Reddy (Sales)'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    user: { name: 'Sales Person', role: 'Sales' },
    action: 'Login',
    details: 'User successfully logged in'
  },
    {
    id: '5',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    user: { name: 'Admin User', role: 'Admin' },
    action: 'System Update',
    details: 'Tally data sync completed successfully'
  },
];
