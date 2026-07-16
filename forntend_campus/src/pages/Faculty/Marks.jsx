import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaGraduationCap, FaCheckCircle, FaEdit } from 'react-icons/fa';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Marks = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [facultyDetails, setFacultyDetails] = useState(null);

  // Selection states
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  
  // Marks map: { [studentId]: grade }
  const [marksMap, setMarksMap] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadFacultyDetails = async () => {
      try {
        const name = user?.name || 'Dr. Grace Hopper';
        const list = await api.getCollection('faculty');
        const details = list.find(f => f.name === name) || list[1];
        setFacultyDetails(details);

        if (details.courses && details.courses.length > 0) {
          setSelectedCourse(details.courses[0]);
        }
        if (details.subjects && details.subjects.length > 0) {
          setSelectedSubject(details.subjects[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadFacultyDetails();
    }
  }, [user, api]);

  // Load students and mock fetch existing results when selectors change
  useEffect(() => {
    const loadStudentsResults = async () => {
      if (!selectedCourse || !selectedSubject) return;
      try {
        const stuList = await api.getCollection('students');
        const enrolled = stuList.filter(s => s.course === selectedCourse);
        setStudents(enrolled);

        const initialMarks = {};
        for (const student of enrolled) {
          const results = await api.getStudentResults(student.id);
          // find grade in current subject if exists in any semester records
          let foundGrade = 'A+'; // default fallback
          results.forEach(sem => {
            const subRecord = sem.subjects.find(s => s.name === selectedSubject);
            if (subRecord) foundGrade = subRecord.grade;
          });
          initialMarks[student.id] = foundGrade;
        }
        setMarksMap(initialMarks);
      } catch (e) {
        console.error(e);
      }
    };
    loadStudentsResults();
  }, [selectedCourse, selectedSubject, api]);

  const handleGradeChange = (studentId, grade) => {
    setMarksMap(prev => ({
      ...prev,
      [studentId]: grade
    }));
  };

  const handleSubmitMarks = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    try {
      // Loop through checklist and simulate results updates
      for (const student of students) {
        const grade = marksMap[student.id];
        
        // Fetch current records
        const results = await api.getStudentResults(student.id);
        
        // Find semester to insert results (default Semester 5 CSE fallback John Doe)
        // If results array is empty, we will create one
        let updatedResults = [...results];
        const activeSemIndex = updatedResults.findIndex(r => r.semester === student.semester);
        
        if (activeSemIndex !== -1) {
          const subjectsList = [...updatedResults[activeSemIndex].subjects];
          const subIdx = subjectsList.findIndex(s => s.name === selectedSubject);
          if (subIdx !== -1) {
            subjectsList[subIdx].grade = grade;
          } else {
            subjectsList.push({ name: selectedSubject, grade });
          }
          updatedResults[activeSemIndex].subjects = subjectsList;
        } else {
          updatedResults.push({
            semester: student.semester,
            gpa: 8.5,
            subjects: [{ name: selectedSubject, grade }]
          });
        }

        // Update database
        const db = JSON.parse(localStorage.getItem('campus_mgmt_db'));
        db.studentResults[student.id] = updatedResults;
        localStorage.setItem('campus_mgmt_db', JSON.stringify(db));
      }

      setSuccessMsg('Academic grades updated and synchronized successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Term Marks Entry Sheet
          </h1>
          <p className="text-xs text-slate-400">
            Publish semester evaluation scores, grades, and CGPA metrics.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-white p-5 rounded-2xl border border-slate-100 dark:border-slate-850 dark:bg-slate-900 shadow-xs">
        <div>
          <label className="block text-[10px] font-semibold text-slate-450 uppercase mb-1">Degree Program</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            {facultyDetails?.courses.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-450 uppercase mb-1">Subject Module</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            {facultyDetails?.subjects.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Roster sheet */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900">
        <h3 className="text-xs font-bold text-slate-805 dark:text-slate-200 uppercase tracking-wider mb-6 pb-4 border-b border-slate-100 dark:border-slate-805">
          Student Evaluation Sheet
        </h3>

        {students.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No students registered in this course program</p>
        ) : (
          <form onSubmit={handleSubmitMarks} className="space-y-6">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[450px] overflow-y-auto pr-2">
              {students.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between py-3 hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-xs text-slate-850 dark:text-slate-200">{student.name}</h4>
                    <p className="text-[9px] text-slate-400">Roll ID: {student.rollNo} | Semester {student.semester}</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Select grade dropdown */}
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-slate-400 font-semibold uppercase">Grade:</label>
                      <select
                        value={marksMap[student.id] || 'A'}
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                      >
                        {['O', 'A+', 'A', 'B+', 'B', 'C', 'F'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {successMsg && (
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-650 dark:text-emerald-400">
                <FaCheckCircle /> {successMsg}
              </p>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button 
                type="submit" 
                variant="primary" 
                loading={submitting}
                className="flex items-center gap-1.5"
              >
                <FaGraduationCap /> Synchronize Marks Sheets
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Marks;
