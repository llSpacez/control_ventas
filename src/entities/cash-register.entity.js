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
exports.CashRegister = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let CashRegister = class CashRegister {
};
exports.CashRegister = CashRegister;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CashRegister.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'opening_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CashRegister.prototype, "openingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closing_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CashRegister.prototype, "closingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'initial_amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CashRegister.prototype, "initialAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_total', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CashRegister.prototype, "salesTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expenses_total', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CashRegister.prototype, "expensesTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CashRegister.prototype, "expectedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CashRegister.prototype, "actualAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CashRegister.prototype, "difference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['open', 'closed', 'suspended'], default: 'open' }),
    __metadata("design:type", String)
], CashRegister.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'opened_by' }),
    __metadata("design:type", Number)
], CashRegister.prototype, "openedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closed_by', nullable: true }),
    __metadata("design:type", Number)
], CashRegister.prototype, "closedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CashRegister.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CashRegister.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'opened_by' }),
    __metadata("design:type", user_entity_1.User)
], CashRegister.prototype, "openedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'closed_by' }),
    __metadata("design:type", user_entity_1.User)
], CashRegister.prototype, "closedBy", void 0);
exports.CashRegister = CashRegister = __decorate([
    (0, typeorm_1.Entity)('cash_registers')
], CashRegister);
//# sourceMappingURL=cash-register.entity.js.map