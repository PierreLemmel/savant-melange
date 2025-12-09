import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

const sections = [
	{ id: 'le-projet', label: 'Le Projet' },
	{ id: 'qui-sommes-nous', label: 'Qui Sommes-nous ?' },
	{ id: 'dates', label: 'Dates à venir' },
	{ id: 'passes', label: 'Événements passés' },
	{ id: 'pro', label: 'Espace Pro' },
];

export default function Navigation() {
  	const [activeSection, setActiveSection] = useState('');
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
		if (element)
			observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

  	return <nav className={cn(
		"fixed top-0 left-0 right-0 z-50 backdrop-blur-sm py-4 px-6 shadow-lg",
	)}>
		<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
			<div className="w-full md:w-auto flex justify-between items-center">
				<div className="text-2xl font-bold uppercase tracking-tighter text-[#FDFD96] drop-shadow-md">
					<a href="#" className="hover:text-white transition-colors">Savant Mélange</a>
					<span className="mx-2 text-[#87CEEB]">{'>'}</span>
					<span className="text-[#87CEEB] text-lg">{sections.find(s => s.id === activeSection)?.label || 'Accueil'}</span>
				</div>
				
				<button
					onClick={toggleMobileMenu}
					className="md:hidden text-[#FDFD96] hover:text-white transition-colors focus:outline-none"
					aria-label="Toggle menu"
					aria-expanded={isMobileMenuOpen}
				>
					<svg
						className="w-6 h-6"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						{isMobileMenuOpen ? (
							<path d="M6 18L18 6M6 6l12 12" />
						) : (
							<path d="M4 6h16M4 12h16M4 18h16" />
						)}
					</svg>
				</button>
			</div>
			
			<ul className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:flex-wrap justify-center gap-4 md:gap-8 w-full md:w-auto`}>
			{sections.map(({ id, label }) => (
				<li key={id}>
				<a
					href={`#${id}`}
					onClick={closeMobileMenu}
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
}

