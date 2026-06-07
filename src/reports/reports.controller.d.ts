import { ReportsService } from './reports.service';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getInvoice(id: string): Promise<{
        success: boolean;
        data: import("../entities/sale.entity").Sale;
    }>;
    getSalesMasterDetail(): Promise<{
        success: boolean;
        sales: import("../entities/sale.entity").Sale[];
        details: import("../entities/sale-detail.entity").SaleDetail[];
    }>;
    getSalesByDateRange(startDate: string, endDate: string): Promise<{
        success: boolean;
        data: import("../entities/sale.entity").Sale[];
        total: number;
        average: number;
        count: number;
        startDate: Date;
        endDate: Date;
    }>;
    getSalesByCustomer(customerId: string): Promise<{
        success: boolean;
        customer: import("../entities/customer.entity").Customer;
        sales: import("../entities/sale.entity").Sale[];
        totalSpent: number;
        totalSales: number;
    }>;
    getTopProducts(limit?: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    getLowStockProducts(threshold?: string): Promise<{
        success: boolean;
        data: import("../entities/product.entity").Product[];
        count: number;
        threshold: number;
    }>;
    getSalesByUser(userId: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        sales: import("../entities/sale.entity").Sale[];
        total: number;
        count: number;
    }>;
    getDailySalesSummary(date?: string): Promise<{
        date: Date;
        total: number;
        count: number;
        average: number;
        paymentsByMethod: any[];
        sales: import("../entities/sale.entity").Sale[];
    }>;
    getPurchasesBySupplier(supplierId: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        purchases: import("../entities/purchase.entity").Purchase[];
        total: number;
        count: number;
    }>;
    getExpensesByCategory(startDate: string, endDate: string): Promise<{
        success: boolean;
        data: any[];
        grandTotal: any;
        startDate: Date;
        endDate: Date;
    }>;
    getProductProfitability(): Promise<{
        success: boolean;
        data: {
            profit: number;
            margin: number;
            id: number;
            code: string;
            barcode: string;
            name: string;
            description: string;
            price: number;
            cost: number;
            stock: number;
            minStock: number;
            categoryId: number;
            supplierId: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            category: import("../entities/category.entity").Category;
            supplier: import("../entities/supplier.entity").Supplier;
            saleDetails: import("../entities/sale-detail.entity").SaleDetail[];
            purchaseDetails: import("../entities/purchase-detail.entity").PurchaseDetail[];
            inventories: import("../entities/inventory.entity").Inventory[];
            returnDetails: import("../entities/return-detail.entity").ReturnDetail[];
        }[];
        totalProfit: number;
    }>;
    getFrequentCustomers(minPurchases?: string): Promise<{
        success: boolean;
        data: any[];
        minPurchases: number;
    }>;
    getInventoryByWarehouse(): Promise<{
        success: boolean;
        data: {};
    }>;
    getMonthlyBilling(year?: string): Promise<{
        success: boolean;
        data: any[];
        year: number;
        yearlyTotal: any;
    }>;
    getBusinessSummary(): Promise<{
        success: boolean;
        data: {
            sales: {
                total: number;
                today: number;
            };
            customers: {
                total: number;
                active: number;
            };
            products: {
                total: number;
                lowStock: number;
            };
            expenses: {
                monthly: number;
            };
            inventory: {
                value: number;
            };
            payments: any[];
        };
    }>;
}
