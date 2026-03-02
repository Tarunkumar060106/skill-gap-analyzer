import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, BarChart3, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div style={{ background: 'var(--glass-bg)', padding: '4rem 2rem', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-lg)', maxWidth: '800px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>
          <BookOpen className="text-accent" size={36} />
          <span style={{ background: 'linear-gradient(to right, #66fcf1, #8a2be2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Skill Gap Analyzer
          </span>
        </div>
        
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Bridge the Gap <br/> Between College & Career</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          Evaluate your technical skills, discover areas for improvement, and get personalized learning plans. Verified identity ensures authentic assessments.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link to="/signup" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>Get Started</Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>Login</Link>
        </div>

        <div className="grid grid-cols-3">
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <ShieldCheck size={32} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Verified Students</h3>
            <p className="text-muted">Strict ID verification ensures authentic skill scores.</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <BarChart3 size={32} style={{ color: 'var(--pending)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Skill Analytics</h3>
            <p className="text-muted">Deep insights into your technical and soft skills.</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <TrendingUp size={32} style={{ color: 'var(--accent-primary)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Growth Plans</h3>
            <p className="text-muted">AI-driven learning recommendations for your career.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
