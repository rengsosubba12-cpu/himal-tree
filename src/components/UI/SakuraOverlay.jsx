import { useEffect, useRef } from 'react';

// Modest budget (15–25 active petals max) to guarantee zero FPS / scroll impact
const PETAL_COUNT = 20;

// Delicate soft-pink / blush sakura color palette
const SAKURA_COLORS = [
  '#FFB7C5', // Classic sakura blossom pink
  '#FFCCD5', // Soft blush
  '#FAD2E1', // Delicate pale pink
  '#F4ACB7', // Warm cherry blossom
  '#FFE5EC', // Light blush tint
];

export default function SakuraOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Petal factory:
    // Origin & Flow: Spawns in top-left region (x: -5% to 40%, y: -10%) and drifts toward bottom-right
    const createPetal = (initialScatter = false) => {
      // Scale variation for depth (0.6 to 1.25)
      const scale = 0.6 + Math.random() * 0.65;
      
      // Opacity variation (0.4 to 0.8), mapped subtly with scale for atmospheric depth
      const depthOpacity = 0.4 + (scale - 0.6) * 0.4 + (Math.random() * 0.15 - 0.075);
      const clampedOpacity = Math.min(0.8, Math.max(0.4, Number(depthOpacity.toFixed(2))));

      // Spawn region: x: -5% to 40%, y: -10% to -2%
      const spawnX = -width * 0.05 + Math.random() * (width * 0.45);
      const spawnY = -height * 0.10 - Math.random() * (height * 0.04);

      // Ultra-slow fall speed: ~0.35 to 0.75 px per frame (~20-45 px/s)
      const vy = 0.35 + Math.random() * 0.4;
      // Diagonal drift toward bottom-right: ~0.25 to 0.60 px per frame
      const vx = 0.25 + Math.random() * 0.35;

      let x = spawnX;
      let y = spawnY;

      // On initial load, scatter petals across the viewport diagonal so it feels naturally active
      if (initialScatter) {
        const progress = Math.random();
        x = spawnX + progress * (width * 1.15);
        y = spawnY + progress * (height * 1.15);
      }

      return {
        x,
        y,
        baseSize: 9 + Math.random() * 4,
        scale,
        opacity: clampedOpacity,
        vx,
        vy,
        // Gentle sine-wave oscillation (sway)
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.012,
        swayDistance: 0.6 + Math.random() * 0.7,
        // 2D rotation & rotational spin
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        // 3D-like flip & tumble oscillation
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.01 + Math.random() * 0.018,
        color: SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)],
      };
    };

    // Modest pool of active petals
    const petals = Array.from({ length: PETAL_COUNT }, () => createPetal(true));

    // Sakura petal silhouette with subtle top notch and tapered base
    const drawPetalPath = (size) => {
      ctx.beginPath();
      ctx.moveTo(0, size);
      // Left contour up to left cleft tip
      ctx.bezierCurveTo(-size * 0.75, size * 0.35, -size * 0.85, -size * 0.4, -size * 0.32, -size);
      // Center cleft notch
      ctx.quadraticCurveTo(0, -size * 0.62, size * 0.32, -size);
      // Right contour down to base
      ctx.bezierCurveTo(size * 0.85, -size * 0.4, size * 0.75, size * 0.35, 0, size);
      ctx.closePath();
    };

    let lastTime = performance.now();

    const render = (now) => {
      // Normalize delta time to 60fps baseline
      const dt = Math.min((now - lastTime) / 16.667, 2.0);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Motion physics: sway, rotation, and 3D tumbling
        p.swayAngle += p.swaySpeed * dt;
        p.rotation += p.rotationSpeed * dt;
        p.flip += p.flipSpeed * dt;

        p.x += (p.vx + Math.sin(p.swayAngle) * p.swayDistance) * dt;
        p.y += p.vy * dt;

        // Respawn when drifting out of bounds (past bottom or far right)
        if (p.y > height + 30 || p.x > width + 60) {
          petals[i] = createPetal(false);
          continue;
        }

        // Render petal with 3D perspective foreshortening
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // 3D tumble effect using cosine flip foreshortening
        const flipScale = Math.cos(p.flip);
        ctx.scale(p.scale * flipScale, p.scale);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        drawPetalPath(p.baseSize);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        width: '100%',
        height: '100%',
      }}
    />
  );
}
