import React from 'react';

const ResumeIO = ({ data }) => {
    const { name, role, summary, skills_list, experience = [], education = [], projects = [] } = data;

    // Helpers
    const skills = Array.isArray(skills_list) ? skills_list :
        (typeof skills_list === 'string' ? skills_list.split(',').filter(s => s.trim()) : []);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 35%) 1fr',
            width: '100%',
            height: '100%',
            minHeight: '1000px', // A4 height simulation
            fontFamily: 'Helvetica, Arial, sans-serif',
            color: '#333',
            backgroundColor: 'white'
        }}>

            {/* LEFT COLUMN */}
            <div style={{
                backgroundColor: '#f3e7df',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>

                {/* Header Block in Left Column */}
                <div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        margin: '0 0 6px 0',
                        color: '#000',
                        lineHeight: '1.2'
                    }}>
                        {name || 'Your Name'}
                    </h1>
                    <div style={{
                        fontSize: '14px',
                        color: '#444',
                        fontWeight: '500'
                    }}>
                        {role || 'Job Title'}
                    </div>
                </div>

                {/* Contact Info Mockup */}
                <div style={{ fontSize: '12px', color: '#666', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>sandra.miller@email.com</div>
                    <div>+1 212 635 3564</div>
                    <div>New York, USA</div>
                </div>

                {/* Profile */}
                <div>
                    <h3 style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        margin: '0 0 8px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Profile
                    </h3>
                    <p style={{
                        fontSize: '11px',
                        lineHeight: '1.5',
                        color: '#555',
                        margin: 0
                    }}>
                        {summary || 'Experienced professional with strong leadership skills...'}
                    </p>
                </div>

                {/* Skills */}
                <div>
                    <h3 style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        margin: '0 0 8px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Skills
                    </h3>
                    <ul style={{
                        paddingLeft: '16px',
                        margin: 0,
                        fontSize: '11px',
                        color: '#555'
                    }}>
                        {skills.length > 0 ? skills.map((s, i) => (
                            <li key={i} style={{ marginBottom: '4px' }}>{s.trim()}</li>
                        )) : (
                            <>
                                <li>Team Leadership</li>
                                <li>Strategic Planning</li>
                                <li>Project Management</li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ padding: '40px 32px' }}>

                {/* Experience */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #333',
                        paddingBottom: '6px',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Experience
                    </h3>

                    {experience.length > 0 ? experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{exp.title || 'Job Title'}</div>
                                <div style={{ fontSize: '11px', color: '#666' }}>{exp.duration || 'Date'}</div>
                            </div>
                            <div style={{ fontSize: '12px', color: '#555', marginBottom: '6px' }}>{exp.company || 'Company Name'}</div>
                            <div style={{ fontSize: '11px', lineHeight: '1.5', color: '#444' }}>
                                {Array.isArray(exp.points) ? exp.points.map((p, idx) => (
                                    <div key={idx}>• {p}</div>
                                )) : exp.points}
                            </div>
                        </div>
                    )) : (
                        <div style={{ fontSize: '12px', color: '#999' }}>Add your experience...</div>
                    )}
                </div>

                {/* Education */}
                <div>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #333',
                        paddingBottom: '6px',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Education
                    </h3>

                    {education.length > 0 ? education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{edu.degree || 'Degree'}</div>
                                <div style={{ fontSize: '11px', color: '#666' }}>{edu.duration || 'Date'}</div>
                            </div>
                            <div style={{ fontSize: '12px', color: '#555' }}>{edu.institution || 'University Name'}</div>
                        </div>
                    )) : (
                        <div style={{ fontSize: '12px', color: '#999' }}>Add your education...</div>
                    )}
                </div>

                {/* Projects */}
                {projects.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                        <h3 style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #333',
                            paddingBottom: '6px',
                            marginBottom: '16px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Projects
                        </h3>

                        {projects.map((proj, i) => (
                            <div key={i} style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{proj.name}</div>
                                    <div style={{ fontSize: '11px', color: '#666' }}>{proj.duration}</div>
                                </div>
                                {proj.tech && <div style={{ fontSize: '12px', color: '#555', fontStyle: 'italic', marginBottom: '6px' }}>{proj.tech}</div>}
                                <div style={{ fontSize: '11px', lineHeight: '1.5', color: '#444' }}>
                                    {Array.isArray(proj.points) ? proj.points.map((p, idx) => (
                                        <div key={idx}>• {p}</div>
                                    )) : proj.points}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ResumeIO;
