export default function getCroppedImg(imageSrc, pixelCrop, outputWidth, outputHeight) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous"; // CORS sorunları için

    image.onload = () => {
canvas.width = outputWidth;   // 1300
canvas.height = outputHeight; // 480

ctx.drawImage(
  image,
  pixelCrop.x,
  pixelCrop.y,
  pixelCrop.width,
  pixelCrop.height,
  0,
  0,
  outputWidth,
  outputHeight
);


      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Blob üretilemedi"));
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    };

    image.onerror = (err) => reject(err);
  });
}
