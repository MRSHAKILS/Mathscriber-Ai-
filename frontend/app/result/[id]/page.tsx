'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/home/NavbarNew';
import Footer from '@/components/home/Footer';
import ConversionResult from '@/components/ConversionResult';

interface ConversionData {
  id: string;
  username?: string;
  original_filename: string;
  image_url: string;
  latex_code: string;
  conversion_type: string;
  task_type?: string;
  detected_content?: {
    primary: string;
    has_equations: boolean;
    has_tables: boolean;
    has_diagrams: boolean;
  };
  created_at: string;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversion, setConversion] = useState<ConversionData | null>(null);

  useEffect(() => {
    const fetchConversion = async () => {
      try {
        const conversionId = params?.id;
        if (!conversionId) {
          setError('No conversion ID provided');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8000/api/result/${conversionId}/`
        );

        const data = await response.json();

        if (data.success) {
          setConversion(data.data);
        } else {
          setError(data.message || 'Failed to load conversion');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchConversion();
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <Navbar />
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading conversion result...</p>
        </div>
      </div>
    );
  }

  if (error || !conversion) {
    return (
      <div className="flex min-h-screen bg-black flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Conversion Not Found
            </h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              <ArrowLeft size={20} />
              Go Home
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black via-purple-950/10 to-black flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/upload')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Upload
            </button>
            
            <h1 className="text-4xl font-bold text-white mb-2">
              Conversion Result
            </h1>
            <p className="text-gray-400">
              Created on {new Date(conversion.created_at).toLocaleString()}
            </p>
          </div>

          {/* Image Preview */}
          {conversion.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">
                Original Image
              </h2>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 inline-block">
                <img
                  src={conversion.image_url}
                  alt="Original input"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            </motion.div>
          )}

          {/* Conversion Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Detection Results
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Primary Type</p>
                  <p className="text-white font-semibold capitalize">
                    {conversion.detected_content?.primary || conversion.task_type || 'Unknown'}
                  </p>
                </div>
                {conversion.detected_content && (
                  <>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Equations</p>
                      <p className={`font-semibold ${conversion.detected_content.has_equations ? 'text-green-400' : 'text-gray-500'}`}>
                        {conversion.detected_content.has_equations ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Tables</p>
                      <p className={`font-semibold ${conversion.detected_content.has_tables ? 'text-green-400' : 'text-gray-500'}`}>
                        {conversion.detected_content.has_tables ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Diagrams</p>
                      <p className={`font-semibold ${conversion.detected_content.has_diagrams ? 'text-green-400' : 'text-gray-500'}`}>
                        {conversion.detected_content.has_diagrams ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Conversion Result Component */}
      <ConversionResult
        latexCode={conversion.latex_code}
        conversionId={conversion.id}
        detectedContent={conversion.detected_content}
        onSave={async (newCode) => {
          // TODO: Update the conversion in the database
          setConversion({ ...conversion, latex_code: newCode });
        }}
      />

      <Footer />
    </div>
  );
}
