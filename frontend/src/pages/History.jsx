import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../components/Toast';

const History = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://127.0.0.1:8000/resumes', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setResumes(data);
                }
            } catch (err) {
                toast.error('Failed to load history');
            } finally {
                setLoading(false);
            }
        };
        fetchResumes();
    }, []);

    const handleDownload = (resume) => {
        const url = `http://127.0.0.1:8000/downloads/resume_${resume.id}_${resume.template || 'resumeio'}.pdf`;
        window.open(url, '_blank');
        toast.success('Opening PDF...');
    };

    const templateIcons = {
        resumeio: '💼',
        modern: '✨',
        creative: '🎨',
        professional: '🏢',
        ats: '📋',
    };

    return (
        <div className="history-page">
            <div className="history-content">
                <div className="history-header">
                    <div>
                        <h1 className="history-title">Resume History</h1>
                        <p style={{ color: 'var(--gray-500)', fontSize: 15, marginTop: 6 }}>
                            All your previously generated resumes
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/builder')}>
                        + New Resume
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: 88, borderRadius: 'var(--radius-xl)' }} />
                        ))}
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📄</div>
                        <h2 className="empty-state-title">No resumes yet</h2>
                        <p className="empty-state-desc">
                            You haven't created any resumes yet. Build your first one now!
                        </p>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/builder')}>
                            Build My First Resume
                        </button>
                    </div>
                ) : (
                    <div className="history-list">
                        {resumes.map((r) => (
                            <div key={r.id} className="history-item">
                                <div className="history-item-icon">
                                    {templateIcons[r.template] || '📄'}
                                </div>
                                <div className="history-item-info">
                                    <div className="history-item-name">{r.name}</div>
                                    <div className="history-item-meta">
                                        {r.role}
                                        {r.template && (
                                            <span className="badge badge-blue" style={{ marginLeft: 10 }}>
                                                {r.template}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="history-item-actions">
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => handleDownload(r)}
                                    >
                                        ⬇ Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
