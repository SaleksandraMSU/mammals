import { useDispatch, useSelector } from "react-redux"
import { getIsPhoto, getIsReliable } from "../../redux/selectors"
import { useCallback } from "react";
import { IFiltersState } from "../../redux/types";
import { setFilters } from "../../redux/actions";


export const Checkbox = () => {
    const isPhoto = useSelector(getIsPhoto);
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
            <div style={{margin: "1rem 0"}}>
                <input type="checkbox" checked={isReliable} onChange={() => onChange("isReliable", !isReliable)} /> Только надежные
            </div>
            {/* <div style={{margin: "10px"}}>
                <input type="checkbox" checked={isPhoto} onChange={() => onChange("isPhoto", !isPhoto)} /> С фото
            </div> */}
        </>
    )
}