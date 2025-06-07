
import React, { useEffect, useState } from 'react';
import { Code, Database, BarChart3 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 500);
    const timer2 = setTimeout(() => setCurrentStep(2), 1500);
    const timer3 = setTimeout(() => setCurrentStep(3), 2500);
    const timer4 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Main Name Animation */}
        <div className="mb-8">
          <h1 
            className={`text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent transition-all duration-1000 ${
              currentStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            Mahesh
          </h1>
          <div 
            className={`h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-4 transition-all duration-1000 ${
              currentStep >= 1 ? 'w-32 opacity-100' : 'w-0 opacity-0'
            }`}
          />
        </div>

        {/* Subtitle Animation */}
        <div 
          className={`text-xl md:text-2xl text-slate-300 mb-12 transition-all duration-1000 delay-500 ${
            currentStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Data Analysis Portfolio
        </div>

        {/* Icons Animation */}
        <div 
          className={`flex justify-center space-x-8 mb-8 transition-all duration-1000 delay-1000 ${
            currentStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="p-4 bg-blue-600/20 rounded-full backdrop-blur-sm border border-blue-400/30 animate-pulse">
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
            <span className="text-sm text-slate-400">Analytics</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="p-4 bg-purple-600/20 rounded-full backdrop-blur-sm border border-purple-400/30 animate-pulse">
              <Database className="w-8 h-8 text-purple-400" />
            </div>
            <span className="text-sm text-slate-400">Data</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="p-4 bg-green-600/20 rounded-full backdrop-blur-sm border border-green-400/30 animate-pulse">
              <Code className="w-8 h-8 text-green-400" />
            </div>
            <span className="text-sm text-slate-400">Code</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div 
          className={`transition-all duration-1000 delay-1500 ${
            currentStep >= 3 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-64 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: currentStep >= 3 ? '100%' : '0%' }}
            />
          </div>
          <p className="text-slate-400 text-sm mt-4 animate-pulse">Loading Portfolio...</p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-blue-400/30 animate-pulse" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-400/30 animate-pulse" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-400/30 animate-pulse" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-blue-400/30 animate-pulse" />
    </div>
  );
};

export default SplashScreen;
