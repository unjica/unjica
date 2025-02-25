import Image from 'next/image';

interface BlurredBackgroundProps {
  imagePath?: string;
  alt?: string;
}

export function BlurredBackground({ 
  imagePath = '/Unjica LOGO.jpeg',
  alt = 'Background Logo'
}: BlurredBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imagePath}
          alt={alt}
          fill
          priority
          sizes="100vw"
          style={{ 
            objectFit: 'cover',
            position: 'absolute',
          }}
          className="blur-[4px] brightness-[0.3] scale-110"
          quality={100}
        />
      </div>
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
} 