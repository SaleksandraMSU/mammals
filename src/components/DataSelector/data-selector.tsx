import { useDispatch, useSelector } from "react-redux"
import Modal from 'react-modal';
import { IoMdClose } from "react-icons/io";
import { IFiltersState, addLayer, getIsSampleMode, getLayers, setLayers, toggleSampleMode } from "../../redux";
import { DATA_SELECTORS } from "./data-selector-constants";
import { IconButton } from "../Buttons";
import styles from "./data-selector.module.scss";
import { Filters } from "../Select";
import { useCallback, useState } from "react";
import { FilterSelect } from "../Select/Select";
import { DoubleSlider } from "../Slider";
import { methods, months, museums, species, } from "../Select/data";
import { getRandomColor } from "../Select/select-utils";
import { GRADIENT_ITEMS } from "../GradientPicker";
import { Checkbox } from "../Checkbox";

interface IValues extends IFiltersState {
    title: string
};

const customStyles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        zIndex: "1000"
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '12px',
        width: '350px',
    },
};


export const DataSelector = () => {
    const dispatch = useDispatch();
    const root = document.getElementById("root");
    const layers = useSelector(getLayers);
    const isSampleMode = useSelector(getIsSampleMode);
    const [showModal, setShowModal] = useState(false);

    const initValues: IValues = {
        title: `Новый слой ${layers.length ? layers.length + 2 : 1}`,
        species: [],
        dateRange: [1697, 2024],
        months: [],
        museum: [],
        determinationMethod: [],
        isReliable: false,
    };
    const [values, setValues] = useState(initValues);

    const onToggleMode = () => {
        dispatch(toggleSampleMode());
        dispatch(setLayers([]));
    };

    const onChange = useCallback(
        (param: keyof IValues, value: boolean | number[] | string) => {
            setValues((prevValues) => ({ ...prevValues, [param]: value }));
        },
        []
    );

    const onLayerCreate = () => {
        dispatch(addLayer({
            title: values.title,
            value: 9999,
            opacity: 1,
            color: getRandomColor(),
            gradient: GRADIENT_ITEMS[layers.length].value,
            filters: values,
            gridCells: [],
        }));
        setValues(initValues);
        setShowModal(false);
    };

    const onCloseModal = () => {
        setValues(initValues);
        setShowModal(false);
    };

    return (
        <>
            <div className={styles.radioButtons}>
                {DATA_SELECTORS.map((mode) => {
                    const Icon = mode.icon;
                    return (
                        <IconButton
                            key={mode.key}
                            value={mode.value}
                            onClick={onToggleMode}
                            active={mode.value === isSampleMode}
                        >
                            <Icon size={20}/>
                        </IconButton>
                    )
                })}
            </div>
            {!isSampleMode ?
                <Filters />
                :
                <div className={styles.buttonWrapper}>
                    <button className={styles.button} onClick={() => setShowModal(true)}>
                        Создать новый слой на основе выборки
                    </button>
                </div>

            }
            <Modal
                isOpen={showModal}
                onRequestClose={() => onCloseModal()}
                appElement={root!}
                style={customStyles}
            >
                <div className={styles.closeBtn}>
                    <IoMdClose
                        className={styles.icon}
                        onClick={() => onCloseModal()} />
                </div>
                <div className={styles.modal}>
                    <input
                        type="text"
                        placeholder="Название нового слоя"
                        className={styles.input}
                        value={values.title}
                        onChange={(e) => onChange("title", e.target.value)}
                    />
                    <FilterSelect
                        options={species}
                        title="Виды"
                        value="species"
                        onSelect={onChange}
                        filters={values}
                    />
                    <DoubleSlider
                        value={values.dateRange}
                        onChange={onChange}
                    />
                    <FilterSelect
                        options={months}
                        title="Месяцы"
                        value="months"
                        onSelect={onChange}
                        filters={values}
                    />
                    <FilterSelect
                        options={museums}
                        title="Источник данных"
                        value="museum"
                        onSelect={onChange}
                        filters={values}
                    />
                    <FilterSelect
                        options={methods}
                        title="Способ определения"
                        value="determinationMethod"
                        onSelect={onChange}
                        filters={values}
                    />
                    <Checkbox
                        label="Только надежные"
                        isChecked={values.isReliable}
                        onChange={() => onChange("isReliable", !values.isReliable)}
                    />
                    <button className={styles.button} onClick={() => onLayerCreate()}>
                        Создать слой
                    </button>
                </div>
            </Modal>
        </>
    )

}