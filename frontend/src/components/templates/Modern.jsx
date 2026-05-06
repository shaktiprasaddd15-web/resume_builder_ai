import React from 'react';

const Modern = ({ data }) => {
    const { name, role, summary, skills, experience, education, projects = [], email, phone, location } = data;

    return (
        <div style={{
            width: '100%',
            minHeight: '1000px',
            backgroundColor: 'white',
            fontFamily: 'Montserrat, sans-serif',
            color: '#333',
            padding: '40px'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px', borderBottom: '4px solid #3b82f6', paddingBottom: '24px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '2px', color: '#1e3a8a' }}>{name}</h1>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#64748b' }}>{role}</div>

                <div style={{ marginTop: '16px', fontSize: '12px', color: '#475569', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    {email && <span>{email}</span>}
                    {phone && <span>{phone}</span>}
                    {location && <span>{location}</span>}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div style={{ marginBottom: '32px' }}>
                    <p style={{ textAlign: 'center', fontSize: '13px', lineHeight: '1.6', maxWidth: '80%', margin: '0 auto', color: '#334155' }}>
                        {summary}
                    </p>
                </div>
            )}

            {/* Skills Bar */}
            {skills && (
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#1e3a8a', marginBottom: '12px' }}>Core Competencies</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                        {skills.split(',').map((s, i) => (
                            <span key={i} style={{
                                backgroundColor: '#eff6ff',
                                color: '#1e40af',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '11px',
                                fontWeight: '600'
                            }}>
                                {s.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: '#1e3a8a',
                    borderBottom: '1px solid #cbd5e1',
                    paddingBottom: '8px',
                    marginBottom: '16px'
                }}>
                    Professional Experience
                </h3>

                {experience.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>
                            {exp.duration}
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{exp.title}</div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', marginBottom: '8px' }}>{exp.company}</div>
                            <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#334155' }}>
                                {Array.isArray(exp.points) ? exp.points.map((p, idx) => <div key={idx}>• {p}</div>) : exp.points}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Education */}
            <div>
                <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: '#1e3a8a',
                    borderBottom: '1px solid #cbd5e1',
                    paddingBottom: '8px',
                    marginBottom: '16px'
                }}>
                    Education
                </h3>

                {education.map((edu, i) => (
                    <div key={i} style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>
                            {edu.duration}
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{edu.degree}</div>
                            <div style={{ fontSize: '13px', color: '#334155' }}>{edu.institution}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Projects */}
            {projects.length > 0 && (
                <div>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        color: '#1e3a8a',
                        borderBottom: '1px solid #cbd5e1',
                        paddingBottom: '8px',
                        marginBottom: '16px'
                    }}>
                        Projects
                    </h3>

                    {projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>
                                {proj.duration}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{proj.name}</div>
                                {proj.tech && <div style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', marginBottom: '8px' }}>{proj.tech}</div>}
                                <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#334155' }}>
                                    {Array.isArray(proj.points) ? proj.points.map((p, idx) => <div key={idx}>• {p}</div>) : proj.points}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Modern;
