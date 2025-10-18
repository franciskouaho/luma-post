'use client';

export default function FeaturedSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-500 text-sm font-medium mb-8">Featured on</p>
          
          <div className="flex justify-center items-center space-x-12">
            {/* Starter Story */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-gray-700 font-medium">Starter Story</span>
            </div>

            {/* TinyLaunch */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-gray-700 font-medium">TinyLaunch</span>
            </div>

            {/* Product Hunt */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-gray-700 font-medium">Product Hunt</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
