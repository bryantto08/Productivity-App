'use client';

import {React, useState} from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { register } from '../apis/auth';
import { useRouter } from 'next/navigation'
import { useCookies } from 'next-client-cookies';

export default function Register() { 
    const router = useRouter();
    const cookies = useCookies();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleRegister = async () => {
      const res = await register({'username': username, 'password': password});
      if (res.success) {
        cookies.set('session-id', res['session-id']);
        router.push("/user/" + username);
      }
      else {
        alert('Registration Failed! Username might be taken!');
      }
    };
  
    return (
      <div className={styles.container}>
        <div className={styles.loginForm}>
          <h2>Register</h2>
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
          <button onClick={handleRegister}>Register</button>
        </div>
      </div>
    );
  };