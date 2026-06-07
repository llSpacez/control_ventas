import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { PaginationDto } from '../dto/pagination.dto';
export declare class CustomersService {
    private customerRepository;
    constructor(customerRepository: Repository<Customer>);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: Customer[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Customer>;
    findByDocument(documentNumber: string): Promise<Customer>;
    create(customerData: Partial<Customer>): Promise<Customer>;
    update(id: number, customerData: Partial<Customer>): Promise<Customer>;
    remove(id: number): Promise<void>;
    getSalesHistory(id: number): Promise<{
        success: boolean;
        data: import("../entities/sale.entity").Sale[];
    }>;
}
