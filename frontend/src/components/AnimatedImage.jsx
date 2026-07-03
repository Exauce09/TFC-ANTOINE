import { useState } from 'react'

const VARIANTS = {
  hero: {
    container: 'absolute inset-0 overflow-hidden',
    image:
      'absolute inset-0 w-full h-full object-cover motion-safe:animate-ken-burns',
  },
  banner: {
    container: 'absolute inset-0 overflow-hidden',
    image:
      'absolute inset-0 w-full h-full object-cover motion-safe:animate-ken-burns-subtle',
  },
  card: {
    container: 'overflow-hidden h-full w-full group/card',
    image:
      'w-full h-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover/card:scale-105',
  },
  gallery: {
    container: 'overflow-hidden',
    image:
      'w-full h-full object-cover transition-transform duration-500 ease-out motion-safe:hover:scale-[1.03]',
  },
  sidepanel: {
    container: 'absolute inset-0 overflow-hidden',
    image: 'absolute inset-0 w-full h-full object-cover',
  },
  inline: {
    container: 'overflow-hidden',
    image: 'w-full h-full object-cover',
  },
}

export default function AnimatedImage({
  src,
  alt = '',
  variant = 'card',
  className = '',
  imgClassName = '',
  ...rest
}) {
  const [loaded, setLoaded] = useState(false)
  const v = VARIANTS[variant] || VARIANTS.card
  const targetOpacity = imgClassName.match(/\b(opacity-\S+)\b/)?.[1]
  const extraImgClass = imgClassName.replace(/\bopacity-\S+\b/g, '').trim()

  return (
    <div className={`${v.container} ${className}`}>
      <img
        key={src}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={[
          v.image,
          'transition-opacity duration-700 ease-out',
          loaded ? (targetOpacity || 'opacity-100') : 'opacity-0',
          extraImgClass,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
    </div>
  )
}
