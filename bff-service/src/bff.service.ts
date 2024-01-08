import { Injectable } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

import { Request } from 'express';

@Injectable()
export class BffService {
  constructor(private httpService: HttpService) {}

  async forwardRequest(req: Request): Promise<any> {
    const recipientServiceName = req.url.split('/')[1]; // Extract service name from URL
    const recipientURL = process.env[`${recipientServiceName.toUpperCase()}_URL`];
//
//     const recipientServiceName = req.url.split('/')[1]; // Extract service name from URL
//     const recipientURL = process.env[`${recipientServiceName.toUpperCase()}_URL`];

    if (!recipientURL) {
      throw new Error("Recipient service URL not found");
    }

    const response = await this.httpService.request({
      method: req.method,
      url: recipientURL + req.url.substring(recipientServiceName.length + 1),
      ...(req.method !== 'GET' && { data: req.body }),
    }).toPromise();

    return response;
  }
}
