import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, ExternalLink, ShieldCheck, User, Download, CheckCircle, Info } from 'lucide-react';

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [contacts, setContacts] = useState([
        { number: '', label: '' },
        { number: '', label: '' }
    ]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/owner/profile');
            if (res.status === 401) return navigate('/');
            const data = await res.json();

            if (data.qr_id) {
                setProfile(data);
                setName(data.owner_name || '');
                setCity(data.city || '');
                setBloodGroup(data.blood_group || '');

                let existingContacts = [];
                try {
                    const parsed = JSON.parse(data.emergency_contacts || '[]');
                    existingContacts = parsed.map((c, i) => {
                        if (typeof c === 'string') {
                            return { number: c, label: `Contact ${i + 1}` };
                        }
                        return c;
                    });
                } catch (e) {
                    existingContacts = [];
                }

                if (existingContacts.length === 0) existingContacts = [{ number: '', label: '' }, { number: '', label: '' }];
                else if (existingContacts.length === 1) existingContacts.push({ number: '', label: '' });

                setContacts(existingContacts);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const validContacts = contacts.filter(c => c.number.trim() !== '');

        if (validContacts.length === 0) {
            setMessage("Please add at least one emergency contact number.");
            return;
        }

        const res = await fetch('/api/owner/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                owner_name: name,
                city,
                blood_group: bloodGroup,
                emergency_contacts: validContacts
            })
        });
        const data = await res.json();
        setProfile(data);
        setMessage("Profile saved successfully!");
        setTimeout(() => setMessage(''), 3000);
        fetchProfile();
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        navigate('/');
    };

    const handleContactChange = (index, field, value) => {
        const newContacts = [...contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setContacts(newContacts);
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ marginBottom: '1rem', width: '40px', height: '40px', borderWidth: '4px' }}></div>
            <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>Loading your vault...</p>
        </div>
    );

    if (!profile?.qr_id) {
        return (
            <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <ShieldCheck size={64} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>Welcome to CarSafe!</h1>
                    <p className="text-muted">First, let's complete your emergency profile to generate your unique QR.</p>
                </div>

                <div className="card">
                    {message && (
                        <div style={{ padding: '1rem', background: 'rgba(255,51,102,0.1)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Info size={18} /> {message}
                        </div>
                    )}
                    <form onSubmit={handleSave}>
                        <div className="input-group">
                            <label>Your Full Name <span style={{ color: 'var(--primary)' }}>*</span></label>
                            <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Rahul Sharma" />
                        </div>
                        <div className="input-group">
                            <label>Where are you from? (City) <span style={{ color: 'var(--primary)' }}>*</span></label>
                            <input value={city} onChange={e => setCity(e.target.value)} required placeholder="e.g. Mumbai, Maharashtra" />
                        </div>
                        <div className="input-group">
                            <label>Blood Group</label>
                            <input value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} placeholder="e.g. O+" />
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <label style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1rem', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Emergency Contacts</label>
                            
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="input-group" style={{ marginBottom: '1rem' }}>
                                    <label>Primary Contact Name</label>
                                    <input value={contacts[0].label} onChange={e => handleContactChange(0, 'label', e.target.value)} placeholder="e.g. Dad, Spouse" />
                                </div>
                                <div className="input-group" style={{ marginBottom: 0 }}>
                                    <label>Primary Phone Number <span style={{ color: 'var(--primary)' }}>*</span></label>
                                    <input value={contacts[0].number} onChange={e => handleContactChange(0, 'number', e.target.value)} required placeholder="+91 98765 43210" />
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary w-full mt-4" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                            Complete Profile & Generate QR
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const qrValue = profile?.qr_id ? `${window.location.origin}/qr/${profile.qr_id}` : '';

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            {/* Header */}
            <header className="app-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="status-badge" style={{ padding: '0.75rem', borderRadius: '1rem', background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.2)' }}>
                        <ShieldCheck size={28} color="var(--primary)" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', margin: 0, background: 'linear-gradient(90deg, #fff, #A0A5AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>My Dashboard</h2>
                        <span className="text-muted text-sm">Manage your secure profile</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn btn-secondary"
                    style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                >
                    <LogOut size={16} /> <span className="hidden-mobile">Sign Out</span>
                </button>
            </header>

            {/* Main Grid */}
            <div style={{ display: 'grid', gap: '2rem' }}>

                {/* QR Card */}
                <div className="card text-center" style={{ borderTop: '4px solid var(--primary)', background: 'linear-gradient(180deg, rgba(255,51,102,0.05) 0%, var(--card-bg) 100%)' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Emergency Access QR</h3>
                        <p className="text-sm text-muted">Place this on your vehicle visualization</p>
                    </div>

                    {profile?.qr_id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* QR Canvas Container */}
                            <div style={{
                                padding: '2rem',
                                background: 'white', /* White background is necessary for the QR to be scannable on dark themes */
                                border: '4px solid rgba(255,255,255,0.1)',
                                borderRadius: '1.5rem',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(255,51,102,0.2)',
                                marginBottom: '2rem',
                                position: 'relative',
                                display: 'inline-block'
                            }}>
                                <QRCodeSVG
                                    value={qrValue}
                                    size={220}
                                    level="H"
                                    imageSettings={{
                                        src: "/favicon.ico",
                                        x: undefined,
                                        y: undefined,
                                        height: 35,
                                        width: 35,
                                        excavate: true,
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'linear-gradient(90deg, var(--success), #00A650)',
                                    color: 'white',
                                    padding: '0.35rem 1rem',
                                    borderRadius: '2rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 4px 10px rgba(0,230,118,0.4)',
                                    letterSpacing: '1px'
                                }}>
                                    ACTIVE & SECURE
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '350px' }}>
                                <a
                                    href={qrValue}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    <ExternalLink size={18} /> Test Link
                                </a>
                                <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', opacity: 0.6, cursor: 'not-allowed' }} disabled title="Download coming soon">
                                    <Download size={18} /> Save Image
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '3rem 2rem', color: 'var(--text-muted)' }}>
                            <div style={{ marginBottom: '1rem', color: 'var(--primary)', opacity: 0.5 }}>
                                <Info size={48} />
                            </div>
                            <p style={{ fontSize: '1.1rem' }}>Complete your profile below to generate your QR.</p>
                        </div>
                    )}
                </div>

                {/* Profile Form */}
                <div className="card">
                    <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
                            <User size={24} color="var(--secondary)" /> Emergency Data
                        </h3>
                        <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>This info is shown only when your unique QR is scanned.</p>
                    </div>

                    {message && (
                        <div className="animate-fade-in" style={{
                            padding: '1rem 1.25rem',
                            background: message.includes('success') ? 'rgba(0,230,118,0.1)' : 'rgba(255,51,102,0.1)',
                            border: `1px solid ${message.includes('success') ? 'rgba(0,230,118,0.3)' : 'rgba(255,51,102,0.3)'}`,
                            color: message.includes('success') ? 'var(--success)' : 'var(--primary)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '0.95rem',
                            fontWeight: '500'
                        }}>
                            {message.includes('success') ? <CheckCircle size={20} /> : <Info size={20} />}
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSave}>
                        <div className="input-group">
                            <label>Vehicle Owner Name</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div className="input-group">
                            <label>City / Location</label>
                            <input
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                placeholder="e.g. Mumbai, Maharashtra"
                            />
                        </div>
                        <div className="input-group">
                            <label>Blood Group</label>
                            <input
                                value={bloodGroup}
                                onChange={e => setBloodGroup(e.target.value)}
                                placeholder="e.g. O+"
                            />
                        </div>

                        <div style={{ marginTop: '3rem' }}>
                            <label style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                Emergency Contacts
                            </label>

                            {/* Contact 1 */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'grid', gap: '1.25rem' }}>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label>Label</label>
                                        <input
                                            value={contacts[0].label}
                                            onChange={e => handleContactChange(0, 'label', e.target.value)}
                                            placeholder="e.g. Dad, Spouse"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label>Phone Number <span style={{ color: 'var(--primary)' }}>*</span></label>
                                        <input
                                            value={contacts[0].number}
                                            onChange={e => handleContactChange(0, 'number', e.target.value)}
                                            placeholder="+91 98765 43210"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact 2 */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'grid', gap: '1.25rem' }}>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label>Label (Optional)</label>
                                        <input
                                            value={contacts[1].label}
                                            onChange={e => handleContactChange(1, 'label', e.target.value)}
                                            placeholder="e.g. Brother, Office"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label>Phone Number</label>
                                        <input
                                            value={contacts[1].number}
                                            onChange={e => handleContactChange(1, 'number', e.target.value)}
                                            placeholder="+91..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                            <Save size={20} /> Save Secure Payload
                        </button>
                    </form>
                </div>
            </div>

            <div className="text-center mt-8 text-xs text-muted" style={{ opacity: 0.5 }}>
                <p>CarSafe v1.0 &bull; AES-256 Encrypted Communication</p>
            </div>
        </div>
    );
}
