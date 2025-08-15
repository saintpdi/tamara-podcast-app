import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

const SimpleApp = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      try {
        // Test if Supabase client can be imported
        import('./integrations/supabase/client').then(() => {
          console.log('✅ Supabase client loaded successfully');
          setIsLoading(false);
        }).catch((error) => {
          console.error('❌ Error loading Supabase client:', error);
          setHasError(true);
          setIsLoading(false);
        });
      } catch (error) {
        console.error('❌ Error during initialization:', error);
        setHasError(true);
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Configuration Error
          </h1>
          <p className="text-gray-600 mb-4">
            There's an issue with the Supabase configuration. Check the console for details.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                SheTalks
              </h1>
              <p className="text-gray-600 mb-6">
                ✅ Basic app structure is working!
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✅ React Router loaded</p>
                <p>✅ TanStack Query loaded</p>
                <p>✅ UI components loaded</p>
                <p>✅ Supabase client initialized</p>
              </div>
              <button
                onClick={() => {
                  // Switch back to full app
                  window.location.href = '/full-app';
                }}
                className="mt-6 w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Continue to Full App
              </button>
            </div>
          </div>
          <Routes>
            <Route path="*" element={<div>Route working</div>} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default SimpleApp;
