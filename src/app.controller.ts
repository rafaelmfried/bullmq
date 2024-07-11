import { Controller, Get, Query } from '@nestjs/common';
import { QueueService } from './queue/queue.service';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly queueService: QueueService) {}

  @Get('create-queue')
  createQueue(@Query('name') name: string) {
    this.queueService.createQueue(name);
    return `Queue ${name} created`;
  }

  @Get('add-job')
  async addJob(
    @Query('queueName') queueName: string,
    @Query('data') data: string,
  ) {
    await this.queueService.addJob(queueName, { data });
    return `Job added to queue ${queueName}`;
  }
}
