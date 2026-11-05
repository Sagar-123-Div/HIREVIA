import React from 'react';

// Simple Footer - static content, no state/logic needed
// Company links data hai, taaki naya link add karna ho toh array mein object daalna hai

const links = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'For Employers', href: '/recruiter/dashboard' },
  { label: 'For Job Seekers', href: '/jobs' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: brand name */}
        <p className="text-white font-bold text-lg">Hirevia</p>

        {/* Middle: links */}
        <div className="flex flex-wrap gap-6">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-white text-sm">
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: copyright */}
        <p className="text-sm">© {new Date().getFullYear()} Hirevia. All rights reserved.</p>
      </div>
    </footer>
  );
}