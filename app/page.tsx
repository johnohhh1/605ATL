'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';

const backgrounds = [
  '/atl-background-red.jpg',
  '/atl-background-green.jpg',
  '/atl-background.jpg'
];

export default function RecognitionForm() {
  const [formData, setFormData] = useState({
    recipientName: '',
    message: '',
    signature: '',
    date: '',
    checkboxes: {
      guestCounts: false,
      playRestaurant: false,
      foodDrink: false,
      accountable: false,
      engageTeam: false,
      bringBack: false,
      growSales: false,
      increaseProfits: false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const element = document.getElementById('capture-area');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imageData = canvas.toDataURL('image/jpeg', 0.95);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          metadata: {
            location: 'Auburn Hills',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      alert('Recognition form submitted successfully!');

    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting form: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div 
        id="capture-area" 
        className="max-w-[850px] mx-auto bg-white p-8 rounded-lg shadow-lg"
        style={{
          backgroundImage: `url('${backgrounds[Math.floor(Math.random() * backgrounds.length)]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#E31837]">
            Auburn Hills ATL
          </h1>
          <div className="max-w-[300px]">
            <label className="block font-bold text-gray-700 mb-2">
              CHEERS TO YOU,
            </label>
            <input
              type="text"
              value={formData.recipientName}
              onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
              className="w-full p-2 border-2 border-[#E31837] rounded"
              required
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Checkboxes */}
          <div className="mb-8">
            <div className="flex flex-row justify-between gap-4">
              {[
                ['guestCounts', 'EVERY GUEST COUNTS'],
                ['playRestaurant', 'PLAY RESTAURANT'],
                ['foodDrink', 'FOOD & DRINK PERFECTION'],
                ['accountable', 'BE ACCOUNTABLE']
              ].map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.checkboxes[key as keyof typeof formData.checkboxes]}
                    onChange={(e) => setFormData({
                      ...formData,
                      checkboxes: {...formData.checkboxes, [key]: e.target.checked}
                    })}
                    className="w-5 h-5"
                  />
                  <label className="font-bold text-sm whitespace-nowrap">{label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Message Section */}
          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Recognition Message:
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full h-32 p-2 border-2 border-[#E31837] rounded"
              required
            />
          </div>

          {/* Bottom Checkboxes */}
          <div className="mb-8">
            <div className="flex flex-row justify-between gap-4">
              {[
                ['engageTeam', 'ENGAGE TEAM MEMBERS'],
                ['bringBack', 'BRING BACK GUESTS'],
                ['growSales', 'GROW SALES'],
                ['increaseProfits', 'INCREASE PROFITS']
              ].map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.checkboxes[key as keyof typeof formData.checkboxes]}
                    onChange={(e) => setFormData({
                      ...formData,
                      checkboxes: {...formData.checkboxes, [key]: e.target.checked}
                    })}
                    className="w-5 h-5"
                  />
                  <label className="font-bold text-sm whitespace-nowrap">{label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Section */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block font-bold text-gray-700 mb-2">
                WITH #CHILISLOVE,
              </label>
              <input
                type="text"
                value={formData.signature}
                onChange={(e) => setFormData({...formData, signature: e.target.value})}
                className="w-full p-2 border-2 border-[#E31837] rounded"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-2">
                DATE
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2 border-2 border-[#E31837] rounded"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#E31837] text-white py-3 px-6 rounded-lg font-bold hover:bg-[#c41430] transition-colors"
          >
            Submit Recognition
          </button>
        </form>
      </div>
    </div>
  );
}
