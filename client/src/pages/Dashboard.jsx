import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, ExternalLink, ShieldCheck, User, Download, CheckCircle, Info, QrCode } from 'lucide-react';

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [vehicleType, setVehicleType] = useState('Car');
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
                setVehicleType(data.vehicle_type || 'Car');

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
                vehicle_type: vehicleType,
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
                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1.25rem', background: 'rgba(59, 130, 246,0.1)', borderRadius: '2rem', marginBottom: '1rem', color: 'var(--primary)', border: '1px solid rgba(59, 130, 246,0.2)' }}>
                        <ShieldCheck size={48} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>Welcome to Aidlyn</h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Let's set up your secure digital envelope.</p>
                </div>

                <div className="card" style={{ borderTop: '4px solid var(--primary)', padding: '2.5rem' }}>
                    {message && (
                        <div style={{ padding: '1rem', background: 'rgba(59, 130, 246,0.1)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Info size={18} /> {message}
                        </div>
                    )}
                    <form onSubmit={handleSave}>
                        <div className="input-group">
                            <label>Your Full Name <span style={{ color: 'var(--primary)' }}>*</span></label>
                            <input className="premium-input" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Rahul Sharma" />
                        </div>
                        <div className="input-group">
                            <label>Vehicle Type</label>
                            <select className="premium-input" value={vehicleType} onChange={e => setVehicleType(e.target.value)} style={{ appearance: 'none' }}>
                                <option value="Car">Car</option>
                                <option value="Bike">Bike / Scooter</option>
                                <option value="Truck">Truck / Commercial</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label>City <span style={{ color: 'var(--primary)' }}>*</span></label>
                                <input className="premium-input" value={city} onChange={e => setCity(e.target.value)} required placeholder="e.g. Mumbai" />
                            </div>
                            <div className="input-group">
                                <label>Blood Group</label>
                                <input className="premium-input" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} placeholder="e.g. O+" />
                            </div>
                        </div>

                        <div style={{ marginTop: '2.5rem' }}>
                            <label style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'block', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Primary Emergency Contact</label>
                            
                            <div className="contact-card highlight-contact">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', alignItems: 'end' }}>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label>Relation</label>
                                        <input className="premium-input soft-bg" value={contacts[0].label} onChange={e => handleContactChange(0, 'label', e.target.value)} placeholder="e.g. Dad, Spouse" />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label>Phone Number <span style={{ color: 'var(--primary)' }}>*</span></label>
                                        <input className="premium-input soft-bg" value={contacts[0].number} onChange={e => handleContactChange(0, 'number', e.target.value)} required placeholder="+91 98765 43210" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary w-full" style={{ padding: '1.25rem', fontSize: '1.2rem', marginTop: '2.5rem', borderRadius: '1rem', letterSpacing: '0.5px' }}>
                            Generate My QR Pass
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const qrValue = profile?.qr_id ? `${window.location.origin}/qr/${profile.qr_id}` : '';

    const downloadQR = () => {
        const svg = document.getElementById("qr-svg-node");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        const encoded = btoa(unescape(encodeURIComponent(svgData)));
        img.onload = () => {
            const qrSize = img.width; 
            
            // Layout dimensions based on Vehicle Type
            const isCompact = vehicleType === 'Bike' || vehicleType === 'Other';
            const padding = isCompact ? 25 : 30;
            const topHeaderHeight = isCompact ? 50 : 65;
            const bottomFooterHeight = isCompact ? 40 : 55;
            
            canvas.width = qrSize + (padding * 2);
            canvas.height = qrSize + topHeaderHeight + bottomFooterHeight + padding;
            
            // Base Background (Sleek Dark for compact, White for standard)
            ctx.fillStyle = isCompact ? "#0A0A0B" : "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Header Banner (Electric Blue vs Primary Red)
            ctx.fillStyle = isCompact ? "#3B82F6" : "#E11D48";
            ctx.fillRect(0, 0, canvas.width, topHeaderHeight);
            
            // Header Text
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            
            if (isCompact) {
                ctx.font = "bold 16px 'Inter', Arial, sans-serif";
                ctx.fillText("SCAN IF EMERGENCY", canvas.width / 2, 30);
            } else {
                ctx.font = "bold 18px 'Inter', Arial, sans-serif";
                ctx.fillText("VEHICLE EMERGENCY", canvas.width / 2, 28);
                ctx.font = "bold 12px 'Inter', Arial, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.9)";
                ctx.fillText("SCAN TO CONTACT EMERGENCY", canvas.width / 2, 48);
            }
            
            // White placeholder for QR if background is dark
            if (isCompact) {
                ctx.fillStyle = "white";
                ctx.fillRect(padding - 5, topHeaderHeight + (padding / 2), qrSize + 10, qrSize + 10);
            }
            
            // QR Image
            ctx.drawImage(img, padding, topHeaderHeight + (padding / 2) + (isCompact ? 5 : 5));
            
            // ID text
            if (profile?.qr_id) {
                ctx.fillStyle = isCompact ? "#9BA1A6" : "#333333";
                ctx.font = "bold 12px monospace";
                ctx.fillText(`ID: ${profile.qr_id.toUpperCase()}`, canvas.width / 2, topHeaderHeight + qrSize + padding + 15 + (isCompact ? 5 : 5));
            }
            
            // Footer Branding
            ctx.fillStyle = isCompact ? "#52525B" : "#555555";
            ctx.font = "11px 'Inter', Arial, sans-serif";
            ctx.fillText("Secured by Aidlyn", canvas.width / 2, canvas.height - (isCompact ? 12 : 20));
            
            // Trigger download
            const a = document.createElement("a");
            a.download = `Aidlyn-${isCompact ? 'Compact' : 'Standard'}-${profile?.qr_id || 'QR'}.png`;
            a.href = canvas.toDataURL("image/png");
            a.click();
        };
        img.src = `data:image/svg+xml;base64,${encoded}`;
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            {/* Header */}
            <header className="app-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="status-badge" style={{ padding: '0.75rem', borderRadius: '1rem', background: 'rgba(59, 130, 246,0.1)', border: '1px solid rgba(59, 130, 246,0.2)' }}>
                        <ShieldCheck size={28} color="var(--primary)" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', margin: 0, background: 'linear-gradient(90deg, var(--text-main), var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>My Dashboard</h2>
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

                {/* QR Card - Digital ID Layout */}
                <div className="card digital-id-card text-center" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(82, 82, 91, 0.4), rgba(24, 24, 27, 0.8))', padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                            <QrCode size={28} color="var(--primary)" />
                            <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary)', letterSpacing: '1px' }}>DIGITAL PASS</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Aidlyn Emergency Access</p>
                    </div>

                    <div style={{ padding: '3rem 2rem', background: 'var(--card-bg)' }}>
                    {profile?.qr_id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="qr-container" style={{
                                padding: '1.5rem',
                                background: 'white',
                                borderRadius: '1.25rem',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.4), 0 0 40px rgba(59,130,246,0.15)',
                                marginBottom: '2.5rem',
                                position: 'relative',
                                display: 'inline-block'
                            }}>
                                <QRCodeSVG
                                    id="qr-svg-node"
                                    value={qrValue}
                                    size={200}
                                    level="H"
                                    imageSettings={{
                                        src: "/favicon.ico",
                                        x: undefined, y: undefined,
                                        height: 30, width: 30,
                                        excavate: true,
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'var(--success)',
                                    color: '#000',
                                    padding: '0.4rem 1.25rem',
                                    borderRadius: '2rem',
                                    fontSize: '0.8rem',
                                    fontWeight: '800',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 8px 20px rgba(0,230,118,0.3)',
                                    letterSpacing: '1.5px',
                                }}>
                                    SECURE
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                                <a href={qrValue} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                                    <ExternalLink size={18} /> Test Scan
                                </a>
                                <button onClick={downloadQR} className="btn" style={{ flex: 1, justifyContent: 'center', background: 'var(--primary)', color: 'var(--bg-color)', boxShadow: '0 4px 15px rgba(255,255,255,0.2)' }}>
                                    <Download size={18} /> Save PNG
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                            <Info size={48} style={{ margin: '0 auto 1rem', opacity: 0.5, color: 'var(--primary)' }} />
                            <p style={{ fontSize: '1.1rem' }}>Complete your profile below to generate your unique QR Pass.</p>
                        </div>
                    )}
                    </div>
                </div>

                {/* Profile Form */}
                <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
                    <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', color: 'var(--text-main)' }}>
                            <User size={24} color="var(--secondary)" /> Emergency Profile
                        </h3>
                        <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>These details will be securely displayed upon QR scan.</p>
                    </div>

                    {message && (
                        <div className="animate-fade-in" style={{
                            padding: '1rem 1.25rem',
                            background: message.includes('success') ? 'rgba(0,230,118,0.1)' : 'rgba(59, 130, 246,0.1)',
                            border: `1px solid ${message.includes('success') ? 'rgba(0,230,118,0.3)' : 'rgba(59, 130, 246,0.3)'}`,
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
                                placeholder="e.g. Rahul Sharma"
                                className="premium-input"
                            />
                        </div>
                        <div className="input-group">
                            <label>Vehicle Type</label>
                            <select className="premium-input" value={vehicleType} onChange={e => setVehicleType(e.target.value)} style={{ appearance: 'none', color: 'white' }}>
                                <option value="Car" style={{ color: 'black' }}>Car</option>
                                <option value="Bike" style={{ color: 'black' }}>Bike / Scooter</option>
                                <option value="Truck" style={{ color: 'black' }}>Truck / Commercial</option>
                                <option value="Other" style={{ color: 'black' }}>Other</option>
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label>City / Location</label>
                                <input
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    placeholder="e.g. Mumbai"
                                    className="premium-input"
                                />
                            </div>
                            <div className="input-group">
                                <label>Blood Group</label>
                                <input
                                    value={bloodGroup}
                                    onChange={e => setBloodGroup(e.target.value)}
                                    placeholder="e.g. O+"
                                    className="premium-input"
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '2.5rem' }}>
                            <label style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', display: 'block', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                First Responders (Contacts)
                            </label>

                            {/* Contact 1 */}
                            <div className="contact-card highlight-contact">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', alignItems: 'end' }}>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label>Relation / Label</label>
                                        <input
                                            value={contacts[0].label}
                                            onChange={e => handleContactChange(0, 'label', e.target.value)}
                                            placeholder="e.g. Dad, Spouse"
                                            className="premium-input soft-bg"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label>Phone Number <span style={{ color: 'var(--primary)' }}>*</span></label>
                                        <input
                                            value={contacts[0].number}
                                            onChange={e => handleContactChange(0, 'number', e.target.value)}
                                            placeholder="+91..."
                                            required
                                            className="premium-input soft-bg"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact 2 */}
                            <div className="contact-card" style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', alignItems: 'end' }}>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label>Secondary Label</label>
                                        <input
                                            value={contacts[1].label}
                                            onChange={e => handleContactChange(1, 'label', e.target.value)}
                                            placeholder="e.g. Brother"
                                            className="premium-input soft-bg"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label>Phone Number</label>
                                        <input
                                            value={contacts[1].number}
                                            onChange={e => handleContactChange(1, 'number', e.target.value)}
                                            placeholder="+91..."
                                            className="premium-input soft-bg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '2.5rem', borderRadius: '1rem' }}>
                            <Save size={20} /> Apply & Secure Data
                        </button>
                    </form>
                </div>
            </div>

            <div className="text-center mt-8 text-xs text-muted" style={{ opacity: 0.5 }}>
                <p>Aidlyn v1.0 &bull; AES-256 Encrypted Communication</p>
                <p style={{ marginTop: '0.25rem' }}>Developed by Prashant Maurya & Pushpak</p>
            </div>
        </div>
    );
}
