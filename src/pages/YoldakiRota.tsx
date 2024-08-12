import {   Map, useMap, useMapsLibrary,  } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

import {DeckGlOverlay} from '../components/deckgl-overlay';

import type {Feature, GeoJSON} from 'geojson';

import {GeoJsonLayer} from '@deck.gl/layers';

const DATA_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json';

export default function RotaCiz() {

  const [data, setData] = useState<GeoJSON | null>(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then(res => res.json())
      .then(data => setData(data as GeoJSON));
  }, []);


    return (
        <>
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h1>Yoldaki Rota</h1>
                <Map
                    defaultZoom={3}
                    defaultCenter={{ lat: 22.54992, lng: 0 }}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    className="w-[1200px] h-[600px]"
                >
                    <Directions />
                    <DeckGlOverlay layers={getDeckGlLayers(data)} />
                </Map>
            </div>
        </>
    );
}


function Directions() {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] =
      useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] =
      useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];
  
    // Initialize directions service and renderer
    useEffect(() => {
      if (!routesLibrary || !map) return;
      setDirectionsService(new routesLibrary.DirectionsService());
      setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
    }, [routesLibrary, map]);
  
    // Use directions service
    useEffect(() => {
      if (!directionsService || !directionsRenderer) return;
  
      directionsService
        .route({
          origin: {lat: 40.9780, lng: 27.5086},
          destination: {lat: 40.1828, lng: 29.0668},
          waypoints: [
           {
            location: {lat: 40.7569, lng: 30.3780},
            stopover: true,
           },
          ],
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: false,
        })
        .then(response => {
          directionsRenderer.setDirections(response);
          setRoutes(response.routes);
        });
  
      return () => directionsRenderer.setMap(null);
    }, [directionsService, directionsRenderer]);
  
    // Update direction route
    useEffect(() => {
      if (!directionsRenderer) return;
      directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);
  
    if (!leg) return null;
  
    return (
      <div className="directions">
        <h2>{selected.summary}</h2>
        <p>
          {leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}
        </p>
        <p>Distance: {leg.distance?.text}</p>
        <p>Duration: {leg.duration?.text}</p>
  
        <h2>Other Routes</h2>
        <ul>
          {routes.map((route, index) => (
            <li key={route.summary}>
              <button onClick={() => setRouteIndex(index)}>
                {route.summary}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  

  function getDeckGlLayers(data: GeoJSON | null) {
    if (!data) return [];
  
    return [
      new GeoJsonLayer({
        id: 'geojson-layer',
        data,
        stroked: false,
        filled: true,
        extruded: true,
        pointType: 'circle',
        lineWidthScale: 20,
        lineWidthMinPixels: 4,
        getFillColor: [160, 160, 180, 200],
        getLineColor: (f: Feature) => {
          const hex = f?.properties?.color;
  
          if (!hex) return [0, 0, 0];
  
          return hex.match(/[0-9a-f]{2}/g)!.map((x: string) => parseInt(x, 16));
        },
        getPointRadius: 1300,
        getLineWidth: 1,
        getElevation: 30
      })
    ];
  }
  