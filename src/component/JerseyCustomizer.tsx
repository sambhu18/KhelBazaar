'use client';

import { useEffect, useRef, useState } from 'react';

interface JerseyCustomization {
  number: string;
  playerName: string;
  jerseyColor: string;
  sleevesColor: string;
  sponsorText: string;
  frontPatch: boolean;
  sleevePatch: boolean;
}

export interface JerseyCustomizerProps {
  onConfirm: (customization: JerseyCustomization) => void;
  onCancel: () => void;
  productId?: string;
  price?: number;
}

export default function JerseyCustomizer({
  onConfirm,
  onCancel,
  productId,
  price,
}: JerseyCustomizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [customization, setCustomization] = useState<JerseyCustomization>({
    number: '7',
    playerName: 'PLAYER',
    jerseyColor: '#1F2937',
    sleevesColor: '#1F2937',
    sponsorText: '',
    frontPatch: true,
    sleevePatch: false,
  });

  const [totalPrice, setTotalPrice] = useState(price || 0);

  // Update price when customization changes
  useEffect(() => {
    let addedPrice = 0;
    if (customization.playerName !== 'PLAYER') addedPrice += 200; // Personalization fee
    if (customization.frontPatch) addedPrice += 150; // Patch fee
    if (customization.sleevePatch) addedPrice += 100; // Sleeve patch fee
    
    setTotalPrice((price || 0) + addedPrice);
  }, [customization, price]);

  // Draw jersey on canvas
  useEffect(() => {
    drawJersey();
  }, [customization]);

  const drawJersey = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Draw jersey body
    const centerX = width / 2;
    const torsoTop = 80;
    const torsoHeight = 200;

    // Main jersey body
    ctx.fillStyle = customization.jerseyColor;
    ctx.beginPath();
    // Neck hole
    ctx.moveTo(centerX - 40, torsoTop);
    // Left shoulder
    ctx.lineTo(50, torsoTop + 30);
    // Left side
    ctx.lineTo(40, torsoTop + torsoHeight);
    // Bottom
    ctx.lineTo(width - 40, torsoTop + torsoHeight);
    // Right side
    ctx.lineTo(width - 50, torsoTop + 30);
    // Right shoulder
    ctx.lineTo(centerX + 40, torsoTop);
    ctx.closePath();
    ctx.fill();

    // Draw sleeves
    ctx.fillStyle = customization.sleevesColor;
    // Left sleeve
    ctx.fillRect(20, torsoTop + 30, 30, 120);
    // Right sleeve
    ctx.fillRect(width - 50, torsoTop + 30, 30, 120);

    // Draw neck opening
    ctx.fillStyle = '#1F2937';
    ctx.beginPath();
    ctx.ellipse(centerX, torsoTop, 35, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw collar line
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 40, torsoTop);
    ctx.lineTo(centerX + 40, torsoTop);
    ctx.stroke();

    // Draw front patch if enabled
    if (customization.frontPatch) {
      ctx.fillStyle = 'rgba(0, 184, 174, 0.3)';
      ctx.fillRect(centerX - 35, torsoTop + 50, 70, 50);
      ctx.strokeStyle = '#00B8AE';
      ctx.lineWidth = 1;
      ctx.strokeRect(centerX - 35, torsoTop + 50, 70, 50);
      
      ctx.fillStyle = '#00B8AE';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('SPONSOR', centerX, torsoTop + 75);
    }

    // Draw sleeve patch if enabled
    if (customization.sleevePatch) {
      ctx.fillStyle = 'rgba(0, 184, 174, 0.3)';
      ctx.fillRect(25, torsoTop + 60, 20, 30);
      ctx.strokeStyle = '#00B8AE';
      ctx.lineWidth = 1;
      ctx.strokeRect(25, torsoTop + 60, 20, 30);
    }

    // Draw jersey number (back view suggestion)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillText(customization.number, centerX, torsoTop + 140);

    // Draw player name
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(customization.playerName, centerX, torsoTop + 160);

    // Draw sponsor text on front if provided
    if (customization.sponsorText) {
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(customization.sponsorText, centerX, torsoTop + 195);
    }

    // Draw badge/club crest in center
    ctx.fillStyle = '#00B8AE';
    ctx.beginPath();
    ctx.arc(centerX, torsoTop + 30, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('J', centerX, torsoTop + 35);
  };

  const jerseyColors = [
    { name: 'Black', value: '#1F2937' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Blue', value: '#2563EB' },
    { name: 'Green', value: '#059669' },
    { name: 'Yellow', value: '#FBBF24' },
    { name: 'Navy', value: '#001F3F' },
    { name: 'Purple', value: '#7C3AED' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 md:p-8 my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-gray-900">2D Jersey Customizer</h2>
          <button
            onClick={onCancel}
            className="text-2xl text-gray-500 hover:text-gray-900 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Canvas Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 w-full">
              <canvas
                ref={canvasRef}
                width={300}
                height={400}
                className="w-full h-auto bg-white rounded-lg shadow-lg"
              />
            </div>
            <p className="text-xs text-gray-500 font-bold mt-4 text-center">
              Live Preview
            </p>
          </div>

          {/* Customization Options */}
          <div className="space-y-6 overflow-y-auto max-h-[500px] pr-4">
            {/* Jersey Number */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">
                Jersey Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customization.number}
                  onChange={(e) =>
                    setCustomization({
                      ...customization,
                      number: e.target.value.slice(0, 2).toUpperCase(),
                    })
                  }
                  maxLength={2}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-center text-lg font-black focus:outline-none focus:border-[#00B8AE]"
                  placeholder="7"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Max 2 characters</p>
            </div>

            {/* Player Name */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">
                Player Name
              </label>
              <input
                type="text"
                value={customization.playerName}
                onChange={(e) =>
                  setCustomization({
                    ...customization,
                    playerName: e.target.value.slice(0, 12).toUpperCase(),
                  })
                }
                maxLength={12}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg font-black focus:outline-none focus:border-[#00B8AE] text-center"
                placeholder="PLAYER NAME"
              />
              <p className="text-xs text-gray-500 mt-1">
                +NPR 200 {customization.playerName !== 'PLAYER' && '✓'}
              </p>
            </div>

            {/* Jersey Color */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">
                Jersey Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {jerseyColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() =>
                      setCustomization({
                        ...customization,
                        jerseyColor: color.value,
                      })
                    }
                    className={`w-full aspect-square rounded-lg border-3 transition-all ${
                      customization.jerseyColor === color.value
                        ? 'border-[#00B8AE] scale-105'
                        : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Sleeves Color */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">
                Sleeves Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {jerseyColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() =>
                      setCustomization({
                        ...customization,
                        sleevesColor: color.value,
                      })
                    }
                    className={`w-full aspect-square rounded-lg border-3 transition-all ${
                      customization.sleevesColor === color.value
                        ? 'border-[#00B8AE] scale-105'
                        : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Patches */}
            <div className="space-y-3 border-t pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customization.frontPatch}
                  onChange={(e) =>
                    setCustomization({
                      ...customization,
                      frontPatch: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="font-bold text-gray-700">Front Sponsor Patch</span>
                <span className="text-teal-600 font-black text-sm">+NPR 150</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customization.sleevePatch}
                  onChange={(e) =>
                    setCustomization({
                      ...customization,
                      sleevePatch: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="font-bold text-gray-700">Sleeve Patch</span>
                <span className="text-teal-600 font-black text-sm">+NPR 100</span>
              </label>
            </div>

            {/* Sponsor Text */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">
                Sponsor Text (Optional)
              </label>
              <input
                type="text"
                value={customization.sponsorText}
                onChange={(e) =>
                  setCustomization({
                    ...customization,
                    sponsorText: e.target.value.slice(0, 15),
                  })
                }
                maxLength={15}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00B8AE]"
                placeholder="Sponsor name"
              />
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-4 border-2 border-[#00B8AE]/20">
              <p className="text-xs text-gray-600 font-bold mb-1 uppercase">Total Price</p>
              <p className="text-3xl font-black text-[#00B8AE]">
                NPR {totalPrice.toLocaleString()}
              </p>
              {totalPrice > (price || 0) && (
                <p className="text-xs text-gray-600 font-bold mt-2">
                  Base: NPR {(price || 0).toLocaleString()} + Customization: NPR{' '}
                  {(totalPrice - (price || 0)).toLocaleString()}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onCancel}
                className="flex-1 py-3 bg-gray-100 text-gray-900 font-black rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(customization)}
                className="flex-1 py-3 bg-[#00B8AE] text-white font-black rounded-xl hover:bg-teal-500 transition-all"
              >
                Add to Cart
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Note: Your jersey will be produced with professional thermal-press
              technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
