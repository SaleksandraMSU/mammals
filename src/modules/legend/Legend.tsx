import React, { useEffect, useState } from "react";
import cn from "classnames";
import Select from 'react-select';
import styles from "./Legend.module.scss";
import { useSelector } from "react-redux";
import { getDefaultLayer, getIsZeroFilters, getLayers } from "../../redux";
import { LayerLegend } from "./point-legend";

type TOption = {
    value: number,
    label: string,
}

export const Legend = React.memo(() => {
    const [active, setActive] = useState(false);
    const [visibleLyr, setVisibleLyr] = useState<number | null>();
    const [options, setOptions] = useState<TOption[]>([]);
    const isNoFilters = useSelector(getIsZeroFilters);
    const layers = useSelector(getLayers);
    const defaultLyr = useSelector(getDefaultLayer);

    useEffect(() => {
        if (layers.length) {
            setVisibleLyr(layers[0].value);

            const options = layers.map((lyr) => {
                return (
                    {
                        value: lyr.value!,
                        label: lyr.title,
                    }
                )
            });
            setOptions(options);
        }
    }, [layers])

    const defaultLabels = ["375 и более", 170, 50, 15, 1];
    const layerLabels = ["20 и более", 15, 10, 5, 1];

    return (
        <div
            className={cn(styles.block, {
                [styles.active]: active
            }
            )}>
            <div onClick={() => setActive(!active)}>Легенда</div>
            {active &&
                <>
                    <div style={{ marginTop: "1rem" }}>
                        {layers.length > 0 &&
                            <Select
                                options={options}
                                value={options.find(option => option.value === visibleLyr)}
                                onChange={(selected) => setVisibleLyr(selected?.value)}
                            />
                        }
                    </div>
                    <div className={styles.grid}>
                        {layers.length ?
                            layers.map((l) =>
                                <LayerLegend
                                    visible={l.value === visibleLyr}
                                    key={l.value}
                                    opacity={l.opacity}
                                    color={l.color}
                                    gradient={l.gradient}
                                    labels={layerLabels}
                                />
                            )
                            :
                            <LayerLegend
                                visible={true}
                                opacity={defaultLyr.opacity}
                                color={defaultLyr.color}
                                gradient={defaultLyr.gradient}
                                labels={isNoFilters ? defaultLabels : layerLabels}
                            />
                        }

                    </div>
                </>
            }
        </div>
    )
})