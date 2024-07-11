import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { Queue } from 'bullmq';

jest.mock('bullmq');

describe('QueueService', () => {
  let service: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueService],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new queue if it does not exist', () => {
    const queueName = 'test-queue';
    service.createQueue(queueName);

    expect(service['queues'].has(queueName)).toBe(true);
    const queue = service['queues'].get(queueName);
    expect(queue).toBeInstanceOf(Queue);
  });

  it('should not create a new queue if it already exists', () => {
    const queueName = 'test-queue';
    service.createQueue(queueName);
    const firstQueueInstance = service['queues'].get(queueName);

    service.createQueue(queueName);
    const secondQueueInstance = service['queues'].get(queueName);

    expect(firstQueueInstance).toBe(secondQueueInstance);
  });

  it('should add a job to an existing queue', async () => {
    const queueName = 'test-queue';
    service.createQueue(queueName);

    const queue = service['queues'].get(queueName);
    const addJobSpy = jest.spyOn(queue, 'add');

    const jobData = { data: 'test-data' };
    await service.addJob(queueName, jobData);

    expect(addJobSpy).toHaveBeenCalledWith(queueName + '-job', jobData);
  });

  it('should throw an error when adding a job to a non-existent queue', async () => {
    const queueName = 'non-existent-queue';
    const jobData = { data: 'test-data' };

    await expect(service.addJob(queueName, jobData)).rejects.toThrowError(
      `Queue ${queueName} does not exist`,
    );
  });
});
