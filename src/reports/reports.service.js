"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("../entities/sale.entity");
const sale_detail_entity_1 = require("../entities/sale-detail.entity");
const product_entity_1 = require("../entities/product.entity");
const customer_entity_1 = require("../entities/customer.entity");
const purchase_entity_1 = require("../entities/purchase.entity");
const expense_entity_1 = require("../entities/expense.entity");
const inventory_entity_1 = require("../entities/inventory.entity");
const payment_entity_1 = require("../entities/payment.entity");
let ReportsService = class ReportsService {
    constructor(saleRepository, saleDetailRepository, productRepository, customerRepository, purchaseRepository, expenseRepository, inventoryRepository, paymentRepository) {
        this.saleRepository = saleRepository;
        this.saleDetailRepository = saleDetailRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.purchaseRepository = purchaseRepository;
        this.expenseRepository = expenseRepository;
        this.inventoryRepository = inventoryRepository;
        this.paymentRepository = paymentRepository;
    }
    async getInvoice(id) {
        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: { customer: true, user: true, details: { product: true } },
        });
        return {
            success: true,
            data: sale,
        };
    }
    async getSalesMasterDetail() {
        const sales = await this.saleRepository.find({
            relations: { customer: true, details: { product: true }, user: true },
            order: { saleDate: 'DESC' },
        });
        const details = await this.saleDetailRepository.find({
            relations: { sale: true, product: true },
        });
        return {
            success: true,
            sales,
            details,
        };
    }
    async getSalesByDateRange(startDate, endDate) {
        const sales = await this.saleRepository.find({
            where: { saleDate: (0, typeorm_2.Between)(startDate, endDate), status: 'completed' },
            relations: { customer: true, user: true },
            order: { saleDate: 'DESC' },
        });
        const total = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        const average = total / sales.length || 0;
        return {
            success: true,
            data: sales,
            total,
            average,
            count: sales.length,
            startDate,
            endDate,
        };
    }
    async getSalesByCustomer(customerId) {
        const customer = await this.customerRepository.findOne({
            where: { id: customerId },
        });
        const sales = await this.saleRepository.find({
            where: { customerId, status: 'completed' },
            relations: { details: { product: true }, user: true },
            order: { saleDate: 'DESC' },
        });
        const totalSpent = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        return {
            success: true,
            customer,
            sales,
            totalSpent,
            totalSales: sales.length,
        };
    }
    async getTopProducts(limit = 10) {
        const results = await this.saleDetailRepository
            .createQueryBuilder('detail')
            .select('product.id', 'productId')
            .addSelect('product.name', 'productName')
            .addSelect('product.code', 'productCode')
            .addSelect('SUM(detail.quantity)', 'totalQuantity')
            .addSelect('SUM(detail.subtotal)', 'totalAmount')
            .addSelect('AVG(detail.unitPrice)', 'averagePrice')
            .leftJoin('detail.product', 'product')
            .groupBy('product.id')
            .orderBy('totalQuantity', 'DESC')
            .limit(limit)
            .getRawMany();
        return {
            success: true,
            data: results,
        };
    }
    async getLowStockProducts(threshold = 10) {
        const products = await this.productRepository.find({
            where: { stock: (0, typeorm_2.LessThan)(threshold), isActive: true },
            relations: { category: true, supplier: true },
            order: { stock: 'ASC' },
        });
        return {
            success: true,
            data: products,
            count: products.length,
            threshold,
        };
    }
    async getSalesByUser(userId, startDate, endDate) {
        const whereCondition = { userId, status: 'completed' };
        if (startDate && endDate) {
            whereCondition.saleDate = (0, typeorm_2.Between)(startDate, endDate);
        }
        const sales = await this.saleRepository.find({
            where: whereCondition,
            relations: { customer: true },
            order: { saleDate: 'DESC' },
        });
        const total = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        return {
            success: true,
            sales,
            total,
            count: sales.length,
        };
    }
    async getDailySalesSummary(date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const sales = await this.saleRepository.find({
            where: { saleDate: (0, typeorm_2.Between)(startOfDay, endOfDay), status: 'completed' },
            relations: { customer: true },
        });
        const total = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        const count = sales.length;
        const average = total / count || 0;
        const paymentsByMethod = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('payment.paymentMethod', 'method')
            .addSelect('SUM(payment.amount)', 'total')
            .where('payment.paymentDate BETWEEN :start AND :end', { start: startOfDay, end: endOfDay })
            .groupBy('payment.paymentMethod')
            .getRawMany();
        return {
            date,
            total,
            count,
            average,
            paymentsByMethod,
            sales
        };
    }
    async getPurchasesBySupplier(supplierId, startDate, endDate) {
        const whereCondition = { supplierId };
        if (startDate && endDate) {
            whereCondition.purchaseDate = (0, typeorm_2.Between)(startDate, endDate);
        }
        const purchases = await this.purchaseRepository.find({
            where: whereCondition,
            relations: { details: { product: true }, user: true },
            order: { purchaseDate: 'DESC' },
        });
        const total = purchases.reduce((sum, purchase) => sum + Number(purchase.total), 0);
        return {
            success: true,
            purchases,
            total,
            count: purchases.length,
        };
    }
    async getExpensesByCategory(startDate, endDate) {
        const expenses = await this.expenseRepository
            .createQueryBuilder('expense')
            .select('expense.category', 'category')
            .addSelect('SUM(expense.amount)', 'total')
            .addSelect('COUNT(expense.id)', 'count')
            .where('expense.expenseDate BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .groupBy('expense.category')
            .orderBy('total', 'DESC')
            .getRawMany();
        const grandTotal = expenses.reduce((sum, cat) => sum + Number(cat.total), 0);
        return {
            success: true,
            data: expenses,
            grandTotal,
            startDate,
            endDate,
        };
    }
    async getProductProfitability() {
        const products = await this.productRepository.find({
            where: { isActive: true },
            relations: { category: true },
        });
        const profitability = products.map(product => ({
            ...product,
            profit: Number(product.price) - Number(product.cost),
            margin: ((Number(product.price) - Number(product.cost)) / Number(product.price)) * 100,
        }));
        const sorted = profitability.sort((a, b) => b.margin - a.margin);
        const totalProfit = sorted.reduce((sum, p) => sum + p.profit * p.stock, 0);
        return {
            success: true,
            data: sorted,
            totalProfit,
        };
    }
    async getFrequentCustomers(minPurchases = 5) {
        const customers = await this.customerRepository
            .createQueryBuilder('customer')
            .leftJoin('customer.sales', 'sale')
            .select('customer.id', 'id')
            .addSelect('customer.fullName', 'fullName')
            .addSelect('customer.documentNumber', 'documentNumber')
            .addSelect('customer.email', 'email')
            .addSelect('customer.phone', 'phone')
            .addSelect('COUNT(sale.id)', 'purchaseCount')
            .addSelect('SUM(sale.total)', 'totalSpent')
            .addSelect('AVG(sale.total)', 'averagePurchase')
            .where('sale.status = :status', { status: 'completed' })
            .groupBy('customer.id')
            .having('COUNT(sale.id) >= :minPurchases', { minPurchases })
            .orderBy('totalSpent', 'DESC')
            .getRawMany();
        return {
            success: true,
            data: customers,
            minPurchases,
        };
    }
    async getInventoryByWarehouse() {
        const inventory = await this.inventoryRepository
            .createQueryBuilder('inventory')
            .leftJoinAndSelect('inventory.product', 'product')
            .leftJoinAndSelect('inventory.warehouse', 'warehouse')
            .orderBy('warehouse.name', 'ASC')
            .addOrderBy('product.name', 'ASC')
            .getMany();
        const grouped = inventory.reduce((acc, item) => {
            const warehouseName = item.warehouse?.name || 'Sin almacén';
            if (!acc[warehouseName]) {
                acc[warehouseName] = [];
            }
            acc[warehouseName].push(item);
            return acc;
        }, {});
        return {
            success: true,
            data: grouped,
        };
    }
    async getMonthlyBilling(year) {
        const results = await this.saleRepository
            .createQueryBuilder('sale')
            .select('MONTH(sale.saleDate)', 'month')
            .addSelect('YEAR(sale.saleDate)', 'year')
            .addSelect('SUM(sale.total)', 'total')
            .addSelect('COUNT(sale.id)', 'count')
            .where('YEAR(sale.saleDate) = :year', { year })
            .andWhere('sale.status = :status', { status: 'completed' })
            .groupBy('MONTH(sale.saleDate)')
            .orderBy('month', 'ASC')
            .getRawMany();
        const yearlyTotal = results.reduce((sum, month) => sum + Number(month.total), 0);
        return {
            success: true,
            data: results,
            year,
            yearlyTotal,
        };
    }
    async getBusinessSummary() {
        const totalSales = await this.saleRepository
            .createQueryBuilder('sale')
            .select('SUM(sale.total)', 'total')
            .where('sale.status = :status', { status: 'completed' })
            .getRawOne();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todaySales = await this.saleRepository
            .createQueryBuilder('sale')
            .select('SUM(sale.total)', 'total')
            .where('sale.saleDate BETWEEN :today AND :tomorrow', { today, tomorrow })
            .andWhere('sale.status = :status', { status: 'completed' })
            .getRawOne();
        const totalCustomers = await this.customerRepository.count();
        const activeCustomers = await this.customerRepository.count({ where: { isActive: true } });
        const totalProducts = await this.productRepository.count();
        const lowStockProducts = await this.productRepository.count({ where: { stock: (0, typeorm_2.LessThan)(10) } });
        const currentMonth = new Date();
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const monthlyExpenses = await this.expenseRepository
            .createQueryBuilder('expense')
            .select('SUM(expense.amount)', 'total')
            .where('expense.expenseDate BETWEEN :start AND :end', { start: startOfMonth, end: endOfMonth })
            .getRawOne();
        const inventoryValue = await this.inventoryRepository
            .createQueryBuilder('inventory')
            .leftJoin('inventory.product', 'product')
            .select('SUM(inventory.quantity * product.cost)', 'total')
            .getRawOne();
        const paymentsByMethod = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('payment.paymentMethod', 'method')
            .addSelect('SUM(payment.amount)', 'total')
            .groupBy('payment.paymentMethod')
            .getRawMany();
        return {
            success: true,
            data: {
                sales: {
                    total: Number(totalSales?.total || 0),
                    today: Number(todaySales?.total || 0),
                },
                customers: {
                    total: totalCustomers,
                    active: activeCustomers,
                },
                products: {
                    total: totalProducts,
                    lowStock: lowStockProducts,
                },
                expenses: {
                    monthly: Number(monthlyExpenses?.total || 0),
                },
                inventory: {
                    value: Number(inventoryValue?.total || 0),
                },
                payments: paymentsByMethod,
            },
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(sale_detail_entity_1.SaleDetail)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(4, (0, typeorm_1.InjectRepository)(purchase_entity_1.Purchase)),
    __param(5, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __param(6, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __param(7, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map