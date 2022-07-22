import React from "react";
import "../building_data/style.css";

import VectorMap, {
    Layer,
    Tooltip,
    Label,
    Size
} from "devextreme-react/vector-map";

import { roomsData, buildingData } from "../building_data/data.js";

const projection = {
    aspectRatio: 1,
    from: null, //([x, y]) => [x * 100, y * 100],
    to: null //([l, lt]) => [l / 1200, lt / 1200],
};

const Map = () => {
    return (
        <VectorMap
          id="vector-map"
          zoomingEnabled={true}
          zoomFactor={1}
          maxZoomFactor={100}
          panningEnabled={true}
          projection={projection}
        >
            <Size 
                width={1600}
                height={800}
            />
            <Layer
                dataSource={buildingData}
                hoverEnabled={false}
                name="building">
            </Layer>
          <Layer
            dataSource={roomsData}
            name="rooms"
            borderWidth={0.5}
            color="transparent">
            <Label enabled={true} dataField="name"></Label>
          </Layer>
          <Tooltip
            enabled={true}
            customizeTooltip={customizeTooltip}
          ></Tooltip>
        </VectorMap>
      );
}

function customizeTooltip(arg) {
    if (arg.layer.name === 'rooms') {
      return { text: `Square: ${arg.attribute('square')} ft&#178` };
    }
    return null;
}

export default Map;