import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  Briefcase, 
  UserCheck, 
  Code, 
  Layers, 
  Pause, 
  Play, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink,
  Info,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

/**
 * ReferHire Network — Signature 3D Spatial Referral Graph
 * Visualizes the relationships between Candidate Skills, Open Requisitions, and Verified Company Referrers.
 * Compliant with UI/UX Pro Max Three.js guidelines (disposal, pixel ratio cap, reduced-motion, single RAF loop).
 */
export const ReferralUniverse3D = ({ onSelectJob, onExploreReferrers, onExploreJobs }) => {
  const mountRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isMotionPaused, setIsMotionPaused] = useState(false);
  const [viewMode2D, setViewMode2D] = useState(false);
  const [webGLError, setWebGLError] = useState(false);

  // Network graph data connecting Skills -> Requisitions -> Referrers
  const networkData = useMemo(() => ({
    nodes: [
      // Company Job Opportunities (Hex: Deep Cobalt #2554D7)
      {
        id: 'job-google-mern',
        type: 'JOB',
        label: 'MERN Stack Developer',
        sublabel: 'Google Cloud • ₹14-24 LPA',
        company: 'Google',
        pos: [-4.2, 2.5, 0],
        color: 0x2554d7,
        skills: ['skill-react', 'skill-nodejs', 'skill-mongodb'],
        referrerId: 'ref-google-priya',
        details: 'Open Requisition for Google Cloud developer tools. 2+ yrs experience required.'
      },
      {
        id: 'job-msft-frontend',
        type: 'JOB',
        label: 'Frontend Engineer (React)',
        sublabel: 'Microsoft Azure • ₹18-28 LPA',
        company: 'Microsoft',
        pos: [4.5, 2.8, -0.5],
        color: 0x2554d7,
        skills: ['skill-react', 'skill-typescript'],
        referrerId: 'ref-msft-rohan',
        details: 'Azure Developer Experience Portal team. Focus on TypeScript and design tokens.'
      },
      {
        id: 'job-stripe-backend',
        type: 'JOB',
        label: 'Senior Backend Engineer',
        sublabel: 'Stripe • ₹26-40 LPA',
        company: 'Stripe',
        pos: [3.8, -2.8, 0.5],
        color: 0x2554d7,
        skills: ['skill-nodejs', 'skill-distributed'],
        referrerId: null,
        details: 'High-throughput payment settlement pipelines and ledger reliability.'
      },
      // Verified Company Referrers (Hex: Forest Emerald #107548)
      {
        id: 'ref-google-priya',
        type: 'REFERRER',
        label: 'Priya Sundaram',
        sublabel: 'Senior Staff Engineer • Google',
        company: 'Google',
        pos: [-5.6, -1.8, 1],
        color: 0x107548,
        rating: 4.95,
        totalReferrals: 14,
        details: 'Verified Google corporate employee. Actively endorsing candidates for Cloud and Search.'
      },
      {
        id: 'ref-msft-rohan',
        type: 'REFERRER',
        label: 'Rohan Mehta',
        sublabel: 'Principal Eng Lead • Microsoft',
        company: 'Microsoft',
        pos: [5.8, 0.2, 1.2],
        color: 0x107548,
        rating: 4.88,
        totalReferrals: 22,
        details: 'Verified Microsoft corporate employee. Mentors and reviews candidates for Azure DX.'
      },
      // Candidate Skill Nodes (Hex: Architectural Slate #4A5364 / Ink #17191D)
      {
        id: 'skill-react',
        type: 'SKILL',
        label: 'React & Virtual DOM',
        sublabel: 'Frontend Architecture',
        pos: [-0.5, 3.2, 1.5],
        color: 0x4a5364,
        details: 'High-demand candidate capability matched in 85% of active tech requisitions.'
      },
      {
        id: 'skill-nodejs',
        type: 'SKILL',
        label: 'Node.js & Express',
        sublabel: 'Asynchronous Services',
        pos: [-1.2, -1.5, 2],
        color: 0x4a5364,
        details: 'Foundational runtime for microservices, API composition, and real-time sockets.'
      },
      {
        id: 'skill-typescript',
        type: 'SKILL',
        label: 'TypeScript',
        sublabel: 'Type Safety & Generics',
        pos: [1.8, 1.8, 1],
        color: 0x4a5364,
        details: 'Crucial requirement across mid and senior level frontend engineering roles.'
      },
      {
        id: 'skill-mongodb',
        type: 'SKILL',
        label: 'MongoDB Aggregation',
        sublabel: 'Data Modeling',
        pos: [-2.8, 0.6, -1],
        color: 0x4a5364,
        details: 'Schema indexing, compound pipeline queries, and NoSQL architecture.'
      },
      {
        id: 'skill-distributed',
        type: 'SKILL',
        label: 'Distributed Systems',
        sublabel: 'Concurrency & Scalability',
        pos: [1.5, -2.4, -0.8],
        color: 0x4a5364,
        details: 'Partitioning, consensus, message queues, and high-availability design.'
      }
    ],
    // Explicit relationships
    links: [
      { from: 'skill-react', to: 'job-google-mern' },
      { from: 'skill-nodejs', to: 'job-google-mern' },
      { from: 'skill-mongodb', to: 'job-google-mern' },
      { from: 'job-google-mern', to: 'ref-google-priya' },
      { from: 'skill-react', to: 'job-msft-frontend' },
      { from: 'skill-typescript', to: 'job-msft-frontend' },
      { from: 'job-msft-frontend', to: 'ref-msft-rohan' },
      { from: 'skill-nodejs', to: 'job-stripe-backend' },
      { from: 'skill-distributed', to: 'job-stripe-backend' }
    ]
  }), []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || viewMode2D) return;

    // 1. WebGL capability validation
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLError(true);
        return;
      }
    } catch {
      setWebGLError(true);
      return;
    }

    // 2. Reduced motion detection
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    const handleMotionChange = (e) => { reducedMotion = e.matches; };
    motionQuery.addEventListener('change', handleMotionChange);

    // 3. Scene, Camera, Renderer Setup
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    // Neutral architectural fog
    scene.fog = new THREE.FogExp2(0xf8f7f4, 0.035);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const handleContextLost = (e) => {
      e.preventDefault();
      setWebGLError(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    // 4. Clean Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // 5. Shared Geometries for memory conservation
    const sphereGeo = new THREE.SphereGeometry(0.45, 20, 20);
    const ringGeo = new THREE.RingGeometry(0.65, 0.72, 32);
    const nodeMeshes = [];
    const interactiveObjects = [];

    // Construct Node Visuals
    const nodeMap = new Map();
    networkData.nodes.forEach(node => {
      nodeMap.set(node.id, node);
      const group = new THREE.Group();
      group.position.set(node.pos[0], node.pos[1], node.pos[2]);

      // Core sphere
      const material = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.35,
        metalness: 0.2
      });
      const sphere = new THREE.Mesh(sphereGeo, material);
      sphere.userData = node;
      group.add(sphere);

      // Architectural orbital locator ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      scene.add(group);
      nodeMeshes.push({ group, sphere, ring, data: node });
      interactiveObjects.push(sphere);
    });

    // 6. Relationship Connection Lines (Tubular / Line Segments)
    const lineMatStandard = new THREE.LineBasicMaterial({
      color: 0xb7b3a6,
      transparent: true,
      opacity: 0.55
    });

    const lineObjects = [];
    networkData.links.forEach(link => {
      const fromNode = nodeMap.get(link.from);
      const toNode = nodeMap.get(link.to);
      if (fromNode && toNode) {
        const points = [
          new THREE.Vector3(...fromNode.pos),
          new THREE.Vector3(...toNode.pos)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMatStandard);
        line.userData = { from: link.from, to: link.to };
        scene.add(line);
        lineObjects.push(line);
      }
    });

    // 7. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clickCoord = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(clickCoord, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, false);
      if (intersects.length > 0) {
        const clickedData = intersects[0].object.userData;
        setSelectedNode(clickedData);
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // 8. Container Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 9. Animation & Render Loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      // Gentle orbital oscillation (unless motion paused or user prefers reduced motion)
      if (!isMotionPaused && !reducedMotion) {
        const time = clock.getElapsedTime() * 0.25;
        camera.position.x = Math.sin(time) * 1.5;
        camera.position.y = Math.cos(time * 0.8) * 0.8;
        camera.lookAt(0, 0, 0);

        // Gentle node bobbing
        nodeMeshes.forEach((item, idx) => {
          item.group.position.y = item.data.pos[1] + Math.sin(time * 1.5 + idx) * 0.08;
          item.ring.rotation.z += dt * 0.2;
        });
      }

      // Raycast detection
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactiveObjects, false);

      if (hits.length > 0) {
        const hitData = hits[0].object.userData;
        renderer.domElement.style.cursor = 'pointer';
        setHoveredNode(hitData);
      } else {
        renderer.domElement.style.cursor = 'default';
        setHoveredNode(null);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Pause rendering when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 10. Resource Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleMotionChange);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      sphereGeo.dispose();
      ringGeo.dispose();
      nodeMeshes.forEach(item => {
        item.sphere.material.dispose();
        item.ring.material.dispose();
      });
      lineObjects.forEach(l => {
        l.geometry.dispose();
        l.material.dispose();
      });
      renderer.dispose();
    };
  }, [networkData, isMotionPaused, viewMode2D]);

  // Fallback 2D view rendering
  if (webGLError || viewMode2D) {
    return (
      <div className="surface-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="editorial-kicker">
              <Layers size={14} /> REFERRAL TOPOLOGY DIRECTORY
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '0.25rem' }}>
              ReferHire Professional Connection Graph
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Accessible directory representation of opportunity requisitions, verified corporate referrers, and core required skills.
            </p>
          </div>
          {!webGLError && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setViewMode2D(false)}
            >
              <RefreshCw size={14} /> Switch to 3D Spatial Canvas
            </button>
          )}
        </div>

        <div className="grid-3">
          {networkData.nodes.map(node => (
            <div 
              key={node.id}
              className="surface-card surface-card-hover"
              onClick={() => setSelectedNode(node)}
              style={{
                borderColor: selectedNode?.id === node.id ? 'var(--color-cobalt)' : undefined,
                background: selectedNode?.id === node.id ? 'var(--color-cobalt-subtle)' : undefined
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className={`badge ${node.type === 'JOB' ? 'badge-candidate' : node.type === 'REFERRER' ? 'badge-referrer' : 'badge-mono'}`}>
                  {node.type}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{node.sublabel}</span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{node.label}</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {node.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* 3D WebGL Canvas Viewport */}
      <div 
        ref={mountRef} 
        className="scene-3d-wrapper"
        aria-label="3D Referral Network Visualization: Interactive graph of tech jobs, referrers, and skills"
      />

      {/* Floating Canvas Controls Header */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        <div style={{
          background: 'var(--bg-glass-strong)',
          backdropFilter: 'blur(8px)',
          padding: '0.5rem 0.85rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-sm)',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-cobalt)' }} />
          <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            REFERHIRE SPATIAL GRAPH
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>• Click nodes to inspect</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'auto' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setIsMotionPaused(!isMotionPaused)}
            title={isMotionPaused ? 'Resume spatial drift' : 'Pause camera drift'}
            style={{ padding: '0.4rem 0.65rem' }}
          >
            {isMotionPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setViewMode2D(true)}
            title="Switch to accessible 2D list"
            style={{ fontSize: '0.75rem' }}
          >
            2D View
          </button>
        </div>
      </div>

      {/* Hover Tooltip Overlay */}
      {hoveredNode && !selectedNode && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)',
          pointerEvents: 'none',
          zIndex: 10,
          animation: 'fadeIn 0.15s ease-out',
          maxWidth: '320px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className={`badge ${hoveredNode.type === 'JOB' ? 'badge-candidate' : hoveredNode.type === 'REFERRER' ? 'badge-referrer' : 'badge-mono'}`} style={{ fontSize: '0.7rem' }}>
              {hoveredNode.type}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{hoveredNode.sublabel}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{hoveredNode.label}</div>
        </div>
      )}

      {/* Selected Node Detailed Inspector Card */}
      {selectedNode && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          maxWidth: '520px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 20,
          animation: 'scaleUp 0.18s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className={`badge ${selectedNode.type === 'JOB' ? 'badge-candidate' : selectedNode.type === 'REFERRER' ? 'badge-referrer' : 'badge-mono'}`}>
                  {selectedNode.type}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{selectedNode.sublabel}</span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedNode.label}
              </h4>
            </div>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setSelectedNode(null)}
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
            >
              Close
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
            {selectedNode.details}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {selectedNode.type === 'JOB' && (
              <button 
                className="btn btn-cobalt btn-sm"
                onClick={() => {
                  if (onExploreJobs) onExploreJobs();
                }}
              >
                Inspect Requisition <ArrowRight size={13} />
              </button>
            )}

            {selectedNode.type === 'REFERRER' && (
              <button 
                className="btn btn-referral btn-sm"
                onClick={() => {
                  if (onExploreReferrers) onExploreReferrers();
                }}
              >
                Connect with Referrer <ArrowRight size={13} />
              </button>
            )}

            {selectedNode.type === 'SKILL' && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  if (onExploreJobs) onExploreJobs();
                }}
              >
                Find Roles Requiring {selectedNode.label} <ArrowRight size={13} />
              </button>
            )}

            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setSelectedNode(null)}
            >
              Back to Graph
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
