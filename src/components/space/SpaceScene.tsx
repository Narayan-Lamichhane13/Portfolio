import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import {
  EARTH_POSITION,
  EARTH_RADIUS,
  MOON_POSITION,
  MOON_RADIUS,
  SUN_POSITION,
  SUN_RADIUS,
  WAYPOINTS,
} from './waypoints';

export interface SpaceSceneHandle {
  /** Set the target progress (0..1) along the orbital curve. The camera will
   *  smoothly ease toward this position. */
  setProgress: (t: number) => void;
  /** Snap the camera to a progress value with no easing (used by skipAnimations). */
  setProgressInstant: (t: number) => void;
  /** Read the current animated progress (the camera's actual position, not the target). */
  getCurrentProgress: () => number;
  /** Play the trans-Earth coast outro: peel away from the moon and arc back
   *  toward Earth. Calls onComplete once the cinematic finishes so the caller
   *  can show the end-of-tour overlay. */
  playOutro: (onComplete: () => void) => void;
}

interface SpaceSceneProps {
  /** Fired once when the camera finishes easing to its target progress. */
  onArrive?: (progress: number) => void;
}

export const SpaceScene = forwardRef<SpaceSceneHandle, SpaceSceneProps>(
  function SpaceScene({ onArrive }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<SpaceSceneHandle | null>(null);
  const onArriveRef = useRef(onArrive);
  onArriveRef.current = onArrive;

  useImperativeHandle(ref, () => ({
    setProgress: (t) => apiRef.current?.setProgress(t),
    setProgressInstant: (t) => apiRef.current?.setProgressInstant(t),
    getCurrentProgress: () => apiRef.current?.getCurrentProgress() ?? 0,
    playOutro: (cb) => apiRef.current?.playOutro(cb),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01020a);
    // Distant deep-space fog gives the void a sense of volume.
    scene.fog = new THREE.FogExp2(0x01020a, 0.0015);

    const baseFov = 46;
    const camera = new THREE.PerspectiveCamera(baseFov, 1, 0.05, 1200);
    camera.position.copy(WAYPOINTS[0].pos);
    camera.lookAt(WAYPOINTS[0].lookAt);
    scene.add(camera);

    /* ─── Lights ──────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x3a5478, 0.45));
    const sunLight = new THREE.DirectionalLight(0xfff1d6, 2.6);
    sunLight.position.copy(SUN_POSITION);
    scene.add(sunLight);
    // Cool fill from the Earth side — earthshine.
    const earthFill = new THREE.DirectionalLight(0x4a7cb8, 0.35);
    earthFill.position.copy(EARTH_POSITION);
    scene.add(earthFill);

    /* ─── Distant nebulae (deep background color) ─────────────────── */
    scene.add(makeNebulae());

    /* ─── Stars (multi-class, twinkling, with milky way band) ─────── */
    const stars = makeStars();
    scene.add(stars.points);
    scene.add(stars.bright);

    /* ─── Sun (animated plasma sphere + layered halos + flares) ───── */
    const sunGroup = makeSun();
    scene.add(sunGroup);

    /* ─── Earth (procedural day/night, clouds, atmosphere) ────────── */
    const earthGroup = makeEarth();
    scene.add(earthGroup);

    /* ─── Moon (procedural, bump-mapped, deep crater field) ───────── */
    const moonGroup = makeMoon();
    scene.add(moonGroup);

    /* ─── Rocket (multi-stage, with plume) ────────────────────────── */
    const rocket = new THREE.Group();
    const rocketModel = makeRocket();
    rocketModel.rotation.x = Math.PI / 2;
    rocketModel.rotation.z = Math.PI;
    rocket.add(rocketModel);
    rocket.scale.setScalar(0.6);
    scene.add(rocket);
    const ROCKET_OFFSET = new THREE.Vector3(0, -1.55, -4.2);

    // Off-scene helper used to compute the rocket's *target* orientation
    // each frame; the actual rocket then quaternion-slerps toward it so
    // direction changes feel smooth rather than snap.
    const rocketTargetHelper = new THREE.Object3D();
    let rocketInitialized = false;

    /* ─── Orbital curves (Catmull-Rom through every waypoint) ──────── */
    const positions = WAYPOINTS.map((w) => w.pos.clone());
    const lookAts = WAYPOINTS.map((w) => w.lookAt.clone());
    const rolls = WAYPOINTS.map((w) => w.roll ?? 0);

    const cameraCurve = new THREE.CatmullRomCurve3(
      positions,
      false,
      'centripetal',
      0.5,
    );
    const lookCurve = new THREE.CatmullRomCurve3(
      lookAts,
      false,
      'centripetal',
      0.5,
    );

    /* ─── Camera state ────────────────────────────────────────────── */
    let currentT = 0;
    let targetT = 0;
    let currentVel = 0;
    let currentRoll = rolls[0];
    let arrived = true;
    const tmpPos = new THREE.Vector3();
    const tmpLook = new THREE.Vector3();

    /* ─── Outro (trans-Earth coast) state ─────────────────────────── */
    let outroActive = false;
    let outroStartMs = 0;
    const OUTRO_DURATION_MS = 4200;
    let outroOnComplete: (() => void) | null = null;
    let outroCurve: THREE.CatmullRomCurve3 | null = null;
    const outroLookStart = new THREE.Vector3();
    const outroLookEnd = EARTH_POSITION.clone();
    const outroLook = new THREE.Vector3();

    function sampleRoll(t: number): number {
      const f = t * (rolls.length - 1);
      const i0 = Math.max(0, Math.min(rolls.length - 1, Math.floor(f)));
      const i1 = Math.max(0, Math.min(rolls.length - 1, i0 + 1));
      const w = f - i0;
      return rolls[i0] * (1 - w) + rolls[i1] * w;
    }

    apiRef.current = {
      setProgress: (t) => {
        if (outroActive) return;
        targetT = THREE.MathUtils.clamp(t, 0, 1);
        if (Math.abs(targetT - currentT) > 0.001) arrived = false;
      },
      setProgressInstant: (t) => {
        if (outroActive) return;
        targetT = THREE.MathUtils.clamp(t, 0, 1);
        currentT = targetT;
        currentVel = 0;
        arrived = true;
      },
      getCurrentProgress: () => currentT,
      playOutro: (cb) => {
        if (outroActive) return;
        outroOnComplete = cb;
        outroStartMs = performance.now();
        // Pin orbit progress so when outro ends the camera "lands" cleanly at
        // the last anchor (the Thank You overlay covers any micro-snap).
        targetT = 1;
        currentT = 1;
        currentVel = 0;
        arrived = true;
        // Curve sweeps from current camera position out past the moon and on
        // toward Earth — control points chosen for a wide cinematic arc.
        outroCurve = new THREE.CatmullRomCurve3(
          [
            camera.position.clone(),
            new THREE.Vector3(11, 4.5, 0.5),
            new THREE.Vector3(-2, 6, 11),
            new THREE.Vector3(-16, 7, 19),
          ],
          false,
          'centripetal',
          0.5,
        );
        outroLookStart.copy(MOON_POSITION);
        outroActive = true;
      },
    };

    {
      const p0 = cameraCurve.getPoint(0);
      const l0 = lookCurve.getPoint(0);
      camera.position.copy(p0);
      camera.lookAt(l0);
    }

    /* ─── Resize ──────────────────────────────────────────────────── */
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ─── Animation loop ──────────────────────────────────────────── */
    const tmpVec = new THREE.Vector3();
    const tmpUp = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const rocketWorldPos = new THREE.Vector3();
    const rocketLookTarget = new THREE.Vector3();
    let frameId = 0;
    const start = performance.now();
    let lastTime = start;

    const step = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const elapsed = (now - start) / 1000;

      stars.update(elapsed);
      sunGroup.userData.update(elapsed, camera);
      earthGroup.userData.update(elapsed);
      moonGroup.userData.update(elapsed);

      // Active curve + progress used for rocket tangent below — defaults to
      // the orbit, switched to the outro path while the cinematic plays.
      let activeCurve: THREE.CatmullRomCurve3 = cameraCurve;
      let activeT = currentT;
      let speed = 0;
      let moving = false;
      let inOutroFrame = false;
      let outroCompletedThisFrame = false;

      if (outroActive && outroCurve) {
        inOutroFrame = true;
        const t01 = Math.min(1, (now - outroStartMs) / OUTRO_DURATION_MS);
        // Cubic ease-in-out — slow peel-off, smooth acceleration, gentle hold.
        const eased =
          t01 < 0.5
            ? 4 * t01 * t01 * t01
            : 1 - Math.pow(-2 * t01 + 2, 3) / 2;

        outroCurve.getPoint(eased, tmpPos);
        outroLook.copy(outroLookStart).lerp(outroLookEnd, eased);

        camera.position.copy(tmpPos);
        camera.up.set(0, 1, 0);
        camera.lookAt(outroLook);

        // Smoothly settle FOV back to base — no thrust-pulse during cinematic.
        camera.fov += (baseFov - camera.fov) * Math.min(1, dt * 4);
        camera.updateProjectionMatrix();

        activeCurve = outroCurve;
        activeT = eased;
        speed = 0.05; // simulated steady cruise so the plume reads as burning
        moving = true;

        if (t01 >= 1) {
          outroActive = false;
          outroCompletedThisFrame = true;
        }
      } else {
        const prevT = currentT;
        if (prefersReduced) {
          currentT = targetT;
          currentVel = 0;
        } else {
          // Slower natural frequency + a touch more damping than critical so
          // the camera glides toward the target instead of darting and
          // jittering when the user scrolls in rapid bursts.
          const omega = 4.6;
          const zeta = 1.15;
          const x = currentT - targetT;
          const accel =
            -2 * zeta * omega * currentVel - omega * omega * x;
          currentVel += accel * dt;
          currentT += currentVel * dt;
        }
        currentT = THREE.MathUtils.clamp(currentT, 0, 1);
        if (Math.abs(currentT - targetT) < 0.0005 && Math.abs(currentVel) < 0.002) {
          currentT = targetT;
          currentVel = 0;
        }

        speed = Math.abs(currentT - prevT) / Math.max(dt, 0.0001);
        moving = Math.abs(currentT - targetT) > 0.0008;
        activeT = currentT;

        cameraCurve.getPoint(currentT, tmpPos);
        lookCurve.getPoint(currentT, tmpLook);
        currentRoll = sampleRoll(currentT);

        // Settled drift — gentle parallax breathing while parked.
        const driftMag = moving ? 0 : 0.10;
        tmpPos.x += Math.sin(elapsed * 0.18) * driftMag;
        tmpPos.y += Math.sin(elapsed * 0.13 + 1.3) * driftMag * 0.7;
        tmpPos.z += Math.cos(elapsed * 0.15) * driftMag;

        camera.position.copy(tmpPos);
        tmpVec.subVectors(tmpLook, camera.position).normalize();
        tmpUp.set(0, 1, 0).applyAxisAngle(tmpVec, currentRoll);
        camera.up.copy(tmpUp);
        camera.lookAt(tmpLook);

        // Hold FOV steady — the cruise camera no longer breathes with speed.
        camera.fov += (baseFov - camera.fov) * Math.min(1, dt * 4);
        camera.updateProjectionMatrix();

        if (!arrived && !moving) {
          arrived = true;
          onArriveRef.current?.(currentT);
        }
      }

      // ── Rocket: compute target pose, then ease toward it ─────────
      // Target world position is the camera-relative offset.
      rocketWorldPos
        .copy(ROCKET_OFFSET)
        .applyQuaternion(camera.quaternion)
        .add(camera.position);

      // Target orientation: face along the curve tangent, banked slightly
      // toward whichever body we're orbiting/approaching. Computed on a
      // detached helper so the rocket itself can slerp toward the result.
      activeCurve.getTangent(activeT, tangent).normalize().negate();
      const bankTarget = inOutroFrame ? EARTH_POSITION : MOON_POSITION;
      const dirToTarget = tmpVec
        .copy(bankTarget)
        .sub(rocketWorldPos)
        .normalize();
      const bank = moving ? 0.18 : 0.0;
      rocketLookTarget
        .copy(rocketWorldPos)
        .addScaledVector(tangent, 1)
        .addScaledVector(dirToTarget, bank);
      rocketTargetHelper.position.copy(rocketWorldPos);
      rocketTargetHelper.up.set(0, 1, 0);
      rocketTargetHelper.lookAt(rocketLookTarget);

      if (!rocketInitialized) {
        // First frame — snap so the rocket doesn't lerp in from world origin.
        rocket.position.copy(rocketWorldPos);
        rocket.quaternion.copy(rocketTargetHelper.quaternion);
        rocketInitialized = true;
      } else {
        // Frame-rate-independent exponential smoothing. Position lerps faster
        // than rotation so the rocket "trails" the camera realistically while
        // its heading eases through curve direction changes.
        const posK = 1 - Math.pow(0.0001, dt); // ~roughly dt*9 at 60fps
        const rotK = 1 - Math.pow(0.002, dt);  // slower — tames tangent jolts
        rocket.position.lerp(rocketWorldPos, posK);
        rocket.quaternion.slerp(rocketTargetHelper.quaternion, rotK);
      }

      // Engine plume + bell glow — gentler pulse so the flame reads as a
      // continuous burn rather than flickering candle-light.
      const ud = rocketModel.userData;
      const thrustBase = 0.85 + Math.min(speed * 12, 0.9);
      const pulse =
        thrustBase + Math.sin(elapsed * (moving ? 9 : 4.5)) * (moving ? 0.10 : 0.05);
      const plumeOpacity = THREE.MathUtils.clamp(pulse * 0.55, 0.35, 1);
      const plumeScale = pulse * 0.42;

      (ud.plumeOuter as THREE.Sprite).material.opacity = plumeOpacity * 0.55;
      (ud.plumeOuter as THREE.Sprite).scale.set(plumeScale * 1.55, plumeScale * 2.1, 1);
      (ud.plumeInner as THREE.Sprite).material.opacity = plumeOpacity;
      (ud.plumeInner as THREE.Sprite).scale.set(plumeScale * 0.92, plumeScale * 1.4, 1);
      (ud.plumeCore as THREE.Sprite).material.opacity = plumeOpacity * 1.05;
      (ud.plumeCore as THREE.Sprite).scale.set(plumeScale * 0.5, plumeScale * 0.85, 1);
      (ud.bellGlow as THREE.Sprite).material.opacity = plumeOpacity * 0.9;
      (ud.bellGlow as THREE.Sprite).scale.setScalar(0.30 + pulse * 0.05);

      // Side-booster mini-plumes
      for (const side of ['boosterPlumeL', 'boosterPlumeR'] as const) {
        const s = ud[side] as THREE.Sprite;
        s.material.opacity = plumeOpacity * 0.55;
        s.scale.set(plumeScale * 0.55, plumeScale * 0.82, 1);
      }

      // Window emissive flicker
      const winMat = ud.windowMat as THREE.MeshStandardMaterial;
      winMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 3.1) * 0.08;

      rocketModel.rotation.y = Math.sin(elapsed * 0.4) * 0.04;

      renderer.render(scene, camera);

      // Fire the outro callback after the final frame has been rendered, so
      // the Thank You overlay appears over the freshly-painted Earth approach
      // shot rather than mid-animation.
      if (outroCompletedThisFrame) {
        const cb = outroOnComplete;
        outroOnComplete = null;
        outroCurve = null;
        cb?.();
      }

      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      apiRef.current = null;
      disposeNode(scene);
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      aria-hidden
    />
  );
});

/* ──────────────────────────────────────────────────────────────────── */
/* Stars                                                                */
/* ──────────────────────────────────────────────────────────────────── */

/** Stellar color palette — Harvard spectral classes O→M, weighted toward G/K
 *  to roughly match observed counts. Returns vec3-ish [r, g, b]. */
const STELLAR_PALETTE: Array<[number, number, number]> = [
  [0.62, 0.74, 1.00], // O — blue
  [0.74, 0.83, 1.00], // B — blue-white
  [0.90, 0.94, 1.00], // A — white
  [0.99, 0.98, 0.94], // F — yellow-white
  [1.00, 0.96, 0.86], // G — sun-like yellow
  [1.00, 0.85, 0.66], // K — orange
  [1.00, 0.66, 0.45], // M — red
];
const STELLAR_WEIGHTS = [1, 4, 12, 18, 25, 25, 15];

function pickStellarColor(): [number, number, number] {
  const total = STELLAR_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < STELLAR_WEIGHTS.length; i++) {
    r -= STELLAR_WEIGHTS[i];
    if (r <= 0) return STELLAR_PALETTE[i];
  }
  return STELLAR_PALETTE[4];
}

function makeStars() {
  // Tilt matrix for the "milky way" plane — random tilt, fixed per build.
  const tilt = new THREE.Matrix4().makeRotationFromEuler(
    new THREE.Euler(0.45, 1.1, 0.2),
  );

  function genPosition(galactic: boolean): [number, number, number] {
    let theta: number;
    let phi: number;
    if (galactic) {
      theta = Math.random() * Math.PI * 2;
      // Gaussian-ish concentration around the equator (phi = π/2)
      const g = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
      phi = Math.PI / 2 + g * 0.55;
    } else {
      theta = Math.random() * Math.PI * 2;
      phi = Math.acos(2 * Math.random() - 1);
    }
    const r = 360 + Math.random() * 80;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);
    const v = new THREE.Vector3(x, y, z).applyMatrix4(tilt);
    return [v.x, v.y, v.z];
  }

  // ── Main star field
  const count = 7200;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const galactic = Math.random() < 0.4;
    const [x, y, z] = genPosition(galactic);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Most stars are tiny pinpricks; a small fraction are notably brighter.
    const r = Math.random();
    sizes[i] = r < 0.85 ? 0.5 + Math.random() * 0.4 : 1.0 + Math.random() * 0.7;

    const c = pickStellarColor();
    colors[i * 3] = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];

    seeds[i] = Math.random();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('starColor', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute float size;
      attribute float seed;
      attribute vec3 starColor;
      varying float vSize;
      varying float vSeed;
      varying vec3 vColor;
      uniform float uTime;
      void main() {
        vSize = size;
        vSeed = seed;
        vColor = starColor;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        // Per-star twinkle, frequency varies with seed.
        float tw = 0.65 + 0.35 *
          sin(uTime * (1.2 + seed * 5.0) + seed * 31.0);
        gl_PointSize = size * tw * (340.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vSize;
      varying float vSeed;
      varying vec3 vColor;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float halo = smoothstep(0.5, 0.0, d);
        float core = smoothstep(0.18, 0.0, d);
        // 4-point diffraction spike for the brightest stars
        float spike = 0.0;
        if (vSize > 1.05) {
          float dx = abs(c.x);
          float dy = abs(c.y);
          spike =
            smoothstep(0.04, 0.0, dy) * smoothstep(0.5, 0.05, dx) +
            smoothstep(0.04, 0.0, dx) * smoothstep(0.5, 0.05, dy);
        }
        vec3 col = mix(vColor, vec3(1.0), core * 0.65);
        float a = halo * 0.55 + core * 0.55 + spike * 0.45;
        gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, mat);

  // ── A tiny constellation of really bright "named" stars with fat halos
  const brightCount = 18;
  const bGeo = new THREE.BufferGeometry();
  const bPos = new Float32Array(brightCount * 3);
  const bSize = new Float32Array(brightCount);
  const bColor = new Float32Array(brightCount * 3);
  const bSeed = new Float32Array(brightCount);
  for (let i = 0; i < brightCount; i++) {
    const [x, y, z] = genPosition(Math.random() < 0.6);
    bPos[i * 3] = x;
    bPos[i * 3 + 1] = y;
    bPos[i * 3 + 2] = z;
    bSize[i] = 2.2 + Math.random() * 1.4;
    const c = pickStellarColor();
    bColor[i * 3] = c[0];
    bColor[i * 3 + 1] = c[1];
    bColor[i * 3 + 2] = c[2];
    bSeed[i] = Math.random();
  }
  bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
  bGeo.setAttribute('size', new THREE.BufferAttribute(bSize, 1));
  bGeo.setAttribute('starColor', new THREE.BufferAttribute(bColor, 3));
  bGeo.setAttribute('seed', new THREE.BufferAttribute(bSeed, 1));
  const bright = new THREE.Points(bGeo, mat.clone());
  (bright.material as THREE.ShaderMaterial).uniforms = {
    uTime: { value: 0 },
  };

  return {
    points,
    bright,
    update(t: number) {
      mat.uniforms.uTime.value = t;
      ((bright.material as THREE.ShaderMaterial).uniforms.uTime as { value: number }).value = t;
    },
  };
}

/* ──────────────────────────────────────────────────────────────────── */
/* Distant nebulae                                                       */
/* ──────────────────────────────────────────────────────────────────── */

function makeNebulae() {
  const group = new THREE.Group();
  const nebulaTex = makeNebulaTexture();
  // A handful of huge soft color clouds painted onto the celestial sphere.
  const palette = [
    0x6a3aa0, // violet
    0x2c5fb8, // deep blue
    0x9c3a6b, // magenta
    0x276f7a, // teal
    0xb35a2e, // amber dust
  ];
  for (let i = 0; i < 5; i++) {
    const mat = new THREE.SpriteMaterial({
      map: nebulaTex,
      color: palette[i],
      transparent: true,
      opacity: 0.18 + Math.random() * 0.10,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sp = new THREE.Sprite(mat);
    // Place far behind the stars so they read as background haze.
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.PI / 2 + (Math.random() - 0.5) * 1.2;
    const r = 480;
    sp.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi) * 0.55,
      r * Math.sin(phi) * Math.sin(theta),
    );
    const size = 240 + Math.random() * 180;
    sp.scale.set(size, size * (0.7 + Math.random() * 0.4), 1);
    sp.material.rotation = Math.random() * Math.PI;
    group.add(sp);
  }
  return group;
}

function makeNebulaTexture() {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  // Soft cloud built from many translucent radial blobs.
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 80; i++) {
    const x = size / 2 + (Math.random() - 0.5) * size * 0.7;
    const y = size / 2 + (Math.random() - 0.5) * size * 0.7;
    const r = 12 + Math.random() * 60;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const a = 0.04 + Math.random() * 0.05;
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ──────────────────────────────────────────────────────────────────── */
/* Sun                                                                   */
/* ──────────────────────────────────────────────────────────────────── */

function makeSun() {
  const group = new THREE.Group();
  group.position.copy(SUN_POSITION);

  // Plasma photosphere — animated noise-driven shader.
  const sunGeo = new THREE.SphereGeometry(SUN_RADIUS * 0.62, 64, 48);
  const sunMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uCamera: { value: new THREE.Vector3() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vLocal;
      varying vec3 vNormalW;
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vLocal = normalize(position);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uCamera;
      varying vec3 vLocal;
      varying vec3 vNormalW;
      varying vec3 vWorldPos;

      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
      }
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i), hash(i+vec3(1,0,0)), u.x),
              mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), u.x), u.y),
          mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), u.x),
              mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), u.x), u.y),
          f.z
        );
      }
      float fbm(vec3 p) {
        float v = 0.0;
        float a = 0.55;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = p * 2.07 + 17.3;
          a *= 0.52;
        }
        return v;
      }
      void main() {
        // Two layers of noise drifting in opposite directions — this gives
        // the convective "boiling" surface look.
        vec3 p = vLocal * 3.5;
        float n1 = fbm(p + vec3(0.0, uTime * 0.05, 0.0));
        float n2 = fbm(p * 2.4 + vec3(uTime * -0.07, 0.0, uTime * 0.03));
        float granules = noise(vLocal * 50.0 + vec3(uTime * 0.2));
        float h = n1 * 0.55 + n2 * 0.30 + granules * 0.15;

        // Sunspots — rare dark blotches, very low frequency.
        float spot = smoothstep(0.78, 0.86, fbm(vLocal * 1.7 + 100.0));
        h -= spot * 0.45;

        // Color ramp: cool red basins → orange → bright yellow-white peaks.
        vec3 deep   = vec3(0.65, 0.10, 0.02);
        vec3 mid    = vec3(1.00, 0.45, 0.10);
        vec3 hot    = vec3(1.00, 0.90, 0.55);
        vec3 hotter = vec3(1.00, 1.00, 0.95);
        vec3 col = mix(deep, mid,    smoothstep(0.10, 0.40, h));
        col      = mix(col,  hot,    smoothstep(0.40, 0.65, h));
        col      = mix(col,  hotter, smoothstep(0.70, 0.90, h));

        // Limb darkening — real suns dim toward the edge.
        vec3 viewDir = normalize(uCamera - vWorldPos);
        float limb = pow(max(dot(normalize(vNormalW), viewDir), 0.0), 0.45);
        col *= 0.55 + 0.65 * limb;

        // Push slightly above 1 so additive halos build a credible bloom.
        col *= 1.55;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  // Don't tonemap the sun core — preserve the saturated bright colors.
  (sunMat as unknown as { toneMapped: boolean }).toneMapped = false;
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  group.add(sunMesh);

  // Layered halos — additive, untonemapped → real bloom feel.
  const halos: Array<[number, number, number, number]> = [
    [SUN_RADIUS * 1.05, 0xfff2c0, 0.95, 0],
    [SUN_RADIUS * 1.7,  0xffc068, 0.78, 0],
    [SUN_RADIUS * 2.8,  0xff9038, 0.50, 0],
    [SUN_RADIUS * 4.6,  0xff5418, 0.24, 0],
    [SUN_RADIUS * 8.0,  0xc8401e, 0.10, 0],
  ];
  for (const [r, c, o] of halos) {
    const sp = makeGlow(new THREE.Vector3(0, 0, 0), r, c, o);
    (sp.material as THREE.SpriteMaterial).toneMapped = false;
    group.add(sp);
  }

  // Flare cross — an animated star-shaped lens flare.
  const flareTex = makeFlareTexture();
  const flareMat = new THREE.SpriteMaterial({
    map: flareTex,
    color: 0xffe9b0,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  flareMat.toneMapped = false;
  const flare = new THREE.Sprite(flareMat);
  flare.scale.set(SUN_RADIUS * 8, SUN_RADIUS * 8, 1);
  group.add(flare);

  group.userData.update = (t: number, camera: THREE.PerspectiveCamera) => {
    sunMat.uniforms.uTime.value = t;
    sunMat.uniforms.uCamera.value.copy(camera.position);
    flareMat.rotation = t * 0.04;
    flareMat.opacity = 0.45 + Math.sin(t * 0.7) * 0.10;
    sunMesh.rotation.y = t * 0.02;
  };
  return group;
}

function makeFlareTexture() {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.translate(size / 2, size / 2);
  // Long thin rays along + and × axes — anamorphic-ish flare.
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 2);
    const grad = ctx.createLinearGradient(0, 0, size / 2, 0);
    grad.addColorStop(0, 'rgba(255,255,255,0.85)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.20)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, -1.5, size / 2, 3);
    ctx.restore();
  }
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 2 + Math.PI / 4);
    const grad = ctx.createLinearGradient(0, 0, size / 2.4, 0);
    grad.addColorStop(0, 'rgba(255,255,255,0.45)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.10)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, -1, size / 2.4, 2);
    ctx.restore();
  }
  // Small bright core
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 22);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(-size / 2, -size / 2, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ──────────────────────────────────────────────────────────────────── */
/* Earth                                                                 */
/* ──────────────────────────────────────────────────────────────────── */

function makeEarth() {
  const group = new THREE.Group();
  group.position.copy(EARTH_POSITION);

  const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 96, 64);
  const earthMat = new THREE.ShaderMaterial({
    uniforms: {
      uSunPos: { value: SUN_POSITION.clone() },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      varying vec3 vLocal;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vLocal = normalize(position);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunPos;
      uniform float uTime;
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      varying vec3 vLocal;

      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
      }
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i), hash(i+vec3(1,0,0)), u.x),
              mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), u.x), u.y),
          mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), u.x),
              mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), u.x), u.y),
          f.z
        );
      }
      float fbm(vec3 p, int oct) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 6; i++) {
          if (i >= oct) break;
          v += a * noise(p);
          p = p * 2.1 + 17.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        // Domain-warp the noise to break up symmetric blob continents.
        vec3 q = vLocal * 2.5;
        vec3 warp = vec3(
          fbm(q + 5.2, 4),
          fbm(q + 1.7, 4),
          fbm(q + 9.3, 4)
        ) * 1.4;
        float continent = fbm(vLocal * 3.0 + warp, 6);
        float detail    = fbm(vLocal * 12.0, 4);
        float n = continent * 0.75 + detail * 0.25;

        float seaLevel = 0.50;
        float landMask = smoothstep(seaLevel - 0.02, seaLevel + 0.04, n);
        float coast    = smoothstep(seaLevel - 0.04, seaLevel + 0.02, n)
                       - smoothstep(seaLevel + 0.02, seaLevel + 0.08, n);

        // Latitude (y of normalized local position).
        float lat = abs(vLocal.y);

        // Biome colors — vary with latitude to give tropical / temperate / polar.
        vec3 deepOcean    = vec3(0.025, 0.06, 0.18);
        vec3 ocean        = vec3(0.08,  0.22, 0.42);
        vec3 shallow      = vec3(0.18,  0.45, 0.62);
        vec3 tropical     = vec3(0.18,  0.40, 0.16);
        vec3 temperate    = vec3(0.30,  0.45, 0.20);
        vec3 desert       = vec3(0.60,  0.50, 0.26);
        vec3 tundra       = vec3(0.75,  0.78, 0.72);
        vec3 ice          = vec3(0.92,  0.96, 1.00);

        vec3 oceanCol = mix(deepOcean, ocean, smoothstep(0.30, 0.50, n));
        oceanCol      = mix(oceanCol, shallow, coast * 0.5);

        vec3 landBase = mix(tropical, temperate, smoothstep(0.18, 0.40, lat));
        landBase      = mix(landBase, desert,
                           smoothstep(0.30, 0.55, n) * (1.0 - smoothstep(0.15, 0.30, lat)));
        landBase      = mix(landBase, tundra,    smoothstep(0.55, 0.72, lat));

        vec3 surface = mix(oceanCol, landBase, landMask);
        // Polar ice — covers both ocean and land at high latitudes.
        float iceMask = smoothstep(0.70, 0.86, lat) +
                        smoothstep(0.60, 0.78, lat) * landMask * 0.6;
        surface = mix(surface, ice, clamp(iceMask, 0.0, 1.0));

        // Cloud layer (slow-drifting). We render clouds in a separate sphere
        // for parallax, but a faint base layer here helps the planet feel alive.
        float clouds = smoothstep(0.55, 0.78,
                          fbm(vLocal * 5.5 + vec3(uTime * 0.02, 0.0, 0.0), 5));
        surface = mix(surface, vec3(0.95, 0.96, 1.0), clouds * 0.18);

        // Lighting
        vec3 sunDir = normalize(uSunPos - vWorldPos);
        vec3 N = normalize(vNormalW);
        float ndotl = dot(N, sunDir);
        float day = smoothstep(-0.10, 0.25, ndotl);
        float light = clamp(ndotl, 0.0, 1.0);
        vec3 lit = surface * (0.10 + 0.95 * light);

        // Ocean specular glint — strong, mirror-like off the sea, none on land.
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        vec3 halfV = normalize(sunDir + viewDir);
        float spec = pow(max(dot(N, halfV), 0.0), 110.0);
        lit += spec * (1.0 - landMask) * vec3(1.0, 0.95, 0.85) * 1.4
                    * smoothstep(0.0, 0.4, ndotl);

        // City lights on the night side — only on land, only away from poles.
        float cityNoise = smoothstep(0.62, 0.86, fbm(vLocal * 22.0, 4));
        float pop       = cityNoise * landMask
                          * smoothstep(0.06, 0.20, n - 0.5)
                          * (1.0 - smoothstep(0.55, 0.75, lat));
        float night = 1.0 - day;
        lit += pop * night * vec3(1.0, 0.85, 0.50) * 1.8;

        // Atmospheric Rayleigh-ish rim — blue at edges, brightest where sunlit.
        float fres = pow(1.0 - max(dot(N, viewDir), 0.0), 2.4);
        vec3 atm = vec3(0.32, 0.58, 1.00) * fres;
        // Sunset / dawn warm tint along the terminator
        float terminator = pow(1.0 - abs(ndotl), 8.0);
        atm += vec3(1.00, 0.55, 0.25) * fres * terminator * 0.8;
        lit += atm * (0.35 + 0.85 * day);

        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });
  const earth = new THREE.Mesh(earthGeo, earthMat);
  group.add(earth);

  // Outer cloud layer — separate sphere, transparent, slightly larger, drifts.
  const cloudMat = new THREE.ShaderMaterial({
    uniforms: {
      uSunPos: { value: SUN_POSITION.clone() },
      uTime: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      varying vec3 vLocal;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vLocal = normalize(position);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunPos;
      uniform float uTime;
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      varying vec3 vLocal;
      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
      }
      float noise(vec3 p) {
        vec3 i = floor(p); vec3 f = fract(p);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i), hash(i+vec3(1,0,0)), u.x),
              mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), u.x), u.y),
          mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), u.x),
              mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), u.x), u.y),
          f.z
        );
      }
      float fbm(vec3 p) {
        float v = 0.0; float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = p * 2.1 + 11.0;
          a *= 0.5;
        }
        return v;
      }
      void main() {
        vec3 p = vLocal * 4.5 + vec3(uTime * 0.015, 0.0, uTime * 0.008);
        float c = fbm(p);
        float c2 = fbm(p * 2.3 + 5.0);
        float clouds = smoothstep(0.50, 0.75, c) * (0.5 + 0.5 * c2);
        if (clouds < 0.02) discard;

        vec3 sunDir = normalize(uSunPos - vWorldPos);
        float ndotl = max(dot(normalize(vNormalW), sunDir), 0.0);
        float day = smoothstep(-0.05, 0.25, dot(normalize(vNormalW), sunDir));
        vec3 col = vec3(1.0) * (0.20 + 0.85 * ndotl);
        // Warm tint along the terminator
        col = mix(col, vec3(1.0, 0.7, 0.5), pow(1.0 - abs(ndotl), 6.0) * 0.5);
        gl_FragColor = vec4(col, clouds * 0.85 * (0.18 + day * 0.82));
      }
    `,
  });
  const cloudGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.012, 64, 48);
  const clouds = new THREE.Mesh(cloudGeo, cloudMat);
  group.add(clouds);

  // Atmospheric glow — thin shell using back-side rendering for a halo effect.
  const atmGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.10, 64, 48);
  const atmMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uSunPos: { value: SUN_POSITION.clone() } },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunPos;
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      void main() {
        vec3 V = normalize(cameraPosition - vWorldPos);
        // Back-side normals point inward, so flip.
        vec3 N = -normalize(vNormalW);
        float fres = pow(1.0 - max(dot(N, V), 0.0), 2.0);
        vec3 sunDir = normalize(uSunPos - vWorldPos);
        float ndotl = max(dot(N, sunDir), 0.0);
        vec3 col = vec3(0.30, 0.58, 1.00) * (0.4 + 0.7 * ndotl);
        // Sunset orange right at the limb where light grazes
        float term = pow(1.0 - abs(dot(N, sunDir)), 8.0);
        col += vec3(1.0, 0.55, 0.25) * term * 0.6;
        gl_FragColor = vec4(col, fres);
      }
    `,
  });
  const atm = new THREE.Mesh(atmGeo, atmMat);
  group.add(atm);

  group.userData.update = (t: number) => {
    earthMat.uniforms.uTime.value = t;
    cloudMat.uniforms.uTime.value = t;
    earth.rotation.y = t * 0.04;
    clouds.rotation.y = t * 0.05;
    clouds.rotation.x = Math.sin(t * 0.02) * 0.02;
  };
  return group;
}

/* ──────────────────────────────────────────────────────────────────── */
/* Moon                                                                  */
/* ──────────────────────────────────────────────────────────────────── */

function makeMoon() {
  const group = new THREE.Group();
  group.position.copy(MOON_POSITION);

  const geo = new THREE.SphereGeometry(MOON_RADIUS, 192, 128);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSunPos: { value: SUN_POSITION.clone() },
      uTime: { value: 0 },
    },
    extensions: { derivatives: true } as never,
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      varying vec3 vLocal;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vLocal = normalize(position);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunPos;
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      varying vec3 vLocal;

      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
      }
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
        float n000 = hash(i);
        float n100 = hash(i + vec3(1, 0, 0));
        float n010 = hash(i + vec3(0, 1, 0));
        float n110 = hash(i + vec3(1, 1, 0));
        float n001 = hash(i + vec3(0, 0, 1));
        float n101 = hash(i + vec3(1, 0, 1));
        float n011 = hash(i + vec3(0, 1, 1));
        float n111 = hash(i + vec3(1, 1, 1));
        return mix(
          mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
          mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
          u.z
        );
      }
      float fbm(vec3 p, int oct) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 8; i++) {
          if (i >= oct) break;
          v += a * noise(p);
          p = p * 2.07 + vec3(31.7, 17.3, 47.1);
          a *= 0.5;
        }
        return v;
      }
      float ridged(vec3 p, int oct) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 6; i++) {
          if (i >= oct) break;
          float n = 1.0 - abs(noise(p) * 2.0 - 1.0);
          v += a * n * n;
          p = p * 2.04 + vec3(11.3, 27.7, 5.1);
          a *= 0.5;
        }
        return v;
      }

      vec2 craters(vec3 p) {
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        float depth = 0.0;
        float rim = 0.0;
        for (int z = -1; z <= 1; z++) {
        for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec3 g = vec3(float(x), float(y), float(z));
          vec3 cellId = ip + g;
          vec3 jitter = vec3(
            hash(cellId + 0.7),
            hash(cellId + 1.3),
            hash(cellId + 2.1)
          );
          vec3 cp = g + jitter;
          float d = length(fp - cp);
          float r = 0.30 + 0.20 * hash(cellId + 4.7);
          if (hash(cellId + 9.1) < 0.30) continue;
          if (d < r) {
            float t = d / r;
            float basin = pow(1.0 - t, 1.2);
            float ringOuter = smoothstep(0.85, 1.0, t);
            float ringInner = 1.0 - smoothstep(0.55, 0.85, t);
            float thisRim = ringOuter * ringInner;
            depth = max(depth, basin);
            rim = max(rim, thisRim);
          }
        }}}
        return vec2(depth, rim);
      }

      // Compute the bump-mapped normal using screen-space derivatives of the
      // height field. This works without explicit tangent vectors and gives
      // far more believable shading than relying on the smooth sphere normal.
      vec3 perturbNormal(vec3 surfPos, vec3 N, float h) {
        vec3 dpdx = dFdx(surfPos);
        vec3 dpdy = dFdy(surfPos);
        float dhdx = dFdx(h);
        float dhdy = dFdy(h);
        vec3 r1 = cross(dpdy, N);
        vec3 r2 = cross(N, dpdx);
        float det = dot(dpdx, r1);
        vec3 grad = sign(det) * (dhdx * r1 + dhdy * r2);
        return normalize(abs(det) * N - grad);
      }

      // Compute terrain height at a local-sphere point.
      float surfaceHeight(vec3 lp, out float maria, out float lum,
                          out float ridges) {
        float n0 = fbm(lp * 3.5, 5);
        float n1 = fbm(lp * 9.0, 5);
        float n2 = ridged(lp * 22.0, 4);
        float n3 = fbm(lp * 64.0, 3);
        vec2 c1 = craters(lp * 4.5);
        vec2 c2 = craters(lp * 11.0);
        vec2 c3 = craters(lp * 28.0);

        maria = smoothstep(0.58, 0.30, n0);
        ridges = n2;

        float h = 0.0;
        h -= maria * 0.55;
        h += (1.0 - maria) * (0.10 + 0.20 * n2);
        h -= c1.x * 0.55 + c2.x * 0.40 + c3.x * 0.22;
        h += c1.y * 0.45 + c2.y * 0.30 + c3.y * 0.18;
        h += (n1 - 0.5) * 0.10 + (n3 - 0.5) * 0.05;

        // Albedo brightness shares the same shaping but with different weights.
        lum = 0.88;
        lum -= maria * 0.22;
        lum += (1.0 - maria) * (0.5 + 0.5 * n2) * 0.10;
        lum -= c1.x * 0.30 + c2.x * 0.22 + c3.x * 0.14;
        lum += c1.y * 0.35 + c2.y * 0.22 + c3.y * 0.14;
        lum += (n1 - 0.5) * 0.08 + (n3 - 0.5) * 0.04;
        lum = clamp(lum, 0.18, 1.18);
        return h;
      }

      void main() {
        float maria, lum, ridges;
        float h = surfaceHeight(vLocal, maria, lum, ridges);

        // Albedo: silvery white highlands, slightly blue-grey maria.
        vec3 highCol = vec3(1.05, 1.03, 0.99);
        vec3 mariaCol = vec3(0.55, 0.58, 0.66);
        vec3 base = mix(highCol, mariaCol, maria);
        vec3 col = base * lum;

        // Bump-mapped normal from the height field — this is what makes the
        // craters cast real-feeling shadows along the terminator.
        vec3 N = perturbNormal(vWorldPos, normalize(vNormalW), h * 0.45);

        vec3 sunDir = normalize(uSunPos - vWorldPos);
        float ndotl = dot(N, sunDir);
        float wrap = pow(ndotl * 0.5 + 0.5, 1.6);

        // Earthshine — cool blue ambient on the dark side.
        vec3 earthshine = vec3(0.10, 0.13, 0.22)
                          * (1.0 - smoothstep(-0.1, 0.4, ndotl));

        col = col * (0.16 + 1.00 * wrap) + earthshine * (1.0 - wrap);

        // Sharp specular near terminator — rocky low-roughness glint.
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        vec3 halfVec = normalize(sunDir + viewDir);
        float spec = pow(max(dot(N, halfVec), 0.0), 90.0)
                     * smoothstep(0.0, 0.30, ndotl);
        col += spec * vec3(0.85, 0.78, 0.66) * 0.22;

        // Limb darkening — proper sphere shading instead of a flat disk.
        float limb = pow(max(dot(normalize(vNormalW), viewDir), 0.0), 0.55);
        col *= mix(0.78, 1.0, limb);

        // Cool blue-white outer rim glow.
        float rim = pow(1.0 - max(dot(normalize(vNormalW), viewDir), 0.0), 2.6);
        col += rim * vec3(0.20, 0.28, 0.42) * (0.32 + ndotl * 0.7);

        // Tiny ray-pattern highlights from the largest fresh craters
        // (Tycho/Copernicus-style) — extra brightness around bright rims.
        col += vec3(0.05, 0.05, 0.06) * ridges * smoothstep(0.0, 0.4, ndotl);

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const moon = new THREE.Mesh(geo, mat);
  group.add(moon);

  // Soft cool halo around the moon.
  group.add(makeGlow(new THREE.Vector3(), MOON_RADIUS * 1.18, 0xeaf2ff, 0.22));
  group.add(makeGlow(new THREE.Vector3(), MOON_RADIUS * 2.0, 0xb8d2ff, 0.10));

  group.userData.update = (t: number) => {
    moon.rotation.y = t * 0.012;
    mat.uniforms.uTime.value = t;
  };
  return group;
}

/* ──────────────────────────────────────────────────────────────────── */
/* Glow billboard                                                        */
/* ──────────────────────────────────────────────────────────────────── */

function makeGlow(pos: THREE.Vector3, radius: number, color: number, opacity: number) {
  const tex = makeRadialGlowTexture();
  const mat = new THREE.SpriteMaterial({
    map: tex,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.position.copy(pos);
  sprite.scale.set(radius * 2, radius * 2, 1);
  return sprite;
}

let glowTexCache: THREE.CanvasTexture | null = null;
function makeRadialGlowTexture() {
  if (glowTexCache) return glowTexCache;
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.5)');
  grad.addColorStop(0.55, 'rgba(255,255,255,0.18)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  glowTexCache = tex;
  return tex;
}

/* ──────────────────────────────────────────────────────────────────── */
/* Rocket                                                                */
/* ──────────────────────────────────────────────────────────────────── */

function makeRocket(): THREE.Group {
  const g = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xeaedf3,
    metalness: 0.7,
    roughness: 0.32,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xff7a2e,
    metalness: 0.3,
    roughness: 0.55,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x111319,
    metalness: 0.4,
    roughness: 0.7,
  });
  const bellMat = new THREE.MeshStandardMaterial({
    color: 0x44464d,
    metalness: 0.9,
    roughness: 0.25,
  });
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x88dcff,
    metalness: 0.1,
    roughness: 0.1,
    emissive: 0x4dc8ff,
    emissiveIntensity: 0.6,
  });
  g.userData.windowMat = windowMat;

  // ── Main body (slightly tapered, with two paneling rings)
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 1.2, 32),
    bodyMat,
  );
  g.add(body);

  // Paneling — thin black rings at intervals
  for (const y of [-0.30, 0.10, 0.45]) {
    const ring = new THREE.Mesh(
      new THREE.CylinderGeometry(0.184, 0.20, 0.012, 32),
      darkMat,
    );
    ring.position.y = y;
    g.add(ring);
  }

  // Orange accent stripe near the top
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(0.182, 0.182, 0.10, 32),
    accentMat,
  );
  band.position.y = 0.18;
  g.add(band);

  // ── Nose cone (two-stage) and cap
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.55, 32),
    bodyMat,
  );
  nose.position.y = 0.875;
  g.add(nose);
  const noseTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.18, 24),
    accentMat,
  );
  noseTip.position.y = 1.22;
  g.add(noseTip);
  // Tiny antenna on the tip
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.005, 0.18, 8),
    darkMat,
  );
  antenna.position.y = 1.40;
  g.add(antenna);

  // ── Window with an emissive lit interior + glow halo
  const windowMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    windowMat,
  );
  windowMesh.position.set(0, 0.34, 0.16);
  windowMesh.rotation.x = Math.PI / 2;
  g.add(windowMesh);
  // Window glow
  const winGlow = makeGlow(
    new THREE.Vector3(0, 0.34, 0.18),
    0.20,
    0x6cc7ff,
    0.55,
  );
  g.add(winGlow);

  // ── Engine bell with a glowing throat
  const bell = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.16, 0.22, 32, 1, true),
    bellMat,
  );
  bell.position.y = -0.72;
  g.add(bell);
  // Inner shell (brighter, gives the bell its layered look)
  const bellInner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.13, 0.20, 32, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0x665548,
      metalness: 0.1,
      roughness: 0.4,
      side: THREE.BackSide,
      emissive: 0xff7a2e,
      emissiveIntensity: 0.6,
    }),
  );
  bellInner.position.y = -0.71;
  g.add(bellInner);
  // Bell throat glow — additive sprite tucked inside the nozzle
  const bellGlow = makeGlow(
    new THREE.Vector3(0, -0.78, 0),
    0.30,
    0xffb469,
    0.85,
  );
  g.add(bellGlow);
  g.userData.bellGlow = bellGlow;

  // ── Fins (4 around base)
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.22, -0.08);
  finShape.lineTo(0.22, -0.30);
  finShape.lineTo(0, -0.20);
  finShape.lineTo(0, 0);
  const finGeo = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.015,
    bevelEnabled: true,
    bevelSize: 0.005,
    bevelThickness: 0.005,
    bevelSegments: 1,
  });
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, accentMat);
    const a = (i / 4) * Math.PI * 2;
    fin.position.set(0, -0.42, 0);
    fin.rotation.y = a;
    fin.translateX(0.20);
    g.add(fin);
  }

  // ── Side boosters (2)
  const boosterMat = bodyMat;
  for (const sx of [-1, 1]) {
    const boost = new THREE.Group();
    const bb = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.08, 0.85, 20),
      boosterMat,
    );
    boost.add(bb);
    const bn = new THREE.Mesh(
      new THREE.ConeGeometry(0.07, 0.18, 20),
      bodyMat,
    );
    bn.position.y = 0.51;
    boost.add(bn);
    const bell2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.06, 0.10, 20, 1, true),
      bellMat,
    );
    bell2.position.y = -0.46;
    boost.add(bell2);
    boost.position.set(sx * 0.30, -0.10, 0);
    g.add(boost);

    // Booster mini-plume
    const bp = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeRadialGlowTexture(),
        color: 0xffb469,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    bp.position.set(sx * 0.30, -0.65, 0);
    bp.scale.set(0.22, 0.36, 1);
    g.add(bp);
    g.userData[sx === -1 ? 'boosterPlumeL' : 'boosterPlumeR'] = bp;
  }

  // ── Main thrust plume — three stacked sprites for layered color depth
  const plumeOuter = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeRadialGlowTexture(),
      color: 0xff5a18,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  plumeOuter.position.set(0, -1.05, 0);
  plumeOuter.scale.set(0.85, 1.3, 1);
  g.add(plumeOuter);
  g.userData.plumeOuter = plumeOuter;

  const plumeInner = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeRadialGlowTexture(),
      color: 0xffb060,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  plumeInner.position.set(0, -0.95, 0);
  plumeInner.scale.set(0.5, 0.85, 1);
  g.add(plumeInner);
  g.userData.plumeInner = plumeInner;

  const plumeCore = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeRadialGlowTexture(),
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  plumeCore.material.toneMapped = false;
  plumeCore.position.set(0, -0.88, 0);
  plumeCore.scale.set(0.25, 0.45, 1);
  g.add(plumeCore);
  g.userData.plumeCore = plumeCore;

  return g;
}

/* ──────────────────────────────────────────────────────────────────── */
/* Disposal                                                              */
/* ──────────────────────────────────────────────────────────────────── */

function disposeNode(node: THREE.Object3D) {
  node.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => disposeMaterial(m));
      } else {
        disposeMaterial(mesh.material);
      }
    }
  });
}
function disposeMaterial(m: THREE.Material) {
  Object.values(m).forEach((value) => {
    if (value && (value as THREE.Texture).isTexture) {
      (value as THREE.Texture).dispose();
    }
  });
  m.dispose();
}
