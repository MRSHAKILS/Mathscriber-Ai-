'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, ChevronDown, ChevronUp, Zap, Shield, Clock, Crown } from 'lucide-react';
import Navbar from '@/components/home/NavbarNew';
import Footer from '@/components/home/Footer';

export default function PricingPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay."
        },
        {
            question: "Can I cancel my subscription at any time?",
            answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period."
        },
        {
            question: "Is there a limit to how many files I can convert?",
            answer: "The Free plan has a limit of 10 conversions per day. The Pro plan offers unlimited conversions."
        },
        {
            question: "Do you offer student discounts?",
            answer: "Yes! Students with a valid .edu email address can get 50% off the Pro plan. Contact support for details."
        }
    ];

    const features = [
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Get your LaTeX code in seconds with our advanced AI processing."
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your data is encrypted and automatically deleted after processing."
        },
        {
            icon: Clock,
            title: "24/7 Availability",
            description: "Our systems are always online, ready whenever you need them."
        },
        {
            icon: Crown,
            title: "Premium Quality",
            description: "Industry-leading accuracy for complex mathematical equations."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-20">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[100px] -z-10" />

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
                    >
                        Simple, Transparent <br />
                        <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                            Pricing Plans
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Choose the perfect plan for your mathematical needs. No hidden fees.
                    </motion.p>
                </section>

                {/* Pricing Cards */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
                        >
                            <h3 className="text-2xl font-bold mb-2">Free Starter</h3>
                            <p className="text-gray-400 mb-6">Perfect for trying out MathScriber</p>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-black">$0</span>
                                <span className="text-gray-400 ml-2">/month</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check className="w-5 h-5 text-green-500" /> 10 Conversions/day
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check className="w-5 h-5 text-green-500" /> Basic OCR Accuracy
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check className="w-5 h-5 text-green-500" /> Export to LaTeX
                                </li>
                                <li className="flex items-center gap-3 text-gray-500">
                                    <X className="w-5 h-5" /> Priority Support
                                </li>
                                <li className="flex items-center gap-3 text-gray-500">
                                    <X className="w-5 h-5" /> Handwriting Recognition
                                </li>
                            </ul>

                            <button className="w-full py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 transition-all text-white">
                                Get Started Free
                            </button>
                        </motion.div>

                        {/* Pro Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative p-8 rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-900/20 to-black backdrop-blur-xl group"
                        >
                            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-orange-500 to-red-600 opacity-20 group-hover:opacity-40 transition-opacity -z-10" />
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                                MOST POPULAR
                            </div>

                            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                Pro Unlimited <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            </h3>
                            <p className="text-gray-400 mb-6">For students and professionals</p>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-black">$9.99</span>
                                <span className="text-gray-400 ml-2">/month</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 rounded-full bg-green-500/20 text-green-500"><Check className="w-3 h-3" /></div>
                                    Unlimited Conversions
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 rounded-full bg-green-500/20 text-green-500"><Check className="w-3 h-3" /></div>
                                    Highest Accuracy (GPT-4o)
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 rounded-full bg-green-500/20 text-green-500"><Check className="w-3 h-3" /></div>
                                    Handwriting Recognition
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 rounded-full bg-green-500/20 text-green-500"><Check className="w-3 h-3" /></div>
                                    Priority Support
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 rounded-full bg-green-500/20 text-green-500"><Check className="w-3 h-3" /></div>
                                    Early Access to Features
                                </li>
                            </ul>

                            <button className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-white shadow-lg shadow-orange-500/25 transition-all transform hover:scale-[1.02]">
                                Upgrade to Pro
                            </button>
                        </motion.div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MathScriber?</h2>
                        <p className="text-gray-400">Experience the future of mathematical documentation</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-400">Everything you need to know about our pricing</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-semibold">{faq.question}</span>
                                    {openFaqIndex === index ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                <div
                                    className={`px-6 overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
                                        }`}
                                >
                                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
