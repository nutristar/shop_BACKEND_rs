import { Controller, Req, Res, All, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BffService } from './bff.service';

@Controller('bff')
export class BffController {
  constructor(private readonly bffService: BffService) {}

  @All('*')
  async handleRequest(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await this.bffService.forwardRequest(req);
      res.status(response.status).send(response.data);
    } catch (error) {
      res.status(HttpStatus.BAD_GATEWAY).send(error.message);
    }
  }
}
