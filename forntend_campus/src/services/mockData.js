// Mock Database and Services for Campus Management System
// Persists in localStorage for a fully functional CRUD experience on the client side.

const INITIAL_DATA = {
  departments: [
    { id: 'DEPT01', name: 'Computer Science & Engineering', code: 'CSE', head: 'Dr. Alan Turing', room: 'Block A - 401', facultyCount: 15, studentCount: 240 },
    { id: 'DEPT02', name: 'Electronics & Communication', code: 'ECE', head: 'Dr. Claude Shannon', room: 'Block B - 202', facultyCount: 12, studentCount: 180 },
    { id: 'DEPT03', name: 'Mechanical Engineering', code: 'ME', head: 'Dr. Nikola Tesla', room: 'Block C - 105', facultyCount: 10, studentCount: 150 },
    { id: 'DEPT04', name: 'Business Administration', code: 'MBA', head: 'Dr. Peter Drucker', room: 'Block D - 310', facultyCount: 8, studentCount: 120 }
  ],
  courses: [
    { id: 'CRS01', name: 'B.Tech Computer Science', code: 'CS-BTECH', duration: '4 Years', department: 'Computer Science & Engineering', feesPerSem: 75000 },
    { id: 'CRS02', name: 'M.Tech Data Science', code: 'DS-MTECH', duration: '2 Years', department: 'Computer Science & Engineering', feesPerSem: 90000 },
    { id: 'CRS03', name: 'B.Tech Electronics', code: 'ECE-BTECH', duration: '4 Years', department: 'Electronics & Communication', feesPerSem: 70000 },
    { id: 'CRS04', name: 'Master of Business Administration', code: 'MBA-GEN', duration: '2 Years', department: 'Business Administration', feesPerSem: 110000 }
  ],
  subjects: [
    { id: 'SUB01', name: 'Database Management Systems', code: 'CSE-301', semester: 5, department: 'Computer Science & Engineering', credits: 4 },
    { id: 'SUB02', name: 'Design and Analysis of Algorithms', code: 'CSE-302', semester: 5, department: 'Computer Science & Engineering', credits: 4 },
    { id: 'SUB03', name: 'Computer Networks', code: 'CSE-303', semester: 5, department: 'Computer Science & Engineering', credits: 3 },
    { id: 'SUB04', name: 'Digital Signal Processing', code: 'ECE-301', semester: 5, department: 'Electronics & Communication', credits: 4 },
    { id: 'SUB05', name: 'Organizational Behavior', code: 'MBA-101', semester: 1, department: 'Business Administration', credits: 3 }
  ],
  students: [
    { id: 'STU001', name: 'John Doe', rollNo: 'CSE-22-001', email: 'john.doe@campus.edu', department: 'Computer Science & Engineering', course: 'B.Tech Computer Science', semester: 5, attendance: 87.5, cgpa: 8.9, balanceFees: 15000, paidFees: 60000, status: 'Active', gender: 'Male', dob: '2004-05-12', phone: '+1 555-0199', address: '123 University Dorms, Campus Road' },
    { id: 'STU002', name: 'Jane Smith', rollNo: 'CSE-22-002', email: 'jane.smith@campus.edu', department: 'Computer Science & Engineering', course: 'B.Tech Computer Science', semester: 5, attendance: 92.0, cgpa: 9.2, balanceFees: 0, paidFees: 75000, status: 'Active', gender: 'Female', dob: '2004-08-22', phone: '+1 555-0188', address: '456 College View Apartments, City' },
    { id: 'STU003', name: 'Alex Johnson', rollNo: 'ECE-22-015', email: 'alex.j@campus.edu', department: 'Electronics & Communication', course: 'B.Tech Electronics', semester: 5, attendance: 78.4, cgpa: 7.8, balanceFees: 20000, paidFees: 50000, status: 'Active', gender: 'Non-Binary', dob: '2003-11-05', phone: '+1 555-0177', address: '789 Elm St, Suburbia' },
    { id: 'STU004', name: 'Emma Watson', rollNo: 'MBA-23-042', email: 'emma.w@campus.edu', department: 'Business Administration', course: 'Master of Business Administration', semester: 1, attendance: 95.5, cgpa: 9.5, balanceFees: 0, paidFees: 110000, status: 'Active', gender: 'Female', dob: '2001-04-15', phone: '+1 555-0166', address: '10 Pine Dr, Metro City' },
    { id: 'STU005', name: 'Michael Brown', rollNo: 'ME-22-009', email: 'michael.b@campus.edu', department: 'Mechanical Engineering', course: 'B.Tech Computer Science', semester: 5, attendance: 65.2, cgpa: 6.9, balanceFees: 35000, paidFees: 40000, status: 'On Probation', gender: 'Male', dob: '2003-02-28', phone: '+1 555-0155', address: '22 Oak Ln, West Hills' }
  ],
  faculty: [
    { id: 'FAC001', name: 'Dr. Alan Turing', facultyId: 'FAC-CSE-001', email: 'alan.turing@campus.edu', department: 'Computer Science & Engineering', designation: 'Professor & Head', courses: ['B.Tech Computer Science', 'M.Tech Data Science'], subjects: ['Design and Analysis of Algorithms'], phone: '+1 555-1001', office: 'Block A - 401', qualification: 'Ph.D. in Computer Science', experience: '15 Years', status: 'Active' },
    { id: 'FAC002', name: 'Dr. Grace Hopper', facultyId: 'FAC-CSE-002', email: 'grace.hopper@campus.edu', department: 'Computer Science & Engineering', designation: 'Associate Professor', courses: ['B.Tech Computer Science'], subjects: ['Database Management Systems'], phone: '+1 555-1002', office: 'Block A - 405', qualification: 'Ph.D. in Software Engineering', experience: '10 Years', status: 'Active' },
    { id: 'FAC003', name: 'Dr. Claude Shannon', facultyId: 'FAC-ECE-001', email: 'claude.shannon@campus.edu', department: 'Electronics & Communication', designation: 'Professor & Head', courses: ['B.Tech Electronics'], subjects: ['Digital Signal Processing'], phone: '+1 555-1003', office: 'Block B - 202', qualification: 'Ph.D. in Information Theory', experience: '18 Years', status: 'Active' }
  ],
  notices: [
    { id: 'NOT01', title: 'End Semester Examination Schedule', content: 'The end semester examination for all courses will commence on December 1st, 2026. The detailed timetable has been updated in the respective portals. Please check and clear all pending dues before November 20th.', date: '2026-07-10', category: 'Exam', target: 'All' },
    { id: 'NOT02', title: 'Hackathon Registration Open', content: 'Register for the annual campus hackathon "Code-Sprint 2026". Registration closes on August 5th. Win prizes up to $5000 and internship opportunities with leading tech firms.', date: '2026-07-12', category: 'Event', target: 'All' },
    { id: 'NOT03', title: 'Faculty Meeting: Syllabus Review', content: 'All faculty members are requested to attend the syllabus review meeting scheduled for tomorrow at 2:00 PM in the Main Conference Hall.', date: '2026-07-13', category: 'Academic', target: 'Faculty' }
  ],
  events: [
    { id: 'EVT01', title: 'Campus Hackathon "Code-Sprint"', date: '2026-08-10', time: '09:00 AM - 09:00 PM', location: 'Main Computing Lab', coordinator: 'Dr. Grace Hopper', description: '24-hour coding challenge testing problem-solving, UI design, and execution.', image: '' },
    { id: 'EVT02', title: 'Annual Cultural Festival "Aura"', date: '2026-09-15', time: '10:00 AM - 11:00 PM', location: 'Open Air Theater', coordinator: 'Prof. Claude Shannon', description: 'Music, dance, fashion show, and food stalls celebrating campus talent and diversity.', image: '' },
    { id: 'EVT03', title: 'National Tech Symposium', date: '2026-10-05', time: '10:00 AM - 05:00 PM', location: 'Seminar Hall 1', coordinator: 'Dr. Alan Turing', description: 'Paper presentations, guest lectures, and robotic battles involving 50+ colleges.', image: '' }
  ],
  placements: [
    { id: 'PLC01', company: 'Google Inc.', designation: 'Associate Software Engineer', package: '45 LPA', eligibility: 'CSE, ECE (CGPA > 8.5)', driveDate: '2026-09-20', status: 'Upcoming', applied: 85, selected: 0 },
    { id: 'PLC02', company: 'Microsoft', designation: 'Technical Program Manager', package: '38 LPA', eligibility: 'All Branches (CGPA > 8.0)', driveDate: '2026-09-28', status: 'Upcoming', applied: 140, selected: 0 },
    { id: 'PLC03', company: 'NVIDIA', designation: 'Hardware Design Intern', package: '25 LPA', eligibility: 'ECE (CGPA > 8.0)', driveDate: '2026-07-05', status: 'Completed', applied: 40, selected: 3 },
    { id: 'PLC04', company: 'Deloitte', designation: 'Technology Analyst', package: '12 LPA', eligibility: 'All Branches (CGPA > 7.0)', driveDate: '2026-07-02', status: 'Completed', applied: 200, selected: 24 }
  ],
  assignments: [
    { id: 'ASN01', title: 'DBMS Normalization Exercises', course: 'B.Tech Computer Science', subject: 'Database Management Systems', faculty: 'Dr. Grace Hopper', dueDate: '2026-07-25', status: 'Active', submissions: [
      { studentId: 'STU001', studentName: 'John Doe', rollNo: 'CSE-22-001', submittedAt: '2026-07-13', status: 'Graded', grade: 'A', file: 'dbms_normal.pdf' },
      { studentId: 'STU002', studentName: 'Jane Smith', rollNo: 'CSE-22-002', submittedAt: '2026-07-14', status: 'Submitted', grade: '', file: 'dbms_smith.pdf' }
    ] },
    { id: 'ASN02', title: 'Dynamic Programming Implementations', course: 'B.Tech Computer Science', subject: 'Design and Analysis of Algorithms', faculty: 'Dr. Alan Turing', dueDate: '2026-07-30', status: 'Active', submissions: [] }
  ],
  timetable: {
    'B.Tech Computer Science': {
      Monday: [
        { time: '09:00 - 10:00', subject: 'Database Management Systems', code: 'CSE-301', room: 'Block A - 402', teacher: 'Dr. Grace Hopper' },
        { time: '10:00 - 11:00', subject: 'Design and Analysis of Algorithms', code: 'CSE-302', room: 'Block A - 402', teacher: 'Dr. Alan Turing' },
        { time: '11:15 - 12:15', subject: 'Computer Networks', code: 'CSE-303', room: 'Block A - 402', teacher: 'Dr. Grace Hopper' },
        { time: '02:00 - 04:00', subject: 'DBMS Laboratory', code: 'CSE-301L', room: 'Main Computing Lab', teacher: 'Dr. Grace Hopper' }
      ],
      Tuesday: [
        { time: '09:00 - 10:00', subject: 'Computer Networks', code: 'CSE-303', room: 'Block A - 402', teacher: 'Dr. Grace Hopper' },
        { time: '10:00 - 11:00', subject: 'Database Management Systems', code: 'CSE-301', room: 'Block A - 402', teacher: 'Dr. Grace Hopper' },
        { time: '11:15 - 12:15', subject: 'Design and Analysis of Algorithms', code: 'CSE-302', room: 'Block A - 402', teacher: 'Dr. Alan Turing' }
      ],
      Wednesday: [
        { time: '09:00 - 10:00', subject: 'Design and Analysis of Algorithms', code: 'CSE-302', room: 'Block A - 402', teacher: 'Dr. Alan Turing' },
        { time: '10:00 - 11:00', subject: 'Computer Networks', code: 'CSE-303', room: 'Block A - 402', teacher: 'Dr. Grace Hopper' },
        { time: '02:00 - 04:00', subject: 'Algorithms Lab', code: 'CSE-302L', room: 'Algorithms Lab', teacher: 'Dr. Alan Turing' }
      ],
      Thursday: [
        { time: '09:00 - 10:00', subject: 'Database Management Systems', code: 'CSE-301', room: 'Block A - 402', teacher: 'Dr. Grace Hopper' },
        { time: '11:15 - 12:15', subject: 'Computer Networks', code: 'CSE-303', room: 'Block A - 402', teacher: 'Dr. Grace Hopper' }
      ],
      Friday: [
        { time: '10:00 - 11:00', subject: 'Design and Analysis of Algorithms', code: 'CSE-302', room: 'Block A - 402', teacher: 'Dr. Alan Turing' },
        { time: '11:15 - 12:15', subject: 'Database Management Systems', code: 'CSE-301', room: 'Block A - 402', teacher: 'Dr. Grace Hopper' }
      ]
    }
  },
  studentAttendance: [
    { studentId: 'STU001', subject: 'Database Management Systems', classesConducted: 24, classesAttended: 22 },
    { studentId: 'STU001', subject: 'Design and Analysis of Algorithms', classesConducted: 26, classesAttended: 21 },
    { studentId: 'STU001', subject: 'Computer Networks', classesConducted: 20, classesAttended: 18 },
    { studentId: 'STU002', subject: 'Database Management Systems', classesConducted: 24, classesAttended: 24 },
    { studentId: 'STU002', subject: 'Design and Analysis of Algorithms', classesConducted: 26, classesAttended: 23 },
    { studentId: 'STU002', subject: 'Computer Networks', classesConducted: 20, classesAttended: 17 }
  ],
  studentResults: {
    'STU001': [
      { semester: 1, gpa: 8.5, subjects: [{ name: 'Mathematics I', grade: 'A+' }, { name: 'Basic Electrical Eng', grade: 'A' }, { name: 'Programming in C', grade: 'O' }] },
      { semester: 2, gpa: 8.7, subjects: [{ name: 'Mathematics II', grade: 'A' }, { name: 'Data Structures', grade: 'O' }, { name: 'Physics', grade: 'B+' }] },
      { semester: 3, gpa: 9.1, subjects: [{ name: 'Object Oriented Prog', grade: 'O' }, { name: 'Digital Electronics', grade: 'A+' }, { name: 'Discrete Maths', grade: 'A' }] },
      { semester: 4, gpa: 8.9, subjects: [{ name: 'Operating Systems', grade: 'A+' }, { name: 'Formal Languages', grade: 'A' }, { name: 'Computer Org', grade: 'A' }] }
    ],
    'STU002': [
      { semester: 1, gpa: 9.0, subjects: [{ name: 'Mathematics I', grade: 'O' }, { name: 'Basic Electrical Eng', grade: 'A+' }, { name: 'Programming in C', grade: 'O' }] },
      { semester: 2, gpa: 9.3, subjects: [{ name: 'Mathematics II', grade: 'A+' }, { name: 'Data Structures', grade: 'O' }, { name: 'Physics', grade: 'A+' }] },
      { semester: 3, gpa: 9.4, subjects: [{ name: 'Object Oriented Prog', grade: 'O' }, { name: 'Digital Electronics', grade: 'O' }, { name: 'Discrete Maths', grade: 'A+' }] },
      { semester: 4, gpa: 9.2, subjects: [{ name: 'Operating Systems', grade: 'O' }, { name: 'Formal Languages', grade: 'A+' }, { name: 'Computer Org', grade: 'A' }] }
    ]
  },
  feesTransactions: [
    { id: 'TXN1001', studentId: 'STU001', amount: 30000, date: '2026-07-02', status: 'Success', mode: 'Credit Card', purpose: 'Semester 5 Tuition' },
    { id: 'TXN1002', studentId: 'STU001', amount: 30000, date: '2026-07-05', status: 'Success', mode: 'Net Banking', purpose: 'Semester 5 Hostel Fees' },
    { id: 'TXN1003', studentId: 'STU002', amount: 75000, date: '2026-07-01', status: 'Success', mode: 'UPI', purpose: 'Semester 5 Tuition' }
  ],
  systemSettings: {
    campusName: 'Vanguard Technical Institute',
    shortName: 'VTI Campus',
    academicYear: '2026-27',
    contactEmail: 'admin@vanguard.edu',
    contactPhone: '+1 (555) 987-6543',
    address: '890 Innovation Boulevard, Cyber City',
    enableNotifications: true,
    maintenanceMode: false
  },
  library: [
    { id: 'LIB001', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest', isbn: '978-0-262-03384-8', category: 'Computer Science', totalCopies: 5, availableCopies: 3, issuedTo: ['STU001', 'STU002'], location: 'Rack A-12', addedDate: '2024-01-15' },
    { id: 'LIB002', title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', isbn: '978-0-07-802215-9', category: 'Computer Science', totalCopies: 4, availableCopies: 4, issuedTo: [], location: 'Rack A-14', addedDate: '2024-02-10' },
    { id: 'LIB003', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0-13-212695-3', category: 'Computer Science', totalCopies: 6, availableCopies: 5, issuedTo: ['STU003'], location: 'Rack A-16', addedDate: '2024-01-20' },
    { id: 'LIB004', title: 'Signals and Systems', author: 'Oppenheim & Willsky', isbn: '978-0-13-814757-0', category: 'Electronics', totalCopies: 3, availableCopies: 2, issuedTo: ['STU003'], location: 'Rack B-08', addedDate: '2024-03-01' },
    { id: 'LIB005', title: 'Engineering Mathematics', author: 'B.S. Grewal', isbn: '978-81-933585-0-8', category: 'Mathematics', totalCopies: 8, availableCopies: 6, issuedTo: ['STU001', 'STU005'], location: 'Rack C-02', addedDate: '2023-11-05' },
    { id: 'LIB006', title: 'Management Information Systems', author: 'Kenneth C. Laudon', isbn: '978-0-13-305849-2', category: 'Business', totalCopies: 4, availableCopies: 4, issuedTo: [], location: 'Rack D-01', addedDate: '2024-04-12' }
  ],
  libraryIssues: [
    { id: 'ISS001', bookId: 'LIB001', bookTitle: 'Introduction to Algorithms', studentId: 'STU001', studentName: 'John Doe', rollNo: 'CSE-22-001', issueDate: '2026-07-01', dueDate: '2026-07-15', returnDate: null, status: 'Issued', fine: 0 },
    { id: 'ISS002', bookId: 'LIB001', bookTitle: 'Introduction to Algorithms', studentId: 'STU002', studentName: 'Jane Smith', rollNo: 'CSE-22-002', issueDate: '2026-07-05', dueDate: '2026-07-19', returnDate: null, status: 'Issued', fine: 0 },
    { id: 'ISS003', bookId: 'LIB003', bookTitle: 'Computer Networks', studentId: 'STU003', studentName: 'Alex Johnson', rollNo: 'ECE-22-015', issueDate: '2026-06-20', dueDate: '2026-07-04', returnDate: null, status: 'Overdue', fine: 110 },
    { id: 'ISS004', bookId: 'LIB005', bookTitle: 'Engineering Mathematics', studentId: 'STU001', studentName: 'John Doe', rollNo: 'CSE-22-001', issueDate: '2026-06-10', dueDate: '2026-06-24', returnDate: '2026-06-23', status: 'Returned', fine: 0 }
  ],
  hostel: [
    { id: 'HST001', blockName: 'Block A (Boys)', roomNumber: 'A-101', floor: 1, type: 'Double Sharing', capacity: 2, occupants: ['STU001'], amenities: ['AC', 'WiFi', 'Attached Bath'], monthlyRent: 8000, status: 'Partially Occupied' },
    { id: 'HST002', blockName: 'Block A (Boys)', roomNumber: 'A-102', floor: 1, type: 'Triple Sharing', capacity: 3, occupants: ['STU003', 'STU005'], amenities: ['Fan', 'WiFi', 'Common Bath'], monthlyRent: 5000, status: 'Partially Occupied' },
    { id: 'HST003', blockName: 'Block A (Boys)', roomNumber: 'A-201', floor: 2, type: 'Single Occupancy', capacity: 1, occupants: [], amenities: ['AC', 'WiFi', 'Attached Bath', 'Balcony'], monthlyRent: 12000, status: 'Vacant' },
    { id: 'HST004', blockName: 'Block B (Girls)', roomNumber: 'B-101', floor: 1, type: 'Double Sharing', capacity: 2, occupants: ['STU002', 'STU004'], amenities: ['AC', 'WiFi', 'Attached Bath'], monthlyRent: 8000, status: 'Fully Occupied' },
    { id: 'HST005', blockName: 'Block B (Girls)', roomNumber: 'B-102', floor: 1, type: 'Triple Sharing', capacity: 3, occupants: [], amenities: ['Fan', 'WiFi', 'Common Bath'], monthlyRent: 5000, status: 'Vacant' }
  ],
  messMenu: {
    Monday: { breakfast: 'Idli, Sambar, Chutney', lunch: 'Rice, Dal, Sabzi, Curd', snacks: 'Tea & Biscuits', dinner: 'Chapati, Paneer Curry, Rice' },
    Tuesday: { breakfast: 'Poha, Tea', lunch: 'Rice, Rajma, Salad', snacks: 'Samosa & Juice', dinner: 'Chapati, Dal Tadka, Rice, Kheer' },
    Wednesday: { breakfast: 'Bread & Butter, Omelette', lunch: 'Fried Rice, Manchurian, Raita', snacks: 'Coffee & Cake', dinner: 'Chapati, Aloo Gobi, Dal' },
    Thursday: { breakfast: 'Upma, Coconut Chutney', lunch: 'Rice, Chole, Roti', snacks: 'Tea & Pakora', dinner: 'Biryani, Raita, Papad' },
    Friday: { breakfast: 'Dosa, Sambar', lunch: 'Rice, Dal Makhani, Bhindi', snacks: 'Milk & Fruits', dinner: 'Chapati, Mix Veg, Rice, Gulab Jamun' },
    Saturday: { breakfast: 'Puri & Bhaji', lunch: 'Veg Pulao, Papad, Curd', snacks: 'Tea & Bread Omelette', dinner: 'Chapati, Dal, Sabzi, Ice Cream' },
    Sunday: { breakfast: 'Aloo Paratha, Curd', lunch: 'Special Thali (Puri, Sabzi, Dal, Rice, Sweet)', snacks: 'Tea & Snacks', dinner: 'Chapati, Chicken Curry (Non-Veg), Rice, Salad' }
  },
  examSchedule: [
    { id: 'EXM001', examType: 'End Semester', course: 'B.Tech Computer Science', semester: 5, subject: 'Database Management Systems', subjectCode: 'CSE-301', date: '2026-12-01', time: '09:00 AM - 12:00 PM', hall: 'Exam Hall A', maxMarks: 100, duration: '3 Hours', invigilator: 'Dr. Alan Turing' },
    { id: 'EXM002', examType: 'End Semester', course: 'B.Tech Computer Science', semester: 5, subject: 'Design and Analysis of Algorithms', subjectCode: 'CSE-302', date: '2026-12-03', time: '09:00 AM - 12:00 PM', hall: 'Exam Hall B', maxMarks: 100, duration: '3 Hours', invigilator: 'Dr. Grace Hopper' },
    { id: 'EXM003', examType: 'End Semester', course: 'B.Tech Computer Science', semester: 5, subject: 'Computer Networks', subjectCode: 'CSE-303', date: '2026-12-05', time: '02:00 PM - 05:00 PM', hall: 'Exam Hall A', maxMarks: 100, duration: '3 Hours', invigilator: 'Dr. Grace Hopper' },
    { id: 'EXM004', examType: 'Mid Semester', course: 'B.Tech Electronics', semester: 5, subject: 'Digital Signal Processing', subjectCode: 'ECE-301', date: '2026-09-15', time: '10:00 AM - 12:00 PM', hall: 'Seminar Hall 1', maxMarks: 50, duration: '2 Hours', invigilator: 'Dr. Claude Shannon' }
  ],
  leaveRequests: [
    { id: 'LVR001', applicantId: 'STU001', applicantName: 'John Doe', applicantRole: 'student', rollNo: 'CSE-22-001', department: 'Computer Science & Engineering', leaveType: 'Medical', fromDate: '2026-07-20', toDate: '2026-07-22', reason: 'Fever and medical consultation required', appliedDate: '2026-07-14', status: 'Pending', reviewedBy: null, remarks: '' },
    { id: 'LVR002', applicantId: 'FAC002', applicantName: 'Dr. Grace Hopper', applicantRole: 'faculty', rollNo: 'FAC-CSE-002', department: 'Computer Science & Engineering', leaveType: 'Personal', fromDate: '2026-07-25', toDate: '2026-07-25', reason: 'Family function', appliedDate: '2026-07-13', status: 'Approved', reviewedBy: 'Admin', remarks: 'Approved. Please ensure classes are covered.' },
    { id: 'LVR003', applicantId: 'STU003', applicantName: 'Alex Johnson', applicantRole: 'student', rollNo: 'ECE-22-015', department: 'Electronics & Communication', leaveType: 'Academic', fromDate: '2026-08-01', toDate: '2026-08-03', reason: 'National level technical paper presentation', appliedDate: '2026-07-12', status: 'Approved', reviewedBy: 'Admin', remarks: 'All the best!' }
  ],
  grievances: [
    { id: 'GRV001', studentId: 'STU001', studentName: 'John Doe', rollNo: 'CSE-22-001', category: 'Academic', subject: 'Marks Discrepancy in DBMS', description: 'My internal marks for DBMS show 18/25 but I scored 22 in the test. Please review.', filedDate: '2026-07-10', status: 'Under Review', response: '', resolvedDate: null },
    { id: 'GRV002', studentId: 'STU003', studentName: 'Alex Johnson', rollNo: 'ECE-22-015', category: 'Hostel', subject: 'Water Supply Issue in Block A', description: 'No water supply in Block A bathrooms for the past 3 days between 6 AM - 8 AM.', filedDate: '2026-07-08', status: 'Resolved', response: 'The issue has been reported to maintenance. Water supply has been restored.', resolvedDate: '2026-07-12' }
  ],
  certificates: [
    { id: 'CRT001', studentId: 'STU001', studentName: 'John Doe', rollNo: 'CSE-22-001', type: 'Bonafide Certificate', purpose: 'Bank Loan Application', requestedDate: '2026-07-05', status: 'Ready for Collection', collectedDate: null, remarks: 'Certificate ready. Visit admin office with ID card.' },
    { id: 'CRT002', studentId: 'STU002', studentName: 'Jane Smith', rollNo: 'CSE-22-002', type: 'Character Certificate', purpose: 'Job Application', requestedDate: '2026-07-10', status: 'Pending', collectedDate: null, remarks: '' },
    { id: 'CRT003', studentId: 'STU001', studentName: 'John Doe', rollNo: 'CSE-22-001', type: 'Transcript', purpose: 'Higher Studies Application', requestedDate: '2026-06-20', status: 'Collected', collectedDate: '2026-06-25', remarks: 'Collected successfully.' }
  ]
};

// Initialize localStorage if it doesn't exist (with self-healing collection migrations)
const getDb = () => {
  if (typeof window === 'undefined') return INITIAL_DATA;
  const stored = localStorage.getItem('campus_mgmt_db');
  if (!stored) {
    localStorage.setItem('campus_mgmt_db', JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  try {
    const parsed = JSON.parse(stored);
    let hasChanges = false;
    
    // Auto-migrate missing schema fields if database was created by a previous template
    Object.keys(INITIAL_DATA).forEach(key => {
      if (parsed[key] === undefined || parsed[key] === null) {
        parsed[key] = INITIAL_DATA[key];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      localStorage.setItem('campus_mgmt_db', JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    // If parsing fails, reset database completely
    localStorage.setItem('campus_mgmt_db', JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
};

const saveDb = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('campus_mgmt_db', JSON.stringify(data));
  }
};

export const mockDb = {
  // Generic CRUD
  getCollection: (name) => {
    const db = getDb();
    return db[name] || [];
  },

  getItem: (collection, id) => {
    const items = mockDb.getCollection(collection);
    return items.find(item => item.id === id);
  },

  createItem: (collection, itemData) => {
    const db = getDb();
    const items = db[collection] || [];
    const newItem = {
      id: `${collection.toUpperCase().substring(0, 3)}${Math.floor(100 + Math.random() * 900)}`,
      ...itemData
    };
    db[collection] = [...items, newItem];
    saveDb(db);
    return newItem;
  },

  updateItem: (collection, id, itemData) => {
    const db = getDb();
    const items = db[collection] || [];
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      db[collection][index] = { ...db[collection][index], ...itemData };
      saveDb(db);
      return db[collection][index];
    }
    return null;
  },

  deleteItem: (collection, id) => {
    const db = getDb();
    const items = db[collection] || [];
    db[collection] = items.filter(item => item.id !== id);
    saveDb(db);
    return true;
  },

  // Custom getters / actions
  getTimetable: (courseName) => {
    const db = getDb();
    return db.timetable[courseName] || db.timetable['B.Tech Computer Science'];
  },

  updateTimetable: (courseName, schedule) => {
    const db = getDb();
    db.timetable[courseName] = schedule;
    saveDb(db);
    return schedule;
  },

  getStudentAttendance: (studentId) => {
    const db = getDb();
    return db.studentAttendance.filter(att => att.studentId === studentId);
  },

  updateStudentAttendance: (studentId, subject, incrementAttended, incrementConducted) => {
    const db = getDb();
    const index = db.studentAttendance.findIndex(att => att.studentId === studentId && att.subject === subject);
    if (index !== -1) {
      db.studentAttendance[index].classesConducted += incrementConducted;
      db.studentAttendance[index].classesAttended += incrementAttended;
    } else {
      db.studentAttendance.push({
        studentId,
        subject,
        classesConducted: incrementConducted,
        classesAttended: incrementAttended
      });
    }
    saveDb(db);
  },

  getStudentResults: (studentId) => {
    const db = getDb();
    return db.studentResults[studentId] || [];
  },

  getFeesTransactions: (studentId) => {
    const db = getDb();
    return db.feesTransactions.filter(tx => tx.studentId === studentId);
  },

  payStudentFees: (studentId, amount, paymentMode) => {
    const db = getDb();
    const student = db.students.find(s => s.id === studentId);
    if (student) {
      const payAmount = Number(amount);
      student.paidFees += payAmount;
      student.balanceFees = Math.max(0, student.balanceFees - payAmount);
      
      const newTx = {
        id: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
        studentId,
        amount: payAmount,
        date: new Date().toISOString().split('T')[0],
        status: 'Success',
        mode: paymentMode,
        purpose: 'Semester Tuition'
      };
      
      db.feesTransactions.unshift(newTx);
      saveDb(db);
      return { student, transaction: newTx };
    }
    return null;
  },

  getAssignmentsByFaculty: (facultyName) => {
    const db = getDb();
    return db.assignments.filter(asn => asn.faculty === facultyName);
  },

  getAssignmentsByCourse: (courseName) => {
    const db = getDb();
    return db.assignments.filter(asn => asn.course === courseName);
  },

  submitAssignment: (assignmentId, studentId, studentName, rollNo, fileName) => {
    const db = getDb();
    const assignment = db.assignments.find(asn => asn.id === assignmentId);
    if (assignment) {
      const submission = {
        studentId,
        studentName,
        rollNo,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        grade: '',
        file: fileName
      };
      assignment.submissions = assignment.submissions.filter(s => s.studentId !== studentId);
      assignment.submissions.push(submission);
      saveDb(db);
      return assignment;
    }
    return null;
  },

  gradeSubmission: (assignmentId, studentId, grade) => {
    const db = getDb();
    const assignment = db.assignments.find(asn => asn.id === assignmentId);
    if (assignment) {
      const submission = assignment.submissions.find(s => s.studentId === studentId);
      if (submission) {
        submission.grade = grade;
        submission.status = 'Graded';
        saveDb(db);
        return assignment;
      }
    }
    return null;
  },

  getSettings: () => {
    const db = getDb();
    return db.systemSettings;
  },

  updateSettings: (newSettings) => {
    const db = getDb();
    db.systemSettings = { ...db.systemSettings, ...newSettings };
    saveDb(db);
    return db.systemSettings;
  },

  // Library Methods
  issueBook: (bookId, studentId, studentName, rollNo) => {
    const db = getDb();
    const book = db.library.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) return null;
    book.availableCopies -= 1;
    if (!book.issuedTo.includes(studentId)) book.issuedTo.push(studentId);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    const issue = {
      id: `ISS${Math.floor(100 + Math.random() * 900)}`,
      bookId, bookTitle: book.title, studentId, studentName, rollNo,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null, status: 'Issued', fine: 0
    };
    db.libraryIssues.push(issue);
    saveDb(db);
    return issue;
  },

  returnBook: (issueId) => {
    const db = getDb();
    const issue = db.libraryIssues.find(i => i.id === issueId);
    if (!issue) return null;
    issue.returnDate = new Date().toISOString().split('T')[0];
    issue.status = 'Returned';
    const book = db.library.find(b => b.id === issue.bookId);
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      book.issuedTo = book.issuedTo.filter(id => id !== issue.studentId);
    }
    saveDb(db);
    return issue;
  },

  getStudentLibraryIssues: (studentId) => {
    const db = getDb();
    return db.libraryIssues.filter(i => i.studentId === studentId);
  },

  // Hostel Methods
  getMessMenu: () => {
    const db = getDb();
    return db.messMenu;
  },

  getStudentRoom: (studentId) => {
    const db = getDb();
    return db.hostel.find(r => r.occupants.includes(studentId)) || null;
  },

  // Exam Schedule Methods
  getExamsByCourse: (courseName) => {
    const db = getDb();
    return db.examSchedule.filter(e => e.course === courseName);
  },

  // Leave Request Methods
  applyLeave: (data) => {
    const db = getDb();
    const newLeave = {
      id: `LVR${Math.floor(100 + Math.random() * 900)}`,
      ...data,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      reviewedBy: null,
      remarks: ''
    };
    db.leaveRequests.push(newLeave);
    saveDb(db);
    return newLeave;
  },

  reviewLeave: (id, status, remarks) => {
    const db = getDb();
    const leave = db.leaveRequests.find(l => l.id === id);
    if (leave) {
      leave.status = status;
      leave.remarks = remarks;
      leave.reviewedBy = 'Admin';
      saveDb(db);
    }
    return leave;
  },

  getLeavesByApplicant: (applicantId) => {
    const db = getDb();
    return db.leaveRequests.filter(l => l.applicantId === applicantId);
  },

  // Grievance Methods
  fileGrievance: (data) => {
    const db = getDb();
    const newGrievance = {
      id: `GRV${Math.floor(100 + Math.random() * 900)}`,
      ...data,
      filedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      response: '',
      resolvedDate: null
    };
    db.grievances.push(newGrievance);
    saveDb(db);
    return newGrievance;
  },

  respondGrievance: (id, response, status) => {
    const db = getDb();
    const g = db.grievances.find(g => g.id === id);
    if (g) {
      g.response = response;
      g.status = status;
      if (status === 'Resolved') g.resolvedDate = new Date().toISOString().split('T')[0];
      saveDb(db);
    }
    return g;
  },

  getStudentGrievances: (studentId) => {
    const db = getDb();
    return db.grievances.filter(g => g.studentId === studentId);
  },

  // Certificate Methods
  requestCertificate: (data) => {
    const db = getDb();
    const newCert = {
      id: `CRT${Math.floor(100 + Math.random() * 900)}`,
      ...data,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      collectedDate: null,
      remarks: ''
    };
    db.certificates.push(newCert);
    saveDb(db);
    return newCert;
  },

  updateCertificateStatus: (id, status, remarks) => {
    const db = getDb();
    const cert = db.certificates.find(c => c.id === id);
    if (cert) {
      cert.status = status;
      cert.remarks = remarks;
      if (status === 'Collected') cert.collectedDate = new Date().toISOString().split('T')[0];
      saveDb(db);
    }
    return cert;
  },

  getStudentCertificates: (studentId) => {
    const db = getDb();
    return db.certificates.filter(c => c.studentId === studentId);
  }
};
