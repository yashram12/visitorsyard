import { useState} from "react";
import 'dotenv/config'
import Star from '../Star';
import {Container,Row} from 'react-bootstrap'
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";


const Mapcontainer = ({ list }) => {
  const mapStyles = {
    height: "70vh",
    width: "95%",
    margin:"1rem"
  };
  
const [hovered, setHovered] = useState({});

const [myLoc,setMyLoc] =useState({});


  
  return (
    <LoadScript googleMapsApiKey='AIzaSyCJvaBJZXo3I8tvsLAC6lxANy536KuGtS8'>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={9}
        // center={list[Math.floor(list.length / 2)].coordinates}
        center={myLoc}
        onClick={()=>setHovered({})}
      > 

        {navigator.geolocation && navigator.geolocation.getCurrentPosition((pos)=>{
          console.log(pos.coords)
          setMyLoc({lat:pos.coords.latitude,lng:pos.coords.longitude})
        })}

        <Marker key={-1} position={myLoc && myLoc} onMouseOver={()=>setHovered({placeId:-1,name:"My Location",coordinates:myLoc && myLoc,star:-1})} onMouseDown={()=>setHovered({})} />
        
        {list.map((item,i) => {
          return (
            <Marker
              key={i}
              position={item.coordinates}
              onMouseOver={()=>setHovered(item)}
              onMouseDown={()=>setHovered({})}
            />
          );
        })}
        
        {hovered.coordinates && (
          <InfoWindow position={hovered.coordinates} clickable={true} onCloseClick={()=>{setHovered({})}}>
            <Container>
            <Row><h6>{hovered.name}</h6></Row>
            <Row><Star n={hovered.star} /></Row>
            </Container>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Mapcontainer;
