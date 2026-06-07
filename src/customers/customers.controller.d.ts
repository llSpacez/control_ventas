import { CustomersService } from './customers.service';
import { Customer } from '../entities/customer.entity';
import { PaginationDto } from '../dto/pagination.dto';
export declare class CustomersController {
    private customersService;
    constructor(customersService: CustomersService);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: Customer[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findByDocument(documentNumber: string): Promise<{
        success: boolean;
        data: Customer;
    }>;
    getSalesHistory(id: string): Promise<{
        success: boolean;
        data: import("../entities/sale.entity").Sale[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: Customer;
    }>;
    create(createCustomerDto: Partial<Customer>): Promise<{
        success: boolean;
        message: string;
        data: Customer;
    }>;
    update(id: string, updateCustomerDto: Partial<Customer>): Promise<{
        success: boolean;
        message: string;
        data: Customer;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
