import {useState ,useEffect} from 'react';
import { Carousel, Container ,Row,Col} from "react-bootstrap";
import { Link ,useParams} from "react-router-dom";
import Mapcontainer from "./Mapcontainer";



const Tour = () => {
  
  const [places,setPlaces] = useState([{}]);

  const [tourData,setTourData] = useState({})

  const {tid} = useParams();
  
  useEffect(()=>{
    fetch(`/api/v1/tours/${tid}`)
    .then(response=>response.json())
    .then(json=>{
      if(json.status === 'success'){
        setPlaces(json.data.places)
        setTourData(json.data.trip)
      }
    })
  },[tid])
  
     

  return (
    <div style={{minHeight:'70vh'}}>
      <Link
        to="/tours"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          margin: "1vw",
          textDecoration: "none",
          color: "black",
        }}
      >
        <h6>{"< Back"}</h6>
      </Link>
      <Container>
        <Row>
          <Col xl={6} s={12}>
            <Carousel variant="dark">
              {places.map((place,i)=>{
                return(
                  <Carousel.Item key={i}>
                    <img
                      style={{height:"20rem"}}
                      className="d-block w-100"
                      src={place.img}
                      alt={`slide-${i+1}`}
                    />
                  </Carousel.Item>
                )
              })}

            </Carousel>
          </Col>
          <Col className='' xl={6} sm={12}>
              <div className="m-5">
                <h1>{tourData.TRIP_NAME}</h1>
                <div><i className="fa fa-sun-o"></i><span>{" "}{tourData.TIME} Days</span><span>{" | "}</span><i className="fa fa-moon-o"></i><span>{" "}{tourData.TIME + 1} Nights</span></div>
                <div><i className="fa fa-road"></i><span>{" "}{tourData.DISTANCE} Kms</span></div>
              </div>
          </Col>
        </Row>
      </Container>
                <div className="m-5 "><h2>Places you have in this Tour</h2></div>
     <Container style={{maxWidth:'100vw'}}>
             <Row >
             <Col xl={4} lg={5} sm={12}>
                {
                    places.map((el,i)=>{
                        return <Row className="text-center" key={i}>
                                <h4>{el.name}</h4>
                                {(places.length-1) !== i && <div className='text-center'><div style={{fontWidth:"10%",fontWeight:'100',fontSize:'30px'}}>V</div></div>}
                            </Row>
                    })
                }
             </Col>
             <Col >
               <Mapcontainer list={places} />  
             </Col>
             </Row>
     </Container>
    
    </div>
  );
};

export default Tour;
