// pages/results/[id].js - Fixed results page to prevent build errors
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Results() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    // Simulate loading results based on ID
    const loadResults = () => {
      try {
        // In a real app, you'd fetch from database/API
        // For now, show a placeholder
        setResults({
          id: id,
          story: 'Sample story...',
          images: [],
          generatedAt: new Date().toISOString()
        });
      } catch (err) {
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    // Add delay to simulate API call
    setTimeout(loadResults, 1000);
  }, [id]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Results - Tiger True Crime</title>
        </Head>
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-300">Loading results...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error - Tiger True Crime</title>
        </Head>
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl text-red-500 mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-400 mb-2">Error Loading Results</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              Return Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Results - Tiger True Crime</title>
      </Head>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-400 mb-4">
              🐅 Generation Results
            </h1>
            <p className="text-gray-300">Result ID: {id}</p>
          </div>

          {results && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-orange-300 mb-4">
                Generation Complete
              </h2>
              <p className="text-gray-300 mb-4">
                Generated at: {new Date(results.generatedAt).toLocaleString()}
              </p>
              <div className="text-center">
                <button
                  onClick={() => router.push('/')}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold"
                >
                  Create New Generation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// This prevents the prerender error
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      id: params?.id || null,
    },
    // Revalidate every hour
    revalidate: 3600,
  };
}