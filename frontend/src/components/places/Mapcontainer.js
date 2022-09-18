import { useState } from "react";
import "dotenv/config"
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const Mapcontainer = ({ name, coords }) => {
  const [hovered, setHovered] = useState(false);

  
  const mapStyles = {
    height: "50vh",
    width: "100%",
  };

  return (
    <LoadScript googleMapsApiKey='AIzaSyCJvaBJZXo3I8tvsLAC6lxANy536KuGtS8'>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={coords && coords}
        onMouseDown={()=>setHovered(false)}
      >
        <Marker
          key={name && name}
          position={coords && coords}
          onMouseOver={() => setHovered(true)}
          onMouseDown={() => setHovered(false)}
        />
        {hovered && (
          <InfoWindow
            position={coords && coords}
            clickable={true}
            onCloseClick={() => {
              setHovered(false);
            }}
          >
            <h6>{name && name}</h6>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Mapcontainer;
