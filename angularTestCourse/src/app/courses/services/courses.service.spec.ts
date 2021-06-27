import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import {
  COURSES,
  findLessonsForCourse,
  LESSONS,
} from "../../../../server/db-data";
import { HttpErrorResponse } from "@angular/common/http";

describe("Courses service", () => {
  let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("returns all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy();
      expect(courses.length).toBe(12);

      const course = courses.find((course) => course.id == 12);

      expect(course.titles.description).toBe("Angular Testing Course");
    });

    const req = httpTestingController.expectOne("/api/courses");

    expect(req.request.method).toEqual("GET");

    req.flush({ payload: Object.values(COURSES) });
  });

  it("returns courses by id", () => {
    const courseIdToBeQueried = 12;
    coursesService.findCourseById(courseIdToBeQueried).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(courseIdToBeQueried);
      expect(course.lessonsCount).toBe(10);
    });

    const req = httpTestingController.expectOne(
      `/api/courses/${courseIdToBeQueried}`
    );

    expect(req.request.method).toEqual("GET");

    req.flush(COURSES[courseIdToBeQueried]);
  });

  it("saves course data", () => {
    var changedDesc = "changed";
    const changes = { titles: { description: changedDesc } };

    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
      expect(course.titles.description).toBe(changedDesc);
    });

    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("PUT");

    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );

    req.flush({ ...COURSES[12], ...changes });
  });

  it("should give an error if save course fails", () => {
    const changes = { titles: { description: "some change" } };
    coursesService.saveCourse(12, changes).subscribe(
      () => {
        fail("should not be sucessful");
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe("Internal server error");
      }
    );

    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("PUT");

    req.flush("Save course failed", {
      status: 500,
      statusText: "Internal server error",
    });
  });

  it("should find a list of lessons", () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(
      (req) => req.url == "/api/lessons"
    );

    expect(req.request.method).toEqual("GET");

    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });
});
