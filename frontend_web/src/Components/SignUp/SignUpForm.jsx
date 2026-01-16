import React, { useState } from 'react';
import './SignUpForm.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.jsx';
// If you use icons, you would typically import them here (e.g., from react-icons)
// Example: import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    
    // New states for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        // 1. Client-side validation for password match
        if (password !== confirmPassword) {
            setMessage('Error: Passwords do not match.');
            return;
        }

        try {
            // Include username, email, and password in the body
            const response = await api.post('/sign_up.php', { email, password, username });

            const data = response.data;
            
            // If sign-up is successful, clear the fields and redirect
            if (data.success) {
                setMessage(data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(data.message);
            }

        } catch (error) {
            setMessage('An error occurred. Please try again later.');
            console.error('Error:', error);
        }
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    // Helper component/function to render the icon based on visibility state
    const EyeIcon = ({ isVisible, onClick }) => (
        // Note: You should replace the text with an actual icon library (like FontAwesome or material icons)
        // For simplicity, we use text here, but your CSS needs to style this 'icon' class.
        <span 
            className="icon" 
            onClick={onClick} 
            style={{ cursor: 'pointer' }}
            title={isVisible ? 'Hide Password' : 'Show Password'}
        >
            {isVisible ? '👁️' : '🔒'} 
        </span>
    );

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                
                {/* Username Input */}
                <div className="inputbox">
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                
                {/* Email Input */}
                <div className="inputbox">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                {/* Password Input */}
                <div className="inputbox">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <EyeIcon 
                        isVisible={showPassword} 
                        onClick={() => togglePasswordVisibility('password')}
                    />
                </div>
                
                {/* Confirm Password Input */}
                <div className="inputbox">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <EyeIcon 
                        isVisible={showConfirmPassword} 
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                    />
                </div>
                
                <button type='submit'>Sign Up</button>
                {message && <p className='message'>{message}</p>} 
                
                <div className="Login-link">
                    <p>Already have an account? <Link to="/login">click to Login</Link></p>
                </div>
            </form>
        </div>
    );
};

export default SignUp;