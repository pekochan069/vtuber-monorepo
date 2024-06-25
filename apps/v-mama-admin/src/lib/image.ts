export function prepareImages(
  file: File | null,
  baseSize = 512,
  sizes = [512, 256, 128, 64],
): Promise<Blob[]> {
  if (!file) {
    return Promise.reject("No file provided");
  }

  const reader = new FileReader();
  const canvas = document.createElement("canvas");

  function resize(img: HTMLImageElement, target: number) {
    canvas.width = target;
    canvas.height = target;
    canvas.getContext("2d")?.drawImage(img, 0, 0, target, target);
    const data = canvas.toDataURL("image/png");

    const bytes = atob(data.split(",")[1]);
    const mime = data.split(",")[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(bytes.length).map((_, i) => bytes.charCodeAt(i));

    return new Blob([ia], { type: mime });
  }

  reader.readAsDataURL(file);

  let width = 0;
  let height = 0;

  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      reject("Not an image file");
      return;
    }

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        width = img.width;
        height = img.height;

        if (width !== height) {
          reject("Image must be square");
        }

        if (width < baseSize) {
          reject(`Image must be at least ${baseSize}x${baseSize}`);
        }

        const images = sizes.map((size) => resize(img, size));

        resolve(images);
      };
    };
  });
}

export function prepareImage(file: File, maxHeight: number): Promise<Blob> {
  const reader = new FileReader();
  const canvas = document.createElement("canvas");

  function resize(
    img: HTMLImageElement,
    targetWidth: number,
    targetHeight: number,
  ) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    canvas.getContext("2d")?.drawImage(img, 0, 0, targetWidth, targetHeight);
    const data = canvas.toDataURL("image/png");

    const bytes = atob(data.split(",")[1]);
    const mime = data.split(",")[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(bytes.length).map((_, i) => bytes.charCodeAt(i));

    return new Blob([ia], { type: mime });
  }

  reader.readAsDataURL(file);

  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      reject("Not an image file");
      return;
    }

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        // change width with respect to height
        const height = img.height > maxHeight ? maxHeight : img.height;
        const width = (height / img.height) * img.width;

        const logo = resize(img, width, maxHeight);

        resolve(logo);
      };
    };
  });
}
