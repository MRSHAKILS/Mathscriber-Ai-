'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TestimonialsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Mathematics Professor',
      institution: 'Stanford University',
      avatar: 'SC',
      rating: 5,
      text: 'MathScriber has revolutionized how I prepare lecture materials. The accuracy is remarkable, and being able to convert diagrams to TikZ saves me hours every week.',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      name: 'Alex Johnson',
      role: 'PhD Candidate',
      institution: 'MIT',
      avatar: 'AJ',
      rating: 5,
      text: 'As a researcher, I deal with complex equations daily. MathScriber\'s multiple AI model approach ensures I always get the best results. The live camera feature is a game-changer!',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      name: 'Prof. Michael Brown',
      role: 'Physics Department Head',
      institution: 'Cambridge University',
      avatar: 'MB',
      rating: 5,
      text: 'We\'ve adopted MathScriber across our department. The ability to scan handwritten notes and instantly convert them to LaTeX has improved our documentation workflow tremendously.',
      gradient: 'from-green-400 to-emerald-400'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Graduate Student',
      institution: 'ETH Zurich',
      avatar: 'ER',
      rating: 5,
      text: 'The free tier is incredibly generous! I can convert my handwritten math homework to LaTeX without any cost. The accuracy is better than any other tool I\'ve tried.',
      gradient: 'from-orange-400 to-red-400'
    },
    {
      name: 'Dr. James Lee',
      role: 'Research Scientist',
      institution: 'Google AI',
      avatar: 'JL',
      rating: 5,
      text: 'MathScriber\'s API integration is seamless. We use it in our research pipeline to process thousands of mathematical expressions daily. Highly recommended for automation!',
      gradient: 'from-indigo-400 to-purple-400'
    },
    {
      name: 'Sophie Martin',
      role: 'Undergraduate Student',
      institution: 'Harvard University',
      avatar: 'SM',
      rating: 5,
      text: 'I love the drawing interface! It makes it so easy to sketch out equations and get instant LaTeX. Perfect for study notes and assignments. The dark mode is beautiful too!',
      gradient: 'from-pink-400 to-rose-400'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-900 via-red-950/50 to-black relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"> Researchers & Students</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied users worldwide
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="testimonials-swiper pb-16"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-red-500/30 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-red-400 opacity-50" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-gray-300 mb-6 flex-grow leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Author info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      <p className="text-gray-500 text-xs">{testimonial.institution}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '500+', label: 'Institutions' },
            { value: '1M+', label: 'Conversions' },
            { value: '4.9/5', label: 'Rating' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .testimonials-swiper .swiper-button-next,
        .testimonials-swiper .swiper-button-prev {
          color: #f87171;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .testimonials-swiper .swiper-button-next:after,
        .testimonials-swiper .swiper-button-prev:after {
          font-size: 20px;
        }

        .testimonials-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          width: 12px;
          height: 12px;
        }

        .testimonials-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(to right, #dc2626, #ea580c);
          width: 32px;
          border-radius: 6px;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
