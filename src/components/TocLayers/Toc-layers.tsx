import { useDispatch, useSelector } from "react-redux";
import styles from "./Toc-layers.module.scss";
import { getDefaultLayer, getLayers } from "../../redux";
import { TocItem } from "./toc-item";

export const TocLayers = () => {

    const layers = useSelector(getLayers);
    const defaultLayer = useSelector(getDefaultLayer);

    return (
        <div>
            <div className={styles.title}>Векторные слои</div>
            {!layers.length ?
                <TocItem
                    key={defaultLayer.title}
                    title={defaultLayer.title}
                    opacity={defaultLayer.opacity} 
                    color={defaultLayer.color}
                    gradient={defaultLayer.gradient}
                    />
                :
                layers.map((lyr) =>
                    <TocItem
                        key={lyr.title}
                        title={lyr.title}
                        opacity={lyr.opacity}
                        color={lyr.color}
                        gradient={lyr.gradient}
                    />
                )

            }
        </div>
    )
}