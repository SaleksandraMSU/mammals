import MapComponent from './modules/map/map';
import { Collapsible } from './components/Collapsible/Collapsible';
import { Filters } from './components/Select/Filters';
import { Checkbox } from './components/Checkbox/Checkbox';
import { Toggle } from './components/Toggle/Toggle';
import { BasemapsSelect } from './modules/layers/Basemaps/basemaps-select';
import PopupControl from './modules/popup/Popup';
import { ResetButton } from './components/Button/Button';
import { TocLayers } from './components/TocLayers/Toc-layers';
import { LayersCollection } from './modules/layers';
import styles from "./App.module.scss";
import { ParametersPanel } from './components/ParametersPanel/ParamsPanel';
import { ZoomChange } from './components/ZoomChange/ZoomChange';

function App() {
  return (
    <>
      <div className={styles.full}>
        <div className={styles.header}>
          <img src="./public/logo.png" alt="" height={77} />
          <span>Портал Млекопитающие России</span>
          <div className={styles.separator}></div>
          <div className={styles.separatorShadow}></div>
        </div>
        <div style={{ fontSize: "36px", padding: "30px 0" }}>Карта млекопитающих</div>
        <div className={styles.gridContainer}>
          <div className={styles.sidebar}>
            <div style={{ fontSize: "18px", fontWeight: "600", margin: "20px 0 30px 40px" }}>Настройки карты</div>
            <Collapsible label='Визуализация' defaultActive>
              <Toggle />
              <ZoomChange />
              <ParametersPanel />
              <TocLayers />
              <BasemapsSelect />
            </Collapsible>
            <Collapsible label='Фильтрация'>
              <Filters />
              <Checkbox />
              <ResetButton />
            </Collapsible>
          </div>
          <div className={styles.map}>
            <MapComponent>
              <LayersCollection />
              <PopupControl />
            </MapComponent>
          </div>
        </div>
        <div className={styles.footer}>
          © Млекопитающие России
        </div>
      </div>
    </>
  )
}

export default App
