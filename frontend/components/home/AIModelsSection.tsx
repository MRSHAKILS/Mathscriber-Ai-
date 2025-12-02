'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, X, Minus } from 'lucide-react';

const AIModelsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const comparisonData = [
    {
      feature: 'Multiple AI Models',
      mathscriber: true,
      competitor1: false,
      competitor2: false
    },
    {
      feature: 'Diagram to TikZ',
      mathscriber: true,
      competitor1: false,
      competitor2: false
    },
    {
      feature: 'Live Camera Scanner',
      mathscriber: true,
      competitor1: 'partial',
      competitor2: false
    },
    {
      feature: 'Drawing Interface',
      mathscriber: true,
      competitor1: false,
      competitor2: false
    },
    {
      feature: 'Dark Mode & Modern UI',
      mathscriber: true,
      competitor1: 'partial',
      competitor2: false
    }
  ];

  const getIcon = (value: boolean | string) => {
    if (value === true) return <Check className="w-6 h-6 text-green-500" />;
    if (value === 'partial') return <Minus className="w-6 h-6 text-yellow-500" />;
    return <X className="w-6 h-6 text-red-500" />;
  };

  return (
    <section id="comparison" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"> MathScriber?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compare our features with other tools in the market
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-900/50 to-orange-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 uppercase tracking-wider">
                    MathScriber
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Mathpix
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Generic Tools
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {comparisonData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getIcon(row.mathscriber)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getIcon(row.competitor1)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getIcon(row.competitor2)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {[
            { label: 'Accuracy Rate', value: '97.3%', color: 'from-green-400 to-emerald-600' },
            { label: 'Avg. Processing Time', value: '2.4s', color: 'from-blue-400 to-cyan-600' },
            { label: 'Supported Models', value: '11+', color: 'from-purple-400 to-pink-600' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-300 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AIModelsSection;
