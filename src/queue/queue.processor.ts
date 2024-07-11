import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor('my-queue')
export class QueueProcessor extends WorkerHost {
  async process(job: any) {
    console.log('Processing job:', job.id);
    console.log('Job data:', job.data);
    // Process your job here
  }
}
