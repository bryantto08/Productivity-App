'use client';

import React from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Your App Logo</div>
      <ul className={styles.navLinks}>
        <li className={styles.navItem}>
          <Link href="/">
            <p className={styles.navLink}>Home</p>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/login">
            <p className={styles.navLink}>Log In</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
