'use client';

export default function TestimonialsSection() {
  const testimonials = [
    {
      text: "Best price/quality of all platforms of this kind by far",
      author: "Sarah M.",
      avatar: "👩‍💼"
    },
    {
      text: "Post bridge is the best investment i've made in months. It's simple and works, exactly what i was searching",
      author: "Mike R.",
      avatar: "👨‍💻"
    },
    {
      text: "Time is money and this saves me both. Incredible value for the price.",
      author: "Emma L.",
      avatar: "👩‍🎨"
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What our creators say
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied creators who trust Luma Post
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 border border-gray-100">
              <div className="mb-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">8,166+</div>
            <div className="text-gray-600">Active Creators</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">50M+</div>
            <div className="text-gray-600">Posts Scheduled</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">4.9★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
