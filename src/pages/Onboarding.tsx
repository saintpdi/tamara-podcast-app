
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import InterestSelection from '@/components/InterestSelection';
import CreatorSelection from '@/components/CreatorSelection';
import TagSelection from '@/components/TagSelection';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const totalSteps = 3;
  const progress = (completedSteps.size / totalSteps) * 100;

  const handleStepComplete = (step: number) => {
    setCompletedSteps(prev => new Set([...prev, step]));
    if (step < totalSteps) {
      setCurrentStep(step + 1);
    } else {
      // All steps completed, navigate to main app
      navigate('/');
    }
  };

  const handleSkipAll = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6 pt-8">
          <h1 className="text-3xl font-bold pink-gradient-text mb-2">
            Welcome to SheTalks!
          </h1>
          <p className="text-gray-600 mb-4">
            Let's personalize your experience
          </p>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 mt-2">
            Step {Math.max(...Array.from(completedSteps), 0) + 1} of {totalSteps}
          </p>
        </div>

        {currentStep === 1 && (
          <InterestSelection
            onComplete={() => handleStepComplete(1)}
            isOnboarding={true}
          />
        )}

        {currentStep === 2 && (
          <CreatorSelection
            onComplete={() => handleStepComplete(2)}
          />
        )}

        {currentStep === 3 && (
          <TagSelection
            onComplete={() => handleStepComplete(3)}
          />
        )}

        <div className="mt-6 text-center">
          <Button
            onClick={handleSkipAll}
            variant="ghost"
            className="text-gray-600"
          >
            Skip and explore
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
