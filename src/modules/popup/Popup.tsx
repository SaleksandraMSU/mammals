import Overlay from 'ol/Overlay.js';
import { useEffect, useRef, useState } from 'react';
import { Control } from 'ol/control';
import { createRoot } from 'react-dom/client';
import './popup-style.scss';
import { useMapContext } from '../map/map-context';


const PopupControl = () => {
  const { map } = useMapContext();
  const popupRef = useRef(null);

  useEffect(() => {
    const overlay = new Overlay({
      element: popupRef.current!,
      autoPan: true,
    });
    map.addOverlay(overlay);

    map.on('singleclick', (event) => {
      const coordinate = event.coordinate;
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const attributes = feature.getProperties();
        const popupContent = (
          <div>
            <button className="popup-closer" onClick={() => overlay.setPosition(undefined)}></button>
            {Object.keys(attributes).filter((key) => key !== "geometry").map((key) => (
              <p key={key}>
                <strong>{key}: </strong>
                {JSON.stringify(attributes[key])}
              </p>
            ))}
          </div>
        );
        createRoot(popupRef.current!).render(popupContent)
        overlay.setPosition(coordinate);
      });
    });
  }, []);

  return (
    <div>
      <div ref={popupRef} className="popup">
        <div className="popup-content" />
      </div>
    </div>
  );
};

export default PopupControl;