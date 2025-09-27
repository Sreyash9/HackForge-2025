import React from 'react';
import { X, Zap, Calculator, Info, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface TariffInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TariffInfoModal: React.FC<TariffInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            Tariff Information & User Manual
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tariff Calculation Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-600" />
                How We Calculate Your Electricity Bill
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Goa Electricity Tariff Structure (2024-25)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Fixed Charge (per month):</span>
                    <span className="font-mono">₹60 per kW of sanctioned load</span>
                  </div>
                  <div className="border-t pt-2">
                    <p className="font-medium mb-1">Energy Charges (per kWh):</p>
                    <div className="ml-4 space-y-1">
                      <div className="flex justify-between">
                        <span>0-50 kWh:</span>
                        <span className="font-mono">₹2.95/kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span>51-150 kWh:</span>
                        <span className="font-mono">₹4.10/kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span>151-300 kWh:</span>
                        <span className="font-mono">₹5.85/kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Above 300 kWh:</span>
                        <span className="font-mono">₹6.90/kWh</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Bill Calculation Formula</h4>
                <div className="font-mono text-sm space-y-1">
                  <p><strong>Total Bill = Fixed Charge + Energy Charge + Taxes</strong></p>
                  <p>Fixed Charge = Sanctioned Load (kW) × ₹60</p>
                  <p>Energy Charge = Sum of slab-wise calculations</p>
                  <p>Taxes = GST @ 5% + Other duties</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Example Calculation</h4>
                <div className="text-sm">
                  <p><strong>For 200 kWh usage with 5 kW sanctioned load:</strong></p>
                  <div className="ml-4 space-y-1 mt-2">
                    <p>Fixed Charge: 5 kW × ₹60 = ₹300</p>
                    <p>Energy Charge:</p>
                    <div className="ml-4">
                      <p>• 0-50 kWh: 50 × ₹2.95 = ₹147.50</p>
                      <p>• 51-150 kWh: 100 × ₹4.10 = ₹410.00</p>
                      <p>• 151-200 kWh: 50 × ₹5.85 = ₹292.50</p>
                      <p><strong>Total Energy: ₹850.00</strong></p>
                    </div>
                    <p>Subtotal: ₹300 + ₹850 = ₹1,150</p>
                    <p>GST (5%): ₹57.50</p>
                    <p><strong>Final Bill: ₹1,207.50</strong></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Manual Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                How to Use WattWise - Simple Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    Set Up Your Home
                  </h4>
                  <ul className="text-sm space-y-1 ml-8">
                    <li>• Click "Add Room" to create rooms in your house</li>
                    <li>• Add appliances in each room with their wattage</li>
                    <li>• Upload photos if needed for better tracking</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    Log Daily Usage
                  </h4>
                  <ul className="text-sm space-y-1 ml-8">
                    <li>• Go to "Log Usage" page daily</li>
                    <li>• Enter how many hours each appliance ran</li>
                    <li>• App calculates your energy consumption</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    Set Goals & Track Progress
                  </h4>
                  <ul className="text-sm space-y-1 ml-8">
                    <li>• Set monthly energy saving goals</li>
                    <li>• Take daily quiz to earn points</li>
                    <li>• Compete with others on leaderboard</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                    Monitor & Save
                  </h4>
                  <ul className="text-sm space-y-1 ml-8">
                    <li>• Check dashboard for consumption patterns</li>
                    <li>• Get AI-powered saving tips</li>
                    <li>• Maintain daily streaks for bonuses</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-2">💡 Pro Tips for Maximum Savings</h4>
                <ul className="text-sm space-y-1">
                  <li>• Log usage every day to maintain your streak</li>
                  <li>• Take the daily quiz to learn energy-saving tips</li>
                  <li>• Set realistic monthly goals (start with 10-15% reduction)</li>
                  <li>• Use the chatbot for personalized advice</li>
                  <li>• Check your weekly patterns to identify peak usage days</li>
                  <li>• Compare your performance with the community leaderboard</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⚠️ Important Notes</h4>
                <ul className="text-sm space-y-1">
                  <li>• Wattage information is usually found on appliance labels</li>
                  <li>• If unsure about wattage, use our common appliance guide</li>
                  <li>• Bills are estimates based on Goa tariff rates</li>
                  <li>• Actual bills may vary due to additional charges and meter readings</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TariffInfoModal;