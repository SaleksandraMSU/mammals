import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react";
import { getIsReliable, setFilters, IFiltersState } from "../../redux";

export const Checkbox = () => {
    const isReliable = useSelector(getIsReliable);
    const dispatch = useDispatch();

    const onChange = useCallback(
        (param: keyof IFiltersState, value: boolean) => {
            dispatch(setFilters({ [param]: value }));
        },
        [dispatch]
    );

    return (
        <>
            <div style={{ margin: "1rem 0" }}>
                <input type="checkbox" checked={isReliable} onChange={() => onChange("isReliable", !isReliable)} /> Только надежные
            </div>
        </>
    )
}