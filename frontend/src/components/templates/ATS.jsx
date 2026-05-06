import React from 'react';

const ATS = ({ data }) => {
    const { name, role, summary, skills_list, experience = [], education = [], projects = [], email, phone, location } = data;

    const skills = Array.isArray(skills_list) ? skills_list :
        (typeof skills_list === 'string' ? skills_list.split(',').filter(s => s.trim()) : []);

    return (
        <div style={{
            width: '100%',
            minHeight: '1000px',
            backgroundColor: 'white',
            fontFamily: 'Times New Roman, serif',
            color: '#000',
            padding: '48px',
            lineHeight: '1.4'
        }}>

            {/* Header - Simple and Centered */}
            <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '4px', textTransform: 'uppercase' }}>{name}</h1>
            <div style={{ fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
                {location} | {phone} | {email}
            </div>

            <div style={{ borderBottom: '1px solid #000', marginBottom: '12px' }}></div>

            {/* Summary */}
            <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Professional Summary</h3>
                <p style={{ fontSize: '12px', textAlign: 'justify' }}>{summary}</p>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Skills</h3>
                <p style={{ fontSize: '12px' }}>
                    {skills.join(' • ')}
                </p>
            </div>

            {/* Experience */}
            <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Experience</h3>

                {experience.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{exp.company}</span>
                            <span style={{ fontSize: '12px' }}>{exp.duration}</span>
                        </div>
                        <div style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '4px' }}>{exp.title}</div>
                        <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px' }}>
                            {Array.isArray(exp.points) ? exp.points.map((p, idx) => (
                                <li key={idx} style={{ marginBottom: '2px' }}>{p}</li>
                            )) : <li>{exp.points}</li>}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Education */}
            <div>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Education</h3>

                {education.map((edu, i) => (
                    <div key={i} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{edu.institution}</span>
                            <span style={{ fontSize: '12px' }}>{edu.duration}</span>
                        </div>
                        <div style={{ fontSize: '12px' }}>{edu.degree}</div>
                    </div>
                ))}
            </div>

            {/* Projects */}
            {projects.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Projects</h3>
                    {projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{proj.name}</span>
                                <span style={{ fontSize: '12px' }}>{proj.duration}</span>
                            </div>
                            {proj.tech && <div style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '4px' }}>{proj.tech}</div>}
                            <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px' }}>
                                {Array.isArray(proj.points) ? proj.points.map((p, idx) => (
                                    <li key={idx} style={{ marginBottom: '2px' }}>{p}</li>
                                )) : <li>{proj.points}</li>}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ATS;
