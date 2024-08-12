import {  ControlPosition, Map, MapControl, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import MapHandler from "../components/MapHandler";
import { useState } from "react";
import { PlaceAutocompleteClassic } from "../components/PlaceAutocompleteClassic";

export default function AddAddress() {
    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.PlaceResult | null>(null);

    const location = selectedPlace?.geometry?.location;

   
    return (
        <>
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h1>Add Address</h1>
                <Map
                    defaultZoom={3}
                    defaultCenter={{ lat: 22.54992, lng: 0 }}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    className="w-[1200px] h-[600px]"
                >
                    {location && (
                        <Marker
                            position={{
                                lat: location.lat(),
                                lng: location.lng()
                            }}
                            draggable
                        />
                    )}

                    {location && (
                        <InfoWindow
                            position={{
                                lat: location.lat(),
                                lng: location.lng(),
                            }}
                            pixelOffset={[0, -40]}
                        >
                            <div>
                                <h1>{selectedPlace?.name}</h1>
                                <p>{selectedPlace?.formatted_address}</p>
                            </div>
                        </InfoWindow>
                    )}

                    <MapControl position={ControlPosition.TOP}>
                        <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
                    </MapControl>
                    <MapHandler place={selectedPlace} />
                </Map>
            </div>
        </>
    );
}
