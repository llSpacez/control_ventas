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
exports.ReturnDetail = void 0;
const typeorm_1 = require("typeorm");
const return_entity_1 = require("./return.entity");
const product_entity_1 = require("./product.entity");
let ReturnDetail = class ReturnDetail {
};
exports.ReturnDetail = ReturnDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReturnDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_id' }),
    __metadata("design:type", Number)
], ReturnDetail.prototype, "returnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], ReturnDetail.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ReturnDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ReturnDetail.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ReturnDetail.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ReturnDetail.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => return_entity_1.Return, returnEntity => returnEntity.details, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'return_id' }),
    __metadata("design:type", return_entity_1.Return)
], ReturnDetail.prototype, "return", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, product => product.returnDetails),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], ReturnDetail.prototype, "product", void 0);
exports.ReturnDetail = ReturnDetail = __decorate([
    (0, typeorm_1.Entity)('return_details')
], ReturnDetail);
//# sourceMappingURL=return-detail.entity.js.map