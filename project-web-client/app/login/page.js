'use client';

import {React, useState} from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Login() { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = () => {
      // Handle login logic here
      console.log(`Email: ${email}, Password: ${password}`);
    };
  
    return (
      <div className={styles.container}>
        <div className={styles.loginForm}>
          <h2>Login</h2>
          <input
            type="text"
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
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  };