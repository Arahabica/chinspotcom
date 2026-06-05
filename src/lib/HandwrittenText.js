const HANDWRITTEN_OPTS = {
  chunkSize: [2, 3],
  translateX: [-0.2, 0.2],
  translateY: [-0.4, 0.4],
  rotate: [-1.8, 1.8],
  scaleX: [0.96, 1.06],
  edgeBias: 2, // ランダムが端によりやすいように設定。1の場合均等。
};

const HANDWRITTEN_TEXT_CLASS = 'handwritten-text';
const HANDWRITTEN_SKIP_SELECTOR = [
  'script',
  'style',
  'svg',
  'canvas',
  'noscript',
  'template',
  '[aria-hidden="true"]',
  '.sr-only',
  `.${HANDWRITTEN_TEXT_CLASS}`,
].join(',');

const randomUniformBetween = (min, max) => (
  min + Math.random() * (max - min)
);

const randomBetween = (min, max) => {
  if (HANDWRITTEN_OPTS.edgeBias <= 1) {
    return randomUniformBetween(min, max);
  }

  const center = (min + max) / 2;
  const radius = (max - min) / 2;
  const direction = Math.random() < 0.5 ? -1 : 1;
  const distanceFromCenter = Math.random() ** (1 / HANDWRITTEN_OPTS.edgeBias);

  return center + direction * radius * distanceFromCenter;
};

const randomIntBetween = (min, max) => (
  Math.floor(randomUniformBetween(min, max + 1))
);

const isSkippableTextNode = (node) => {
  const parent = node.parentElement;
  if (!parent || !node.nodeValue || node.nodeValue.trim() === '') {
    return true;
  }

  if (parent.closest(HANDWRITTEN_SKIP_SELECTOR)) {
    return true;
  }

  const style = window.getComputedStyle(parent);
  return style.display === 'none' || style.visibility === 'hidden';
};

const getHandwrittenChunkSize = (remaining) => {
  const [minChunkSize, maxChunkSize] = HANDWRITTEN_OPTS.chunkSize;

  if (remaining <= maxChunkSize) {
    return remaining;
  }
  if (remaining === maxChunkSize + 1) {
    return minChunkSize;
  }

  const size = randomIntBetween(minChunkSize, maxChunkSize);
  return remaining - size === 1 ? maxChunkSize : size;
};

const createHandwrittenSpan = (text) => {
  const span = document.createElement('span');
  const translateX = randomBetween(...HANDWRITTEN_OPTS.translateX);
  const translateY = randomBetween(...HANDWRITTEN_OPTS.translateY);
  const rotation = randomBetween(...HANDWRITTEN_OPTS.rotate);
  const scaleX = randomBetween(...HANDWRITTEN_OPTS.scaleX);

  span.className = HANDWRITTEN_TEXT_CLASS;
  span.textContent = text;
  span.style.display = 'inline-block';
  span.style.transform = `translate(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px) rotate(${rotation.toFixed(2)}deg) scaleX(${scaleX.toFixed(3)})`;
  span.style.transformOrigin = 'center center';
  span.style.verticalAlign = 'baseline';

  return span;
};

const appendHandwrittenWord = (fragment, word) => {
  const chars = Array.from(word);
  let index = 0;

  while (index < chars.length) {
    const chunkSize = getHandwrittenChunkSize(chars.length - index);
    const chunk = chars.slice(index, index + chunkSize).join('');
    fragment.appendChild(createHandwrittenSpan(chunk));
    index += chunkSize;
  }
};

const replaceTextNodeWithHandwrittenSpans = (node) => {
  const text = node.nodeValue;
  if (!text) {
    return;
  }

  const fragment = document.createDocumentFragment();
  const parts = text.match(/\s+|\S+/gu) ?? [];

  parts.forEach((part) => {
    if (/^\s+$/u.test(part)) {
      fragment.appendChild(document.createTextNode(part));
      return;
    }

    appendHandwrittenWord(fragment, part);
  });

  node.replaceWith(fragment);
};

export const applyHandwrittenText = () => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        return isSkippableTextNode(node)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    }
  );
  const textNodes = [];
  let node = walker.nextNode();

  while (node) {
    textNodes.push(node);
    node = walker.nextNode();
  }

  textNodes.forEach(replaceTextNodeWithHandwrittenSpans);
};
