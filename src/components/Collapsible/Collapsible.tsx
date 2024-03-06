import { useState } from "react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import styles from "./Collapsible.module.scss";

type TCollapsibleProps = {
    label: string,
    children: React.ReactNode,
    defaultActive?: boolean,
}
export const Collapsible = ({ label, children, defaultActive }: TCollapsibleProps) => {
    const [active, setActive] = useState(defaultActive);

    // useEffect(() => {
    //     if (collapseItems) {
    //         setItems({
    //             ...collapseItems.map(item => ({
    //                 ...item,
    //                 toggled: false
    //             }))
    //         })
    //     }
    // }, [collapseItems])

    const onClick = () => {
        setActive(!active)
    }

    return (
        <div className={styles.accordion}>
            <div className={styles.contentBx}>
                <div className={styles.label} onClick={onClick}>
                    {label}
                    {active ?
                        <IoIosArrowDown className={styles.icon} />
                        :
                        <IoIosArrowForward className={styles.icon} />
                    }
                </div>
                {active && <div className={styles.content}>
                    {children}
                </div>
                }
            </div>
        </div>
    )
}