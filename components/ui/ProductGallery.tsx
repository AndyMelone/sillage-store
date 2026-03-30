"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  image1: string;
  image2: string;
  name: string;
}

export function ProductGallery({ image1, image2, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = [image1, image2];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <Image
          src={images[selectedImage]}
          alt={name}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative w-20 h-28 overflow-hidden bg-secondary transition-all duration-300 ${
              selectedImage === index
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={image}
              alt={`${name} - Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
