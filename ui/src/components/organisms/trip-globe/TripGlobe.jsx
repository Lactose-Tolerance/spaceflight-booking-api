// src/components/organisms/trip-globe/TripGlobe.jsx
import React, { useRef, useMemo, useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import Button from '../../atoms/button/Button'; //
import './TripGlobe.css';

// ALTITUDE_SCALE removed!
const DEFAULT_SMA = 10000;

const PLANET_CONFIG = {
  Earth: { texture: '/textures/earth-night.jpg', bump: '/textures/earth-topology.png' },
  Moon: { texture: '/textures/moon-dark.png', bump: '/textures/moon-bump.jpg' },
  Mars: { texture: '/textures/mars-dark.jpg', bump: '' }
};

// --> CHANGED: Now accepts planetRadiusKm dynamically
const generateOrbit = (port, planetRadiusKm) => {
  const a = (port.semiMajorAxis || DEFAULT_SMA) / planetRadiusKm;
  const b = (port.semiMinorAxis || port.semiMajorAxis || DEFAULT_SMA) / planetRadiusKm;
  const e = Math.sqrt(Math.max(0, 1 - Math.pow(b / a, 2))); 
  const inc = (port.inclination || 0) * (Math.PI / 180);
  const raan = (port.longitude || 0) * (Math.PI / 180);
  
  const points = [];
  const segments = 128; // Increased segments for smoother polar transitions
  
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * 2 * Math.PI;
    const r_true = (a * (1 - e * e)) / (1 + e * Math.cos(t));
    const alt = Math.max(0.01, r_true - 1);
    const r = r_true; 
    
    // Orbital plane coordinates
    const xOrb = r * Math.cos(t);
    const yOrb = r * Math.sin(t);
    
    // 3D Rotations (Inclination then RAAN)
    const xInc = xOrb;
    const yInc = yOrb * Math.cos(inc);
    const zInc = yOrb * Math.sin(inc);
    
    const xFinal = xInc * Math.cos(raan) - yInc * Math.sin(raan);
    const yFinal = xInc * Math.sin(raan) + yInc * Math.cos(raan);
    const zFinal = zInc;
    
    // Coordinate conversion with pole-protection
    const lat = Math.asin(Math.min(1, Math.max(-1, zFinal / r))) * (180 / Math.PI);
    let lng = Math.atan2(yFinal, xFinal) * (180 / Math.PI);
    
    // Fix for the 180/-180 wrap-around jitter
    if (points.length > 0) {
      const prevLng = points[points.length - 1][1];
      if (lng - prevLng > 180) lng -= 360;
      if (lng - prevLng < -180) lng += 360;
    }
    
    points.push([lat, lng, alt]);
  }
  return points;
};

const buildTooltip = (d, isOrbital) => `
  <div style="
    background: var(--color-bg-overlay); 
    padding: 8px 12px; 
    border-radius: 6px; 
    border: 1px solid ${isOrbital ? 'var(--color-cyan-500)' : 'var(--color-cyan-300)'};
    color: var(--color-text-primary); 
    font-family: monospace; 
    pointer-events: none;
  ">
    <strong>${d.name}</strong> (${d.code})<br/>
    <span style="color: var(--color-text-secondary); font-size: 0.8em;">${d.type}</span>
  </div>
`;

// --> CHANGED: Added `planets` to props
const TripGlobe = ({ ports, planets = [], origin, destination, setOrigin, setDestination }) => {
  const globeRef = useRef();
  const containerRef = useRef();
  const [activePlanet, setActivePlanet] = useState(null); 
  const [dimensions, setDimensions] = useState({ width: 0, height: 600 });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) setDimensions({ width: entries[0].contentRect.width, height: 600 });
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [activePlanet]);

  // --> NEW: Dynamically determine the radius of the planet currently being viewed
  const currentRadiusKm = useMemo(() => {
    if (!activePlanet || planets.length === 0) return 6371; // Fallback to Earth
    const planetData = planets.find(p => p.name.toLowerCase() === activePlanet.toLowerCase());
    return planetData ? planetData.radiusKm : 6371;
  }, [activePlanet, planets]);

  const processedPorts = useMemo(() => {
    const currentPlanetPorts = ports.filter(p => p.planet === activePlanet);
    return currentPlanetPorts.map(p => {
      if (p.type === 'ORBITAL') {
        // --> CHANGED: Pass the active planet's radius to the orbit generator
        const path = generateOrbit(p, currentRadiusKm);
        return { ...p, displayLat: path[0][0], displayLng: path[0][1], displayAlt: path[0][2], orbitPath: path };
      }
      return { ...p, displayLat: p.latitude, displayLng: p.longitude, displayAlt: 0 };
    });
  }, [ports, activePlanet, currentRadiusKm]); // Added currentRadiusKm to dependencies

  const planetaryPorts = useMemo(() => processedPorts.filter(p => p.type === 'PLANETARY'), [processedPorts]);
  const orbitalPorts = useMemo(() => processedPorts.filter(p => p.type === 'ORBITAL'), [processedPorts]);

  const handlePortClick = (port) => {
    if (!origin || (origin && destination)) {
      setOrigin(port.code);
      setDestination('');
    } else {
      setDestination(port.code);
    }
  };

  if (!activePlanet) {
    return (
      <div className="system-view">
        {['Earth', 'Moon', 'Mars'].map(planet => (
          <div key={planet} className="planet-card" onClick={() => setActivePlanet(planet)}>
            <div className={`planet-sphere ${planet.toLowerCase()}`}></div>
            <h3>{planet}</h3>
            <span className="port-count">{ports.filter(p => p.planet === planet).length} Ports Available</span>
          </div>
        ))}
      </div>
    );
  }

  const config = PLANET_CONFIG[activePlanet];

  return (
    <div className="globe-container" ref={containerRef}>
      <div className="globe-back-btn-wrapper">
        <Button variant="secondary" onClick={() => setActivePlanet(null)}>
          &larr; Return to System View
        </Button>
      </div>

      {dimensions.width > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={config.texture}
          bumpImageUrl={config.bump}

          pointsData={planetaryPorts}
          pointLat="displayLat"
          pointLng="displayLng"
          pointAltitude={0.2} 
          pointRadius={1.5}    
          pointColor={(d) => d.code === origin ? '#00741f' : d.code === destination ? '#d35b5b' : '#00d2ff'}
          onPointClick={handlePortClick}
          pointLabel={(d) => buildTooltip(d, false)}

          objectsData={orbitalPorts}
          objectLat="displayLat"
          objectLng="displayLng"
          objectAltitude="displayAlt"
          objectThreeObject={(d) => {
            const material = new THREE.MeshBasicMaterial({ color: d.code === origin ? 0x00741f : d.code === destination ? 0xd35b5b : 0x00d2ff });
            const geometry = new THREE.SphereGeometry(5.0, 16, 16);
            return new THREE.Mesh(geometry, material);
          }}
          onObjectClick={handlePortClick}
          objectLabel={(d) => buildTooltip(d, true)}

          pathsData={orbitalPorts}
          pathPoints="orbitPath"
          pathPointLat={p => p[0]}
          pathPointLng={p => p[1]}
          pathPointAlt={p => p[2]}
          pathColor={() => 'rgba(255, 255, 255, 1)'} 
          pathStroke={2}
        />
      )}
    </div>
  );
};

export default TripGlobe;