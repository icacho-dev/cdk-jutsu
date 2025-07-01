export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface APIResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}
