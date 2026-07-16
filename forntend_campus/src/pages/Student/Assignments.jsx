import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaBookOpen, FaFileUpload, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Assignments = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [studentDetails, setStudentDetails] = useState(null);
  
  // Data lists
  const [assignments, setAssignments] = useState([]);
  const [selectedAsn, setSelectedAsn] = useState(null);

  // Submit Modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const id = user?.id || 'STU001';
      const stuList = await api.getCollection('students');
      const details = stuList.find(s => s.id === id) || stuList[0];
      setStudentDetails(details);

      // Fetch assignments based on their course program
      const list = await api.getAssignmentsByCourse(details.course);
      setAssignments(list);
      
      if (list.length > 0) {
        setSelectedAsn(list[0]);
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

  const handleOpenSubmit = (asn) => {
    setSelectedAsn(asn);
    setFileName(`${asn.title.toLowerCase().replace(/ /g, '_')}_solution.pdf`);
    setSubmitModalOpen(true);
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    try {
      await api.submitAssignment(
        selectedAsn.id,
        studentDetails.id,
        studentDetails.name,
        studentDetails.rollNo,
        fileName
      );
      setSuccess('Solution script successfully submitted to instructor portal!');
      setTimeout(() => {
        setSubmitModalOpen(false);
        loadData();
      }, 1500);
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
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          Course Exercises & Assignments
        </h1>
        <p className="text-xs text-slate-400">
          Review posted assignment sheets, submit solutions, and track grades feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Assignment list */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assignment Tasks</h3>
          {assignments.length === 0 ? (
            <p className="text-xs text-slate-450 italic">No posted assignments.</p>
          ) : (
            assignments.map((asn) => {
              // Find student submission if exists
              const sub = asn.submissions.find(s => s.studentId === studentDetails.id);
              let statusLabel = 'Pending';
              let colorClass = 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400';
              if (sub) {
                statusLabel = sub.status; // Submitted or Graded
                colorClass = sub.status === 'Graded'
                  ? 'bg-emerald-50 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-400'
                  : 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400';
              }

              return (
                <div
                  key={asn.id}
                  onClick={() => setSelectedAsn(asn)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    selectedAsn?.id === asn.id
                      ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-205 dark:text-slate-200">
                      {asn.title}
                    </h4>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${colorClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-405 dark:text-slate-400">{asn.subject}</p>
                  <p className="text-[9px] text-slate-400 mt-1">Instructor: {asn.faculty}</p>
                  <span className="text-[9px] text-slate-400 block mt-2 font-semibold">
                    Due Date: {asn.dueDate}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Submission details */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assignment Panel</h3>

          {!selectedAsn ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400 dark:border-slate-800">
              Select an assignment on the left to view instructions & submit details
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900 space-y-6">
              
              {/* Info summary */}
              <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-display font-bold text-sm text-slate-805 dark:text-slate-200">
                  {selectedAsn.title}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-[10px] font-medium text-slate-400">
                  <p>Subject Module: <strong className="text-slate-700 dark:text-slate-300">{selectedAsn.subject}</strong></p>
                  <p>Instructor Faculty: <strong className="text-slate-700 dark:text-slate-300">{selectedAsn.faculty}</strong></p>
                  <p>Assessment Due: <strong className="text-slate-700 dark:text-slate-300">{selectedAsn.dueDate}</strong></p>
                </div>
              </div>

              {/* Submission status review */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">Submission Review</h4>
                {(() => {
                  const studentSub = selectedAsn.submissions.find(s => s.studentId === studentDetails.id);
                  if (studentSub) {
                    return (
                      <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-800/10 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-550 dark:text-slate-400">
                          <p>Status: <span className="font-bold text-indigo-650 dark:text-indigo-400">{studentSub.status}</span></p>
                          <p>Graded Grade: <span className="font-bold text-emerald-600 dark:text-emerald-400">{studentSub.grade || 'Not Graded Yet'}</span></p>
                          <p>Submission Date: <span className="font-bold text-slate-700 dark:text-slate-305">{studentSub.submittedAt}</span></p>
                          <p>Uploaded File: <span className="font-bold text-slate-705 dark:text-slate-305">{studentSub.file}</span></p>
                        </div>
                        {studentSub.status === 'Graded' && (
                          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-[10px] text-emerald-650 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
                            <FaCheckCircle /> Assessment completed. Your script has been evaluated and grades synchronized.
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-8 bg-slate-50/40 border border-slate-100 rounded-xl dark:border-slate-800 dark:bg-slate-800/10 space-y-4">
                        <p className="text-[11px] text-slate-450 italic font-semibold">No solution document uploaded yet.</p>
                        <Button
                          onClick={() => handleOpenSubmit(selectedAsn)}
                          variant="primary"
                          className="flex items-center gap-1.5 mx-auto py-2 text-xs"
                        >
                          <FaFileUpload /> Upload Solution File
                        </Button>
                      </div>
                    );
                  }
                })()}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Submit Assignment Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title={`Submit Solution - ${selectedAsn?.title}`}
      >
        <form onSubmit={handleAssignmentSubmit} className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload your compiled solution script. Please ensure the file matches standard project specs.
          </p>

          <InputField
            label="File Name (Mock upload)"
            id="fileName"
            placeholder="e.g. dbms_homework_revised.pdf"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
          />

          {success && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-emerald-650 dark:text-emerald-405 dark:text-emerald-400">
              <FaCheckCircle /> {success}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Submit Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Assignments;
