import { Request, Response } from 'express';
import { BffService } from './bff.service';
export declare class BffController {
    private readonly bffService;
    constructor(bffService: BffService);
    handleRequest(req: Request, res: Response): Promise<void>;
}
