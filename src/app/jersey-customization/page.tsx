'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JerseyCustomizer from '@/src/component/JerseyCustomizer';
import axiosInstance from '@/src/Services/axiosinstance';

interface JerseyCustomization {
  number: string;
  playerName: string;
  jerseyColor: string;
  sleevesColor: string;
  sponsorText: string;
  frontPatch: boolean;
  sleevePatch: boolean;
}

export default function JerseyCustomizationPage() {
  const router = useRouter();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedJersey, setSelectedJersey] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jerseyTemplates, setJerseyTemplates] = useState<any[]>([]);
  const [error, setError] = useState('');

  // Fetch jerseys from database
  useEffect(() => {
    const fetchJerseys = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/products?category=jersey');
        const jerseys = response.data.products || response.data || [];
        
        if (jerseys.length > 0) {
          setJerseyTemplates(jerseys);
        } else {
          // Fallback to sample jerseys if none found
          setJerseyTemplates([
            {
              _id: '1',
              title: 'Premium Match Jersey',
              price: 2500,
              description: 'Professional-grade match jersey with thermal-press technology',
              image: 'https://images.unsplash.com/photo-1588698943485-618828062534?q=80&w=400',
            },
            {
              _id: '2',
              title: 'Training Jersey',
              price: 1800,
              description: 'Comfortable training jersey with breathable fabric',
              image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400',
            },
            {
              _id: '3',
              title: 'Team Jersey',
              price: 2200,
              description: 'Standard team jersey for clubs and organizations',
              image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400',
            },
          ]);
        }
      } catch (err) {
        console.error('Error fetching jerseys:', err);
        setError('Failed to load jerseys');
      } finally {
        setLoading(false);
      }
    };

    fetchJerseys();
  }, []);

  const handleCustomizationComplete = async (customization: JerseyCustomization) => {
    try {
      setLoading(true);

      // Create a cart item with customization
      const basePrice = selectedJersey?.price || 2500;
      const cartItem = {
        productId: selectedJersey?._id,
        title: `${selectedJersey?.title} - Custom (${customization.playerName} #${customization.number})`,
        price: basePrice + (customization.playerName !== 'PLAYER' ? 200 : 0) +
               (customization.frontPatch ? 150 : 0) +
               (customization.sleevePatch ? 100 : 0),
        quantity: 1,
        customization,
        category: 'jersey',
        image: selectedJersey?.image || selectedJersey?.images?.[0],
      };

      // Get existing cart from localStorage or backend
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      // Dispatch event to update cart in header
      window.dispatchEvent(new Event('cartUpdated'));

      // Show success message
      alert(`Jersey added to cart! Total: NPR ${cartItem.price}`);

      // Redirect to checkout
      router.push('/cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error adding to cart');
    } finally {
      setLoading(false);
    }
  };

  if (showCustomizer && selectedJersey) {
    return (
      <JerseyCustomizer
        price={selectedJersey?.price || 2500}
        onConfirm={handleCustomizationComplete}
        onCancel={() => setShowCustomizer(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-950 to-gray-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
            JERSEY <br />
            <span className="text-[#00B8AE]">CUSTOMIZATION</span>
          </h1>
          <p className="text-xl text-gray-400 font-bold max-w-2xl mx-auto">
            Design your perfect jersey with our 2D customizer. Professional-grade
            thermal-press technology for lasting quality.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
            {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-600 text-lg">Loading available jerseys...</p>
          </div>
        </section>
      ) : (
        /* Jersey Templates */
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12 uppercase">
            Select a Jersey to Customize
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {jerseyTemplates.map((template) => (
              <div
                key={template._id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-bold mb-6">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Base Price
                      </p>
                      <p className="text-2xl font-black text-[#00B8AE]">
                        NPR {template.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedJersey(template);
                      setShowCustomizer(true);
                    }}
                    className="w-full py-4 bg-[#00B8AE] text-white font-black rounded-xl hover:bg-teal-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Customize This Jersey
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Features */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12 uppercase">
            What You Get
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '👕',
                title: 'Custom Number',
                desc: 'Add any number up to 2 digits',
              },
              {
                icon: '✍️',
                title: 'Player Name',
                desc: 'Personalize with player name',
              },
              {
                icon: '🎨',
                title: 'Color Options',
                desc: '8+ color combinations available',
              },
              {
                icon: '🏆',
                title: 'Pro Quality',
                desc: 'Thermal-press technology',
              },
              {
                icon: '📋',
                title: 'Sponsor Patch',
                desc: 'Add front sponsor logos',
              },
              {
                icon: '🖤',
                title: 'Sleeve Patch',
                desc: 'Customize sleeve badges',
              },
              {
                icon: '⚡',
                title: 'Fast Delivery',
                desc: '7-10 days production time',
              },
              {
                icon: '✅',
                title: 'Quality Guarantee',
                desc: '100% satisfaction guaranteed',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 font-bold">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12 uppercase">
            Customization Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
            <div className="bg-teal-50 rounded-2xl p-6 border-2 border-[#00B8AE]/20">
              <h3 className="font-black text-gray-900 mb-4">Base Jersey</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-[#00B8AE] font-black">+</span>
                  <span className="text-gray-700 font-bold">NPR 1800 - 2500</span>
                </li>
              </ul>
            </div>

            <div className="bg-cyan-50 rounded-2xl p-6 border-2 border-cyan-500/20">
              <h3 className="font-black text-gray-900 mb-4">Add-ons</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between font-bold text-gray-700">
                  <span>Player Name:</span>
                  <span className="text-teal-600">+NPR 200</span>
                </li>
                <li className="flex justify-between font-bold text-gray-700">
                  <span>Front Patch:</span>
                  <span className="text-teal-600">+NPR 150</span>
                </li>
                <li className="flex justify-between font-bold text-gray-700">
                  <span>Sleeve Patch:</span>
                  <span className="text-teal-600">+NPR 100</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-950 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-6 uppercase">
            Ready to Design?
          </h2>
          <p className="text-lg text-gray-400 font-bold mb-8">
            Select a jersey template above and start customizing now!
          </p>
          <button
            onClick={() => router.push('/products?category=jersey')}
            className="px-12 py-5 bg-white text-gray-900 font-black rounded-xl hover:bg-[#00B8AE] hover:text-white transition-all duration-300 shadow-xl"
          >
            Browse All Jerseys
          </button>
        </div>
      </section>
    </div>
  );
}
