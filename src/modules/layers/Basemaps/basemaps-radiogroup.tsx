import { useDispatch, useSelector } from "react-redux";
import { basemapsGroup } from "./basemaps-items";
import styles from "./basemaps-radiogroup.module.scss";
import { getActiveBasemap, setActiveBasemap } from "../../../redux";

export const BasemapsRadioGroup = () => {
    const activeBasemap = useSelector(getActiveBasemap);
    const dispatch = useDispatch();

    const onBasemapChange = (e: any) => {
        dispatch(setActiveBasemap(e.target.value));
      };

    return (
        <>
        <div className={styles.title}>Базовая карта</div>
        <div className={styles.radioGroup} onChange={onBasemapChange}>
            {
                basemapsGroup.map((basemap) => (
                    <label key={basemap.key}>
                        <input
                            type="radio"
                            value={basemap.value}
                            checked={basemap.value === activeBasemap}
                            key={basemap.key}
                            readOnly />
                        {basemap.key}
                    </label>
                ))
            }
        </div>
        </>
    )
};