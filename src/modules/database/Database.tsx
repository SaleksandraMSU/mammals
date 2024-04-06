import { useState } from "react";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { FaDatabase } from "react-icons/fa";
import styles from "./Database.module.scss";
import { EData, getDataLayers, setDataLayers } from "../../redux";
import { Checkbox } from "../../components";

export const DataBase = () => {
    const [active, setActive] = useState(false);
    const { Cities, Oopt } = useSelector(getDataLayers);
    const dispatch = useDispatch();

    const onChange = (value: EData, checked: boolean) => {
        //@ts-ignore
        dispatch(setDataLayers({ [value]: checked }));
    };

    return (
        <div
            className={cn(styles.block, {
                [styles.active]: active
            }
            )}>
            <div onClick={() => setActive(!active)}><FaDatabase /></div>
            {active &&
                <div className={styles.list}>
                    <Checkbox
                        isChecked={Cities}
                        onChange={() => onChange(EData.CITIES, !Cities)}
                        label="Заселенные территории"
                    />
                    <Checkbox
                        isChecked={Oopt}
                        onChange={() => onChange(EData.OOPT, !Oopt)}
                        label="ООПТ"
                    />
                </div>
            }
        </div>
    )
}