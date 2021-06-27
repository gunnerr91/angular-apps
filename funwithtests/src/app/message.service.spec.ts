import { LoggerServiceService } from './logger-service.service';
import { MessageService } from './message.service';


fdescribe('MessageService', () => {
  let service: MessageService;
  let logger: LoggerServiceService;
  beforeEach(() => {
    logger = jasmine.createSpyObj('LoggerServiceService',['log','availability']);
    service = new MessageService(logger);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('logs when get content is invoked', () => {
    service.getContent();
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it('returns true when logger service is available', () => {
    logger.availability = () => true;
    let result = service.isLoggerAvailable();
    expect(result).toBe(true);
  });

  it('returns false when logger service is available', () => {
    logger.availability = () => false;
    let result = service.isLoggerAvailable();
    expect(result).toBe(false);
  });
});
