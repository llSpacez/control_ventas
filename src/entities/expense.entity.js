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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const cash_register_entity_1 = require("./cash-register.entity");
let Expense = class Expense {
};
exports.Expense = Expense;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Expense.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expense_number', length: 50, unique: true }),
    __metadata("design:type", String)
], Expense.prototype, "expenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Expense.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Expense.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Expense.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expense_date', type: 'date' }),
    __metadata("design:type", Date)
], Expense.prototype, "expenseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method', type: 'enum', enum: ['cash', 'transfer', 'check'], default: 'cash' }),
    __metadata("design:type", String)
], Expense.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receipt_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "receiptNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], Expense.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cash_register_id', nullable: true }),
    __metadata("design:type", Number)
], Expense.prototype, "cashRegisterId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Expense.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.expenses),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Expense.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cash_register_entity_1.CashRegister),
    (0, typeorm_1.JoinColumn)({ name: 'cash_register_id' }),
    __metadata("design:type", cash_register_entity_1.CashRegister)
], Expense.prototype, "cashRegister", void 0);
exports.Expense = Expense = __decorate([
    (0, typeorm_1.Entity)('expenses')
], Expense);
//# sourceMappingURL=expense.entity.js.map