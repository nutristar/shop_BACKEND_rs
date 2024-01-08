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

//
// import { Module } from '@nestjs/common';
// import { HttpModule } from '@nestjs/axios';
//
// import { BffController } from './bff.controller';
// import { BffService } from './bff.service';
//
// @Module({
//   imports: [HttpModule],
//   controllers: [BffController],
//   providers: [BffService],
// })
// export class AppModule {}
//
//
// import { Injectable } from '@nestjs/common';
// import { HttpModule, HttpService } from '@nestjs/axios';
//
// import { Request } from 'express';
//
// @Injectable()
// export class BffService {
//   constructor(private httpService: HttpService) {}
//
//   async forwardRequest(req: Request): Promise<any> {
//     const recipientServiceName = req.url.split('/')[1]; // Extract service name from URL
//     const recipientURL = process.env[`${recipientServiceName.toUpperCase()}_URL`];
//
//     if (!recipientURL) {
//       throw new Error("Recipient service URL not found");
//     }
//
//     const response = await this.httpService.request({
//       method: req.method,
//       url: recipientURL + req.url.substring(recipientServiceName.length + 1),
//       ...(req.method !== 'GET' && { data: req.body }),
//     }).toPromise();
//
//     return response;
//   }
// }
