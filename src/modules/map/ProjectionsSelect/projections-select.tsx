import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { setProjection, getMapProjection } from "../../../redux";
import { PROJECTIONS } from "../map-projections";
import styles from "./projections-select.module.scss";

export const ProjectionSelect = () => {
    const mapProjection = useSelector(getMapProjection);
    const dispatch = useDispatch();

    const onProjectionChange = (selected: any) => {
        dispatch(setProjection(selected.value));
    };

    return (
        <>
            <div className={styles.title}>Проекция</div>
            <Select
                options={PROJECTIONS}
                value={PROJECTIONS.find(option => option.value === mapProjection)}
                onChange={(selected) => onProjectionChange(selected)}
                styles={{
                    control: (baseStyles) => ({
                        ...baseStyles,
                        marginTop: "10px",
                    }),
                }}
            />
        </>
    )
};