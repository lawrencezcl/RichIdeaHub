import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  loading = 'lazy',
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Generate structured data for images
  const imageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": src,
    "name": alt,
    "description": alt,
    "uploadDate": new Date().toISOString(),
    "width": width,
    "height": height
  }

  // If there's an error, show a fallback
  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
      >
        <span className="text-gray-500 text-sm">图片无法加载</span>
      </div>
    )
  }

  return (
    <>
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority={priority}
          loading={priority ? 'eager' : loading}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          // SEO attributes
          itemProp="image"
        />

        {/* Loading skeleton */}
        {!isLoaded && (
          <div
            className="absolute inset-0 bg-gray-200 animate-pulse"
            style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
          />
        )}
      </div>

      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(imageStructuredData)
        }}
      />
    </>
  )
}

// Lazy loading image component for better performance
export function LazyImage(props: Omit<OptimizedImageProps, 'priority' | 'loading'>) {
  return <OptimizedImage {...props} loading="lazy" priority={false} />
}

// Priority image component for above-the-fold images
export function PriorityImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} priority={true} loading="eager" />
}