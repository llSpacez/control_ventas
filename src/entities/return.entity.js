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
exports.Return = void 0;
const typeorm_1 = require("typeorm");
const sale_entity_1 = require("./sale.entity");
const user_entity_1 = require("./user.entity");
const return_detail_entity_1 = require("./return-detail.entity");
let Return = class Return {
};
exports.Return = Return;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Return.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_number', length: 50, unique: true }),
    __metadata("design:type", String)
], Return.prototype, "returnNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sale_id' }),
    __metadata("design:type", Number)
], Return.prototype, "saleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Return.prototype, "returnDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Return.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Return.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' }),
    __metadata("design:type", String)
], Return.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], Return.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Return.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sale_entity_1.Sale, sale => sale.id),
    (0, typeorm_1.JoinColumn)({ name: 'sale_id' }),
    __metadata("design:type", sale_entity_1.Sale)
], Return.prototype, "sale", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.id),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Return.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => return_detail_entity_1.ReturnDetail, detail => detail.return, { cascade: true }),
    __metadata("design:type", Array)
], Return.prototype, "details", void 0);
exports.Return = Return = __decorate([
    (0, typeorm_1.Entity)('returns')
], Return);
//# sourceMappingURL=return.entity.js.map