import { useSelector } from "react-redux"
import { FaCircle } from "react-icons/fa";
import { EDisplayTypes, IGradientConfig, getDisplayMethod, getIsDisplayMethodChange, getZoomConfig } from "../../redux";
import React, { useEffect, useState } from "react";
import { useMapContext } from "../map/map-context";
import styles from "./layer-legend.module.scss";

type TLayerLegendProps = {
    visible: boolean;
    opacity: number;
    color: string;
    gradient: IGradientConfig;
    labels: (string | number)[];
}

export const LayerLegend = ({ visible, opacity, color, gradient, labels }: TLayerLegendProps) => {
    if (!visible) {
        return;
    }

    const displayMethod = useSelector(getDisplayMethod) as EDisplayTypes;
    const isDisplayChange = useSelector(getIsDisplayMethodChange);
    const { map } = useMapContext();
    const [zoom, setZoom] = useState<number | undefined>(map.getView().getZoom())
    const zoomConfig = useSelector(getZoomConfig);
    const { color1, color2, color3 } = gradient;
    const heatmapLabels = [1, 0.5, 0];

    const onZoomChange = () => {
        const currentZoom = map.getView().getZoom();
        setZoom(currentZoom);
    };

    useEffect(() => {
        map.getView().on("change:resolution", onZoomChange);

        return () => {
            map.getView().un("change:resolution", onZoomChange);
        }
    });

    const isPointRender = isDisplayChange ?
        [EDisplayTypes.POINTS, EDisplayTypes.MIX].includes(displayMethod)
        :
        Number(zoom) > zoomConfig.change;
    const isGradientRender = isDisplayChange ?
        [EDisplayTypes.GRID, EDisplayTypes.MIX].includes(displayMethod)
        :
        Number(zoom) < zoomConfig.change;
    const isHeatmapRender = displayMethod === EDisplayTypes.HEATMAP;

    return (
        <>
            {isPointRender &&
                <React.Fragment>
                    <FaCircle fill={color} opacity={opacity} size={10} />
                    <div>точки регистрации видов</div>
                </React.Fragment>
            }
            {
                isGradientRender &&
                <React.Fragment>
                    <div
                        className={styles.box}
                        style={{
                            background: `linear-gradient(to top, ${color1}, ${color2}, ${color3})`,
                            opacity: opacity,
                        }}
                    >
                    </div>
                    <div className={styles.labels}>
                        {labels.map((l) =>
                            <div key={l}>{l}</div>
                        )}
                    </div>
                </React.Fragment>
            }
            {
                isHeatmapRender &&
                <React.Fragment>
                    <div
                        className={styles.box}
                        style={{
                            background: `linear-gradient(to top, ${color1}, ${color2}, ${color3})`,
                            opacity: opacity,
                        }}
                    >
                    </div>
                    <div className={styles.labels}>
                        {heatmapLabels.map((l) =>
                            <div key={l}>{l}</div>
                        )}
                    </div>
                </React.Fragment>
            }
        </>
    )
}