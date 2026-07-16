import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaPhone, FaBuilding, FaGraduationCap, FaBriefcase, FaCheckCircle } from 'react-icons/fa';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Profile = () => {
  const { user, updateProfileDetails } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    office: '',
    qualification: '',
    experience: ''
  });

  useEffect(() => {
    if (user?.details) {
      setProfile(user.details);
      setFormData({
        name: user.details.name,
        email: user.details.email,
        phone: user.details.phone || '+1 555-1002',
        office: user.details.office || 'Block A - 405',
        qualification: user.details.qualification || 'Ph.D. in Software Engineering',
        experience: user.details.experience || '10 Years'
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    
    // Simulate updating profile in database
    setTimeout(() => {
      updateProfileDetails(formData);
      setSuccess('Profile details successfully updated!');
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  if (!profile) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          Faculty Personal Profile
        </h1>
        <p className="text-xs text-slate-400">
          Review credentials, office allocations, experience records, and update contact links.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Card: Summary */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900 text-center flex flex-col items-center">
          <img 
            src={user?.avatar} 
            alt={profile.name} 
            className="h-28 w-28 rounded-2xl object-cover ring-4 ring-indigo-500/20 mb-4"
          />
          <h2 className="font-display font-bold text-base text-slate-850 dark:text-slate-100">
            {profile.name}
          </h2>
          <p className="text-xs text-indigo-650 font-semibold dark:text-indigo-400 capitalize mt-1">
            {profile.designation}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            ID: {profile.facultyId}
          </p>

          <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-5 mt-6 space-y-3.5 text-left text-xs font-semibold text-slate-550 dark:text-slate-400">
            <p className="flex items-center gap-2.5">
              <FaEnvelope className="text-slate-400" />
              <span className="truncate">{profile.email}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <FaPhone className="text-slate-400" />
              <span>{profile.phone}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <FaBuilding className="text-slate-400" />
              <span>{profile.department}</span>
            </p>
          </div>
        </div>

        {/* Right Card: Credentials Update */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-205 dark:text-slate-200 uppercase tracking-wider mb-4">
            Manage Credentials
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <InputField
                label="Primary Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Contact Phone"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <InputField
                label="Office Location Room"
                id="office"
                value={formData.office}
                onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Highest Academic Qualification"
                id="qualification"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                required
              />
              <InputField
                label="Experience Level"
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                required
              />
            </div>

            {success && (
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-650 dark:text-emerald-400">
                <FaCheckCircle /> {success}
              </p>
            )}

            <div className="flex justify-end pt-3">
              <Button type="submit" variant="primary" loading={saving}>
                Update Details
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
