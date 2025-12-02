import Navbar from '@/components/home/NavbarNew';
import Footer from '@/components/home/Footer';
import { Sparkles, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-black via-red-950/20 to-black overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(239,68,68,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(251,146,60,0.1),transparent_50%)]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">About </span>
                <span className="bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent">MathScriber</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                Transform handwritten mathematical equations into professional LaTeX code with the power of AI.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full border border-red-500/20 mb-6">
                  <Target className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-red-400">Our Mission</span>
                </div>
                <h2 className="text-4xl font-black text-white mb-6">
                  Making Math <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Accessible</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-4">
                  We believe that converting handwritten mathematical notation to digital format shouldn't be a tedious task. 
                  MathScriber leverages cutting-edge AI technology to make this process instant and effortless.
                </p>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Whether you're a student, researcher, or educator, our platform helps you focus on what matters most - 
                  understanding and communicating mathematical concepts.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-3xl opacity-20" />
                <div className="relative bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">98%</div>
                      <div className="text-sm text-gray-400">Accuracy Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">1M+</div>
                      <div className="text-sm text-gray-400">Conversions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">50K+</div>
                      <div className="text-sm text-gray-400">Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">&lt;2s</div>
                      <div className="text-sm text-gray-400">Processing Time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-black via-red-950/10 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4">
                Why Choose <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">MathScriber</span>
              </h2>
              <p className="text-gray-400 text-lg">Powered by advanced AI technology</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Sparkles}
                title="AI-Powered"
                description="Utilizing Google's Gemini 2.0 Flash for state-of-the-art OCR and mathematical understanding."
              />
              <FeatureCard
                icon={Zap}
                title="Lightning Fast"
                description="Get your LaTeX code in seconds. No waiting, no hassle - just instant results."
              />
              <FeatureCard
                icon={Users}
                title="User-Friendly"
                description="Intuitive interface designed for everyone from students to professional mathematicians."
              />
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4">
                Built with <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Cutting-Edge Tech</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TechCard name="Next.js" description="React framework for production" />
              <TechCard name="Gemini 2.0" description="Advanced AI model" />
              <TechCard name="TailwindCSS" description="Modern styling" />
              <TechCard name="Django" description="Robust backend" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-black to-red-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Transform Your <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Math Notes?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of users who are already converting their handwritten math to LaTeX.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/upload"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-500/50 transition-all duration-300"
              >
                Get Started Free
              </a>
              <a 
                href="/#pricing"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-lg rounded-xl border border-white/10 transition-all duration-300"
              >
                View Pricing
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      <div className="relative bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-8 hover:border-red-500/30 transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function TechCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-6 text-center hover:border-red-500/30 transition-all duration-300">
      <h4 className="text-lg font-bold text-white mb-1">{name}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
