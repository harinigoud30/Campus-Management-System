import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockDb } from '../services/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session
  useEffect(() => {
    const savedUser = localStorage.getItem('campus_auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    // Return a promise to support async loading state in Login page
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Standard mock checks
        let authenticatedUser = null;
        const cleanEmail = email.trim().toLowerCase();
        console.log("CMS Auth Debug - Login Attempt:", { email, cleanEmail, password, role });

        if (role === 'admin') {
          const admins = mockDb.getCollection('admins') || [];
          const found = admins.find(a => a.email.toLowerCase() === cleanEmail);

          if (cleanEmail === 'admin@campus.edu' && password === 'admin123') {
            authenticatedUser = {
              id: 'ADM001',
              name: 'System Administrator',
              email: 'admin@campus.edu',
              role: 'admin',
              avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
            };
          } else if (found && (password === found.password || password === 'admin123')) {
            authenticatedUser = {
              id: found.id,
              name: found.name,
              email: found.email,
              role: 'admin',
              avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
              details: found
            };
          } else {
            // Check if registered as student or faculty instead
            const students = mockDb.getCollection('students');
            const faculties = mockDb.getCollection('faculty');
            const isStudent = students.find(s => s.email.toLowerCase() === cleanEmail);
            const isFaculty = faculties.find(f => f.email.toLowerCase() === cleanEmail);
            
            if (isStudent) {
              reject(new Error('This email is registered as a Student. Please switch to the Student login tab.'));
            } else if (isFaculty) {
              reject(new Error('This email is registered as a Faculty member. Please switch to the Faculty login tab.'));
            } else {
              reject(new Error('Invalid Admin credentials (Use admin@campus.edu / admin123 or registered admin email)'));
            }
            return;
          }
        } else if (role === 'faculty') {
          // Check in faculty table
          const faculties = mockDb.getCollection('faculty');
          const found = faculties.find(f => f.email.toLowerCase() === cleanEmail);
          console.log("CMS Auth Debug - Faculty verification details:", { faculties, found });
          
          // Allow generic faculty@campus.edu login
          if (cleanEmail === 'faculty@campus.edu' && password === 'faculty123') {
            authenticatedUser = {
              id: faculties[1]?.id || 'FAC001', // Grace Hopper
              name: faculties[1]?.name || 'Dr. Grace Hopper',
              email: 'grace.hopper@campus.edu',
              role: 'faculty',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
              details: faculties[1] || faculties[0]
            };
          } else if (found && (password === found.password || password === 'faculty123')) {
            authenticatedUser = {
              id: found.id,
              name: found.name,
              email: found.email,
              role: 'faculty',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
              details: found
            };
          } else {
            // Check if email was registered as student or admin instead
            const students = mockDb.getCollection('students');
            const admins = mockDb.getCollection('admins') || [];
            const isStudent = students.find(s => s.email.toLowerCase() === cleanEmail);
            const isAdmin = admins.find(a => a.email.toLowerCase() === cleanEmail);
            
            if (isStudent) {
              reject(new Error('This email is registered as a Student. Please switch to the Student login tab.'));
            } else if (isAdmin) {
              reject(new Error('This email is registered as an Admin. Please switch to the Admin login tab.'));
            } else {
              reject(new Error('Invalid Faculty credentials (Use faculty@campus.edu / faculty123 or a registered faculty email)'));
            }
            return;
          }
        } else if (role === 'student') {
          const students = mockDb.getCollection('students');
          const found = students.find(s => s.email.toLowerCase() === cleanEmail);
          console.log("CMS Auth Debug - Student verification details:", { students, found });

          if (cleanEmail === 'student@campus.edu' && password === 'student123') {
            authenticatedUser = {
              id: students[0]?.id || 'STU001', // John Doe
              name: students[0]?.name || 'John Doe',
              email: 'john.doe@campus.edu',
              role: 'student',
              avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
              details: students[0]
            };
          } else if (found && (password === found.password || password === 'student123')) {
            authenticatedUser = {
              id: found.id,
              name: found.name,
              email: found.email,
              role: 'student',
              avatar: 'https://images.unsplash.com/photo-1539571695357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
              details: found
            };
          } else {
            // Check if email was registered as faculty or admin instead
            const faculty = mockDb.getCollection('faculty');
            const admins = mockDb.getCollection('admins') || [];
            const isFaculty = faculty.find(f => f.email.toLowerCase() === cleanEmail);
            const isAdmin = admins.find(a => a.email.toLowerCase() === cleanEmail);
            
            if (isFaculty) {
              reject(new Error('This email is registered as a Faculty member. Please switch to the Faculty login tab.'));
            } else if (isAdmin) {
              reject(new Error('This email is registered as an Admin. Please switch to the Admin login tab.'));
            } else {
              reject(new Error('Invalid Student credentials (Use student@campus.edu / student123 or a registered student email)'));
            }
            return;
          }
        }

        if (authenticatedUser) {
          setUser(authenticatedUser);
          localStorage.setItem('campus_auth_user', JSON.stringify(authenticatedUser));
          resolve(authenticatedUser);
        } else {
          reject(new Error('Role and login credentials do not match'));
        }
      }, 500);
    });
  };

  const register = async (name, email, password, role) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (role === 'student') {
            // Register a student in students table
            const newStu = mockDb.createItem('students', {
              name,
              email,
              password,
              rollNo: `STU-26-${Math.floor(100 + Math.random() * 900)}`,
              department: 'Computer Science & Engineering',
              course: 'B.Tech Computer Science',
              semester: 1,
              attendance: 100.0,
              cgpa: 0.0,
              balanceFees: 75000,
              paidFees: 0,
              status: 'Active',
              gender: 'Male',
              dob: '2005-01-01',
              phone: '+1 555-0000',
              address: 'Campus Hostel Block 1'
            });
            resolve(newStu);
          } else if (role === 'faculty') {
            const newFac = mockDb.createItem('faculty', {
              name,
              email,
              password,
              facultyId: `FAC-CSE-${Math.floor(100 + Math.random() * 900)}`,
              department: 'Computer Science & Engineering',
              designation: 'Assistant Professor',
              courses: ['B.Tech Computer Science'],
              subjects: ['Programming in C'],
              phone: '+1 555-0000',
              office: 'Block A - 101',
              qualification: 'M.Tech',
              experience: '1 Year',
              status: 'Active'
            });
            resolve(newFac);
          } else if (role === 'admin') {
            const newAdm = mockDb.createItem('admins', {
              name,
              email,
              password,
              adminId: `ADM-26-${Math.floor(100 + Math.random() * 900)}`,
              status: 'Active'
            });
            resolve(newAdm);
          } else {
            reject(new Error('Registration for role is disabled'));
          }
        } catch (e) {
          reject(e);
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campus_auth_user');
  };

  const updateProfileDetails = (updatedDetails) => {
    if (!user) return;
    const isStudent = user.role === 'student';
    const collection = isStudent ? 'students' : 'faculty';
    
    // Update db
    const updated = mockDb.updateItem(collection, user.id, updatedDetails);
    
    // Update local state
    const newUser = {
      ...user,
      name: updated.name,
      email: updated.email,
      details: updated
    };
    setUser(newUser);
    localStorage.setItem('campus_auth_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfileDetails, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
