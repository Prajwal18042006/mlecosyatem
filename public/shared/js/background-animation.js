// Background neural network — black/slate on light theme, white glow on dark theme
let scene, camera, renderer, particles, lines;
let particleMaterial;
let lineMaterial;
const particleCount = 200;
const maxDistance = 150;

function applyNetworkTheme() {
    if (!particleMaterial || !lineMaterial) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (dark) {
        particleMaterial.color.setHex(0xffffff);
        particleMaterial.opacity = 0.75;
        particleMaterial.blending = THREE.AdditiveBlending;
        lineMaterial.color.setHex(0xffffff);
        lineMaterial.opacity = 0.22;
        lineMaterial.blending = THREE.AdditiveBlending;
    } else {
        particleMaterial.color.setHex(0x1e293b);
        particleMaterial.opacity = 0.65;
        particleMaterial.blending = THREE.NormalBlending;
        lineMaterial.color.setHex(0x334155);
        lineMaterial.opacity = 0.2;
        lineMaterial.blending = THREE.NormalBlending;
    }
}

function initBackground() {
    const existing = document.getElementById('bg-canvas');
    const container = existing || document.createElement('div');
    container.id = 'bg-canvas';
    if (!existing) {
        document.body.prepend(container);
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 500;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 1000;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

        particleVelocities.push({
            x: (Math.random() - 0.5) * 0.8,
            y: (Math.random() - 0.5) * 0.8,
            z: (Math.random() - 0.5) * 0.8
        });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleMaterial = new THREE.PointsMaterial({
        color: 0x1e293b,
        size: 3,
        transparent: true,
        opacity: 0.65,
        blending: THREE.NormalBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.userData.velocities = particleVelocities;
    scene.add(particles);

    const lineGeometry = new THREE.BufferGeometry();
    const maxLines = 1500;
    const linePositions = new Float32Array(maxLines * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    lineMaterial = new THREE.LineBasicMaterial({
        color: 0x334155,
        transparent: true,
        opacity: 0.2,
        blending: THREE.NormalBlending
    });

    lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    applyNetworkTheme();
    window.addEventListener('ml-theme-change', applyNetworkTheme);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animateBackground();
}

function animateBackground() {
    requestAnimationFrame(animateBackground);

    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.userData.velocities;
    const linePositions = lines.geometry.attributes.position.array;
    let lineIndex = 0;

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        if (Math.abs(positions[i * 3]) > 500) velocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 500) velocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 500) velocities[i].z *= -1;
    }

    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDistance && lineIndex < 1500) {
                linePositions[lineIndex * 6] = positions[i * 3];
                linePositions[lineIndex * 6 + 1] = positions[i * 3 + 1];
                linePositions[lineIndex * 6 + 2] = positions[i * 3 + 2];
                linePositions[lineIndex * 6 + 3] = positions[j * 3];
                linePositions[lineIndex * 6 + 4] = positions[j * 3 + 1];
                linePositions[lineIndex * 6 + 5] = positions[j * 3 + 2];
                lineIndex++;
            }
        }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    lines.geometry.attributes.position.needsUpdate = true;
    lines.geometry.setDrawRange(0, lineIndex * 2);

    particles.rotation.y += 0.001;
    lines.rotation.y += 0.001;

    renderer.render(scene, camera);
}

if (typeof THREE !== 'undefined') {
    initBackground();
} else {
    console.error('Three.js is not loaded. Background animation skipped.');
}
