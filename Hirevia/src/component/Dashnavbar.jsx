import React from 'react';

const Dashnavbar = () => {
  return (
    
    <nav style={styles.navbar}>
      <div style={styles.brand}>Hirevia</div>

      <div style={styles.links}>
        <a href="#" style={styles.link}>Dashboard</a>
        <a href="#" style={styles.link}>Jobs</a>
        <a href="#" style={styles.link}>Candidates</a>
        <a href="#" style={styles.link}>Reports</a>
      </div>

      <button style={styles.button}>Logout</button>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1f2937',
    color: '#fff',
    padding: '14px 28px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  links: {
    display: 'flex',
    gap: '22px',
    alignItems: 'center',
  },
  link: {
    color: '#e5e7eb',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
  button: {
    backgroundColor: '#f59e0b',
    color: '#111827',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default Dashnavbar;
