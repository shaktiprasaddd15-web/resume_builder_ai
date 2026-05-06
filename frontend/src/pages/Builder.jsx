import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../components/Toast';
import ResumeIO from '../components/templates/ResumeIO';
import Modern from '../components/templates/Modern';
import ATS from '../components/templates/ATS';
import Creative from '../components/templates/Creative';
import Professional from '../components/templates/Professional';

const TEMPLATES = [
    { id: 'resumeio', name: 'Premium', icon: '💼', desc: 'Two-column' },
    { id: 'modern', name: 'Modern', icon: '✨', desc: 'Clean look' },
    { id: 'creative', name: 'Creative', icon: '🎨', desc: 'Bold sidebar' },
    { id: 'professional', name: 'Corporate', icon: '🏢', desc: 'Classic' },
    { id: 'ats', name: 'ATS Safe', icon: '📋', desc: 'Simple text' },
];

const DEFAULT_DATA = {
    name: 'Sandra Miller',
    role: 'Senior Events Manager',
    email: 'sandra.miller@email.com',
    phone: '+1 212 635 3564',
    location: 'New York, USA',
    linkedin: '',
    summary: 'Experienced professional with strong leadership, strategic planning skills, and a proven record of delivering high-impact results across Fortune 500 companies.',
    skills: 'Leadership, Strategic Planning, Event Management, Budgeting, Salesforce, Marketing',
    experience: [
        {
            title: 'Senior Events Manager',
            company: 'Cloud High Co.',
            duration: '2020 - Present',
            location: 'New York, NY',
            points: [
                'Orchestrate large-scale corporate events for 500+ attendees.',
                'Manage a budget of $1.2M annually with 15% cost savings.',
                'Lead a team of 10 event coordinators.',
            ],
        },
        {
            title: 'Events Coordinator',
            company: 'StartUp Inc.',
            duration: '2017 - 2020',
            location: 'Boston, MA',
            points: [
                'Assisted in planning 20+ annual company workshops.',
                'Coordinated vendor logistics and catering services.',
            ],
        },
    ],
    education: [
        {
            degree: 'BS in Hospitality Management',
            institution: 'Cornell University',
            duration: '2013 - 2017',
        },
    ],
    projects: [],
};

const SectionDivider = ({ title }) => (
    <div className="section-divider">
        <div className="section-divider-line" />
        <span className="section-divider-title">{title}</span>
        <div className="section-divider-line" />
    </div>
);

const Builder = () => {
    const [data, setData] = useState(DEFAULT_DATA);
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [importing, setImporting] = useState(false);
    const [template, setTemplate] = useState('resumeio');
    const [generating, setGenerating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const fileInputRef = React.useRef(null);
    const navigate = useNavigate();

    const update = (field, value) => setData(prev => ({ ...prev, [field]: value }));

    const updateExp = (i, field, value) => {
        const updated = [...data.experience];
        updated[i] = { ...updated[i], [field]: value };
        setData(prev => ({ ...prev, experience: updated }));
    };

    const updateEdu = (i, field, value) => {
        const updated = [...data.education];
        updated[i] = { ...updated[i], [field]: value };
        setData(prev => ({ ...prev, education: updated }));
    };

    const addExp = () => setData(prev => ({
        ...prev,
        experience: [...prev.experience, { title: '', company: '', duration: '', location: '', points: [''] }],
    }));

    const removeExp = (i) => setData(prev => ({
        ...prev,
        experience: prev.experience.filter((_, idx) => idx !== i),
    }));

    const addEdu = () => setData(prev => ({
        ...prev,
        education: [...prev.education, { degree: '', institution: '', duration: '' }],
    }));

    const removeEdu = (i) => setData(prev => ({
        ...prev,
        education: prev.education.filter((_, idx) => idx !== i),
    }));

    const updateProj = (i, field, value) => {
        const updated = [...data.projects];
        updated[i] = { ...updated[i], [field]: value };
        setData(prev => ({ ...prev, projects: updated }));
    };

    const addProj = () => setData(prev => ({
        ...prev,
        projects: [...prev.projects, { name: '', tech: '', duration: '', points: [''] }],
    }));

    const removeProj = (i) => setData(prev => ({
        ...prev,
        projects: prev.projects.filter((_, idx) => idx !== i),
    }));

    // ---- Resume Upload / Parse ----
    const handleUploadResume = async (file) => {
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            toast.error('Only PDF files are supported.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File too large. Max 10MB.');
            return;
        }
        setUploading(true);
        setUploadedFileName(file.name);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/parse-resume', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Failed to parse resume');
            }
            const parsed = await res.json();
            setData(prev => ({
                ...prev,
                name: parsed.name || prev.name,
                role: parsed.role || prev.role,
                email: parsed.email || prev.email,
                phone: parsed.phone || prev.phone,
                location: parsed.location || prev.location,
                linkedin: parsed.linkedin || prev.linkedin,
                summary: parsed.summary || prev.summary,
                skills: typeof parsed.skills === 'string' ? parsed.skills : (Array.isArray(parsed.skills) ? parsed.skills.join(', ') : prev.skills),
                experience: Array.isArray(parsed.experience) && parsed.experience.length > 0
                    ? parsed.experience.map(exp => ({
                        title: exp.title || '',
                        company: exp.company || '',
                        duration: exp.duration || '',
                        location: exp.location || '',
                        points: Array.isArray(exp.points) ? exp.points : (exp.points || '').split('\n').filter(Boolean),
                    }))
                    : prev.experience,
                education: Array.isArray(parsed.education) && parsed.education.length > 0
                    ? parsed.education.map(edu => ({
                        degree: edu.degree || '',
                        institution: edu.institution || '',
                        duration: edu.duration || '',
                    }))
                    : prev.education,
                projects: Array.isArray(parsed.projects) && parsed.projects.length > 0
                    ? parsed.projects.map(proj => ({
                        name: proj.name || '',
                        tech: proj.tech || '',
                        duration: proj.duration || '',
                        points: Array.isArray(proj.points) ? proj.points : (proj.points || '').split('\n').filter(Boolean),
                    }))
                    : prev.projects,
            }));
            toast.success('Resume parsed successfully! Fields auto-filled.');
        } catch (err) {
            toast.error(err.message || 'Error parsing resume');
            setUploadedFileName('');
        } finally {
            setUploading(false);
        }
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) handleUploadResume(file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) handleUploadResume(file);
        e.target.value = ''; // reset so same file can be re-selected
    };

    const handleImportLinkedIn = async () => {
        if (!linkedinUrl) {
            toast.error('Please enter a LinkedIn URL');
            return;
        }
        setImporting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://127.0.0.1:8000/import-linkedin?url=${encodeURIComponent(linkedinUrl)}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Failed to import profile');
            }

            const profile = await res.json();

            // Map Proxycurl/Mock response to our data structure
            setData(prev => ({
                ...prev,
                name: profile.full_name || prev.name,
                role: profile.occupation || profile.headline || prev.role,
                location: `${profile.city || ''}, ${profile.state || ''}, ${profile.country_full_name || ''}`.replace(/^, |, $/g, '') || prev.location,
                linkedin: linkedinUrl,
                summary: profile.summary || prev.summary,
                skills: profile.skills ? profile.skills.join(', ') : prev.skills,
                experience: profile.experiences ? profile.experiences.map(exp => ({
                    title: exp.title,
                    company: exp.company,
                    duration: `${exp.starts_at?.year || ''} - ${exp.ends_at?.year || 'Present'}`,
                    location: exp.location || '',
                    points: [exp.description || '']
                })) : prev.experience,
                education: profile.education ? profile.education.map(edu => ({
                    degree: edu.degree_name,
                    institution: edu.school,
                    duration: `${edu.starts_at?.year || ''} - ${edu.ends_at?.year || ''}`
                })) : prev.education
            }));

            toast.success('Profile imported successfully!');

        } catch (err) {
            toast.error(err.message || 'Error importing profile');
        } finally {
            setImporting(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const payload = {
                ...data,
                skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
                experience: data.experience.map(e => ({
                    ...e,
                    points: Array.isArray(e.points) ? e.points : (e.points || '').split('\n').filter(Boolean),
                })),
                projects: (data.projects || []).map(p => ({
                    ...p,
                    points: Array.isArray(p.points) ? p.points : (p.points || '').split('\n').filter(Boolean),
                })),
            };

            const token = localStorage.getItem('token');
            const res = await fetch(`http://127.0.0.1:8000/generate-resume?template=${template}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Failed to generate');
            }

            const result = await res.json();
            toast.success('Resume generated! Downloading...');

            const link = document.createElement('a');
            link.href = result.pdf_url;
            link.download = `Resume_${data.name.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            toast.error(err.message || 'Error generating resume');
        } finally {
            setGenerating(false);
        }
    };

    const previewData = {
        ...data,
        skills_list: data.skills.split(',').map(s => s.trim()).filter(Boolean),
        projects: data.projects || [],
    };

    const renderPreview = () => {
        switch (template) {
            case 'resumeio': return <ResumeIO data={previewData} />;
            case 'modern': return <Modern data={previewData} />;
            case 'ats': return <ATS data={previewData} />;
            case 'creative': return <Creative data={previewData} />;
            case 'professional': return <Professional data={previewData} />;
            default: return <ResumeIO data={previewData} />;
        }
    };

    return (
        <div className="builder-layout">
            {/* ===== SIDEBAR ===== */}
            <div className="builder-sidebar">
                <div className="builder-sidebar-header">
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Resume Builder</h2>
                    <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>Fill in your details below</p>
                </div>

                <div className="builder-sidebar-body">

                    {/* LINKEDIN IMPORT */}
                    <SectionDivider title="Import from Profile" />
                    <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '16px' }}>🔗</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0369a1' }}>LinkedIn / Website URL</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                className="form-input"
                                style={{ fontSize: '13px', padding: '8px' }}
                                placeholder="https://linkedin.com/in/..."
                                value={linkedinUrl}
                                onChange={(e) => setLinkedinUrl(e.target.value)}
                            />
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleImportLinkedIn}
                                disabled={importing}
                            >
                                {importing ? '...' : 'Import'}
                            </button>
                        </div>
                        <p style={{ fontSize: '11px', color: '#0284c7', marginTop: '6px', lineHeight: '1.4' }}>
                            Paste your LinkedIn profile URL to auto-fill your experience and skills.
                        </p>
                    </div>

                    {/* UPLOAD RESUME */}
                    <SectionDivider title="Upload Existing Resume" />
                    <div
                        className={`resume-upload-zone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''} ${uploadedFileName && !uploading ? 'uploaded' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleFileDrop}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        {uploading ? (
                            <>
                                <div className="upload-spinner-ring" />
                                <span className="upload-zone-title">Parsing your resume...</span>
                                <span className="upload-zone-subtitle">AI is extracting your details</span>
                            </>
                        ) : uploadedFileName ? (
                            <>
                                <span className="upload-zone-icon">✅</span>
                                <span className="upload-zone-title">{uploadedFileName}</span>
                                <span className="upload-zone-subtitle">Parsed successfully — click to upload another</span>
                            </>
                        ) : (
                            <>
                                <span className="upload-zone-icon">📄</span>
                                <span className="upload-zone-title">Drop your resume PDF here</span>
                                <span className="upload-zone-subtitle">or click to browse — Max 10MB</span>
                            </>
                        )}
                    </div>

                    {/* TEMPLATE PICKER */}
                    <SectionDivider title="Template" />
                    <div className="template-grid">
                        {TEMPLATES.map(t => (
                            <div
                                key={t.id}
                                className={`template-card ${template === t.id ? 'selected' : ''}`}
                                onClick={() => setTemplate(t.id)}
                            >
                                <div className="template-card-icon">{t.icon}</div>
                                <div className="template-card-name">{t.name}</div>
                            </div>
                        ))}
                    </div>

                    {/* PERSONAL INFO */}
                    <SectionDivider title="Personal Info" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input className="form-input" value={data.name} onChange={e => update('name', e.target.value)} placeholder="John Doe" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Job Title</label>
                                <input className="form-input" value={data.role} onChange={e => update('role', e.target.value)} placeholder="Software Engineer" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" type="email" value={data.email} onChange={e => update('email', e.target.value)} placeholder="you@email.com" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 234 567 890" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input className="form-input" value={data.location} onChange={e => update('location', e.target.value)} placeholder="City, Country" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">LinkedIn</label>
                                <input className="form-input" value={data.linkedin} onChange={e => update('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
                            </div>
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <SectionDivider title="Professional Summary" />
                    <div className="form-group">
                        <textarea
                            className="form-textarea"
                            value={data.summary}
                            onChange={e => update('summary', e.target.value)}
                            placeholder="Write a brief professional summary..."
                            style={{ minHeight: 90 }}
                        />
                    </div>

                    {/* SKILLS */}
                    <SectionDivider title="Skills" />
                    <div className="form-group">
                        <label className="form-label">Skills (comma separated)</label>
                        <input
                            className="form-input"
                            value={data.skills}
                            onChange={e => update('skills', e.target.value)}
                            placeholder="React, Python, Leadership..."
                        />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {data.skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                            <span key={i} className="badge badge-blue">{s}</span>
                        ))}
                    </div>

                    {/* EXPERIENCE */}
                    <SectionDivider title="Experience" />
                    {data.experience.map((exp, i) => (
                        <div key={i} className="exp-item">
                            <div className="exp-item-header">
                                <span className="exp-item-title">Position {i + 1}</span>
                                {data.experience.length > 1 && (
                                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red-500)', fontSize: 12 }} onClick={() => removeExp(i)}>
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    <div className="form-group">
                                        <label className="form-label">Job Title</label>
                                        <input className="form-input" value={exp.title} onChange={e => updateExp(i, 'title', e.target.value)} placeholder="Software Engineer" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Company</label>
                                        <input className="form-input" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Acme Corp" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    <div className="form-group">
                                        <label className="form-label">Duration</label>
                                        <input className="form-input" value={exp.duration} onChange={e => updateExp(i, 'duration', e.target.value)} placeholder="2020 - Present" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Location</label>
                                        <input className="form-input" value={exp.location || ''} onChange={e => updateExp(i, 'location', e.target.value)} placeholder="City, State" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bullet Points (one per line)</label>
                                    <textarea
                                        className="form-textarea"
                                        value={Array.isArray(exp.points) ? exp.points.join('\n') : exp.points}
                                        onChange={e => updateExp(i, 'points', e.target.value.split('\n'))}
                                        placeholder="• Led a team of 5 engineers..."
                                        style={{ minHeight: 80 }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 4 }} onClick={addExp}>
                        + Add Experience
                    </button>

                    {/* EDUCATION */}
                    <SectionDivider title="Education" />
                    {data.education.map((edu, i) => (
                        <div key={i} className="exp-item">
                            <div className="exp-item-header">
                                <span className="exp-item-title">Education {i + 1}</span>
                                {data.education.length > 1 && (
                                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red-500)', fontSize: 12 }} onClick={() => removeEdu(i)}>
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div className="form-group">
                                    <label className="form-label">Degree</label>
                                    <input className="form-input" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="BS in Computer Science" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    <div className="form-group">
                                        <label className="form-label">Institution</label>
                                        <input className="form-input" value={edu.institution} onChange={e => updateEdu(i, 'institution', e.target.value)} placeholder="MIT" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Duration</label>
                                        <input className="form-input" value={edu.duration} onChange={e => updateEdu(i, 'duration', e.target.value)} placeholder="2016 - 2020" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 4 }} onClick={addEdu}>
                        + Add Education
                    </button>

                    {/* PROJECTS */}
                    <SectionDivider title="Projects" />
                    {(data.projects || []).map((proj, i) => (
                        <div key={i} className="exp-item">
                            <div className="exp-item-header">
                                <span className="exp-item-title">Project {i + 1}</span>
                                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red-500)', fontSize: 12 }} onClick={() => removeProj(i)}>
                                    Remove
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    <div className="form-group">
                                        <label className="form-label">Project Name</label>
                                        <input className="form-input" value={proj.name} onChange={e => updateProj(i, 'name', e.target.value)} placeholder="My Awesome App" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tech Stack</label>
                                        <input className="form-input" value={proj.tech} onChange={e => updateProj(i, 'tech', e.target.value)} placeholder="React, Node.js, MongoDB" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Duration (optional)</label>
                                    <input className="form-input" value={proj.duration} onChange={e => updateProj(i, 'duration', e.target.value)} placeholder="Jan 2024 - Mar 2024" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description (one per line)</label>
                                    <textarea
                                        className="form-textarea"
                                        value={Array.isArray(proj.points) ? proj.points.join('\n') : proj.points}
                                        onChange={e => updateProj(i, 'points', e.target.value.split('\n'))}
                                        placeholder="• Built a REST API with 99.9% uptime..."
                                        style={{ minHeight: 80 }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 4 }} onClick={addProj}>
                        + Add Project
                    </button>

                    {/* GENERATE BUTTON */}
                    <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--gray-100)' }}>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '14px', fontSize: 15 }}
                            onClick={handleGenerate}
                            disabled={generating}
                        >
                            {generating ? (
                                <><span className="spinner" /> Generating PDF...</>
                            ) : (
                                '⬇ Generate & Download PDF'
                            )}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)', marginTop: 10 }}>
                            AI will enhance your content before generating
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== PREVIEW ===== */}
            <div className="builder-preview">
                <div className="preview-toolbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>Live Preview</span>
                        <span className="badge badge-green">● Live</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                className={`btn btn-sm ${template === t.id ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setTemplate(t.id)}
                                style={{ fontSize: 12 }}
                            >
                                {t.icon} {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="preview-paper">
                    {renderPreview()}
                </div>
            </div>
        </div>
    );
};

export default Builder;
