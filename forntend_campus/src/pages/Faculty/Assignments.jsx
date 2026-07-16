import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaBookOpen, FaPlus, FaCheck, FaFileAlt, FaFilePdf } from 'react-icons/fa';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Assignments = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [facultyDetails, setFacultyDetails] = useState(null);
  
  // Data lists
  const [assignments, setAssignments] = useState([]);
  const [selectedAsn, setSelectedAsn] = useState(null);

  // Add Assignment Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    subject: '',
    dueDate: ''
  });

  // Grade Modal state
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeVal, setGradeVal] = useState('A+');

  const loadData = async () => {
    try {
      const name = user?.name || 'Dr. Grace Hopper';
      const list = await api.getCollection('faculty');
      const details = list.find(f => f.name === name) || list[1];
      setFacultyDetails(details);

      const asnList = await api.getAssignmentsByFaculty(details.name);
      setAssignments(asnList);
      if (asnList.length > 0) {
        // default select first assignment to see submissions
        setSelectedAsn(asnList[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, api]);

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      course: facultyDetails?.courses[0] || '',
      subject: facultyDetails?.subjects[0] || '',
      dueDate: ''
    });
    setAddModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createItem('assignments', {
        ...formData,
        faculty: facultyDetails.name,
        status: 'Active',
        submissions: []
      });
      setAddModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenGrade = (submission) => {
    setSelectedSubmission(submission);
    setGradeVal(submission.grade || 'A');
    setGradeModalOpen(true);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.gradeSubmission(selectedAsn.id, selectedSubmission.studentId, gradeVal);
      setGradeModalOpen(false);
      
      // reload assignments
      const asnList = await api.getAssignmentsByFaculty(facultyDetails.name);
      setAssignments(asnList);
      
      // refresh selected assignment view
      const updatedAsn = asnList.find(a => a.id === selectedAsn.id);
      setSelectedAsn(updatedAsn);
    } catch (err) {
      console.error(err);
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
            Course Assignments
          </h1>
          <p className="text-xs text-slate-400">
            Publish assessment exercises, review submitted scripts, and submit grades.
          </p>
        </div>
        
        <Button 
          onClick={handleOpenAdd}
          variant="primary"
          className="flex items-center gap-2 rounded-xl text-xs py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        >
          <FaPlus /> Create Assignment Task
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Assignment List */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assignments List</h3>
          {assignments.length === 0 ? (
            <p className="text-xs text-slate-450 italic py-6">No posted assignments.</p>
          ) : (
            assignments.map((asn) => (
              <div
                key={asn.id}
                onClick={() => setSelectedAsn(asn)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  selectedAsn?.id === asn.id
                    ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700'
                }`}
              >
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-205 dark:text-slate-200">
                  {asn.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">Course: {asn.course}</p>
                <p className="text-[10px] text-slate-405 dark:text-slate-400">Subject: {asn.subject}</p>
                <span className="text-[9px] text-slate-400 block mt-2 font-semibold">
                  Due: {asn.dueDate}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Right: Submissions lists */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Student Submission Logs - {selectedAsn?.title || 'None Selected'}
          </h3>

          {!selectedAsn ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400 dark:border-slate-800">
              Select an assignment on the left to review student scripts
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
              {selectedAsn.submissions.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-10 font-medium italic">
                  No submissions recorded for this assignment task yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-105 text-[10px] font-bold text-slate-400 uppercase dark:border-slate-800">
                        <th className="pb-3">Student Name</th>
                        <th className="pb-3">Submitted Date</th>
                        <th className="pb-3">Document Script</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Grade Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                      {selectedAsn.submissions.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10">
                          <td className="py-3.5">
                            <p className="font-semibold text-slate-850 dark:text-slate-200">{sub.studentName}</p>
                            <p className="text-[9px] text-slate-400">Roll: {sub.rollNo}</p>
                          </td>
                          <td className="py-3.5 text-slate-400 font-semibold">{sub.submittedAt}</td>
                          <td className="py-3.5 text-indigo-650 dark:text-indigo-400 font-semibold hover:underline">
                            <a href="#" className="flex items-center gap-1">
                              <FaFilePdf /> {sub.file}
                            </a>
                          </td>
                          <td className="py-3.5">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold ${
                              sub.status === 'Graded'
                                ? 'bg-emerald-50 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-450 dark:text-emerald-400'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                            }`}>
                              {sub.status} {sub.grade ? `(${sub.grade})` : ''}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleOpenGrade(sub)}
                              className="rounded-lg px-2.5 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-705 hover:bg-indigo-100 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700"
                            >
                              Grade Script
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Assignment Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Create New Assignment"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField
            label="Assignment Title / Name"
            id="title"
            placeholder="e.g. DBMS Normalization Exercises"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Course Target"
              id="course"
              type="select"
              options={facultyDetails?.courses || []}
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              required
            />
            <InputField
              label="Subject module"
              id="subject"
              type="select"
              options={facultyDetails?.subjects || []}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <InputField
            label="Submission Due Date"
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Post Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Grade Script modal */}
      <Modal
        isOpen={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        title={`Grade Assignment - ${selectedSubmission?.studentName}`}
      >
        <form onSubmit={handleGradeSubmit} className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Record grading performance for Roll ID <strong>{selectedSubmission?.rollNo}</strong>.
          </p>

          <InputField
            label="Assign Grade"
            id="gradeVal"
            type="select"
            options={['O', 'A+', 'A', 'B+', 'B', 'C', 'F']}
            value={gradeVal}
            onChange={(e) => setGradeVal(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setGradeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Grade
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Assignments;
