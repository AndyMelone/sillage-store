"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const gallery = images.length > 0 ? images : ["/placeholders/sillage.png"];

  return (
    <div>
      <div className="relative flex min-h-90 items-center justify-center bg-secondary p-8 md:min-h-130">
        <Image
          src={gallery[selectedImage]}
          alt={name}
          fill
          className="object-contain p-8"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {gallery.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`relative flex aspect-square items-center justify-center border bg-secondary p-2 transition-colors ${
                selectedImage === index
                  ? "border-accent"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={image}
                alt={`${name} - vue ${index + 1}`}
                fill
                className="object-contain p-2"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
