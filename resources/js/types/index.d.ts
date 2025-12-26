export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    is_admin: boolean;
}

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock_quantity: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    product: Product;
    subtotal: number;
}

export interface Cart {
    id: number;
    user_id: number;
    items: CartItem[];
    total: number;
    item_count: number;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    product: Product;
    subtotal: number;
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export interface LowStockAlert {
    id: string;
    product_id: number;
    product_name: string;
    stock_quantity: number;
    message: string;
    sent_at: string;
}

export interface ProductSold {
    id: number;
    name: string;
    quantity: number;
    revenue: number;
}

export interface DailySalesReport {
    id: string;
    date: string;
    total_orders: number;
    total_revenue: number;
    total_items: number;
    products_sold: ProductSold[];
    message: string;
    sent_at: string;
}

export interface AdminNotifications {
    lowStockCount: number;
    soldOutCount: number;
    recentAlerts: LowStockAlert[];
    recentReports: DailySalesReport[];
}

export interface ShopConfig {
    lowStockThreshold: number;
    perPage: number;
    dailyReportTime: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    shopConfig: ShopConfig;
    adminNotifications?: AdminNotifications | null;
};
