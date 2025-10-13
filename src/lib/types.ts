export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'Admin' | 'Sales' | 'Store';
};

export type StockItem = {
  id: string;
  name:string;
  barcode: string;
  category: string;
  warehouse: string;
  quantity: number;
  rate: number;
  gst: number; // in percent
  imageUrl: string;
  imageHint: string;
};

export type Invoice = {
  id: string;
  customerName: string;
  date: Date;
  items: {
    itemId: string;
    quantity: number;
    rate: number;
  }[];
  totalAmount: number;
  createdBy: string; // user id
  status: 'Paid' | 'Pending' | 'Overdue';
};

export type ActivityLog = {
  id: string;
  timestamp: Date;
  user: {
    name: string;
    role: User['role'];
  };
  action: string;
  details: string;
};
