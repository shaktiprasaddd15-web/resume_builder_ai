import React from 'react';
import '../App.css';

const ResumeForm = ({ data, setData, selectedTemplate, setTemplate, onGenerate, isGenerating }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (index, field, value, arrayName) => {
        const newArray = [...data[arrayName]];
        newArray[index] = { ...newArray[index], [field]: value };
        setData(prev => ({ ...prev, [arrayName]: newArray }));
    };

    const addArrayItem = (arrayName, initialItem) => {
        setData(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], initialItem]
        }));
    };

    const removeArrayItem = (index, arrayName) => {
        const newArray = [...data[arrayName]];
        newArray.splice(index, 1);
        setData(prev => ({ ...prev, [arrayName]: newArray }));
    };

    const templates = [
        { id: 'resumeio', name: 'Premium' },
        { id: 'modern', name: 'Modern' },
        { id: 'ats', name: 'Simple (ATS)' },
        { id: 'creative', name: 'Creative' },
        { id: 'professional', name: 'Professional' }
    ];

    return (
        <div className="sidebar-content fade-in">
            <h1 className="form-title">Build Your Resume</h1>
            <p className="form-subtitle">Fill in your details and watch your resume come to life.</p>

            {/* Template Selection */}
            <div className="form-group">
                <label className="label">Select Template</label>
                <div className="template-cards">
                    {templates.map(t => (
                        <div
                            key={t.id}
                            className={`template-card ${selectedTemplate === t.id ? 'active' : ''}`}
                            onClick={() => setTemplate(t.id)}
                        >
                            {t.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Personal Info */}
            <div className="form-group">
                <label className="label">Personal Details</label>
                <div style={{ display: 'grid', gap: '12px' }}>
                    <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="input-control"
                    />
                    <input
                        type="text"
                        name="role"
                        value={data.role}
                        onChange={handleChange}
                        placeholder="Job Title / Role"
                        className="input-control"
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <input
                            type="email"
                            name="email"
                            value={data.email || ''}
                            onChange={handleChange}
                            placeholder="Email"
                            className="input-control"
                        />
                        <input
                            type="text"
                            name="phone"
                            value={data.phone || ''}
                            onChange={handleChange}
                            placeholder="Phone"
                            className="input-control"
                        />
                    </div>
                    <input
                        type="text"
                        name="location"
                        value={data.location || ''}
                        onChange={handleChange}
                        placeholder="Location (City, Country)"
                        className="input-control"
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="label">Professional Summary</label>
                <textarea
                    name="summary"
                    value={data.summary}
                    onChange={handleChange}
                    placeholder="Briefly describe your professional background..."
                    className="input-control textarea"
                />
            </div>

            <div className="form-group">
                <label className="label">Skills (Comma separated)</label>
                <textarea
                    name="skills"
                    value={data.skills}
                    onChange={handleChange}
                    placeholder="e.g. Leadership, Strategic Planning, Python, React..."
                    className="input-control"
                    style={{ minHeight: '80px' }}
                />
            </div>

            {/* Experience Section */}
            <div className="form-group">
                <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Experience
                    <button
                        type="button"
                        onClick={() => addArrayItem('experience', { title: '', company: '', duration: '', points: [''] })}
                        style={{ color: 'hsl(var(--primary))', fontWeight: 600, fontSize: '11px' }}
                    >
                        + ADD JOB
                    </button>
                </label>

                {data.experience.map((exp, index) => (
                    <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid hsl(var(--border))', borderRadius: '8px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                            <button
                                type="button"
                                onClick={() => removeArrayItem(index, 'experience')}
                                style={{ color: 'red', fontSize: '11px' }}
                            >
                                REMOVE
                            </button>
                        </div>
                        <input
                            placeholder="Job Title"
                            value={exp.title}
                            onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'experience')}
                            className="input-control"
                            style={{ marginBottom: '8px' }}
                        />
                        <input
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => handleArrayChange(index, 'company', e.target.value, 'experience')}
                            className="input-control"
                            style={{ marginBottom: '8px' }}
                        />
                        <input
                            placeholder="Duration (e.g. 2018 - Present)"
                            value={exp.duration}
                            onChange={(e) => handleArrayChange(index, 'duration', e.target.value, 'experience')}
                            className="input-control"
                            style={{ marginBottom: '8px' }}
                        />
                        <textarea
                            placeholder="Key achievements (one per line)..."
                            value={Array.isArray(exp.points) ? exp.points.join('\n') : exp.points}
                            onChange={(e) => handleArrayChange(index, 'points', e.target.value.split('\n'), 'experience')}
                            className="input-control"
                            style={{ minHeight: '80px' }}
                        />
                    </div>
                ))}
            </div>

            {/* Education Section */}
            <div className="form-group">
                <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Education
                    <button
                        type="button"
                        onClick={() => addArrayItem('education', { degree: '', institution: '', duration: '' })}
                        style={{ color: 'hsl(var(--primary))', fontWeight: 600, fontSize: '11px' }}
                    >
                        + ADD SCHOOL
                    </button>
                </label>

                {data.education.map((edu, index) => (
                    <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid hsl(var(--border))', borderRadius: '8px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                            <button
                                type="button"
                                onClick={() => removeArrayItem(index, 'education')}
                                style={{ color: 'red', fontSize: '11px' }}
                            >
                                REMOVE
                            </button>
                        </div>
                        <input
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => handleArrayChange(index, 'degree', e.target.value, 'education')}
                            className="input-control"
                            style={{ marginBottom: '8px' }}
                        />
                        <input
                            placeholder="Institution / University"
                            value={edu.institution}
                            onChange={(e) => handleArrayChange(index, 'institution', e.target.value, 'education')}
                            className="input-control"
                            style={{ marginBottom: '8px' }}
                        />
                        <input
                            placeholder="Duration (e.g. 2014 - 2018)"
                            value={edu.duration}
                            onChange={(e) => handleArrayChange(index, 'duration', e.target.value, 'education')}
                            className="input-control"
                        />
                    </div>
                ))}
            </div>

            <button className="btn-primary" onClick={onGenerate} disabled={isGenerating}>
                {isGenerating ? 'Creating PDF...' : 'Download PDF'}
            </button>

            <div style={{ height: '40px' }}></div>
        </div>
    );
};

export default ResumeForm;
