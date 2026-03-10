import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div style={{ background: 'var(--glass-bg)', padding: '4rem 2rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)', maxWidth: '800px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>
          <BookOpen className="text-primary" size={36} />
          <span style={{ background: 'linear-gradient(to right, #66fcf1, #8a2be2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Skill Gap Analyzer
          </span>
        </div>
        
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Bridge the Gap <br/> Between College & Career</h1>
        <p className="text-muted-foreground" style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          Evaluate your technical skills, discover areas for improvement, and get personalized learning plans. Verified identity ensures authentic assessments.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
            <Link to="/login">Login</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="pt-6 border-none shadow-none bg-secondary/50">
            <CardContent className="text-center">
              <ShieldCheck size={32} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Verified Students</h3>
              <p className="text-muted-foreground text-sm">Strict ID verification ensures authentic skill scores.</p>
            </CardContent>
          </Card>
          <Card className="pt-6 border-none shadow-none bg-secondary/50">
            <CardContent className="text-center">
              <BarChart3 size={32} className="text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Skill Analytics</h3>
              <p className="text-muted-foreground text-sm">Deep insights into your technical and soft skills.</p>
            </CardContent>
          </Card>
          <Card className="pt-6 border-none shadow-none bg-secondary/50">
            <CardContent className="text-center">
              <TrendingUp size={32} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Growth Plans</h3>
              <p className="text-muted-foreground text-sm">AI-driven learning recommendations for your career.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
