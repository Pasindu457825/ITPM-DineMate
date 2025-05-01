import React, { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
import * as THREE from "three";

const VirtualTour = ({ image360URL }) => {
  const viewerRef = useRef(null);
  const viewerInstance = useRef(null);

  useEffect(() => {
    if (image360URL && viewerRef.current) {
      viewerInstance.current = new Viewer({
        container: viewerRef.current,
        panorama: image360URL,
        loadingImg:
          "https://photo-sphere-viewer.js.org/assets/photosphere-logo.gif",
        navbar: ["zoom", "fullscreen", "autorotate"],
        defaultLong: Math.PI,
        three: THREE, // ✅ required in v5+
      });

      return () => viewerInstance.current?.destroy();
    }
  }, [image360URL]);

  if (!image360URL) {
    return <p className="text-red-500">No 360° image available.</p>;
  }

  return (
    <div
      ref={viewerRef}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    ></div>
  );
};

export default VirtualTour;
