import {inject, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AlertButtonComponent } from './alert-button.component';

import { MessageService } from '../message.service';
import { of } from 'rxjs';


fdescribe('AlertButtonComponent', () => {
  let component: AlertButtonComponent;
  let fixture: ComponentFixture<AlertButtonComponent>;
  let de: DebugElement;

  let serviceStub: any;
  let service: MessageService;
  let spy: jasmine.Spy;

  let expectedContent = 'this is a mocked data';

  beforeEach(async () => {

    // serviceStub = {
    //   getContent: () => of(expectedContent)
    // }
    await TestBed.configureTestingModule({
      declarations: [ AlertButtonComponent ],
      // providers: [{provide: MessageService, useValue: serviceStub}]
      providers: [MessageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertButtonComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    service = de.injector.get(MessageService);

    spy = spyOn(service, 'getContent').and.returnValue(of(expectedContent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should have a message with `warn`', () => {
  //   expect(component.content).toContain('warn');
  // });

  it('should have a severity greater than 2', () => {
    expect(component.severity).toBeGreaterThan(2);
  });

  it('should have an H1 tag of `Alert Button`', () => {
    expect(de.query(By.css('h1')).nativeElement.innerHTML).toBe('Alert Button');
  });

  it('should toggle the message boolean', () => {
    expect(component.hideContent).toBeTruthy();
    component.toggle(); 
    expect(component.hideContent).toBeFalsy();
  });

  it('should toggle the message boolean asynchoronously', fakeAsync(() => {
    expect(component.hideContent).toBeTruthy();
    component.toggleAsync();
    tick(501); 
    expect(component.hideContent).toBeFalsy();
  }));

  it('should have message content defined from an observable', () => {
    component.content.subscribe(content => {
      expect(content).toBeDefined();
      expect(content).toBe(expectedContent);
    })
  });

  it('should call getcontent one time and udpate the view', () => {
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.all().length).toEqual(1);

    expect(de.query(By.css('.message-body')).nativeElement.innerText).toContain(expectedContent);
  });

});
