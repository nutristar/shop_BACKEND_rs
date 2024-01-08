import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
export declare class BffService {
    private httpService;
    constructor(httpService: HttpService);
    forwardRequest(req: Request): Promise<any>;
}
