import { Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { SaleDetail } from '../entities/sale-detail.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Purchase } from '../entities/purchase.entity';
import { Expense } from '../entities/expense.entity';
import { Inventory } from '../entities/inventory.entity';
import { Payment } from '../entities/payment.entity';
export declare class ReportsService {
    private saleRepository;
    private saleDetailRepository;
    private productRepository;
    private customerRepository;
    private purchaseRepository;
    private expenseRepository;
    private inventoryRepository;
    private paymentRepository;
    constructor(saleRepository: Repository<Sale>, saleDetailRepository: Repository<SaleDetail>, productRepository: Repository<Product>, customerRepository: Repository<Customer>, purchaseRepository: Repository<Purchase>, expenseRepository: Repository<Expense>, inventoryRepository: Repository<Inventory>, paymentRepository: Repository<Payment>);
    getInvoice(id: number): Promise<{
        success: boolean;
        data: Sale;
    }>;
    getSalesMasterDetail(): Promise<{
        success: boolean;
        sales: Sale[];
        details: SaleDetail[];
    }>;
    getSalesByDateRange(startDate: Date, endDate: Date): Promise<{
        success: boolean;
        data: Sale[];
        total: number;
        average: number;
        count: number;
        startDate: Date;
        endDate: Date;
    }>;
    getSalesByCustomer(customerId: number): Promise<{
        success: boolean;
        customer: Customer;
        sales: Sale[];
        totalSpent: number;
        totalSales: number;
    }>;
    getTopProducts(limit?: number): Promise<{
        success: boolean;
        data: any[];
    }>;
    getLowStockProducts(threshold?: number): Promise<{
        success: boolean;
        data: Product[];
        count: number;
        threshold: number;
    }>;
    getSalesByUser(userId: number, startDate?: Date, endDate?: Date): Promise<{
        success: boolean;
        sales: Sale[];
        total: number;
        count: number;
    }>;
    getDailySalesSummary(date: Date): Promise<{
        date: Date;
        total: number;
        count: number;
        average: number;
        paymentsByMethod: any[];
        sales: Sale[];
    }>;
    getPurchasesBySupplier(supplierId: number, startDate?: Date, endDate?: Date): Promise<{
        success: boolean;
        purchases: Purchase[];
        total: number;
        count: number;
    }>;
    getExpensesByCategory(startDate: Date, endDate: Date): Promise<{
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
            saleDetails: SaleDetail[];
            purchaseDetails: import("../entities/purchase-detail.entity").PurchaseDetail[];
            inventories: Inventory[];
            returnDetails: import("../entities/return-detail.entity").ReturnDetail[];
        }[];
        totalProfit: number;
    }>;
    getFrequentCustomers(minPurchases?: number): Promise<{
        success: boolean;
        data: any[];
        minPurchases: number;
    }>;
    getInventoryByWarehouse(): Promise<{
        success: boolean;
        data: {};
    }>;
    getMonthlyBilling(year: number): Promise<{
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
