import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Building2, Briefcase, Sparkles, ArrowRight, X } from 'lucide-react';

export const CompanyGalaxy3D = ({ jobs = [], onSelectJob, onClose }) => {
  const mountRef = useRef(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);

  // Group jobs by company
  const companyMap = {};
  jobs.forEach((j) => {
    const comp = j.companyName || 'Other';
    if (!companyMap[comp]) companyMap[comp] = [];
    companyMap[comp].push(j);
  });

  const companies = Object.keys(companyMap).map((name, index) => {
    const colors = [0x7868ff, 0x10b981, 0x42d9f5, 0xa855f7, 0xf59e0b];
    const angle = (index / Math.max(1, Object.keys(companyMap).length)) * Math.PI * 2;
    const radius = 9;
    return {
      name,
      jobs: companyMap[name],
      color: colors[index % colors.length],
      pos: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.6, (Math.random() - 0.5) * 3]
    };
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080b14, 0.035);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const centerLight = new THREE.PointLight(0x7868ff, 3, 40);
    scene.add(centerLight);

    // Background cosmic particles
    const starCount = 300;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 60;
      starPositions[i + 1] = (Math.random() - 0.5) * 45;
      starPositions[i + 2] = (Math.random() - 0.5) * 30 - 5;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x9aa8c7, size: 0.12, opacity: 0.5, transparent: true }));
    scene.add(stars);

    // Central Cosmic Core
    const coreGroup = new THREE.Group();
    const coreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x121827, emissive: 0x7868ff, emissiveIntensity: 0.7, wireframe: true })
    );
    coreGroup.add(coreMesh);
    scene.add(coreGroup);

    // Company Celestial Systems & Orbiting Roles
    const interactives = [];
    const companyObjects = [];

    companies.forEach((comp) => {
      const cGroup = new THREE.Group();
      cGroup.position.set(...comp.pos);

      // Company Planet
      const planetGeo = new THREE.SphereGeometry(1.1, 28, 28);
      const planetMat = new THREE.MeshStandardMaterial({
        color: comp.color,
        emissive: comp.color,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const planet = new THREE.Mesh(planetGeo, planetMat);
      planet.userData = { type: 'COMPANY', data: comp };
      cGroup.add(planet);
      interactives.push(planet);

      // Orbit Ring
      const ringGeo = new THREE.TorusGeometry(2.2, 0.02, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: comp.color, transparent: true, opacity: 0.35 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      cGroup.add(ring);

      // Orbiting Job Satellites
      const satellites = [];
      comp.jobs.forEach((j, jIdx) => {
        const satAngle = (jIdx / Math.max(1, comp.jobs.length)) * Math.PI * 2;
        const satDist = 2.2;
        const satGeo = new THREE.SphereGeometry(0.35, 16, 16);
        const satMat = new THREE.MeshStandardMaterial({ color: 0x42d9f5, emissive: 0x42d9f5, emissiveIntensity: 0.8 });
        const satMesh = new THREE.Mesh(satGeo, satMat);
        satMesh.userData = { type: 'JOB', data: j, companyName: comp.name };
        cGroup.add(satMesh);
        interactives.push(satMesh);
        satellites.push({ mesh: satMesh, baseAngle: satAngle, dist: satDist });
      });

      scene.add(cGroup);
      companyObjects.push({ group: cGroup, planet, satellites });
    });

    // Raycaster for Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactives);
      if (hits.length > 0) {
        container.style.cursor = 'pointer';
        setHoveredObject(hits[0].object.userData);
      } else {
        container.style.cursor = 'default';
        setHoveredObject(null);
      }
    };

    const onPointerDown = () => {
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactives);
      if (hits.length > 0) {
        const item = hits[0].object.userData;
        if (item.type === 'COMPANY') {
          setSelectedCompany(item.data);
        } else if (item.type === 'JOB') {
          if (onSelectJob) onSelectJob(item.data);
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('click', onPointerDown);

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      coreGroup.rotation.y = elapsed * 0.2;
      coreGroup.rotation.x = elapsed * 0.1;

      companyObjects.forEach((co, idx) => {
        co.planet.rotation.y = elapsed * 0.5;
        co.satellites.forEach((sat) => {
          const currentAngle = sat.baseAngle + elapsed * 0.8;
          sat.mesh.position.x = Math.cos(currentAngle) * sat.dist;
          sat.mesh.position.y = Math.sin(currentAngle) * sat.dist * 0.4;
          sat.mesh.position.z = Math.sin(currentAngle) * sat.dist * 0.8;
        });
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('click', onPointerDown);
      cancelAnimationFrame(frameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [jobs]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '560px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'radial-gradient(circle at center, #101626 0%, #080B14 100%)', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-lg)' }}>
      {/* Top Header Overlay */}
      <div style={{ position: 'absolute', top: '1.25rem', left: '1.5rem', right: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.35rem' }}>
            <Sparkles size={12} /> Spatial Opportunity Galaxy
          </span>
          <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Explore Hiring Ecosystems</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Celestial clusters represent hiring companies; orbiting satellites are open requisitions.
          </p>
        </div>
        {onClose && (
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} /> Exit 3D Galaxy
          </button>
        )}
      </div>

      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Hover Tooltip */}
      {hoveredObject && (
        <div style={{
          position: 'absolute',
          bottom: '1.25rem',
          left: '1.5rem',
          background: 'rgba(18, 24, 39, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1.15rem',
          boxShadow: 'var(--shadow-md)',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          {hoveredObject.type === 'COMPANY' ? (
            <>
              <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase' }}>
                COMPANY CLUSTER • CLICK TO FILTER
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                {hoveredObject.data.name}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {hoveredObject.data.jobs.length} Active Positions
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '0.75rem', color: '#42D9F5', fontWeight: 700, textTransform: 'uppercase' }}>
                OPEN REQUISITION • CLICK TO VIEW
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                {hoveredObject.data.title}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {hoveredObject.companyName} • {hoveredObject.data.location}
              </div>
            </>
          )}
        </div>
      )}

      {/* Selected Company Sidebar Drawer */}
      {selectedCompany && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '380px',
          background: 'rgba(18, 24, 39, 0.98)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid var(--border-medium)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 20,
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Building2 size={24} color="#7868ff" />
              <h3 style={{ fontSize: '1.3rem' }}>{selectedCompany.name}</h3>
            </div>
            <button onClick={() => setSelectedCompany(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            {selectedCompany.jobs.length} open verified positions at {selectedCompany.name}:
          </p>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {selectedCompany.jobs.map((job) => (
              <div key={job._id} style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  {job.title}
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                  {job.workMode} • {job.location}
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => {
                    if (onSelectJob) onSelectJob(job);
                  }}
                >
                  Inspect Requisition <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
