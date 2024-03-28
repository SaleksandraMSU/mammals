import {
  Checkbox,
  Collapsible,
  Filters,
  Toggle,
  TocLayers,
  ResetButton,
  ParametersPanel,
  StatisticsPanel,
  ZoomChange
} from './components';
import { MapComponent, ProjectionSelect } from './modules/map';
import { BasemapsSelect, LayersCollection } from './modules/layers';
import { PopupControl } from './modules/popup/';
import { Legend } from './modules/legend';
import { SpeciesComparePanel } from './components/SpeciesCompare/SpeciesComparePanel';
import styles from "./App.module.scss";

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
            <div style={{ fontSize: "18px", fontWeight: "600", margin: "20px 0 20px 40px" }}>Настройки карты</div>
            <Collapsible label='Визуализация' defaultActive>
              <Toggle />
              <ZoomChange />
              <ParametersPanel />
              <TocLayers />
              <BasemapsSelect />
              <ProjectionSelect />
            </Collapsible>
            <Collapsible label='Фильтрация'>
              <Filters />
              <Checkbox />
              <ResetButton />
            </Collapsible>
            <Collapsible label='Статистика'>
              <StatisticsPanel />
              <SpeciesComparePanel />
            </Collapsible>
          </div>
          <div className={styles.map}>
            <MapComponent>
              <LayersCollection />
              <PopupControl />
              <Legend />
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
