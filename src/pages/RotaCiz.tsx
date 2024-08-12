import {   Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export default function RotaCiz() {
   
    return (
        <>
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h1>Rota Çiz</h1>
                <Map
                    defaultZoom={3}
                    defaultCenter={{ lat: 22.54992, lng: 0 }}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    className="w-[1200px] h-[600px]"
                >
                    <Directions />
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
        origin: { lat: 40.9780, lng: 27.5086 }, // Başlangıç noktası
        destination: { lat: 40.9780, lng: 27.5086 }, // Bitiş noktası başlangıç noktasıyla aynı
        waypoints: [
            {
            location: { lat: 40.7569, lng: 30.3780 },
            stopover: true,
          },
          {
            location: { lat: 40.8787, lng: 29.2723 },
            stopover: true,
          },
          {
            location: { lat: 41.0201, lng: 28.5850 },
            stopover: true,
          },
        ],
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
        optimizeWaypoints: true, // Waypointsler optimize edilecek
      })
      .then((response) => {
        console.log(response);
        // Bitiş noktasını kaldırmak için
        const optimizedRoute = response.routes[0];
        if (optimizedRoute) {
          // Son varış noktasını rota göstergesi dışına al
          optimizedRoute.legs[optimizedRoute.legs.length - 1].end_location = null;
          // Son varış noktasını rota göstergesi dışına al
          optimizedRoute.legs[optimizedRoute.legs.length - 1].steps = [];
        }
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
  