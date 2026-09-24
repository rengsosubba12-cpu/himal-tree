import React, { useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTransform } from 'framer-motion';

/* ================================================================
   Utilities
   ================================================================ */
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const damp = THREE.MathUtils.damp;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ================================================================
   Procedural Textures
   ================================================================ */

// Hand-turned acacia wood grain for the bowl
function makeWoodTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#b48157';
  ctx.fillRect(0, 0, 1024, 512);
  const panels = [
    [0.03, 0.11],
    [0.36, 0.44],
    [0.69, 0.78],
  ];
  panels.forEach(([a, b]) => {
    ctx.fillStyle = 'rgba(238,208,168,0.6)';
    ctx.fillRect(a * 1024, 0, (b - a) * 1024, 512);
  });
  const rng = mulberry32(7);
  for (let i = 0; i < 260; i++) {
    const y = rng() * 512;
    const dark = 40 + rng() * 60;
    ctx.strokeStyle = `rgba(${dark + 30},${dark * 0.55},${dark * 0.3},${0.07 + rng() * 0.2})`;
    ctx.lineWidth = 0.5 + rng() * 2.4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 24) {
      ctx.lineTo(x, y + Math.sin(x * 0.012 + i) * 3.5 + (rng() - 0.5) * 2);
    }
    ctx.stroke();
  }
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, 'rgba(70,38,16,0.45)');
  g.addColorStop(0.45, 'rgba(0,0,0,0)');
  g.addColorStop(0.62, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(70,38,16,0.35)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Seared beef steak cross-section with marbling
function makeSteakTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#4a2214';
  ctx.fillRect(0, 0, 256, 512);
  const inset = 18;
  const rg = ctx.createRadialGradient(128, 256, 20, 128, 256, 240);
  rg.addColorStop(0, '#d4586f');
  rg.addColorStop(0.55, '#c94f66');
  rg.addColorStop(0.85, '#9a5250');
  rg.addColorStop(1, '#6e3a2c');
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.roundRect(inset, inset, 256 - inset * 2, 512 - inset * 2, 40);
  ctx.fill();
  const rng = mulberry32(21);
  ctx.strokeStyle = 'rgba(255,190,200,0.35)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 70; i++) {
    const x = inset + rng() * (256 - inset * 2);
    const y = inset + rng() * (512 - inset * 2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rng() - 0.5) * 30, y + (rng() - 0.5) * 60);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.ellipse(
      inset + rng() * 220,
      inset + rng() * 476,
      2 + rng() * 3,
      1 + rng() * 2,
      rng() * 3,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Pan-fried gyoza wrapper with crispy bottom gradient
function makeGyozaTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#5a2a10');
  g.addColorStop(0.22, '#8a4a1c');
  g.addColorStop(0.42, '#d29a52');
  g.addColorStop(0.55, '#ead0a0');
  g.addColorStop(1, '#f0d9ad');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const rng = mulberry32(99);
  for (let i = 0; i < 160; i++) {
    const y = rng() * 120;
    const x = rng() * 256;
    ctx.fillStyle = `rgba(${30 + rng() * 40},${12 + rng() * 20},${5},${0.35 + rng() * 0.5})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 3 + rng() * 9, 2 + rng() * 5, rng() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(200,120,50,${0.15 + rng() * 0.25})`;
    ctx.beginPath();
    ctx.arc(rng() * 256, 120 + rng() * 100, 2 + rng() * 4, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Soft radial cloud puff for steam wisps
const steamPuffTexture = (() => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.82)');
  grad.addColorStop(0.55, 'rgba(255, 252, 245, 0.45)');
  grad.addColorStop(0.82, 'rgba(255, 250, 240, 0.14)');
  grad.addColorStop(1.0, 'rgba(255, 250, 240, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
})();

// Deterministic steam particle layout — adjusted for new bowl rim (~y 2.5, radius ~3.0)
const steamParticleData = Array(36)
  .fill(0)
  .map((_, i) => ({
    offset: (i * 13.7) % 100,
    speed: 0.42 + ((i * 7.3) % 10) * 0.07,
    originRadius: 0.15 + (((i * 19.1) % 100) / 100) * 1.8,
    originAngle: (i * 1.745) % (Math.PI * 2),
    baseScale: 0.52 + ((i * 11.3) % 10) * 0.05,
    swirlFreq: 0.8 + ((i * 3.1) % 5) * 0.2,
    swirlAmp: 0.30 + ((i * 5.7) % 5) * 0.05,
  }));

/* ================================================================
   Animation Wrappers
   ================================================================ */

// Scroll-linked drop-in: every ingredient enters from ABOVE the bowl
function Ingredient({ progress, drop = 5, children }) {
  const ref = useRef();
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const p = progress.get();
    const t = easeOutCubic(p);
    g.position.y = damp(g.position.y, drop * (1 - t), 9, dt);
    g.visible = p > 0.002;
    const op = clamp01(p * 2.4);
    if (Math.abs(g.userData.op - op) > 0.002) {
      g.userData.op = op;
      g.traverse((o) => {
        if (!o.material) return;
        const ms = Array.isArray(o.material) ? o.material : [o.material];
        ms.forEach((m) => {
          m.transparent = op < 1;
          m.opacity = op;
        });
      });
    }
  });
  return (
    <group ref={ref} position={[0, drop, 0]} visible={false} userData={{ op: -1 }}>
      {children}
    </group>
  );
}

// Post-assembly idle float + pointer parallax
function Float({ progress, baseScale = 1, children }) {
  const ref = useRef();
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const k = easeOutCubic(progress.get());
    const t = state.clock.elapsedTime;
    
    // Smoothly apply responsive scale
    const targetScale = damp(g.scale.x, baseScale, 6, dt);
    g.scale.setScalar(targetScale);

    g.position.y = damp(g.position.y, k * Math.sin(t * 1.1) * 0.09, 5, dt);

    // Disable pointer parallax on touch viewports to prevent jitter during touch scroll
    const isTouch = typeof window !== 'undefined' && (
      window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches
    );
    const px = isTouch ? 0 : state.pointer.x;
    const py = isTouch ? 0 : state.pointer.y;

    g.rotation.y = damp(
      g.rotation.y,
      k * (px * 0.28 + Math.sin(t * 0.45) * 0.04),
      4,
      dt,
    );
    g.rotation.x = damp(g.rotation.x, k * (-py * 0.09), 4, dt);
    g.rotation.z = damp(g.rotation.z, k * Math.sin(t * 0.7) * 0.015, 4, dt);
  });
  return <group ref={ref}>{children}</group>;
}

// Responsive camera distance and FOV based on viewport aspect ratio and screen width (<768px)
function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const isMobile = size.width < 768;
    const aspect = size.width / size.height;

    let d;
    let lookTargetY = 0.9;

    if (isMobile || aspect < 0.75) {
      // Mobile portrait viewports: move camera back and adjust FOV slightly
      // so the bowl assembly fits completely without clipping left/right
      d = aspect < 0.5 ? 14.2 : 12.8;
      lookTargetY = 0.75;
      camera.fov = 40;
    } else if (aspect < 1.1) {
      d = 10.2;
      lookTargetY = 0.9;
      camera.fov = 38;
    } else {
      d = 8.7;
      lookTargetY = 0.9;
      camera.fov = 38;
    }

    camera.position.set(0, d * 0.8, d * 0.7);
    camera.lookAt(0, lookTargetY, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

/* ================================================================
   3D Ingredient Components
   ================================================================ */

// Acacia wood bowl — lathe profile with scale + rotation entrance
function Bowl({ progress }) {
  const ref = useRef();
  const tex = useMemo(makeWoodTexture, []);
  const geo = useMemo(() => {
    const pts = [
      [0, 0],
      [1.35, 0],
      [1.6, 0.06],
      [2.15, 0.45],
      [2.7, 1.1],
      [3.05, 1.8],
      [3.22, 2.4],
      [3.18, 2.5],
      [3.0, 2.5],
      [2.92, 2.05],
      [2.6, 1.3],
      [2.05, 0.7],
      [1.3, 0.4],
      [0, 0.34],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 112);
  }, []);

  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    const t = easeOutCubic(progress.get());
    const s = damp(m.scale.x, Math.max(0.001, t), 8, dt);
    m.scale.setScalar(s);
    m.rotation.y = damp(m.rotation.y, (1 - t) * 1.3, 8, dt);
    m.rotation.x = damp(m.rotation.x, (1 - t) * -0.35, 8, dt);
    m.visible = t > 0.001;
  });

  return (
    <mesh ref={ref} geometry={geo} scale={0.001} visible={false} castShadow receiveShadow>
      <meshStandardMaterial map={tex} roughness={0.58} metalness={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

// 46 chili-oil noodle strands (extruded CatmullRom curves) + sauce base + oil droplets
function Noodles() {
  const { geos, oilDrops } = useMemo(() => {
    const rng = mulberry32(2024);
    const shape = new THREE.Shape();
    const w = 0.17;
    const h = 0.05;
    shape.moveTo(-w / 2, -h / 2);
    shape.lineTo(w / 2, -h / 2);
    shape.lineTo(w / 2, h / 2);
    shape.lineTo(-w / 2, h / 2);
    shape.closePath();

    const result = [];
    const R = 2.05;
    for (let i = 0; i < 46; i++) {
      const pts = [];
      let ang = rng() * Math.PI * 2;
      let r = rng() * 1.6;
      let x = Math.cos(ang) * r;
      let z = Math.sin(ang) * r;
      let dir = rng() * Math.PI * 2;
      for (let k = 0; k < 8; k++) {
        const rr = Math.hypot(x, z);
        const y = 1.36 + 0.34 * (1 - rr / 2.3) + rng() * 0.16;
        pts.push(new THREE.Vector3(x, y, z));
        dir += (rng() - 0.5) * 1.6;
        x += Math.cos(dir) * 0.62;
        z += Math.sin(dir) * 0.62;
        const nr = Math.hypot(x, z);
        if (nr > R) {
          x *= R / nr;
          z *= R / nr;
          dir += Math.PI * 0.8;
        }
      }
      const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
      result.push({
        geo: new THREE.ExtrudeGeometry(shape, {
          steps: 72,
          bevelEnabled: false,
          extrudePath: curve,
        }),
        v: i % 3,
      });
    }

    const drops = [];
    for (let i = 0; i < 16; i++) {
      const a = rng() * Math.PI * 2;
      const r = 0.3 + rng() * 1.7;
      drops.push({
        p: [Math.cos(a) * r, 1.42 + 0.32 * (1 - r / 2.3) + 0.12, Math.sin(a) * r],
        s: 0.07 + rng() * 0.11,
      });
    }
    return { geos: result, oilDrops: drops };
  }, []);

  const mats = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        color: '#e9a445',
        roughness: 0.34,
        metalness: 0,
        emissive: '#5a1c00',
        emissiveIntensity: 0.12,
      }),
      new THREE.MeshStandardMaterial({
        color: '#dd8a30',
        roughness: 0.3,
        metalness: 0,
        emissive: '#6a1e00',
        emissiveIntensity: 0.14,
      }),
      new THREE.MeshStandardMaterial({
        color: '#f0b45a',
        roughness: 0.38,
        metalness: 0,
        emissive: '#4a1400',
        emissiveIntensity: 0.1,
      }),
    ],
    [],
  );

  return (
    <group>
      {/* Chili-oil sauce base */}
      <mesh position={[0, 1.13, 0]}>
        <cylinderGeometry args={[2.52, 2.0, 0.56, 64]} />
        <meshStandardMaterial
          color="#c4501c"
          roughness={0.28}
          emissive="#5a1400"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 1.2, 0]} scale={[2.0, 0.55, 2.0]}>
        <sphereGeometry args={[1, 40, 24]} />
        <meshStandardMaterial
          color="#e29a3f"
          roughness={0.36}
          emissive="#4a1400"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Noodle strands */}
      {geos.map(({ geo, v }, i) => (
        <mesh key={i} geometry={geo} material={mats[v]} />
      ))}
      {/* Chili oil droplets */}
      {oilDrops.map((d, i) => (
        <mesh key={'o' + i} position={d.p} scale={[d.s, d.s * 0.3, d.s]}>
          <sphereGeometry args={[1, 16, 10]} />
          <meshStandardMaterial
            color="#c8300e"
            roughness={0.12}
            emissive="#701000"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// 6 medium-rare steak slices with procedural marbling texture
function Steak() {
  const topTex = useMemo(makeSteakTexture, []);
  const slices = useMemo(() => {
    const out = [];
    const n = 6;
    const r = 1.72;
    for (let i = 0; i < n; i++) {
      const a = -1.2 + (i / (n - 1)) * 1.75;
      out.push({
        a,
        pos: [Math.cos(a) * r, 1.86, Math.sin(a) * r],
        ry: Math.PI / 2 - a,
        lean: -0.92 + (i % 2) * 0.1,
      });
    }
    return out;
  }, []);
  const mats = useMemo(() => {
    const cut = () =>
      new THREE.MeshStandardMaterial({ map: topTex, roughness: 0.42, metalness: 0 });
    const crust = () =>
      new THREE.MeshStandardMaterial({ color: '#4a2212', roughness: 0.55, metalness: 0 });
    // [px, nx, py, ny, pz, nz]
    return slices.map(() => [cut(), cut(), crust(), crust(), crust(), crust()]);
  }, [slices, topTex]);

  return (
    <group>
      {slices.map((s, i) => (
        <group key={i} position={s.pos} rotation={[0, s.ry, 0]}>
          <mesh rotation={[0, 0, s.lean]} material={mats[i]} castShadow>
            <boxGeometry args={[0.22, 0.74, 1.06]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 6 pan-fried gyoza with pleated crimped edges
function Gyoza() {
  const tex = useMemo(makeGyozaTexture, []);
  const items = useMemo(() => {
    const out = [];
    const xs = [-1.45, -0.85, -0.25, 0.35, 0.95, 1.5];
    xs.forEach((x, i) => {
      const z = 1.62 - 0.19 * x * x;
      out.push({
        pos: [x, 1.72 + (i % 2) * 0.03, z],
        rot: [
          -0.12 + (i % 2) * 0.24,
          x * 0.32 + (i % 2 ? 0.25 : -0.15),
          ((i % 3) - 1) * 0.14,
        ],
      });
    });
    return out;
  }, []);

  return (
    <group>
      {items.map((g, i) => (
        <group key={i} position={g.pos} rotation={g.rot}>
          <mesh scale={[0.54, 0.21, 0.31]} castShadow>
            <sphereGeometry args={[1, 40, 24]} />
            <meshStandardMaterial map={tex} roughness={0.55} metalness={0} />
          </mesh>
          {/* Pleated crimped edge */}
          <mesh position={[0, 0.06, -0.2]} scale={[0.46, 0.09, 0.09]} rotation={[0.35, 0, 0]}>
            <torusGeometry args={[1, 0.35, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#e9c88f" roughness={0.62} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 4 jammy soft-boiled egg halves with yolk highlight + black sesame seeds
function Eggs() {
  const eggs = useMemo(() => {
    const rng = mulberry32(555);
    const r = 1.78;
    return [-1.32, -1.84, -2.38, -2.94].map((a) => {
      const seeds = Array.from({ length: 9 }, () => {
        const t = rng() * Math.PI * 2;
        const rr = Math.sqrt(rng()) * 0.85;
        return {
          p: [Math.cos(t) * rr * 0.42, 0.012, Math.sin(t) * rr * 0.56],
          r: rng() * Math.PI,
        };
      });
      return {
        pos: [Math.cos(a) * r, 1.74, Math.sin(a) * r],
        ry: -a,
        seeds,
        yolkOff: (rng() - 0.5) * 0.1,
      };
    });
  }, []);

  return (
    <group>
      {eggs.map((e, i) => (
        <group key={i} position={e.pos} rotation={[0.08, e.ry, 0]}>
          {/* Egg white hemisphere */}
          <mesh scale={[0.46, 0.4, 0.62]} castShadow>
            <sphereGeometry args={[1, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            <meshStandardMaterial color="#f7f4ee" roughness={0.48} />
          </mesh>
          {/* Cut face */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[0.46, 0.62, 1]}>
            <circleGeometry args={[1, 40]} />
            <meshStandardMaterial color="#fbf8f2" roughness={0.45} />
          </mesh>
          {/* Jammy yolk */}
          <mesh position={[0, 0.01, e.yolkOff]} scale={[0.28, 0.1, 0.38]}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshStandardMaterial
              color="#f39a1f"
              roughness={0.2}
              emissive="#7a3a00"
              emissiveIntensity={0.25}
            />
          </mesh>
          <mesh position={[0.04, 0.03, e.yolkOff + 0.05]} scale={[0.15, 0.08, 0.2]}>
            <sphereGeometry args={[1, 24, 12]} />
            <meshStandardMaterial
              color="#ffb52e"
              roughness={0.12}
              emissive="#8a4400"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Black sesame seeds */}
          {e.seeds.map((s, k) => (
            <mesh key={k} position={s.p} rotation={[0, s.r, 0]} scale={[0.028, 0.014, 0.046]}>
              <sphereGeometry args={[1, 10, 6]} />
              <meshStandardMaterial color="#111111" roughness={0.35} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// 150 instanced scallion pieces with color palette variation
function GreenOnions() {
  const ref = useRef();
  const count = 150;

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const rng = mulberry32(31337);
    const dummy = new THREE.Object3D();
    const palette = ['#4d9a2c', '#63b23d', '#8ccd63', '#3f8a26', '#dfe9c4', '#a9d98a'];
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const t = rng() * Math.PI * 2;
      const rr = Math.pow(rng(), 0.55) * 0.66;
      const y = 1.82 + (1 - rr / 0.66) * 0.28 + rng() * 0.08;
      dummy.position.set(
        0.05 + Math.cos(t) * rr,
        y,
        -0.05 + Math.sin(t) * rr * 0.85,
      );
      dummy.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
      const s = 0.8 + rng() * 0.5;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      color.set(palette[Math.floor(rng() * palette.length)]);
      m.setColorAt(i, color);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow>
      <cylinderGeometry args={[0.07, 0.065, 0.075, 10, 1, false]} />
      <meshStandardMaterial roughness={0.5} />
    </instancedMesh>
  );
}

/* ================================================================
   Rising Steam (ported from old code, adjusted for new bowl)
   ================================================================ */

function SteamParticles({ progress }) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    const steamP = clamp01(progress.get());
    if (steamP <= 0.01) {
      group.current.visible = false;
      return;
    }
    group.current.visible = true;
    const time = state.clock.elapsedTime;

    group.current.children.forEach((child, i) => {
      const p = steamParticleData[i];
      const cycleDuration = 4.2;
      const progressInCycle = ((time * p.speed + p.offset) % cycleDuration) / cycleDuration;

      // Rise from bowl rim (~y 2.5) upward 4 units
      const y = 2.5 + progressInCycle * 4.0;

      // Natural plume expansion as wisps rise
      const expansionFactor = 1 + progressInCycle * 0.9;
      const curRadius = p.originRadius * expansionFactor;
      const curAngle = p.originAngle + Math.sin(time * p.swirlFreq + p.offset) * 0.35;

      const x =
        Math.cos(curAngle) * curRadius + Math.sin(time * 0.7 + p.offset) * p.swirlAmp;
      const z =
        Math.sin(curAngle) * curRadius + Math.cos(time * 0.7 + p.offset) * p.swirlAmp;

      child.position.set(x, y, z);

      // Smooth envelope: fade-in near surface, peak mid-rise, fade at top
      let fade;
      if (progressInCycle < 0.18) {
        fade = progressInCycle / 0.18;
      } else if (progressInCycle > 0.58) {
        fade = Math.max(0, 1 - (progressInCycle - 0.58) / 0.42);
      } else {
        fade = 1.0;
      }

      const scale = p.baseScale * (1 + progressInCycle * 0.85) * steamP;
      child.scale.set(scale, scale, 1);
      child.material.opacity = steamP * fade * 0.82;
    });
  });

  return (
    <group ref={group} visible={false}>
      {steamParticleData.map((_, i) => (
        <sprite key={i}>
          <spriteMaterial
            map={steamPuffTexture}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

/* ================================================================
   Scene Composition
   ================================================================ */

function Scene({ phases }) {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const aspect = size.width / size.height;

  // Dynamically scale the 3D bowl down on mobile portrait (<768px)
  // so the bowl fits completely inside the screen without clipping off the left/right edges
  const bowlScale = isMobile
    ? aspect < 0.52
      ? 0.65
      : 0.74
    : 1.0;

  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.7} color="#fff6ea" />
      <hemisphereLight args={['#fff7ea', '#8a6a4a', 0.4]} />
      {/* Warm key light with shadows */}
      <directionalLight
        position={[5, 9, 5]}
        intensity={1.35}
        color="#fff2df"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Cool fill light */}
      <directionalLight position={[-6, 6, -4]} intensity={0.4} color="#dfe8ff" />

      <CameraRig />

      <Float progress={phases.done} baseScale={bowlScale}>
        <Bowl progress={phases.bowl} />
        <Ingredient progress={phases.noodles} drop={3.5}>
          <Noodles />
        </Ingredient>
        <Ingredient progress={phases.proteins} drop={5}>
          <Steak />
          <Gyoza />
        </Ingredient>
        <Ingredient progress={phases.eggs} drop={5}>
          <Eggs />
        </Ingredient>
        <Ingredient progress={phases.garnish} drop={5}>
          <GreenOnions />
        </Ingredient>
        <SteamParticles progress={phases.steam} />
      </Float>
    </>
  );
}

/* ================================================================
   Exported Component
   ================================================================ */

export default function RamenCanvas3D({ scrollProgress, className = "sticky top-0 h-screen h-[100dvh] w-full" }) {
  // Create phase MotionValues outside Canvas (framer-motion hooks must be in DOM React tree)
  const phases = {
    bowl: useTransform(scrollProgress, [0, 0.2], [0, 1]),
    noodles: useTransform(scrollProgress, [0.2, 0.4], [0, 1]),
    proteins: useTransform(scrollProgress, [0.4, 0.6], [0, 1]),
    eggs: useTransform(scrollProgress, [0.6, 0.8], [0, 1]),
    garnish: useTransform(scrollProgress, [0.8, 1.0], [0, 1]),
    done: useTransform(scrollProgress, [0.86, 1.0], [0, 1]),
    steam: useTransform(scrollProgress, [0.88, 1.0], [0, 1]),
  };

  return (
    <div
      className={`${className} pointer-events-none select-none`}
      style={{ touchAction: 'pan-y' }}
    >
      <Canvas
        dpr={[1, 1.6]}
        shadows
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 38, near: 0.1, far: 100, position: [0, 7, 6] }}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMappingExposure = 1.08;
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          pointerEvents: 'none',
          touchAction: 'pan-y',
        }}
      >
        <Scene phases={phases} />
      </Canvas>
    </div>
  );
}
