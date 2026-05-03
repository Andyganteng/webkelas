import { useState, useEffect, useRef } from 'react';

const logoFrames = [
  "0001_0.jpeg", "0002_3.jpeg", "0003_3.jpeg", "0004_4.jpeg", "0005_3.jpeg", "0006_3.jpeg", "0007_4.jpeg", "0008_3.jpeg", "0009_3.jpeg", "0010_4.jpeg", "0011_3.jpeg", "0012_3.jpeg", "0013_4.jpeg", "0014_3.jpeg", "0015_3.jpeg", "0016_4.jpeg", "0017_3.jpeg", "0018_3.jpeg", "0019_4.jpeg", "0020_3.jpeg", "0021_3.jpeg", "0022_4.jpeg", "0023_3.jpeg", "0024_3.jpeg", "0025_4.jpeg", "0026_3.jpeg", "0027_3.jpeg", "0028_4.jpeg", "0029_3.jpeg", "0030_3.jpeg", "0031_4.jpeg", "0032_3.jpeg", "0033_3.jpeg", "0034_4.jpeg", "0035_3.jpeg", "0036_3.jpeg", "0037_4.jpeg", "0038_3.jpeg", "0039_3.jpeg", "0040_4.jpeg", "0041_3.jpeg", "0042_3.jpeg", "0043_4.jpeg", "0044_3.jpeg", "0045_3.jpeg", "0046_4.jpeg", "0047_3.jpeg", "0048_3.jpeg", "0049_4.jpeg", "0050_3.jpeg", "0051_3.jpeg", "0052_4.jpeg", "0053_3.jpeg", "0054_3.jpeg", "0055_4.jpeg", "0056_3.jpeg", "0057_3.jpeg", "0058_4.jpeg", "0059_3.jpeg", "0060_3.jpeg", "0061_4.jpeg", "0062_3.jpeg", "0063_3.jpeg", "0064_4.jpeg", "0065_3.jpeg", "0066_3.jpeg", "0067_4.jpeg", "0068_3.jpeg", "0069_3.jpeg", "0070_4.jpeg", "0071_3.jpeg", "0072_3.jpeg", "0073_4.jpeg", "0074_3.jpeg", "0075_3.jpeg", "0076_4.jpeg", "0077_3.jpeg", "0078_3.jpeg", "0079_4.jpeg", "0080_3.jpeg", "0081_3.jpeg", "0082_4.jpeg", "0083_3.jpeg", "0084_3.jpeg", "0085_4.jpeg", "0086_3.jpeg", "0087_3.jpeg", "0088_4.jpeg", "0089_3.jpeg", "0090_3.jpeg", "0091_4.jpeg", "0092_3.jpeg", "0093_3.jpeg", "0094_4.jpeg", "0095_3.jpeg", "0096_3.jpeg", "0097_4.jpeg", "0098_3.jpeg", "0099_3.jpeg", "0100_4.jpeg", "0101_3.jpeg", "0102_3.jpeg", "0103_4.jpeg", "0104_3.jpeg", "0105_3.jpeg", "0106_4.jpeg", "0107_3.jpeg", "0108_3.jpeg", "0109_4.jpeg", "0110_3.jpeg", "0111_3.jpeg", "0112_4.jpeg", "0113_3.jpeg", "0114_3.jpeg", "0115_4.jpeg", "0116_3.jpeg", "0117_3.jpeg", "0118_4.jpeg", "0119_3.jpeg", "0120_3.jpeg", "0121_4.jpeg", "0122_3.jpeg", "0123_3.jpeg", "0124_3.jpeg", "0125_4.jpeg", "0126_3.jpeg", "0127_4.jpeg", "0128_3.jpeg", "0129_3.jpeg", "0130_4.jpeg", "0131_3.jpeg", "0132_3.jpeg", "0133_4.jpeg", "0134_3.jpeg", "0135_3.jpeg", "0136_4.jpeg", "0137_3.jpeg", "0138_3.jpeg", "0139_4.jpeg", "0140_3.jpeg", "0141_3.jpeg", "0142_4.jpeg", "0143_3.jpeg", "0144_3.jpeg", "0145_4.jpeg", "0146_3.jpeg", "0147_3.jpeg", "0148_4.jpeg", "0149_3.jpeg", "0150_3.jpeg", "0151_4.jpeg", "0152_3.jpeg", "0153_3.jpeg"
];

const LogoSequence = ({ className = "" }) => {
  const canvasRef = useRef(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const imagesRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Preload images - partially for mobile to save memory
    const limit = window.innerWidth < 768 ? 50 : logoFrames.length;
    logoFrames.slice(0, limit).forEach((frame, index) => {
      const img = new Image();
      img.src = `/logoanimasi/${frame}`;
      img.onload = () => {
        imagesRef.current[index] = img;
      };
    });

    const fps = window.innerWidth < 768 ? 15 : 30; // Reduce FPS on mobile
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % logoFrames.length);
    }, 1000 / fps);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    const img = imagesRef.current[frameIndex];

    if (img && img.complete) {
      // Use lower resolution for processing on mobile to save CPU
      const scale = isMobile ? 0.5 : 1;
      const width = img.width * scale;
      const height = img.height * scale;
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Optimized background removal
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // On mobile, skip pixels to speed up processing if needed, 
      // but simple R>240 is usually fast enough for small logos.
      for (let i = 0; i < data.length; i += 4) {
        // Simple and fast threshold
        if (data[i] > 235 && data[i+1] > 235 && data[i+2] > 235) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
  }, [frameIndex, isMobile]);

  return (
    <canvas 
      ref={canvasRef}
      className={className}
      style={{ imageRendering: 'auto' }}
    />
  );
};

export default LogoSequence;
