'use client';

import {React, useState} from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { login } from '../apis/auth';
import { useRouter } from 'next/navigation'

export default function Login() { 
    const router = useRouter()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = async () => {
      const res = await login({'username': username, 'password': password});
      if (res.success) {
        router.push("/user/" + username);
      }
      else {
        alert('Login Failed!');
      }
    };
  
    return (
      <div className={styles.container}>
        <div className={styles.loginForm}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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