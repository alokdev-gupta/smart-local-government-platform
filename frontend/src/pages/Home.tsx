import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const certificateTypes = [
  { id: 'birth', icon: '👶', label: 'Birth Certificate', desc: 'For newborns and registration', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30' },
  { id: 'citizenship', icon: '🪪', label: 'Citizenship', desc: 'Nepali citizenship document', color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30' },
  { id: 'residence', icon: '🏠', label: 'Residence', desc: 'Proof of residence certificate', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30' },
  { id: 'marriage', icon: '💍', label: 'Marriage', desc: 'Marriage registration certificate', color: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-500/30' },
  { id: 'death', icon: '📋', label: 'Death Certificate', desc: 'Official death registration', color: 'from-slate-500/20 to-slate-600/10', border: 'border-slate-500/30' },
  { id: 'income', icon: '💰', label: 'Income Certificate', desc: 'Proof of income document', color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30' },
  { id: 'character', icon: '⭐', label: 'Character Certificate', desc: 'Good conduct certificate', color: 'from-teal-500/20 to-teal-600/10', border: 'border-teal-500/30' },
];

const stats = [
  { label: 'Applications Processed', value: '24,500+', icon: '📋' },
  { label: 'Certificates Issued', value: '18,200+', icon: '🎖️' },
  { label: 'Registered Citizens', value: '9,800+', icon: '👥' },
  { label: 'Municipalities Served', value: '15+', icon: '🏛️' },
];

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-90" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59,130,246,0.4) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(5,150,105,0.4) 0%, transparent 50%)`,
          }}
        />
        {/* Animated particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-bounce-soft opacity-60" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-emerald-400 rounded-full animate-bounce-soft opacity-40"
             style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce-soft opacity-50"
             style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20
                          rounded-full px-4 py-2 text-sm text-blue-200 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Nepal Government Digital Services Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight animate-slide-up">
            स्मार्ट सरकार
            <br />
            <span className="text-gradient text-4xl sm:text-5xl lg:text-6xl font-bold">
              Smart Government Services
            </span>
          </h1>

          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 animate-slide-up"
             style={{ animationDelay: '0.1s' }}>
            Apply for government certificates online. Real-time tracking, AI-assisted forms,
            and instant digital delivery — right from your home.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {isAuthenticated ? (
              user?.role === 'admin' ? (
                <>
                  <Link to="/admin" className="btn-primary text-base px-8 py-4">
                    🛡️ Admin Dashboard
                  </Link>
                  <Link to="/admin/applications" className="btn-outline text-base px-8 py-4">
                    📋 Manage Applications
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/apply" className="btn-primary text-base px-8 py-4">
                    🚀 Apply for Certificate
                  </Link>
                  <Link to="/dashboard" className="btn-outline text-base px-8 py-4">
                    📊 My Dashboard
                  </Link>
                </>
              )
            ) : (
              <>
                <Link to="/register" className="btn-primary text-base px-8 py-4">
                  🎉 Get Started Free
                </Link>
                <Link to="/login" className="btn-outline text-base px-8 py-4">
                  🔑 Sign In
                </Link>
              </>
            )}
          </div>

          {isAuthenticated && user && (
            <p className="mt-6 text-blue-200 text-sm animate-fade-in">
              Welcome back, <span className="font-semibold text-white">{user.fullName}</span>! 👋
            </p>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Types */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">
            Available <span className="text-gradient">Certificates</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Apply for any government certificate online. Our AI-assisted forms make the process quick and easy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {certificateTypes.map((cert) => (
            <Link
              key={cert.id}
              to={isAuthenticated ? `/apply?type=${cert.id}` : '/register'}
              className={`glass-card-dark p-6 border ${cert.border} hover:border-opacity-60
                          hover:-translate-y-1 transition-all duration-300 hover:shadow-card-hover group`}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cert.color} border ${cert.border}
                              flex items-center justify-center text-2xl mb-4
                              group-hover:scale-110 transition-transform duration-300`}>
                {cert.icon}
              </div>
              <h3 className="font-semibold text-white mb-1">{cert.label}</h3>
              <p className="text-slate-400 text-sm">{cert.desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-primary-400 text-xs font-medium">
                Apply Now
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-slate-400">Three simple steps to get your certificate</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600" />

            {[
              { step: '01', icon: '📝', title: 'Fill Smart Form', desc: 'Our AI assists you in filling out the application form accurately and quickly.' },
              { step: '02', icon: '📤', title: 'Upload Documents', desc: 'Securely upload required documents. We support all standard formats.' },
              { step: '03', icon: '🎖️', title: 'Get Certificate', desc: 'Receive your approved certificate digitally. Download anytime, anywhere.' },
            ].map((step) => (
              <div key={step.step} className="text-center relative">
                <div className="w-24 h-24 rounded-2xl bg-gov-gradient flex flex-col items-center justify-center
                                mx-auto mb-6 shadow-glow-blue relative z-10">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="text-xs font-bold text-blue-200 mt-1">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="glass-card-dark p-12 border border-primary-800/40 bg-gov-gradient/10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Go Digital? 🚀
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                Join thousands of citizens who are already using Smart Gov Nepal for their certificate needs.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/register" className="btn-primary text-base px-10 py-4">
                  Create Free Account
                </Link>
                <Link to="/login" className="btn-outline text-base px-10 py-4">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🇳🇵</span>
            <span className="font-bold text-white">Smart Gov Nepal</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 Government of Nepal — Smart Local Government Platform. All rights reserved.
          </p>
          <div className="flex gap-6 justify-center mt-4">
            <Link to="/terms" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Terms</Link>
            <Link to="/privacy" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacy</Link>
            <Link to="/verify/CERT-DEMO-2024-000001" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Verify Certificate</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
