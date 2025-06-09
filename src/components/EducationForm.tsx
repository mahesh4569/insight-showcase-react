import React, { useState } from 'react';
import { Education } from '../hooks/useEducations';

interface EducationFormProps {
  initialData?: Partial<Education> | null;
  onSave: (data: Omit<Education, 'id' | 'user_id' | 'created_at'>) => void;
  onCancel: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ initialData, onSave, onCancel }) => {
  const safeInitialData = initialData || {};
  const [school, setSchool] = useState(safeInitialData.school || '');
  const [degree, setDegree] = useState(safeInitialData.degree || '');
  const [field, setField] = useState(safeInitialData.field || '');
  const [startDate, setStartDate] = useState(safeInitialData.start_date || '');
  const [endDate, setEndDate] = useState(safeInitialData.end_date || '');
  const [description, setDescription] = useState(safeInitialData.description || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!school || !degree || !field || !startDate) {
      setError('Please fill in all required fields.');
      return;
    }
    onSave({ school, degree, field, start_date: startDate, end_date: endDate, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">School *</label>
        <input type="text" value={school} onChange={e => setSchool(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Degree *</label>
        <input type="text" value={degree} onChange={e => setDegree(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Field of Study *</label>
        <input type="text" value={field} onChange={e => setField(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 text-white" required />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-1">Start Date *</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 text-white" required />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 text-white" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 text-white" rows={3} />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-slate-600 text-white">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
      </div>
    </form>
  );
};

export default EducationForm; 