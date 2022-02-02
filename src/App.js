import { ArcLayer } from "@deck.gl/layers";
import { FillStyleExtension } from "@deck.gl/extensions";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MVTLayer } from "@deck.gl/geo-layers";
import DeckGL from "@deck.gl/react";
import { StaticMap, MapContext, AttributionControl } from "react-map-gl";

import "./App.css";

const MAPBOX_TOKEN = "YOUR TOKEN HERE";

const patterns = ["dots", "hatch-1x", "hatch-2x", "hatch-cross"];

function App() {
  const arcLayer = new ArcLayer({
    data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json",
    getSourcePosition: (d) => d.from.coordinates,
    getTargetPosition: (d) => d.to.coordinates,
    getSourceColor: [255, 200, 0],
    getTargetColor: [0, 140, 255],
    getWidth: 12,
  });

  const mvtStreetsLayer = new MVTLayer({
    data: `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v7/{z}/{x}/{y}.vector.pbf?access_token=${MAPBOX_TOKEN}`,

    minZoom: 0,
    maxZoom: 23,
    getLineColor: [192, 192, 192],
    getFillColor: [140, 170, 180],

    getLineWidth: (f) => {
      switch (f.properties.class) {
        case "street":
          return 6;
        case "motorway":
          return 10;
        default:
          return 1;
      }
    },
    lineWidthMinPixels: 1,
  });

  const naturalEarthLayer = new GeoJsonLayer({
    data: "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson",
    stroked: true,
    filled: true,
    lineWidthMinPixels: 2,
    getLineColor: [60, 60, 60],
    getFillColor: [60, 180, 240],
    // FileStyeExtension props
    fillPatternMask: true,
    fillPatternAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl/master/examples/layer-browser/data/pattern.png",
    fillPatternMapping:
      "https://raw.githubusercontent.com/visgl/deck.gl/master/examples/layer-browser/data/pattern.json",
    getFillPattern: (feature, { index }) => patterns[index % 4],
    getFillPatternScale: 500,
    getFillPatternOffset: [0, 0],
    // Define the extension to use
    extensions: [new FillStyleExtension({ pattern: true })],
  });

  return (
    <DeckGL
      initialViewState={{
        longitude: -122.45,
        latitude: 37.75,
        zoom: 11,
        bearing: 0,
        pitch: 0,
      }}
      controller={true}
      layers={[naturalEarthLayer]}
      // layers={[mvtStreetsLayer]}
      // layers={[mvtStreetsLayer, arcLayer]}
      // This is required when using react-map-gl controls as children
      ContextProvider={MapContext.Provider}
    >
      <StaticMap
        mapboxApiAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
      />
      <AttributionControl
        style={{
          fontFamily: "sans-serif",
          fontSize: 14,
          right: 0,
          bottom: 0,
        }}
      />
    </DeckGL>
  );
}

export default App;
