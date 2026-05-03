const randomBetween = (min: number, max: number) => (
  min + Math.random() * (max - min)
);

const MARK_DENSITY = {
  stains: {
    min: 8,
    heightInterval: 520,
  },
  triangleNoise: {
    min: 24,
    heightInterval: 120,
  },
};

const createStainColor = (alpha: number) => `rgba(116, 83, 42, ${alpha})`;
const createInkColor = (alpha: number) => `rgba(16, 14, 12, ${alpha})`;

const getMarkCount = (height: number, density: { min: number; heightInterval: number }) => (
  Math.max(density.min, Math.floor(height / density.heightInterval))
);

const drawUnevenStain = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) => {
  const lobes = Math.floor(randomBetween(5, 10));

  for (let i = 0; i < lobes; i += 1) {
    const offsetX = randomBetween(-radius * 0.38, radius * 0.38);
    const offsetY = randomBetween(-radius * 0.28, radius * 0.28);
    const lobeRadius = radius * randomBetween(0.42, 0.92);

    context.save();
    context.translate(x + offsetX, y + offsetY);
    context.rotate(randomBetween(-0.8, 0.8));
    context.scale(randomBetween(0.68, 1.8), randomBetween(0.42, 1.15));

    const gradient = context.createRadialGradient(
      0,
      0,
      lobeRadius * 0.08,
      0,
      0,
      lobeRadius
    );

    gradient.addColorStop(0, createStainColor(randomBetween(0.008, 0.018)));
    gradient.addColorStop(0.54, createStainColor(randomBetween(0.004, 0.01)));
    gradient.addColorStop(1, createStainColor(0));

    context.beginPath();
    context.arc(0, 0, lobeRadius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    context.restore();
  }

  const specks = Math.floor(randomBetween(3, 9));
  for (let i = 0; i < specks; i += 1) {
    const angle = randomBetween(0, Math.PI * 2);
    const distance = randomBetween(radius * 0.15, radius * 1.25);
    const speckRadius = randomBetween(0.6, 2.4);

    context.beginPath();
    context.arc(
      x + Math.cos(angle) * distance,
      y + Math.sin(angle) * distance,
      speckRadius,
      0,
      Math.PI * 2
    );
    context.fillStyle = createStainColor(randomBetween(0.005, 0.018));
    context.fill();
  }
};

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

  const stainCount = getMarkCount(height, MARK_DENSITY.stains);
  for (let i = 0; i < stainCount; i += 1) {
    drawUnevenStain(
      context,
      randomBetween(-40, width + 40),
      randomBetween(-30, height + 30),
      randomBetween(28, 96)
    );
  }

  const triangleNoiseCount = getMarkCount(height, MARK_DENSITY.triangleNoise);
  for (let i = 0; i < triangleNoiseCount; i += 1) {
    drawInkTriangleNoise(context, width, height);
  }
};
