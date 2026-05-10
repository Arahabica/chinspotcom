const randomBetween = (min: number, max: number) => (
  min + Math.random() * (max - min)
);

const MARK_DENSITY = {
  triangleNoise: {
    min: 24,
    heightInterval: 120,
  },
};

const createInkColor = (alpha: number) => `rgba(16, 14, 12, ${alpha})`;

const getMarkCount = (height: number, density: { min: number; heightInterval: number }) => (
  Math.max(density.min, Math.floor(height / density.heightInterval))
);

const drawInkTriangleNoise = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const x = randomBetween(18, width - 18);
  const y = randomBetween(18, height - 18);
  const length = randomBetween(4, 12);
  const thickness = randomBetween(0.6, 2.0);

  context.save();
  context.translate(x, y);
  context.rotate(randomBetween(0, Math.PI * 2));
  context.beginPath();
  context.moveTo(-length * 0.45, randomBetween(-thickness, thickness));
  context.lineTo(length * 0.55, randomBetween(-thickness * 0.45, thickness * 0.45));
  context.lineTo(-length * 0.35, randomBetween(thickness * 0.4, thickness * 1.35));
  context.closePath();

  const gradient = context.createLinearGradient(
    -length * 0.55,
    -thickness,
    length * 0.6,
    thickness * 1.4
  );
  gradient.addColorStop(0, createInkColor(randomBetween(0.3, 0.8)));
  gradient.addColorStop(0.45, createInkColor(randomBetween(0.18, 0.34)));
  gradient.addColorStop(1, createInkColor(randomBetween(0.04, 0.12)));

  context.fillStyle = gradient;
  context.fill();
  context.restore();
};

export const drawPaperMarks = () => {
  const canvas = document.querySelector<HTMLCanvasElement>('.paper-marks');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) {
    return;
  }

  const width = Math.max(document.documentElement.scrollWidth, window.innerWidth);
  const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.ceil(width * pixelRatio);
  canvas.height = Math.ceil(height * pixelRatio);

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, width, height);

  const triangleNoiseCount = getMarkCount(height, MARK_DENSITY.triangleNoise);
  for (let i = 0; i < triangleNoiseCount; i += 1) {
    drawInkTriangleNoise(context, width, height);
  }
};
