"use strict";
// Enum для статусу студента
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
// Enum для типу курсу
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
// Enum для семестру
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
// Enum для оцінок
var GradeEnum;
(function (GradeEnum) {
    GradeEnum[GradeEnum["Excellent"] = 5] = "Excellent";
    GradeEnum[GradeEnum["Good"] = 4] = "Good";
    GradeEnum[GradeEnum["Satisfactory"] = 3] = "Satisfactory";
    GradeEnum[GradeEnum["Unsatisfactory"] = 2] = "Unsatisfactory";
})(GradeEnum || (GradeEnum = {}));
// Enum для факультетів
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
class UniversityManagementSystem {
    constructor() {
        this.students = [];
        this.courses = [];
        this.registrations = []; // Додано для відображення реєстрацій
        this.grades = [];
        this.studentIdCounter = 1;
        this.courseIdCounter = 1;
    }
    // Метод для реєстрації студента
    enrollStudent(student) {
        const newStudent = Object.assign({ id: this.studentIdCounter++ }, student);
        this.students.push(newStudent);
        return newStudent;
    }
    // Метод для додавання курсу
    addCourse(course) {
        const newCourse = Object.assign({ id: this.courseIdCounter++ }, course);
        this.courses.push(newCourse);
        return newCourse;
    }
    // Метод для реєстрації студента на курс
    registerForCourse(studentId, courseId) {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (!student) {
            console.log(`Студент з ID ${studentId} не знайдений.`);
            return;
        }
        if (!course) {
            console.log(`Курс з ID ${courseId} не знайдений.`);
            return;
        }
        if (course.maxStudents <= this.registrations.filter(r => r.courseId === courseId).length) {
            console.log(`Курс ${course.name} вже заповнений.`);
            return;
        }
        if (student.faculty !== course.faculty) {
            console.log(`Студент не може реєструватися на курс іншого факультету.`);
            return;
        }
        // Додаємо реєстрацію студента на курс
        this.registrations.push({ studentId, courseId });
        console.log(`Студент ${student.fullName} зареєстрований на курс ${course.name}.`);
    }
    // Метод для виставлення оцінки
    setGrade(studentId, courseId, grade) {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (!student || !course) {
            console.log(`Неможливо виставити оцінку. Студент або курс не знайдені.`);
            return;
        }
        const isRegistered = this.registrations.some(r => r.studentId === studentId && r.courseId === courseId);
        if (!isRegistered) {
            console.log(`Студент не зареєстрований на курс. Оцінку не можна виставити.`);
            return;
        }
        const newGrade = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };
        this.grades.push(newGrade);
        console.log(`Оцінка ${grade} виставлена студенту ${student.fullName} на курсі ${course.name}.`);
    }
    // Метод для оновлення статусу студента
    updateStudentStatus(studentId, newStatus) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            student.status = newStatus;
            console.log(`Статус студента ${student.fullName} оновлено на ${newStatus}.`);
        }
        else {
            console.log(`Студент з ID ${studentId} не знайдений.`);
        }
    }
    // Метод для отримання студентів за факультетом
    getStudentsByFaculty(faculty) {
        return this.students.filter(s => s.faculty === faculty);
    }
    // Метод для отримання оцінок студента
    getStudentGrades(studentId) {
        return this.grades.filter(g => g.studentId === studentId);
    }
    // Метод для отримання доступних курсів для факультету та семестру
    getAvailableCourses(faculty, semester) {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }
    // Метод для розрахунку середнього балу студента
    calculateAverageGrade(studentId) {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) {
            console.log(`Студент з ID ${studentId} не має оцінок.`);
            return 0;
        }
        const totalGrade = studentGrades.reduce((sum, grade) => sum + grade.grade, 0);
        return totalGrade / studentGrades.length;
    }
}
// Створення системи управління університетом
const universitySystem = new UniversityManagementSystem();
// Додавання курсу для тестування
const course = universitySystem.addCourse({
    name: "Основи програмування",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 30,
});
// Додавання студента для тестування
const student = universitySystem.enrollStudent({
    fullName: "Іван Петренко",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "CS101",
});
// Реєстрація студента на курс
universitySystem.registerForCourse(student.id, course.id);
// Виставлення оцінки студенту
universitySystem.setGrade(student.id, course.id, GradeEnum.Excellent);
// Виведення оцінок студента
console.log("Оцінки студента:", universitySystem.getStudentGrades(student.id));
// Розрахунок середнього балу студента
const averageGrade = universitySystem.calculateAverageGrade(student.id);
console.log("Середній бал студента:", averageGrade);
