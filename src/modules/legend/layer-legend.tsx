import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { PiRectangleDuotone } from "react-icons/pi";
import { FaCircle, FaRegCircle } from "react-icons/fa";
import {
    EDisplayTypes,
    IGradientConfig,
    getDataLayers,
    getDisplayMethod,
    getIsDisplayMethodChange,
    getZoomConfig
} from "../../redux";
import { useMapContext } from "../map";
import { GRID_DISPLAY_TYPES, POINT_DISPLAY_TYPES } from "../constants";
import styles from "./layer-legend.module.scss";
import { HEATMAP_LABELS } from "./legend-constants";

type TLayerLegendProps = {
    visible: boolean;
    opacity: number;
    color: string;
    gradient: IGradientConfig;
    labels: (string | number)[];
}

export const LayerLegend = (
    { visible, opacity, color, gradient, labels }: TLayerLegendProps) => {

    if (!visible) {
        return;
    }

    const displayMethod = useSelector(getDisplayMethod);
    const isDisplayChange = useSelector(getIsDisplayMethodChange);
    const data = useSelector(getDataLayers);
    const { map } = useMapContext();
    const [zoom, setZoom] = useState<number | undefined>(map.getView().getZoom())
    const zoomConfig = useSelector(getZoomConfig);
    const { color1, color2, color3 } = gradient;

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
        POINT_DISPLAY_TYPES.includes(displayMethod)
        :
        Number(zoom) > zoomConfig.change;
    const isGradientRender = isDisplayChange ?
        GRID_DISPLAY_TYPES.includes(displayMethod)
        :
        Number(zoom) < zoomConfig.change;
    const isHeatmapRender = displayMethod === EDisplayTypes.HEATMAP;

    return (
        <>
            {isPointRender &&
                <>
                    <React.Fragment>
                        <FaCircle fill={color} opacity={opacity} size={10} />
                        точки регистрации видов
                    </React.Fragment>
                    <React.Fragment>
                        <FaRegCircle fill="red" opacity={opacity} size={10} />
                        ненадежные записи
                    </React.Fragment>
                </>
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
                        {HEATMAP_LABELS.map((l) =>
                            <div key={l}>{l}</div>
                        )}
                    </div>
                </React.Fragment>
            }
            {
                data.Oopt &&
                <React.Fragment>
                    <PiRectangleDuotone
                        fill="rgba(102, 194, 164, 0.5)"
                        stroke="rgba(0, 109, 44, 1)"
                        strokeWidth={0.8}
                        size={30} />
                    ООПТ
                </React.Fragment>
            }
        </>
    )
}