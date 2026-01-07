# Image Setup Instructions

To complete the hero section carousel animation, you need to add 3 webp images to the public folder:

## Required Images:

1. **1.webp** - First carousel image

   - Recommended: Campus overview, students in classroom, or admission scene
   - Dimensions: 1200x900px (4:3 ratio)
   - Format: WebP

2. **2.webp** - Second carousel image

   - Recommended: Technology/computer lab, online registration, or digital workflow
   - Dimensions: 1200x900px (4:3 ratio)
   - Format: WebP

3. **3.webp** - Third carousel image
   - Recommended: Graduation ceremony, successful students, or campus facilities
   - Dimensions: 1200x900px (4:3 ratio)
   - Format: WebP

## How to Add Images:

1. Place the three webp images in: `Frontend/public/`
2. Name them exactly as: `1.webp`, `2.webp`, `3.webp`
3. The carousel will automatically cycle through them every 4 seconds

## Converting Images to WebP:

If you have JPG/PNG images, you can convert them using:

- Online tools: https://cloudconvert.com/jpg-to-webp
- Photoshop: Save for Web → WebP format
- Command line: `cwebp input.jpg -q 80 -o output.webp`

## Fallback:

If images are not found, the carousel will automatically use `/placeholder.svg` as a fallback.

## Features Added:

✅ Auto-scrolling carousel (4 seconds interval)
✅ Smooth fade and scale animations
✅ Interactive dot indicators (click to change slide)
✅ Animated gradient border
✅ Floating background elements
✅ Responsive layout (side-by-side on desktop, stacked on mobile)
✅ Graceful error handling with fallback images
