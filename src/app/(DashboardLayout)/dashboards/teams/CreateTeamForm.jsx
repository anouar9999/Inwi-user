import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Upload,
  X,
  Shield,
  Users,
  Star,
  Lock,
  AlertCircle,
  MailIcon,
} from 'lucide-react';
import { useToast } from '@/app/components/toast/ToastProviderContext';
import FloatingLabelInput from '@/app/components/input/FloatingInput';
import FloatingLabelTextArea from '@/app/components/FloatingTextArea';
import FloatingSelectField from '../../components/FloatingSelectField';

const INPUT_BASE_CLASSES =
  'w-full bg-gray-900/50  px-4 py-2.5 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500';

const FORM_INITIAL_STATE = {
  name: '',
  description: '',
  privacy: 'Public',
  image: null,
  requirements: {
    minRank: 'any',
    region: 'euw',
    playStyle: 'casual',
  },
  captain: {
    name: '',
    role: 'Mid',
    rank: 'any',
  },
};

const OPTIONS = {
  ranks: [
    { value: 'any', label: 'Any Rank' },
    { value: 'iron', label: 'Iron' },
    { value: 'bronze', label: 'Bronze' },
    { value: 'silver', label: 'Silver' },
    { value: 'gold', label: 'Gold' },
    { value: 'platinum', label: 'Platinum' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'master', label: 'Master' },
    { value: 'grandmaster', label: 'Grandmaster' },
    { value: 'challenger', label: 'Challenger' },
  ],
  regions: [
    { value: 'euw', label: 'Europe West' },
    { value: 'eune', label: 'Europe Nordic & East' },
    { value: 'na', label: 'North America' },
    { value: 'kr', label: 'Korea' },
    { value: 'jp', label: 'Japan' },
    { value: 'oce', label: 'Oceania' },
    { value: 'lan', label: 'Latin America North' },
    { value: 'las', label: 'Latin America South' },
    { value: 'br', label: 'Brazil' },
    { value: 'tr', label: 'Turkey' },
    { value: 'ru', label: 'Russia' },
  ],
  playStyles: [
    { value: 'casual', label: 'Casual' },
    { value: 'competitive', label: 'Competitive' },
    { value: 'both', label: 'Both' },
  ],
  roles: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'],
};

const FormSection = ({ title, icon: Icon, children }) => (
  <div className=" p-6">
    <h3 className="flex items-center text-lg font-semibold font-valorant mb-6">
      <Icon className="mr-2 text-primary" size={20} />
      {title}
    </h3>
    {children}
  </div>
);

const SelectField = ({ label, value, onChange, options, className = '' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <select value={value} onChange={onChange} className={`${INPUT_BASE_CLASSES} ${className}`}>
      {options.map((opt) => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  </div>
);

const ImageUpload = ({ preview, onImageChange }) => (
  <div className="relative group">
    <div className="w-full h-48 bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl overflow-hidden group-hover:border-primary/50 transition-colors">
      {preview ? (
        <img src={preview} alt="Team logo preview" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
          <Upload size={32} className="mb-2" />
          <span className="text-sm">Drop your logo here</span>
          <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</span>
        </div>
      )}
    </div>
    <input
      type="file"
      accept="image/png,image/jpeg,image/gif"
      onChange={onImageChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
  </div>
);

const CreateTeamForm = ({ isOpen, onClose, currentUser, onFinish }) => {
  const [formData, setFormData] = useState({
    ...FORM_INITIAL_STATE,
    captain: { ...FORM_INITIAL_STATE.captain, name: currentUser?.username || '' },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        ...FORM_INITIAL_STATE,
        captain: { ...FORM_INITIAL_STATE.captain, name: currentUser?.username || '' },
      });
      setImagePreview(null);
      setError(null);
    }
  }, [isOpen, currentUser]);
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name.trim()) throw new Error('Team name is required');
      if (formData.name.length > 255) throw new Error('Team name must be less than 255 characters');
      if (formData.image && formData.image.length * 0.75 > 2 * 1024 * 1024)
        throw new Error('Image must be less than 2MB');

      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create_team.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          privacy: formData.privacy,
          image: formData.image,
          owner_id: userId,
          owner_name: localStorage.getItem('username') || currentUser?.username,
          team_game: 'Valorant',
          requirements: {
            ...formData.requirements,
            role: formData.captain.role,
          },
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Failed to create team');

      addToast({ type: 'success', message: 'Team created successfully!', duration: 5000 });
      onClose();
      onFinish?.();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      addToast({ type: 'error', message: err.message, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        body.modal-open {
          overflow: hidden;
        }
      `}</style>
      <div className="fixed inset-0 z-50">
        {/* Backdrop with blur */}
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-md" 
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-secondary/50 rounded-3xl backdrop-blur-xl border border-white/5">
              {/* Header */}
              <div className="sticky top-0 z-10 px-6 py-6 bg-secondary/95 backdrop-blur-xl rounded-t-3xl border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl tracking-wider font-custom text-white">Create New Team</h2>
                    <p className="text-sm font-pilot text-gray-500 mt-1">Set up your team profile and preferences</p>
                  </div>
                </div>
              </div>
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 font-pilot grid gap-6">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg col-span-full">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 col-span-full">
              {/* Basic Information */}
              <FormSection title="Basic Information" icon={Shield}>
                <div className="space-y-4">
                  <FloatingLabelInput
                    label="Team Name"
                    type="text"
                    icon={MailIcon}
                    name="email"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your team name"
                  />
                  {/* <div>
          <label className="block text-sm text-gray-300 mb-2">Description</label>
         
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows="4"
            className="w-full bg-gray-800/50  py-3 w-full 
            bg-gray-800 
            text-white 
            rounded-xl 
            text-sm 
            text-[10pt]  px-6 
            py-3   resize-none"
            placeholder="Tell us about your team..."
          />
        </div> */}
                  <FloatingLabelTextArea
                    label="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Tell us about your team..."
                    name="description"
                  />
                </div>
              </FormSection>

              {/* Team Logo */}
              <FormSection title="Team Logo" icon={Upload}>
                <ImageUpload preview={imagePreview} onImageChange={handleImageChange} />
              </FormSection>
            </div>

            {/* Team Requirements */}
            <FormSection title="Team Requirements" icon={Users} className="col-span-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: 'Minimum Rank',
                    value: formData.requirements.minRank,
                    options: OPTIONS.ranks,
                    name: 'minRank',
                  },
                  {
                    label: 'Region',
                    value: formData.requirements.region,
                    options: OPTIONS.regions,
                    name: 'region',
                  },
                  {
                    label: 'Play Style',
                    value: formData.requirements.playStyle,
                    options: OPTIONS.playStyles,
                    name: 'playStyle',
                  },
                  {
                    label: 'Your Role',
                    value: formData.captain.role,
                    options: OPTIONS.roles,
                    name: 'role',
                  },
                ].map((field, index) => (
                  <FloatingSelectField
                    key={field.name}
                    label={field.label}
                    value={field.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [index === 3 ? 'captain' : 'requirements']: {
                          ...prev[index === 3 ? 'captain' : 'requirements'],
                          [field.name]: e.target.value,
                        },
                      }))
                    }
                    options={field.options}
                    name={field.name}
                  />
                ))}
              </div>
            </FormSection>

            {/* Privacy Settings */}
            <FormSection title="Privacy Settings" icon={Lock} className="col-span-full">
              <div className="grid sm:grid-cols-2 gap-3">
                {['Public', 'Private'].map((type) => (
                  <label
                    key={type}
                    className="group flex items-center p-4 bg-gray-800/50 rounded-lg cursor-pointer border border-gray-700 hover:border-purple-500 transition-colors"
                  >
                    <input
                      type="radio"
                      name="privacy"
                      value={type}
                      checked={formData.privacy === type}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, privacy: e.target.value }))
                      }
                      className="w-4 h-4 text-purple-500 border-gray-500 focus:ring-purple-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-white">{type} Team</div>
                      <div className="text-xs text-gray-400">
                        {type === 'Public'
                          ? 'Anyone can view and request to join your team'
                          : 'Only invited members can join your team'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </FormSection>

            {/* Form Actions */}
            <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 col-span-full">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-purple-500 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      <span>Create Team</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CreateTeamForm;