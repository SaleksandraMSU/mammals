import {
  Collapsible,
  Filters,
  TocLayers,
  ParametersPanel,
  StatisticsPanel,
  SpeciesComparePanel,
  ZoomChange,
  DisplayRadioButtons,
  DataSelector
} from './components';
import { MapComponent, ProjectionSelect } from './modules/map';
import { BasemapsSelect, LayersCollection } from './modules/layers';
import { PopupControl } from './modules/popup/';
import { Legend } from './modules/legend';
import { DataBase } from './modules/database/Database';
import styles from "./App.module.scss";

function App() {
  return (
    <>
      <div className={styles.full}>
        <div className={styles.header}>
          <img src="./public/logo.png" alt="" height={77} />
          <span>Портал Млекопитающие России</span>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.separatorShadow}></div>
        <div className={styles.pageTitle}>Карта млекопитающих</div>
        <div className={styles.gridContainer}>
          <div className={styles.sidebar}>
            <div className={styles.title} >Настройки карты</div>
            <Collapsible label='Визуализация' defaultActive>
              <DisplayRadioButtons />
              <ZoomChange />
              <ParametersPanel />
              <TocLayers />
              <BasemapsSelect />
              <ProjectionSelect />
            </Collapsible>
            <Collapsible label='Данные'>
              <DataSelector />
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
              <DataBase />
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
