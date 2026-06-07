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
exports.PurchaseDetail = void 0;
const typeorm_1 = require("typeorm");
const purchase_entity_1 = require("./purchase.entity");
const product_entity_1 = require("./product.entity");
let PurchaseDetail = class PurchaseDetail {
};
exports.PurchaseDetail = PurchaseDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchaseDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_id' }),
    __metadata("design:type", Number)
], PurchaseDetail.prototype, "purchaseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], PurchaseDetail.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PurchaseDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseDetail.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseDetail.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_entity_1.Purchase, purchase => purchase.details, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'purchase_id' }),
    __metadata("design:type", purchase_entity_1.Purchase)
], PurchaseDetail.prototype, "purchase", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, product => product.purchaseDetails),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], PurchaseDetail.prototype, "product", void 0);
exports.PurchaseDetail = PurchaseDetail = __decorate([
    (0, typeorm_1.Entity)('purchase_details')
], PurchaseDetail);
//# sourceMappingURL=purchase-detail.entity.js.map