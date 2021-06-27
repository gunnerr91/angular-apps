import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "../services/courses.service";
import { HttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

fdescribe("dummy tests to try out async behavior with jasmine", () => {
  it("boolean flag returns true using jasmine done", (done) => {
    let test = false;

    setTimeout(() => {
      test = true;
      expect(test).toBe(true);
      done();
    }, 1000);
  });

  it("boolean flag returns true using fakeasync using tick", fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      test = true;
    }, 1000);
    tick(1000);
    expect(test).toBe(true);
  }));

  it("boolean flag returns true using fakeasync using flush", fakeAsync(() => {
    let test = false;

    setTimeout(() => {}, 500);

    setTimeout(() => {
      test = true;
    }, 1000);
    flush();
    expect(test).toBe(true);
  }));
});

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );

  const advancedCourses = setupCourses().filter(
    (course) => course.category == "ADVANCED"
  );

  const allCourses = setupCourses();

  beforeEach(async () => {
    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);
    await TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    coursesService = TestBed.inject(CoursesService);
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1);
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1);
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(allCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(2);
  });

  it("should display advanced courses when tab clicked", () => {
    coursesService.findAllCourses.and.returnValue(of(allCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    click(tabs[1]);

    fixture.detectChanges();

    const titles = el.queryAll(By.css(".mat-card-title"));

    expect(titles.length).not.toBe(0);

    expect(titles[0].nativeElement.textContent).toContain("Security");
  });
});
