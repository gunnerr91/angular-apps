import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerServiceService {

  constructor() { }

  log(message: string): void{
    console.log(message);
  }

  availability(): boolean{
    return true;
  }
}
