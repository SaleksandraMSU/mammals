import Overlay from 'ol/Overlay.js';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useMapContext } from '../map';
import './popup-style.scss';

export const PopupControl = () => {
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
            <button
              className="popup-closer"
              onClick={() => overlay.setPosition(undefined)}
            />
            {Object.keys(attributes)
              .filter((key) => key !== "geometry")
              .map((key) => (
                <p key={key}>
                  <strong>{key}: </strong>
                  {JSON.stringify(attributes[key])}
                </p>
              ))}
          </div>
        );
        createRoot(popupRef.current!).render(popupContent);
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