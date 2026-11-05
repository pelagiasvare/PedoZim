import React, { useState } from 'react';
import {
  CheckCircle2,
  MessageSquare,
  DollarSign,
  FileSpreadsheet,
  Users,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  User,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Calendar,
  FileText,
  CalendarCheck,
  ShoppingBag,
  GraduationCap,
  BarChart3,
  Mail,
  Home,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { ActivePage } from '../components/Sidebar';
import { User as AppUser } from '../types';
import { mockUsers } from '../data/mockData';

// ── Social media URLs — replace with your actual pages ──────────────────
const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/pedo-zim',   // ← your LinkedIn URL
  facebook: 'https://www.facebook.com/pedozim',            // ← your Facebook URL
};

interface PedoLandingPageProps {
  onEnterPortal: (page?: ActivePage, user?: AppUser) => void;
  mockUsers: AppUser[];
}

export const PedoLandingPage: React.FC<PedoLandingPageProps> = ({ onEnterPortal, mockUsers }) => {
  const [studentCount, setStudentCount] = useState<number>(250);
  const [activeFaq,    setActiveFaq]    = useState<number | null>(0);
  const [isScrolled,   setIsScrolled]   = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection]   = useState('home');

  // Login Card Form State
  const [selectedRole, setSelectedRole] = useState<'staff' | 'student' | 'parent' | 'org'>('org');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleTabChange = (role: 'staff' | 'student' | 'parent' | 'org') => {
    setSelectedRole(role);
    switch (role) {
      case 'staff':   setLoginEmail('t.moyo@school.ac.zw'); break;
      case 'student': setLoginEmail('t.mutasa@student.ac.zw'); break;
      case 'parent':  setLoginEmail('gmutasa@gmail.com'); break;
      case 'org':     setLoginEmail('director@pedozim.ac.zw'); break;
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = mockUsers.find((u) => u.email.toLowerCase() === loginEmail.toLowerCase());
    onEnterPortal('dashboard', matched || undefined);
  };

  const calculatedMonthly = (studentCount * 0.2).toFixed(2);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Offset by navbar height (64px) so heading is not hidden
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Scroll spy — update isScrolled + activeSection
  React.useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
      const sections = [
        { id: 'home',     el: document.querySelector('.hero-fundah-display') },
        { id: 'features', el: document.getElementById('features') },
        { id: 'pricing',  el: document.getElementById('pricing') },
        { id: 'faq',      el: document.getElementById('faq') },
      ];
      let current = 'home';
      for (const s of sections) {
        if (s.el) {
          const top = (s.el as HTMLElement).getBoundingClientRect().top;
          if (top <= 90) current = s.id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const featurePills = [
    { label: 'Student Records', icon: <User size={15} /> },
    { label: 'Billing & Finance', icon: <DollarSign size={15} /> },
    { label: 'E-Library', icon: <BookOpen size={15} /> },
    { label: 'Scheduling', icon: <Calendar size={15} /> },
    { label: 'E-Logbook', icon: <FileText size={15} /> },
    { label: 'Attendance Register', icon: <CalendarCheck size={15} /> },
    { label: 'POS', icon: <ShoppingBag size={15} /> },
    { label: 'Academic Reporting', icon: <GraduationCap size={15} /> },
    { label: 'Performance Analytics', icon: <BarChart3 size={15} /> },
    { label: 'Newsletters', icon: <Mail size={15} /> },
    { label: 'E-Schemes', icon: <FileSpreadsheet size={15} /> },
    { label: 'Hostel Roll Call Register', icon: <Home size={15} /> },
  ];

  const faqs = [
    {
      q: 'How much does Pedo cost?',
      a: 'Free for one full term! After that, it is just $0.20 per student per month. For example, a school with 100 students pays only $20/month. There are zero setup fees, no annual lock-in contracts, and no hidden charges.',
    },
    {
      q: 'Do parents or teachers need to install an app?',
      a: 'No app download is required. Everything integrates with WhatsApp — parents receive fee statements, payment receipts, attendance alerts, and end-of-term report cards directly on the number they already use every day.',
    },
    {
      q: 'Does it support ZIMSEC and Cambridge grading structures?',
      a: 'Yes, absolutely. The system supports full ZIMSEC (Distinction, Merit, Credit, Pass, Ungraded) and Cambridge grading scales. You can enter coursework (/30), mid-term (/30), and final examinations (/40) with automated grade cards.',
    },
    {
      q: 'Can Pedo replace Sage Pastel for school accounting?',
      a: 'Yes, with our integrated Financials & Accounting module. It provides full double-entry ledger bookkeeping, bank reconciliation for CBZ/Stanbic/FBC/CABS, EcoCash integration, and audited fee clearance reports.',
    },
    {
      q: 'How quickly can our school get started?',
      a: 'Most schools in Zimbabwe are operational within 24 hours. You can import existing student rosters, assign teachers, set fee levy structures, and begin taking attendance immediately.',
    },
  ];

  return (
    <div className="pedo-home-wrapper">
      {/* ── FLOATING PILL NAVBAR ───────────────────────────────────────── */}
      <nav className={`pedo-floating-navbar ${isScrolled ? 'scrolled' : ''}`}>
        {/* Logo */}
        <div className="navbar-brand-section" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}>
          <div className="navbar-logo-dot" />
          <div className="navbar-brand-name">
            <span className="brand-primary">Pedo</span>
            <span className="brand-accent"> Zim</span>
          </div>
        </div>

        {/* Desktop links */}
        <div className="navbar-nav-links">
          <button className={`navbar-link ${activeSection === 'home' ? 'active' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
          <button className={`navbar-link ${activeSection === 'features' ? 'active' : ''}`} onClick={() => scrollToSection('features')}>Features</button>
          <button className={`navbar-link ${activeSection === 'pricing' ? 'active' : ''}`} onClick={() => scrollToSection('pricing')}>Pricing</button>
          <button className={`navbar-link ${activeSection === 'faq' ? 'active' : ''}`} onClick={() => scrollToSection('faq')}>FAQ & News</button>
        </div>

        {/* CTA + hamburger */}
        <div className="navbar-cta-section">
          <button className="btn-navbar-get-started" onClick={() => onEnterPortal('dashboard')}>Get Started</button>
          <button className="navbar-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <span className={`ham-line ${mobileMenuOpen ? 'open-1' : ''}`} />
            <span className={`ham-line ${mobileMenuOpen ? 'open-2' : ''}`} />
            <span className={`ham-line ${mobileMenuOpen ? 'open-3' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <button className="navbar-mobile-link" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}>Home</button>
          <button className="navbar-mobile-link" onClick={() => scrollToSection('features')}>Features</button>
          <button className="navbar-mobile-link" onClick={() => scrollToSection('pricing')}>Pricing</button>
          <button className="navbar-mobile-link" onClick={() => scrollToSection('faq')}>FAQ & News</button>
          <button className="navbar-mobile-cta"  onClick={() => { onEnterPortal('dashboard'); setMobileMenuOpen(false); }}>Get Started →</button>
        </div>
      )}

      {/* ── FIXED SOCIAL SIDEBAR ──────────────────────────────────────── */}
      <aside className="social-sidebar" aria-label="Social media links">
        <span className="social-sidebar-label">FOLLOW US</span>
        <div className="social-sidebar-line" />
        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="social-sidebar-icon" aria-label="Follow Pedo Zim on LinkedIn" title="LinkedIn">
          {/* LinkedIn icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" className="social-sidebar-icon" aria-label="Follow Pedo Zim on Facebook" title="Facebook">
          {/* Facebook icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
      </aside>

      {/* =================================================================
          3. HERO SECTION (EXACT DISPLAY FROM USER UPLOADED SCREENSHOT)
             Left: Headline + Subtitle + 12 Feature Pills
             Right: Interactive Role Login Card
         ================================================================= */}
      <section className="hero-fundah-display">
        <div className="hero-fundah-container">
          {/* Left Column: Heading & 12 Feature Pills */}
          <div className="hero-fundah-left">
            <div className="hero-tagline-badge">One Platform, Every School Need</div>
            <h1 className="hero-fundah-title">
              All-in-one School Management for <span className="highlight-color">Modern Schools</span>
            </h1>

            <p className="hero-shona-motto">
              Dzidzo Yakanaka, Ramangwana Rakanaka!
            </p>

            <p className="hero-fundah-subtitle">
              Empowering schools with smart technology to simplify administration, enhance learning,
              and build a brighter future for every learner.
            </p>

            <p className="hero-shona-closer">
              Pamwe chete tinovaka ramangwana rakanaka! Together we build a bright future.
            </p>

            {/* 12 Feature Badges Grid */}
            <div className="hero-feature-pills-grid">
              {featurePills.map((pill, idx) => (
                <div
                  key={idx}
                  className="hero-pill-badge"
                  onClick={() => onEnterPortal('dashboard')}
                  title={`Open ${pill.label}`}
                >
                  <span className="pill-badge-icon">{pill.icon}</span>
                  <span className="pill-badge-text">{pill.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Login Card from Screenshot */}
          <div className="hero-fundah-right">
            <div className="hero-login-card">
              {/* Role Switcher Tabs */}
              <div className="login-role-tabs">
                <button
                  type="button"
                  className={`role-tab-btn ${selectedRole === 'staff' ? 'active' : ''}`}
                  onClick={() => handleRoleTabChange('staff')}
                >
                  <Briefcase size={14} />
                  <span>School Staff</span>
                </button>

                <button
                  type="button"
                  className={`role-tab-btn ${selectedRole === 'student' ? 'active' : ''}`}
                  onClick={() => handleRoleTabChange('student')}
                >
                  <BookOpen size={14} />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  className={`role-tab-btn ${selectedRole === 'parent' ? 'active' : ''}`}
                  onClick={() => handleRoleTabChange('parent')}
                >
                  <User size={14} />
                  <span>Parent</span>
                </button>

                <button
                  type="button"
                  className={`role-tab-btn ${selectedRole === 'org' ? 'active' : ''}`}
                  onClick={() => handleRoleTabChange('org')}
                >
                  <ShieldCheck size={14} />
                  <span>Org Member</span>
                </button>
              </div>

              {/* Login Header */}
              <div className="login-card-header">
                <h2 className="login-card-title">Welcome back</h2>
                <p className="login-card-subtitle">Sign in to your Pedo account</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="login-card-form">
                <div className="login-input-group">
                  <User size={18} className="login-input-icon" />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={selectedRole === 'parent' ? 'Phone number' : 'Email address'}
                    required
                    className="login-field"
                  />
                </div>

                <div className="login-input-group">
                  <Lock size={18} className="login-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="login-field"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="login-forgot-row">
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); onEnterPortal('dashboard'); }} className="login-forgot-link">
                    Forgot Password?
                  </a>
                </div>

                <button type="submit" className="login-submit-btn">
                  <span>Login</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          4. "WHO WE ARE" SECTION (Solid #2c5f8d and White)
         ================================================================= */}
      <section id="about" className="section-who-we-are">
        <div className="who-we-are-container">
          <div className="who-we-are-left">
            <div className="section-kicker">WHO WE ARE</div>
            <h2 className="who-we-are-title">School Management for Zimbabwe</h2>
            <p className="who-we-are-desc">
              Zimbabwean schools deserve better than spreadsheets and paper registers. Pedo puts
              students, fees, accounting, and report cards in one platform - on WhatsApp, where your
              parents and teachers already are.
            </p>

            <div className="who-we-are-divider" />

            <div className="stats-strip-3col">
              <div className="stat-col">
                <div className="stat-col-val">$0.20</div>
                <div className="stat-col-lbl">PER STUDENT / MONTH</div>
              </div>
              <div className="stat-col-sep" />
              <div className="stat-col">
                <div className="stat-col-val">1 Term</div>
                <div className="stat-col-lbl">COMPLETELY FREE</div>
              </div>
              <div className="stat-col-sep" />
              <div className="stat-col">
                <div className="stat-col-val">WhatsApp</div>
                <div className="stat-col-lbl">NO APP NEEDED</div>
              </div>
            </div>
          </div>

          {/* Right Brand Card */}
          <div className="who-we-are-right">
            <div className="who-we-are-brand-card">
              <div className="brand-card-inner">
                <img src="/school-icon.svg" alt="Pedo Zim logo" className="brand-card-logo" />
                <div className="brand-card-title">
                  <span className="brand-word-dark">Pedo</span> <span className="brand-word-accent">Zim</span>
                </div>
                <div className="brand-card-tagline">Dzidzo Yakanaka, Ramangwana Rakanaka!</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          5. "FLEXIBLE AND MODULAR" ADD-ONS & FEATURES (#2c5f8d & White)
         ================================================================= */}
      <section id="features" className="section-modules">
        <div className="modules-header">
          <div className="section-kicker">FLEXIBLE AND MODULAR</div>
          <h2 className="modules-title">Add-ons - Only Pay for What You Need</h2>
          <p className="modules-desc">
            The core platform covers attendance, fees, grades, messaging, and reports for every school. Add-on
            modules extend the system for schools that need more - activated in your settings, billed monthly,
            cancelled any time.
          </p>
        </div>

        {/* Feature Showcase 1: Accounting */}
        <div className="feature-showcase-row">
          <div className="feature-image-card">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80"
              alt="School Accounting on Tablet"
            />
          </div>

          <div className="feature-content-card">
            <span className="module-badge">ACCOUNTING</span>
            <h3 className="feature-heading">Replace Sage Pastel with one connected system</h3>
            <p className="feature-p">
              Stop entering the same data twice. Pedo automatically posts fee payments into your accounts,
              combining fee management and full accounting in one system.
            </p>

            <div className="feature-checklist">
              <div className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>Trial balance, income statement, and balance sheet</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>Bank reconciliation against your payment records</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>Expense tracking by department or cost centre</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>End-of-year reports ready for your auditor or board</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Showcase 2: WhatsApp First */}
        <div id="whatsapp" className="feature-showcase-row reverse">
          <div className="feature-content-card">
            <span className="module-badge">WHATSAPP FIRST</span>
            <h3 className="feature-heading">Zero App Downloads. Direct WhatsApp Integration.</h3>
            <p className="feature-p">
              Parents communicate where they are already comfortable. Send daily attendance alerts,
              EcoCash payment receipts, and Cambridge or ZIMSEC terminal report cards in real-time.
            </p>

            <div className="feature-checklist">
              <div className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>Automated daily attendance alerts sent to guardians</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>EcoCash and bank payment receipts delivered on WhatsApp</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>Official ZIMSEC & Cambridge PDF terminal report cards</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>Instant school-wide broadcasting for announcements</span>
              </div>
            </div>
          </div>

          <div className="feature-image-card">
            <img
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80"
              alt="WhatsApp Communication for Zimbabwean Schools"
            />
          </div>
        </div>
      </section>

      {/* =================================================================
          6. CALL TO ACTION BANNER (in #2c5f8d and White)
         ================================================================= */}
      <section className="section-cta-banner">
        <p className="cta-banner-sub">Your first full term is free - no demo call, no card.</p>
        <button className="btn-get-started-cta" onClick={() => onEnterPortal('dashboard')}>
          Get Started for Free →
        </button>
        <div className="cta-banner-note">
          Built for ECD, Primary, and Secondary schools across Zimbabwe — just $0.20 per student per month after your free term
        </div>
      </section>

      {/* =================================================================
          7. TRANSPARENT PRICING CALCULATOR (#2c5f8d & White)
         ================================================================= */}
      <section id="pricing" className="section-pricing">
        <div className="pricing-container">
          <div className="pricing-header">
            <h2 className="pricing-title">Simple, Transparent Pricing</h2>
            <p className="pricing-sub">No hidden fees. No surprises. Just honest pricing.</p>
          </div>

          <div className="pricing-calculator-card">
            <div className="calculator-grid">
              <div className="calculator-left">
                <label className="calculator-label">Adjust Your Student Enrollment:</label>
                <div className="slider-wrapper">
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="10"
                    value={studentCount}
                    onChange={(e) => setStudentCount(parseInt(e.target.value))}
                    className="enrollment-slider"
                  />
                  <div className="enrollment-display">
                    <span className="count-num">{studentCount}</span>
                    <span className="count-lbl">students</span>
                  </div>
                </div>

                <div className="calculator-checklist">
                  <div className="calc-item">
                    <CheckCircle2 size={16} className="check-colored" /> Full Term 100% Free Trial
                  </div>
                  <div className="calc-item">
                    <CheckCircle2 size={16} className="check-colored" /> WhatsApp Parent Notifications included
                  </div>
                  <div className="calc-item">
                    <CheckCircle2 size={16} className="check-colored" /> ZIMSEC Terminal Report Card Generation
                  </div>
                  <div className="calc-item">
                    <CheckCircle2 size={16} className="check-colored" /> Unlimited Teacher & Admin Accounts
                  </div>
                </div>
              </div>

              <div className="calculator-right-box">
                <div className="calc-box-tag">Estimated Monthly Investment</div>
                <div className="calc-box-price">
                  ${calculatedMonthly} <span className="calc-box-period">USD/mo</span>
                </div>
                <div className="calc-box-free-note">First 3 Months: $0.00 (Free Term)</div>
                <button className="btn-calculator-cta" onClick={() => onEnterPortal('dashboard')}>
                  Enter School System Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          8. FREQUENTLY ASKED QUESTIONS
         ================================================================= */}
      <section id="faq" className="section-faq">
        <div className="faq-container">
          <div className="faq-header">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <p className="faq-sub">Everything you need to know about adopting Pedo Zim in your school.</p>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item-card">
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <span className={`faq-chevron ${activeFaq === idx ? 'open' : ''}`}>›</span>
                </button>

                {activeFaq === idx && (
                  <div className="faq-answer-panel">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="faq-more-link">
            <span onClick={() => scrollToSection('about')}>Read all frequently asked questions →</span>
          </div>
        </div>
      </section>

      {/* =================================================================
          9. FOOTER (#2c5f8d and White)
         ================================================================= */}
      <footer className="pedo-footer-main">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <div className="footer-brand-text">
                <span className="footer-brand-name">Pedo</span>
                <span className="footer-brand-accent">Zim</span>
              </div>
            </div>
            <p className="footer-mission-desc">
              Pedo Zim School Management System is a powerful, all-in-one platform built for
              Zimbabwean schools to manage students, fees, accounting, and daily operations - with one
              full term free to experience the difference.
            </p>
            <div className="footer-social-heading">Our Social Channels</div>
            <div className="footer-social-row">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-box" title="LinkedIn">
                in
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-box" title="Facebook">
                f
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Product</h4>
            <ul className="footer-links-list">
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#about">News</a></li>
              <li onClick={() => onEnterPortal('dashboard')} style={{ cursor: 'pointer' }}>Get Started</li>
            </ul>
          </div>

          {/* Features Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Features</h4>
            <ul className="footer-links-list">
              <li>WhatsApp for Schools</li>
              <li>Fees Management</li>
              <li>School Accounting</li>
              <li>Report Cards</li>
              <li>EcoCash Payments</li>
              <li>ZIMSEC Grading and Exams</li>
              <li>For Secondary Schools</li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Legal</h4>
            <ul className="footer-links-list">
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-links-list">
              <li>About Us</li>
              <li>Contact</li>
              <li><a href="mailto:support@pedo.ac.zw">support@pedo.ac.zw</a></li>
              <li><a href="https://wa.me/263781648526">+263 78 164 8526</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          © 2026 Pedo Zim. All rights reserved. Capstone Project by Pelagia Svare.
        </div>
      </footer>

      {/* Floating Action WhatsApp Button at Bottom-Right */}
      <button
        className="floating-action-fab"
        onClick={() => window.open('https://wa.me/263781648526?text=Hello%20Pedo%20Zim,%20I%20have%20an%20inquiry', '_blank')}
        title="WhatsApp Support"
      >
        <MessageSquare size={22} />
      </button>
    </div>
  );
};
