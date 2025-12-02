'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Zap } from 'lucide-react';
import Link from 'next/link';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const pricingTiers = [
    {
      name: 'Basic Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for students and casual users',
      features: [
        '3 AI models access',
        '50 conversions/month',
        'Basic LaTeX export',
        'Handwriting recognition',
        'Community support'
      ],
      cta: 'Start Free',
      popular: false,
      gradient: 'from-gray-700 to-gray-800'
    },
    {
      name: 'Pro Academic',
      price: { monthly: 5, annual: 48 },
      description: 'Ideal for researchers and professionals',
      features: [
        'All 11 AI models',
        'Unlimited conversions',
        'Advanced LaTeX + TikZ',
        'Live camera scanner',
        'History & templates',
        'Priority support',
        'Batch processing'
      ],
      cta: 'Get Pro',
      popular: true,
      gradient: 'from-red-600 to-orange-600'
    },
    {
      name: 'Enterprise',
      price: { monthly: 50, annual: 480 },
      description: 'For teams and institutions',
      features: [
        'Everything in Pro',
        'Custom AI model training',
        'API access & integrations',
        'Team collaboration',
        'Advanced analytics',
        'Dedicated support',
        'Custom branding',
        'SLA guarantees'
      ],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-black via-red-950 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"> Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the plan that works best for you
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg font-medium ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <motion.div
                animate={{ x: isAnnual ? 32 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-1 left-1 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg"
              />
            </button>
            <span className={`text-lg font-medium ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="ml-2 px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full border border-green-500/30">
                Save 20%
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border ${
                tier.popular ? 'border-red-500/50' : 'border-white/10'
              } hover:border-red-500/30 transition-all duration-300 ${
                tier.popular ? 'shadow-2xl shadow-red-500/20' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-bold rounded-full shadow-lg">
                    <Zap className="w-4 h-4" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 text-sm">{tier.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                    ${isAnnual ? tier.price.annual : tier.price.monthly}
                  </span>
                  {tier.price.monthly > 0 && (
                    <span className="text-gray-400">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                {isAnnual && tier.price.monthly > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    ${(tier.price.annual / 12).toFixed(2)}/month billed annually
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={tier.name === 'Enterprise' ? '/contact' : '/signup'}>
                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:shadow-lg hover:shadow-red-500/50 hover:scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {tier.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-4">
            Need a custom solution for your institution or team?
          </p>
          <Link href="/contact">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
              Contact Our Sales Team
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
