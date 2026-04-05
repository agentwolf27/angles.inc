"use client";

import { CldImage } from "next-cloudinary";

type Props = {
  publicId: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

/**
 * Use for portfolio items when `cloudinary_public_id` is set in Supabase.
 * Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME. Falls back to regular <img> via Unsplash URLs in seed data until configured.
 */
export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  className,
  priority,
}: Props) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) return null;
  return (
    <CldImage
      src={publicId}
      width={width}
      height={height}
      alt={alt}
      className={className}
      priority={priority}
    />
  );
}
