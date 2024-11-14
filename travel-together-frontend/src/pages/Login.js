import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

function Login() {
    const { saveToken } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ email, password });
            saveToken(response.data.token); // Save token to context and localStorage
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
    )
}

export default Login;
