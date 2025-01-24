import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCheckInStore } from '../store/checkInStore';
import { CheckInFormData } from '../types/CheckIn';

export const CheckInForm = () => {
  const addCheckIn = useCheckInStore((state) => state.addCheckIn);
  const [logoUrl, setLogoUrl] = useState('');
  const [formData, setFormData] = useState<CheckInFormData>({
    name: '',
    badgeNumber: '',
    title: '',
    investigativeRole: '',
    departmentNumber: '',
    defendantName: '',
    phoneNumber: '',
    caseNumber: '',
    additionalComments: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data: { publicUrl }, error } = supabase
          .storage
          .from('assets')
          .getPublicUrl('da-logo.png');
          
        if (error) throw error;
        setLogoUrl(publicUrl);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await addCheckIn(formData);
      setShowSuccess(true);
      setFormData({
        name: '',
        badgeNumber: '',
        title: '',
        investigativeRole: '',
        departmentNumber: '',
        defendantName: '',
        phoneNumber: '',
        caseNumber: '',
        additionalComments: '',
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError('Failed to submit check-in. Please try again.');
      console.error('Error submitting check-in:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900";
  const selectClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900";
  const textareaClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-900";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          {logoUrl && (
            <img 
              src={logoUrl}
              alt="District Attorney's Office" 
              className="h-24 w-auto"
            />
          )}
        </div>
        <h2 className="text-2xl font-bold text-primary text-center mb-8">
          KCDA Subpoena Check-in
        </h2>
        
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md text-center">
            Check-in successful!
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge Number *
              </label>
              <input
                type="text"
                name="badgeNumber"
                value={formData.badgeNumber}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={selectClasses}
                required
              >
                <option value="">Select Title</option>
                <option value="Officer/Deputy">Officer/Deputy</option>
                <option value="Senior Officer/Deputy">Senior Officer/Deputy</option>
                <option value="Detective">Detective</option>
                <option value="Sergeant">Sergeant</option>
                <option value="Lieutenant">Lieutenant</option>
                <option value="Captain">Captain</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investigative Role *
              </label>
              <select
                name="investigativeRole"
                value={formData.investigativeRole}
                onChange={handleChange}
                className={selectClasses}
                required
              >
                <option value="">Select Role</option>
                <option value="Lead/Assisting">Lead/Assisting</option>
                <option value="Obtained statements">Obtained statements</option>
                <option value="Collected or booked evidence">Collected or booked evidence</option>
                <option value="Obtained photographs">Obtained photographs</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Number *
              </label>
              <input
                type="text"
                name="departmentNumber"
                value={formData.departmentNumber}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Defendant's Name *
              </label>
              <input
                type="text"
                name="defendantName"
                value={formData.defendantName}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Number
              </label>
              <input
                type="text"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments
            </label>
            <textarea
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleChange}
              rows={4}
              className={textareaClasses}
            />
          </div>
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-primary hover:bg-primary-light text-white font-semibold py-3 px-8 rounded-md transition duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Check-in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};