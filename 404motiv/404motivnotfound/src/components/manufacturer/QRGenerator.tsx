import React, { useState } from 'react';
import { QrCode, Download, Copy, Package, Recycle, CheckCircle } from 'lucide-react';

interface QRData {
  productName: string;
  category: string;
  manufacturer: string;
  instructions: string;
}

export default function QRGenerator() {
  const [formData, setFormData] = useState<QRData>({
    productName: '',
    category: 'plastic',
    manufacturer: '',
    instructions: ''
  });
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [qrHistory, setQRHistory] = useState<Array<QRData & { qrCode: string; date: string }>>([]);

  const categories = [
    { value: 'plastic', label: 'Plastic', icon: '🔄' },
    { value: 'paper', label: 'Paper', icon: '📄' },
    { value: 'glass', label: 'Glass', icon: '🍾' },
    { value: 'metal', label: 'Metal', icon: '🔧' },
    { value: 'electronics', label: 'Electronics', icon: '💻' }
  ];

  const handleInputChange = (field: keyof QRData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateQRCode = () => {
    if (!formData.productName || !formData.manufacturer) return;
    
    // Simulate QR generation
    const qrCode = `QR_${formData.category.toUpperCase()}_${Date.now()}`;
    setGeneratedQR(qrCode);
    
    // Add to history
    const newQR = {
      ...formData,
      qrCode,
      date: new Date().toISOString()
    };
    setQRHistory(prev => [newQR, ...prev]);
  };

  const copyQRCode = async (qrCode: string) => {
    try {
      await navigator.clipboard.writeText(qrCode);
      // Show success feedback
    } catch (err) {
      console.error('Failed to copy QR code:', err);
    }
  };

  const downloadQRCode = (qrCode: string) => {
    // In a real implementation, this would generate and download a QR code image
    const element = document.createElement('a');
    const file = new Blob([`QR Code: ${qrCode}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${qrCode}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">QR Code Generator</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Generate QR codes for your products that connect customers with appropriate recycling facilities. 
          Each code contains product information and recycling instructions.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* QR Generation Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Product Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="Enter product name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer *
              </label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                placeholder="Your company name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waste Category *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleInputChange('category', category.value)}
                    className={`p-3 rounded-lg border transition-all ${
                      formData.category === category.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{category.icon}</div>
                      <div className="text-sm font-medium">{category.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recycling Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="Special recycling instructions or preparation steps"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={generateQRCode}
              disabled={!formData.productName || !formData.manufacturer}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <QrCode className="w-5 h-5" />
              <span>Generate QR Code</span>
            </button>
          </div>
        </div>

        {/* Generated QR Display */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Recycle className="w-5 h-5 mr-2 text-blue-600" />
            Generated QR Code
          </h3>

          {generatedQR ? (
            <div className="space-y-6">
              {/* QR Code Visualization */}
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-2">QR Code ID</p>
                <p className="font-mono text-sm font-medium text-gray-900">{generatedQR}</p>
              </div>

              {/* Product Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Product Summary</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-blue-700">Product:</span> {formData.productName}</p>
                  <p><span className="text-blue-700">Category:</span> {formData.category}</p>
                  <p><span className="text-blue-700">Manufacturer:</span> {formData.manufacturer}</p>
                  {formData.instructions && (
                    <p><span className="text-blue-700">Instructions:</span> {formData.instructions}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => copyQRCode(generatedQR)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </button>
                <button
                  onClick={() => downloadQRCode(generatedQR)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Fill out the form and click "Generate" to create your QR code</p>
            </div>
          )}
        </div>
      </div>

      {/* QR History */}
      {qrHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent QR Codes</h3>
          <div className="space-y-4">
            {qrHistory.slice(0, 5).map((qr, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{qr.productName}</h4>
                  <p className="text-sm text-gray-600">
                    {qr.category} • {new Date(qr.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-gray-600">{qr.qrCode}</span>
                  <button
                    onClick={() => copyQRCode(qr.qrCode)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadQRCode(qr.qrCode)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}