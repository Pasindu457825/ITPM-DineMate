// src/virtualView/VirtualTour.js
import React, { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
import * as THREE from "three";

export default function VirtualTour({ image360URL }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!image360URL) return;

    const viewer = new Viewer({
      container: ref.current,
      panorama: image360URL,
      defaultLong: "0deg",
      navbar: ["zoom", "fullscreen", "autorotate"],
      three: THREE,
    });

    return () => viewer.destroy();
  }, [image360URL]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  );
}
