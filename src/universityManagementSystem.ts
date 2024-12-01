// Enum для статусу студента
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

// Enum для типу курсу
enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

// Enum для семестру
enum Semester {
    First = "First",
    Second = "Second"
}

// Enum для оцінок
enum GradeEnum {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

// Enum для факультетів
enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// Інтерфейс студента
interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

// Інтерфейс курсу
interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

// Інтерфейс оцінки
interface Grade {
    studentId: number;
    courseId: number;
    grade: GradeEnum;
    date: Date;
    semester: Semester;
}

class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private registrations: { studentId: number, courseId: number }[] = []; // Додано для відображення реєстрацій
    private grades: Grade[] = [];
    private studentIdCounter = 1;
    private courseIdCounter = 1;

    // Метод для реєстрації студента
    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = {
            id: this.studentIdCounter++,
            ...student
        };
        this.students.push(newStudent);
        return newStudent;
    }

    // Метод для додавання курсу
    addCourse(course: Omit<Course, "id">): Course {
        const newCourse: Course = {
            id: this.courseIdCounter++,
            ...course
        };
        this.courses.push(newCourse);
        return newCourse;
    }

    // Метод для реєстрації студента на курс
    registerForCourse(studentId: number, courseId: number): void {
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
    setGrade(studentId: number, courseId: number, grade: GradeEnum): void {
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

        const newGrade: Grade = {
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
    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            student.status = newStatus;
            console.log(`Статус студента ${student.fullName} оновлено на ${newStatus}.`);
        } else {
            console.log(`Студент з ID ${studentId} не знайдений.`);
        }
    }

    // Метод для отримання студентів за факультетом
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }

    // Метод для отримання оцінок студента
    getStudentGrades(studentId: number): Grade[] {
        return this.grades.filter(g => g.studentId === studentId);
    }

    // Метод для отримання доступних курсів для факультету та семестру
    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }

    // Метод для розрахунку середнього балу студента
    calculateAverageGrade(studentId: number): number {
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
const course: Course = universitySystem.addCourse({
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
