'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Navbar from '@/components/home/NavbarNew';
import Footer from '@/components/home/Footer';
import { 
  Sparkles, 
  Target, 
  Lightbulb, 
  Cog, 
  CheckCircle,
  Brain,
  Code,
  Database,
  Rocket,
  Users,
  Award,
  Clock,
  Zap
} from 'lucide-react';

const timelineData = [
  {
    week: 'Week 1',
    title: 'Foundation & Research',
    color: 'from-red-500 to-orange-500',
    iconColor: '#f97316',
    icon: Lightbulb,
    items: [
      'Complete project requirements analysis and LaTeX pain point identification',
      'Finalize tech stack: Django, Next.js, PostgreSQL, Tailwind CSS',
      'Set up GitHub repository, project structure, and development environment',
      'Create wireframes and UI/UX mockups for all core pages'
    ]
  },
  {
    week: 'Week 2',
    title: 'Core OCR Pipeline Development',
    color: 'from-orange-500 to-yellow-500',
    iconColor: '#eab308',
    icon: Cog,
    items: [
      'Build equation OCR pipeline: Image preprocessing → AI model integration → LaTeX output',
      'Integrate GPT-4o, Gemini 2.0 Flash, and Groq models for equation conversion',
      'Implement file upload system with support for images and PDFs',
      'Create responsive frontend for upload page with drag-and-drop functionality'
    ]
  },
  {
    week: 'Week 3',
    title: 'Table & Diagram Intelligence',
    color: 'from-yellow-500 to-green-500',
    iconColor: '#22c55e',
    icon: Brain,
    items: [
      'Develop table OCR module with grid detection and LaTeX tabular generation',
      'Implement diagram conversion pipeline using Mistral Pixtral and DeepSeek',
      'Add drawing canvas feature with JavaScript Canvas API for freehand input',
      'Create model selection interface allowing users to choose AI backends'
    ]
  },
  {
    week: 'Week 4',
    title: 'LaTeX Editor & Compilation',
    color: 'from-green-500 to-cyan-500',
    iconColor: '#06b6d4',
    icon: Code,
    items: [
      'Build integrated LaTeX editor with syntax highlighting and live preview',
      'Implement pdflatex compiler integration for instant PDF generation',
      'Add user authentication system with secure login and registration',
      'Create results history page with conversion tracking and snippet library'
    ]
  },
  {
    week: 'Week 5',
    title: 'Testing, Optimization & Deployment',
    color: 'from-cyan-500 to-blue-500',
    iconColor: '#3b82f6',
    icon: Rocket,
    items: [
      'Conduct comprehensive beta testing with 50+ students and researchers',
      'Optimize AI prompts for 97%+ accuracy across equations, tables, and diagrams',
      'Implement responsive design testing and cross-browser compatibility',
      'Deploy to production server and prepare final project documentation'
    ]
  }
];

const teamMembers = [
  {
    initials: 'SA',
    name: 'Shakil Ahmed',
    role: 'Project Lead & AI Developer',
    description: 'Expertise in project leadership and AI development with a focus on multi-modal pipelines.',
    id: '2221453042',
    gradient: 'from-red-500 to-orange-500'
  },
  {
    initials: 'MS',
    name: 'Md Sahadat Hossain',
    role: 'Full-Stack Engineer',
    description: 'Specializing in Django backend development and seamless frontend integration.',
    id: '2232195642',
    gradient: 'from-orange-500 to-yellow-500'
  },
  {
    initials: 'KR',
    name: 'Khan Raiyan Ibne Reza',
    role: 'AI & Research Specialist',
    description: 'Advanced technical and scientific research with focus on AI model optimization.',
    id: '2221236642',
    gradient: 'from-yellow-500 to-green-500'
  },
  {
    initials: 'MF',
    name: 'Mutasim Fuad Sarker',
    role: 'UI/UX Designer & Frontend Developer',
    description: 'User-centric design with expertise in creating intuitive and responsive interfaces.',
    id: '2221460642',
    gradient: 'from-green-500 to-cyan-500'
  }
];

const stats = [
  { value: '97.3%', label: 'Accuracy Rate', icon: Target },
  { value: '5+', label: 'AI Models', icon: Brain },
  { value: '2.4s', label: 'Avg. Conversion', icon: Clock },
  { value: '500+', label: 'Users', icon: Users }
];

const techStack = [
  { name: 'Multi-Modal AI', desc: 'Vision + Code Generation', icon: Brain, color: 'from-red-500 to-orange-500' },
  { name: 'Django & Next.js', desc: 'Full-stack Framework', icon: Code, color: 'from-orange-500 to-yellow-500' },
  { name: 'PostgreSQL', desc: 'Reliable Database', icon: Database, color: 'from-yellow-500 to-green-500' },
  { name: 'LaTeX Engine', desc: 'Instant Preview', icon: Zap, color: 'from-green-500 to-cyan-500' }
];

const aiModels = ['GPT-4o', 'Gemini 2.0 Flash', 'Groq', 'Mistral', 'DeepSeek'];

function AnimatedTimelineItem({ item, index }: { item: typeof timelineData[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative flex items-start gap-6"
    >
      {/* Timeline Node */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
        className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg shadow-red-500/20 relative z-10`}
      >
        <Icon className="w-7 h-7 text-white" />
      </motion.div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300"
      >
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.5 }}
          className={`inline-block px-4 py-1 mb-3 text-sm font-bold bg-gradient-to-r ${item.color} rounded-full text-white`}
        >
          {item.week}
        </motion.span>
        
        <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
        
        <ul className="space-y-3">
          {item.items.map((text, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              className="flex items-start gap-3 text-gray-300"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: item.iconColor }} />
              <span className="text-sm leading-relaxed">{text}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default function AboutPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-black to-black" />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[100px]"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full border border-red-500/20 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-sm font-semibold text-red-400">CSE 299 Junior Design Project</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6"
            >
              About{' '}
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                MathScriber
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
            >
              Transforming handwritten mathematics into professional LaTeX with cutting-edge AI technology
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-red-500/30 transition-all"
                  >
                    <Icon className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                The Problem We <span className="text-red-400">Solve</span>
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                In STEM fields, LaTeX is the global standard for professional documents, but it comes with a steep learning curve. Research shows it takes approximately{' '}
                <span className="font-bold text-red-400">200 hours of intentional use</span>{' '}
                for a student to become as efficient with LaTeX as they are with handwriting.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                This creates a workflow conflict: users must choose between intuitive WYSIWYG editors with poor equation support or LaTeX with its superior equations but complex table and layout syntax.
              </p>
              
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-l-4 border-red-500 p-4 rounded-r-xl">
                <p className="text-gray-200 italic">
                  &quot;Creating tables in LaTeX is incredibly complex. The number of mistakes skyrocketed for LaTeX users compared to Word users.&quot;
                </p>
                <p className="text-red-400 text-sm mt-2 font-semibold">— PLOS Usability Study</p>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-3xl blur-2xl" />
                <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-700 rounded-2xl p-8 shadow-2xl">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                  <p className="text-red-100 text-lg leading-relaxed mb-6">
                    To unify the typesetting supremacy of LaTeX for equations with the intuitive, visual creation process of modern editors for tables, resolving a central pain point for the entire STEM community.
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Scribble-First Authoring</p>
                      <p className="text-sm text-red-200">Replacing code with visual creation</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/10 to-black" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Project Development{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Timeline
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our 5-week agile development sprint with clear milestones and deliverables
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-yellow-500 to-cyan-500" />
            
            {/* Timeline Items */}
            <div className="space-y-12">
              {timelineData.map((item, index) => (
                <AnimatedTimelineItem key={item.week} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powered by{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Cutting-Edge Technology
              </span>
            </h2>
          </motion.div>

          {/* Tech Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {techStack.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-red-500/30 transition-all"
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-bold text-white text-lg mb-1">{tech.name}</h4>
                  <p className="text-sm text-gray-400">{tech.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* AI Models */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <h3 className="text-xl font-bold text-white mb-6">AI Models We Use</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {aiModels.map((model, i) => (
                <motion.span
                  key={model}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full text-red-300 font-medium"
                >
                  {model}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/10 to-black" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Team
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A dedicated team from the Department of Electrical and Computer Engineering at North South University
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-red-500/30 transition-all"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-2xl font-bold text-white">{member.initials}</span>
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className={`text-sm font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent mb-3`}>
                  {member.role}
                </p>
                <p className="text-sm text-gray-400 mb-3">{member.description}</p>
                <p className="text-xs text-gray-500">ID: {member.id}</p>
              </motion.div>
            ))}
          </div>

          {/* Faculty Advisor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full">
              <Award className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-white">Faculty Advisor: Dr. Shafin Rahman</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/50 via-red-800/30 to-orange-900/50" />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/30 rounded-full blur-[150px]"
        />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to Transform Your Academic Workflow?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of students and researchers who are already saving time with MathScriber&apos;s AI-powered LaTeX conversion.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.a
              href="/upload"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Try Converter Now
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
