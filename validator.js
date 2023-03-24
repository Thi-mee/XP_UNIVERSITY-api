class Validator {
  constructor() {
    this._errorMsg = [];
  }

  get error() {
    let temp = this._errorMsg;
    this._errorMsg = [];
    return temp;
  }

  isNotUndefined(input, name) {
    if (input === undefined) {
      this._errorMsg.push(`${name} is undefined`);
      return false;
    }
    return true;
  }

  minlength(input, minValue, name) {

    let inputLength = input.length;

    if (inputLength < minValue) {
      this._errorMsg.push(`${name} must be minimum of ${minValue} characters`);
      return false;
    }
    return true
  }

  maxlength(input, maxValue, name) {
    let inputLength = input.value.length;

    if (inputLength > maxValue) {
      this._errorMsg.push(`${name} shouldn't be more than ${maxValue} characters`);
      return false;
    }
    return true
  }

  nonNegative(number, name) {
    if (this.isNotUndefined(number, name) === false) return false;
    if (this.isNumber(number, name) === false) return false;
    if (number < 0) {
      this._errorMsg.push(`${name} must be a non-negative number`);
      return false;
    }
    return true;
  }

  greaterThan(number, minValue, name) {
    if (this.isNotUndefined(number, name) === false) return false;
    if (this.isNumber(number, name) === false) return false;
    if (number < minValue) {
      this._errorMsg.push(`${name} must be greater than ${minValue}`);
      return false;
    }
    return true;
  }

  isString(input, name) {
    if (typeof input !== "string") {
      this._errorMsg.push(`${name} must be a string`);
      return false;
    }
    return true;
  }

  onlyletters(input) {
    let re = /^[A-Za-z]+$/;;

    let inputValue = input.value;

    let errorMessage = "Este campo não aceita números nem caracteres especiais";

    if (!re.test(inputValue)) {
      this.printMessage(input, errorMessage);
    }
  }

  isNumber(number, name) {
    let re = /^[0-9]+$/;

    if (!re.test(number)) {
      this._errorMsg.push(`${name} must be a number`);
      return false;
    }
    return true;
  }

  /**
   * Checks if a input value is an integer
   * @param {any} value to be checked 
   * @param {string} name to be filled in the error message
   * @returns 
   */
  isInteger(value, name) {
    if (this.isNotUndefined(value, name) === false) return false;
    if (!Number.isInteger(value)) {
      this._errorMsg.push(`${name} must be an integer`);
      return false;
    }
    return true;
  }

  isStatusValid(status) {
    if (status === undefined) {
      this._errorMsg.push("Status is required");
      return false;
    }
    if (!this.isInteger(status, "Status")) return false;
    if (status < 0 || status > 1) {
      this._errorMsg.push("Status must be either 0 or 1");
      return false;
    }
    return true;
  }

  isStringLengthGreaterThan(input, name, length) {
    if (this.isNotUndefined(input, name) === false) return false;
    if (this.isString(input, name) === false) return false;
    if (this.minlength(input, length, name) === false) return false;
    return true;
  }

  /**
   * 
   * @param {{
   * Name: string,
   * UniqueId: string,
   * Code: string,
   * Status: number
   * FacultyId: number | undefined
   * }} faculty 
   * @returns 
   */
  faculty(faculty) {
    const res = !this.isStringLengthGreaterThan(faculty.Name, "Faculty Name", 3) ? false
      : !this.isStringLengthGreaterThan(faculty.UniqueId, "Unique Id", 3) ? false
        : !this.isStringLengthGreaterThan(faculty.Code, "Faculty Code", 2) ? false
          : !this.isStatusValid(faculty.Status) ? false : true;
    if (res === false) return false;

    if (faculty.FacultyId) {
      return !this.isNumber(faculty.FacultyId, "Faculty Id") ? false
        : !this.nonNegative(faculty.FacultyId, "Faculty Id") ? false : true;
    }
    return true;
  }

  /**
   * 
   * @param {{
   * Name: string,
   * Status: number
   * }} query 
   */
  facultyQuery(query) {
    let res1, res2;
    if (query.Status !== undefined) {
      res1 = this.nonNegative(query.Status, "Status");
    }
    if (query.Name) {
      res2 = this.isString(query.Name, "Faculty Name");
    }
    if (res1 === false || res2 === false) {
      return false;
    }
    return true;
  }

  /**
   * 
   * @param {{
   * Name: string,
   * FacultyId: number,
   * UniqueId: string,
   * Code: string,
   * Status: number,
   * DepartmentId: number | undefined
   * }} department 
   */
  department(department) {
    const res = !this.isStringLengthGreaterThan(department.Name, "Department Name", 3) ? false
      : !this.isNumber(department.FacultyId, "Faculty Id") ? false
        : !this.greaterThan(department.FacultyId, 0, "Faculty Id") ? false
          : !this.isStringLengthGreaterThan(department.UniqueId, "Unique Id", 3) ? false
            : !this.isStringLengthGreaterThan(department.Code, "Department Code", 2) ? false
              : !this.isStatusValid(department.Status) ? false : true

    if (res === false) return false;
    if (department.DepartmentId) {
      return !this.nonNegative(department.DepartmentId, "Department Id") ? false : true;
    }
    return true;
  }

  /**
   * 
   * @param {{Status: number|undefined, Name: string|undefined, FacultyId: number|undefined}} query 
   * @returns 
   */
  departmentQuery(query) {
    let res1, res2, res3;
    if (query.Status !== undefined) {
      res1 = !this.isInteger(query.Status, "Status") ? false : true;
      console.log(res1);
    }
    if (query.Name !== undefined) {
      res2 = !this.isString(query.Name, "Department Name") ? false: true;
    }
    if (query.FacultyId !== undefined) {
      res3 = !this.nonNegative(query.FacultyId, "Faculty Id") ? false : true;
    }
    if (res1 === false || res2 === false || res3 === false) {
      return false;
    }
    return true;
  }

  /**
 * 
 * @param {{
 * Name: string,
 * CourseId: number | undefined,
 * DepartmentId: number,
 * UniqueId: string,
 * Code: string,
 * Units: number,
 * CourseLevel: number,
 * CourseSemester: number,
 * Status: number
 * }} course 
 */
  course(course) {
    const res1 = !this.isStringLengthGreaterThan(course.Name, "Course Name", 3) ? false
      : !this.greaterThan(course.DepartmentId, 0, "Department Id") ? false
        : !this.isStringLengthGreaterThan(course.UniqueId, "Unique Id", 3) ? false
          : !this.isStringLengthGreaterThan(course.Code, "Course Code", 2) ? false
            : !this.greaterThan(course.Units, 0, "Course Units") ? false
              : !this.greaterThan(course.CourseLevel, 0, "Course Level") ? false
                : !this.greaterThan(course.CourseSemester, 0, "Course Semester") ? false
                  : !this.isStatusValid(course.Status) ? false : true;
    if (res1 === false) return false;
    if (course.CourseId) {
      return !this.nonNegative(course.CourseId, "Course Id") ? false : true;
    }
    return true
  }

  /**
   * 
   * @param {{Status: number|undefined, Name: string|undefined, DepartmentId: number|undefined}} query 
   * @returns 
   */
  courseQuery(query) {
    let res2, res3, res1;

    if (query.Status !== undefined) {
      res1 = this.isInteger(query.Status, "Status");
    }
    if (query.Name !== undefined) {
      res2 = this.isString(query.Name, "Course Name");
    }
    if (query.FacultyId !== undefined) {
      res3 = this.nonNegative(query.DepartmentId, "Department Id");
    }
    if (res1 === false || res2 === false || res3 === false) {
      return false;
    }
    return true;
  }

  /**
   * 
   * @param {{
   * CourseOfStudyId: number | undefined,
   * DepartmentId: number,
   * Name: string,
   * ShortName: string,
   * UniqueId: string,
   * Award: string,
   * Duration: number,
   * RequiredCreditUnits: number,
   * Advisor: string,
   * Status: number
   * }} courseOfStudy 
   */
  courseOfStudy(courseOfStudy) {
    const res1 = !this.greaterThan(courseOfStudy.DepartmentId, 0, "Department Id") ? false
      : !this.isStringLengthGreaterThan(courseOfStudy.Name, "Course of Study Name", 4) ? false
        : !this.isStringLengthGreaterThan(courseOfStudy.ShortName, "Course of Study Short Name", 2) ? false
          : !this.isStringLengthGreaterThan(courseOfStudy.UniqueId, "Unique Id", 3) ? false
            : !this.isStringLengthGreaterThan(courseOfStudy.Award, "Award", 10) ? false
              : !this.greaterThan(courseOfStudy.Duration, 0, "Duration") ? false
                : !this.greaterThan(courseOfStudy.RequiredCreditUnits, 50, "Required Credit Units") ? false
                  : !this.isStringLengthGreaterThan(courseOfStudy.Advisor, "Advisor", 5) ? false
                    : !this.nonNegative(courseOfStudy.Status, "Status") ? false : true;
    if (!res1) return false;
    if (courseOfStudy.CourseOfStudyId) {
      return !this.nonNegative(courseOfStudy.CourseOfStudyId, "Course of Study Id") ? false : true;
    }
    return true;
  }

  /**
   * 
   * @param {{Status: number|undefined, Name: string|undefined, DepartmentId: number|undefined}} query 
   * @returns 
   */
  courseOfStudyQuery(query) {
    let res2, res3, res4;
    if (query.Status !== undefined) {
      res2 = this.isInteger(query.Status, "Status");
    }
    if (query.Name !== undefined) {
      res3 = this.isString(query.Name, "Course of Study Name");
    }
    if (query.FacultyId !== undefined) {
      res4 = this.isNumber(query.DepartmentId, "Department Id");
    }
    if (res2 === false || res3 === false || res4 === false) {
      return false;
    }
    return true;
  }

  /**
   * 
   * @param {{
   * FirstName: string,
   * Surname: string,
   * OtherNames: string,
   * StaffId: string,
   * DepartmentId: number,
   * Status: number,
   * LecturerId: number
   *}} lecturer 
   */
  lecturer(lecturer) {
    const res1 = !this.isStringLengthGreaterThan(lecturer.Surname, "Surname", 3) ? false
      : !this.isStringLengthGreaterThan(lecturer.FirstName, "First Name", 3) ? false
        : !this.isStringLengthGreaterThan(lecturer.StaffId, "Staff Id", 3) ? false
          : !this.greaterThan(lecturer.DepartmentId, 0, "Department Id") ? false
            : !this.nonNegative(lecturer.Status, "Status") ? false : true;
    if (!res1) return false;
    if (lecturer.LecturerId) {
      return !this.nonNegative(lecturer.LecturerId, "lecturer Id") ? false : true;
    }
    return true;
  }

  /**
   * 
   * @param {{Status: number|undefined, Name: string|undefined, DepartmentId: number|undefined}} query 
   * @returns 
   */
  lecturerQuery(query) {
    let res2, res3, res4;
    if (query.Status !== undefined) {
      res2 = this.isInteger(query.Status, "Status");
    }
    if (query.Name !== undefined) {
      res3 = this.isString(query.Name, "Lecturer Name");
    }
    if (query.FacultyId !== undefined) {
      res4 = this.isNumber(query.DepartmentId, "Department Id");
    }
    if (res2 === false || res3 === false || res4 === false) {
      return false;
    }
    return true;
  }
}

module.exports = new Validator;