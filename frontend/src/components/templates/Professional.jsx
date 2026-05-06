import React from 'react';

const Professional = ({ data }) => {
    const { name, role, summary, skills_list, experience = [], education = [], projects = [], email, phone, location } = data;

    const skills = Array.isArray(skills_list) ? skills_list :
        (typeof skills_list === 'string' ? skills_list.split(',').filter(s => s.trim()) : []);

    return (
        <div style={{
            width: '100%',
            minHeight: '1000px',
            backgroundColor: 'white',
            fontFamily: 'serif',
            color: '#222',
            padding: '50px 40px',
            display: 'flex',
            flexDirection: 'column'
        }}>

            {/* Header - Centered */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    margin: '0 0 6px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>{name}</h1>

                <div style={{
                    fontSize: '13px',
                    color: '#555',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px'
                }}>
                    {email} | {phone} | {location}
                </div>
            </div>

            {/* Sections */}
            {summary && (
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #000',
                        paddingBottom: '2px',
                        marginBottom: '8px',
                        textTransform: 'uppercase'
                    }}>Professional Summary</h3>
                    <p style={{ fontSize: '13px', lineHeight: '1.4', margin: 0, textAlign: 'justify' }}>
                        {summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #000',
                        paddingBottom: '2px',
                        marginBottom: '12px',
                        textTransform: 'uppercase'
                    }}>Professional Experience</h3>

                    {experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{exp.company}</div>
                                <div style={{ fontSize: '13px' }}>{exp.duration}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <div style={{ fontStyle: 'italic', fontSize: '13px' }}>{exp.title}</div>
                                <div style={{ fontStyle: 'italic', fontSize: '12px', color: '#666' }}>{exp.location}</div>
                            </div>
                            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', lineHeight: '1.4' }}>
                                {Array.isArray(exp.points) ? exp.points.map((p, idx) => (
                                    <li key={idx} style={{ marginBottom: '2px' }}>{p}</li>
                                )) : exp.points}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #000',
                        paddingBottom: '2px',
                        marginBottom: '12px',
                        textTransform: 'uppercase'
                    }}>Education</h3>

                    {education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{edu.institution}</div>
                                <div style={{ fontSize: '13px' }}>{edu.degree}</div>
                            </div>
                            <div style={{ fontSize: '13px', textAlign: 'right' }}>{edu.duration}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #000',
                        paddingBottom: '2px',
                        marginBottom: '12px',
                        textTransform: 'uppercase'
                    }}>Projects</h3>

                    {projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{proj.name}</div>
                                <div style={{ fontSize: '13px' }}>{proj.duration}</div>
                            </div>
                            {proj.tech && <div style={{ fontStyle: 'italic', fontSize: '12px', color: '#555', marginBottom: '4px' }}>{proj.tech}</div>}
                            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', lineHeight: '1.4' }}>
                                {Array.isArray(proj.points) ? proj.points.map((p, idx) => (
                                    <li key={idx} style={{ marginBottom: '2px' }}>{p}</li>
                                )) : proj.points}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #000',
                        paddingBottom: '2px',
                        marginBottom: '8px',
                        textTransform: 'uppercase'
                    }}>Technical Skills</h3>
                    <p style={{ fontSize: '13px', margin: 0 }}>
                        {skills.join(', ')}
                    </p>
                </div>
            )}

        </div>
    );
};

export default Professional;
