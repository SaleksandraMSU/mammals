import Overlay from 'ol/Overlay.js';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useMapContext } from '../map';
import './popup-style.scss';
import { species } from '../../components/Select/data';

export const PopupControl = () => {
  const { map } = useMapContext();
  const popupRef = useRef(null);

  useEffect(() => {
    const overlay = new Overlay({
      element: popupRef.current!,
      autoPan: false,
    });
    map.addOverlay(overlay);

    map.on('singleclick', (event) => {
      const coordinate = event.coordinate;
      const feats = map.getFeaturesAtPixel(event.pixel);
      const attributes = feats[0].getProperties();
      const popupContent = (
        <div>
          <button
            className="popup-closer"
            onClick={() => overlay.setPosition(undefined)}
          />
          {Object.entries(attributes)
            .filter(([k, _]) => k !== "geometry")
            .map(([key, value]) => (
              ["species", "Species"].includes(key) ?
                <p key={key}>
                  <strong>{key}: </strong>
                  {species.find((sp) => +sp.value === value)?.label}
                </p>
                :
                <p key={key}>
                  <strong>{key}: </strong>
                  {value}
                </p>
            ))}
        </div>
      );
      createRoot(popupRef.current!).render(popupContent);
      overlay.setPosition(coordinate);
    });
  }, [map]);

  return (
    <div>
      <div ref={popupRef} className="popup">
        <div className="popup-content" />
      </div>
    </div>
  );
};