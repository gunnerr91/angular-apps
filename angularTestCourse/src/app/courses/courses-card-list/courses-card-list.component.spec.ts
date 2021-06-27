import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesCardListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the course list", () => {
    component.courses = setupCourses();

    fixture.detectChanges();

    const cards = de.queryAll(By.css(".course-card"));

    expect(cards).toBeTruthy();
    expect(cards.length).toBe(12);
  });

  it("should display the first course", () => {
    component.courses = setupCourses();

    fixture.detectChanges();

    const expectedCourse = component.courses[0];

    const expectedCard = de.query(By.css(".course-card:first-child")),
      title = expectedCard.query(By.css("mat-card-title")),
      image = expectedCard.query(By.css("img"));

    expect(expectedCard).toBeTruthy();

    expect(title.nativeElement.textContent).toBe(
      expectedCourse.titles.description
    );
    expect(image.nativeElement.src).toBe(expectedCourse.iconUrl);
  });
});
