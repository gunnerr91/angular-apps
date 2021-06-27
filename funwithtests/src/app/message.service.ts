import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerServiceService } from './logger-service.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private loggerService: LoggerServiceService) { }

  getContent(){
    this.loggerService.log("get content is called");
    return new Observable((ob) => ob.next("finally here?"));
  }

  isLoggerAvailable(): boolean{
    return this.loggerService.availability();
  }
}
