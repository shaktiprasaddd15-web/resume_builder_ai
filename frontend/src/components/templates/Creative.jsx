import React from 'react';

const Creative = ({ data }) => {
    const { name, role, summary, skills_list, experience = [], education = [], projects = [], email, phone, location } = data;

    const skills = Array.isArray(skills_list) ? skills_list :
        (typeof skills_list === 'string' ? skills_list.split(',').filter(s => s.trim()) : []);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(250px, 35%) 1fr',
            width: '100%',
            height: '100%',
            minHeight: '1000px',
            fontFamily: "'Outfit', sans-serif",
            color: '#2c3e50',
            backgroundColor: 'white'
        }}>
            {/* SIDEBAR */}
            <div style={{
                backgroundColor: '#ecf0f1',
                padding: '40px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px',
                borderRight: '1px solid #bdc3c7'
            }}>

                {/* Contact */}
                <div>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '10px',
                        borderBottom: '2px solid #e74c3c',
                        paddingBottom: '4px'
                    }}>CONTACT</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                        {email && <div>{email}</div>}
                        {phone && <div>{phone}</div>}
                        {location && <div>{location}</div>}
                    </div>
                </div>

                {/* Skills */}
                <div>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '10px',
                        borderBottom: '2px solid #e74c3c',
                        paddingBottom: '4px'
                    }}>SKILLS</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {skills.map((s, i) => (
                            <div key={i} style={{ fontSize: '12px', background: 'white', padding: '4px 8px', borderRadius: '4px', border: '1px solid #bdc3c7' }}>
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education in Sidebar for Creative */}
                <div>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '10px',
                        borderBottom: '2px solid #e74c3c',
                        paddingBottom: '4px'
                    }}>EDUCATION</h3>
                    {education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={{ fontWeight: '700', fontSize: '12px' }}>{edu.degree}</div>
                            <div style={{ fontSize: '12px' }}>{edu.institution}</div>
                            <div style={{ fontSize: '11px', color: '#7f8c8d', fontStyle: 'italic' }}>{edu.duration}</div>
                        </div>
                    ))}
                </div>

            </div>

            {/* MAIN CONTENT */}
            <div style={{ padding: '40px' }}>

                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '900',
                        color: '#2c3e50',
                        margin: '0 0 4px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>{name}</h1>
                    <h2 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#e74c3c',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>{role}</h2>
                </div>

                {/* Profile */}
                {summary && (
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#2c3e50',
                            marginBottom: '12px',
                            borderBottom: '2px solid #e74c3c',
                            display: 'inline-block',
                            paddingBottom: '4px'
                        }}>PROFILE</h3>
                        <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#34495e', margin: 0 }}>
                            {summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                <div>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '20px',
                        borderBottom: '2px solid #e74c3c',
                        display: 'inline-block',
                        paddingBottom: '4px'
                    }}>EXPERIENCE</h3>

                    {experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '24px', borderLeft: '2px solid #ecf0f1', paddingLeft: '16px' }}>
                            <div style={{ fontWeight: '800', fontSize: '14px', color: '#2c3e50' }}>{exp.title}</div>
                            <div style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '8px' }}>
                                {exp.company} | {exp.duration}
                            </div>
                            <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#34495e' }}>
                                {Array.isArray(exp.points) ? exp.points.map((p, idx) => (
                                    <div key={idx}>• {p}</div>
                                )) : exp.points}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                {projects.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#2c3e50',
                            marginBottom: '20px',
                            borderBottom: '2px solid #e74c3c',
                            display: 'inline-block',
                            paddingBottom: '4px'
                        }}>PROJECTS</h3>

                        {projects.map((proj, i) => (
                            <div key={i} style={{ marginBottom: '24px', borderLeft: '2px solid #ecf0f1', paddingLeft: '16px' }}>
                                <div style={{ fontWeight: '800', fontSize: '14px', color: '#2c3e50' }}>{proj.name}</div>
                                {proj.tech && <div style={{ fontSize: '13px', color: '#e74c3c', marginBottom: '4px' }}>{proj.tech}</div>}
                                <div style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '8px' }}>{proj.duration}</div>
                                <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#34495e' }}>
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

export default Creative;
