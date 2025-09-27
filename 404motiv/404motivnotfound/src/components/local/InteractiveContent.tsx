import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Recycle, Truck, Factory, Package, CheckCircle } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useAuth } from '../../context/AuthContext';
import { RecyclingCertificate } from '../common/RecyclingCertificate';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
  expanded: boolean;
}

export default function InteractiveContent() {
  const { user } = useAuth();
  const [steps, setSteps] = useState<ProcessStep[]>([
    {
      id: '1',
      title: 'Collection & Sorting',
      description: 'Waste materials are collected from homes and businesses, then sorted by type',
      icon: Package,
      details: [
        'Waste is collected from designated pickup points',
        'Materials are transported to sorting facilities',
        'Automated and manual sorting separates different materials',
        'Contaminated items are removed from the stream'
      ],
      expanded: false
    },
    {
      id: '2',
      title: 'Transportation',
      description: 'Sorted materials are transported to appropriate recycling facilities',
      icon: Truck,
      details: [
        'Materials are loaded onto specialized transport vehicles',
        'GPS tracking ensures efficient routing to facilities',
        'Quality checks maintain material integrity during transport',
        'Documentation tracks material flow for accountability'
      ],
      expanded: false
    },
    {
      id: '3',
      title: 'Processing & Manufacturing',
      description: 'Materials undergo transformation into raw materials for new products',
      icon: Factory,
      details: [
        'Materials are cleaned and prepared for processing',
        'Mechanical or chemical processes break down materials',
        'Raw materials are refined to manufacturing standards',
        'Quality control ensures material specifications are met'
      ],
      expanded: false
    },
    {
      id: '4',
      title: 'New Product Creation',
      description: 'Recycled materials are used to manufacture new products',
      icon: Recycle,
      details: [
        'Recycled materials are integrated into production lines',
        'New products are manufactured with recycled content',
        'Products are tested for quality and durability',
        'Finished products enter the market, completing the cycle'
      ],
      expanded: false
    }
  ]);

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, expanded: !step.expanded }
        : step
    ));

    // Mark step as completed when expanded for the first time
    if (!completedSteps.has(stepId)) {
      setCompletedSteps(prev => new Set(prev).add(stepId));
    }
  };

  const progress = (completedSteps.size / steps.length) * 100;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Recycling Process</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore each step of the recycling journey. Click on each stage to learn more 
          about how your waste becomes new products.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Learning Progress</h3>
          <span className="text-sm font-medium text-green-600">{completedSteps.size}/{steps.length} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Interactive Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.has(step.id);
          
          return (
            <div key={step.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        Step {index + 1}: {step.title}
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                        )}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {step.expanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {step.expanded && (
                <div className="border-t border-gray-200 p-6 bg-gray-50 animate-in slide-in-from-top">
                  <h4 className="font-semibold text-gray-900 mb-4">Process Details</h4>
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Did You Know?</h5>
                    <p className="text-blue-800 text-sm">
                      {step.id === '1' && 'Proper sorting can increase recycling efficiency by up to 30%!'}
                      {step.id === '2' && 'Optimized transportation routes can reduce carbon emissions by 25%.'}
                      {step.id === '3' && 'Modern recycling facilities can process materials with 95% efficiency.'}
                      {step.id === '4' && 'Recycled materials can be used to create thousands of different products!'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Certificate */}
      {completedSteps.size === steps.length && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
          <p className="text-green-100 mb-4">
            You've completed the interactive recycling process guide. 
            You're now a certified recycling expert!
          </p>
          <PDFDownloadLink
            document={
              <RecyclingCertificate
                userName={user?.name || 'Recycling Champion'}
                completionDate={new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              />
            }
            fileName="recycling-process-certificate.pdf"
            className="inline-block"
          >
            {({ loading }) => (
              <button 
                className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
                disabled={loading}
              >
                {loading ? 'Generating Certificate...' : 'Download Certificate'}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
}