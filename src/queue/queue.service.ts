import { Injectable } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';

@Injectable()
export class QueueService {
  private queues: Map<string, Queue> = new Map();

  constructor() {}

  createQueue(name: string) {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, {
        connection: {
          host: 'redis',
          port: 6379,
        },
      });

      // const worker =
      new Worker(
        name,
        async (job) => {
          console.log(`Processing job in ${name}:`, job.id);
          console.log('Job data:', job.data);
          // Process your job here
        },
        {
          connection: {
            host: 'redis',
            port: 6379,
          },
        },
      );

      this.queues.set(name, queue);
    }
  }

  async addJob(queueName: string, data: any) {
    const queue = this.queues.get(queueName);
    if (queue) {
      await queue.add(queueName + '-job', data);
    } else {
      throw new Error(`Queue ${queueName} does not exist`);
    }
  }
}
