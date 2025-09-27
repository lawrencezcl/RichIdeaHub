'use client'

import TestimonialCarousel from '@/components/TestimonialCarousel'
import MiniStats from '@/components/MiniStats'

export default function TrustEndorsementArea() {

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">用户成功案例</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            真实用户分享他们的副业成功经验和心得体会
          </p>
        </div>

        {/* Enhanced Testimonial Carousel */}
        <div className="mb-20">
          <TestimonialCarousel
            autoPlay={true}
            autoPlayInterval={6000}
            showControls={true}
            compact={false}
            theme="light"
          />
        </div>

        {/* Enhanced Statistics dashboard */}
        <MiniStats variant="default" showRealTime={true} />
      </div>
    </div>
  )
}