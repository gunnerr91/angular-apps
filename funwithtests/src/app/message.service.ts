import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  getContent(){
    return new Observable((ob) => ob.next("finally here?"));
  }
}
