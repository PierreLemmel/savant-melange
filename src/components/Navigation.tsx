import React, { useState, useEffect } from 'react';

const sections = [
  { id: 'le-projet', label: 'Le Projet' },
  { id: 'qui-sommes-nous', label: 'Qui Sommes-nous ?' },
  { id: 'dates', label: 'Dates à venir' },
  { id: 'passes', label: 'Événements passés' },
  { id: 'pro', label: 'Espace Pro' },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#E25822]/90 backdrop-blur-sm border-b-2 border-[#FDFD96] py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-2xl font-bold uppercase tracking-tighter text-[#FDFD96] drop-shadow-md">
          <a href="#" className="hover:text-white transition-colors">Savant Mélange</a>
          <span className="mx-2 text-[#87CEEB]">{'>'}</span>
          <span className="text-[#87CEEB] text-lg">{sections.find(s => s.id === activeSection)?.label || 'Accueil'}</span>
        </div>
        
        <ul className="flex flex-wrap justify-center gap-4 md:gap-8">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`text-sm md:text-base font-bold uppercase transition-all duration-300 hover:text-white hover:underline decoration-wavy decoration-[#87CEEB] ${
                  activeSection === id ? 'text-white underline decoration-[#87CEEB]' : 'text-[#FDFD96]'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

