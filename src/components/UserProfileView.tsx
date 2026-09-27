import { useState } from 'react';
import { UserProfile, Skill } from '../types';
import { User, Briefcase, DollarSign, GraduationCap, FileText, Plus, X, Upload, Sparkles } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const skillSuggestions = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Go', 'Rust', 'Next.js', 'Vue.js',
  'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'GraphQL', 'REST', 'Tailwind CSS', 'Git', 'CI/CD', 'Terraform', 'PyTorch', 'TensorFlow',
  'Swift', 'Kotlin', 'Flutter', 'React Native', 'Java', 'C++', 'Ruby', 'PHP',
];

export default function UserProfileView({ profile, onSave }: Props) {
  const [form, setForm] = useState<UserProfile>(profile);
  const [skillInput, setSkillInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSkill = (name: string) => {
    const skillName = name.trim();
    if (skillName && !form.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      setForm({ ...form, skills: [...form.skills, { name: skillName, level: 'intermediate' }] });
      setSkillInput('');
    }
  };

  const removeSkill = (name: string) => {
    setForm({ ...form, skills: form.skills.filter(s => s.name !== name) });
  };

  const updateSkillLevel = (name: string, level: Skill['level']) => {
    setForm({
      ...form,
      skills: form.skills.map(s => s.name === name ? { ...s, level } : s),
    });
  };

  const addRole = () => {
    const role = roleInput.trim();
    if (role && !form.desiredRoles.includes(role)) {
      setForm({ ...form, desiredRoles: [...form.desiredRoles, role] });
      setRoleInput('');
    }
  };

  const removeRole = (role: string) => {
    setForm({ ...form, desiredRoles: form.desiredRoles.filter(r => r !== role) });
  };

  const filteredSuggestions = skillSuggestions.filter(
    s => !form.skills.find(sk => sk.name.toLowerCase() === s.toLowerCase()) &&
    s.toLowerCase().includes(skillInput.toLowerCase())
  ).slice(0, 8);

  const isComplete = form.name && form.title && form.skills.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-500 mt-1">Set up your profile so AI can find the best matching jobs</p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
            ✓ Profile saved
          </span>
        )}
      </div>

      {/* Profile Completeness */}
      <div className={`rounded-xl border p-4 ${isComplete ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center gap-3">
          <Sparkles className={`w-5 h-5 ${isComplete ? 'text-green-600' : 'text-amber-600'}`} />
          <div>
            <p className={`text-sm font-medium ${isComplete ? 'text-green-800' : 'text-amber-800'}`}>
              {isComplete ? 'Profile is ready! AI will find your best matches.' : 'Complete your profile for better job matches'}
            </p>
            <p className={`text-xs mt-0.5 ${isComplete ? 'text-green-600' : 'text-amber-600'}`}>
              {isComplete
                ? `${form.skills.length} skills, ${form.desiredRoles.length} target roles`
                : `Add your name, title, and at least 1 skill to get started`}
            </p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Senior Software Engineer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="San Francisco, CA"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Briefcase className="w-4 h-4" /> Years of Experience
          </label>
          <input
            type="number"
            value={form.yearsExperience}
            onChange={e => setForm({ ...form, yearsExperience: parseInt(e.target.value) || 0 })}
            min={0}
            max={50}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
          <textarea
            value={form.summary}
            onChange={e => setForm({ ...form, summary: e.target.value })}
            rows={3}
            placeholder="Brief overview of your experience and what you're looking for..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none"
          />
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Skills & Expertise
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.skills.map(skill => (
            <div key={skill.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="text-sm font-medium text-indigo-800">{skill.name}</span>
              <select
                value={skill.level}
                onChange={e => updateSkillLevel(skill.name, e.target.value as Skill['level'])}
                className="text-xs bg-transparent text-indigo-600 border-none outline-none cursor-pointer"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <button onClick={() => removeSkill(skill.name)} className="text-indigo-400 hover:text-indigo-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
            placeholder="Type a skill and press Enter..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          />
          {skillInput && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {filteredSuggestions.map(s => (
                <button
                  key={s}
                  onClick={() => addSkill(s)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 text-gray-700"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desired Roles */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          Target Roles
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.desiredRoles.map(role => (
            <span key={role} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-800 text-sm font-medium rounded-lg">
              {role}
              <button onClick={() => removeRole(role)} className="text-purple-400 hover:text-purple-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={roleInput}
            onChange={e => setRoleInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRole(); } }}
            placeholder="e.g., Frontend Engineer, Full Stack Developer..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          />
          <button
            onClick={addRole}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Salary & Education */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-600" />
          Salary & Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary ($)</label>
            <input
              type="number"
              value={form.desiredSalaryMin}
              onChange={e => setForm({ ...form, desiredSalaryMin: parseInt(e.target.value) || 0 })}
              placeholder="100000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary ($)</label>
            <input
              type="number"
              value={form.desiredSalaryMax}
              onChange={e => setForm({ ...form, desiredSalaryMax: parseInt(e.target.value) || 0 })}
              placeholder="180000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <GraduationCap className="w-4 h-4" /> Education
          </label>
          <input
            type="text"
            value={form.education}
            onChange={e => setForm({ ...form, education: e.target.value })}
            placeholder="B.S. Computer Science, Stanford University"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* Resume Upload */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Resume
        </h2>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
          onClick={() => {
            setForm({ ...form, resumeFileName: 'resume_2026.pdf' });
          }}
        >
          {form.resumeFileName ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-green-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{form.resumeFileName}</p>
                <p className="text-xs text-gray-500">Resume uploaded successfully</p>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload your resume</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (simulated)</p>
            </>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
