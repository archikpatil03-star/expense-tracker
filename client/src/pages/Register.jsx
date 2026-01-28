import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, password);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="card auth-card">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-3">Create Account</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Start monitoring your expenses today</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--danger)',
                        color: 'var(--danger)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1.5rem',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="label" style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-muted)' }}>Username</label>
                        <input
                            className="input"
                            style={{ padding: '1rem' }}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label className="label" style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-muted)' }}>Password</label>
                        <input
                            className="input"
                            style={{ padding: '1rem' }}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="btn w-full action-btn-primary" style={{ padding: '1.25rem', fontSize: '1.1rem', letterSpacing: '0.05em', marginTop: '1rem' }}>
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
