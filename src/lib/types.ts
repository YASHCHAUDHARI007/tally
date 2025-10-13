export type Employee = {
    id: string;
    username: string;
    email: string;
    role: 'Admin' | 'Sales' | 'Store';
  };
  
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
    category?: string;
    warehouse?: string;
    quantity: number;
    rate: number;
    gst: number; // in percent
    imageUrl: string;
    imageHint: string;
  };
  
  export type Invoice = {
    id: string;
    customerName: string;
    date: string; // ISO string
    items: {
      itemId: string;
      quantity: number;
      rate: number;
      gst: number;
    }[];
    totalAmount: number;
    employeeId: string; // user id
    status: 'Paid' | 'Pending' | 'Overdue';
  };
  
  export type ActivityLog = {
    id: string;
    timestamp: string; // ISO string
    user: {
      name: string;
      role: Employee['role'];
    };
    action: string;
    details: string;
  };
  