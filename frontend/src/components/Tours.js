import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {useNavigate} from 'react-router-dom'
import Cardcomp from "./tours/Cardcomp";
import Addtour from "./tours/Addtour";

const Tours = () => {
  const [trips, setTrips] = useState([]);

  const [modalShow, setModalShow] = useState(false);

  const history = useNavigate();

  useEffect(() => {
    fetch("/api/v1/tours")
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "success") setTrips(json.data);
      });
     
  },[]);

  const handleAddtour = ()=>{
    setModalShow(true)
    if(localStorage.getItem('pubtoken') === null){
      history('/login')
      alert("Please Login to add a Review")
    }
  }

  const handleDelete = (i)=>{
    fetch(`/api/v1/tours/${i}`,{
      method:"DELETE",
      headers:{"authorization":localStorage.getItem('pubtoken')}
    })
    .then(response=>response.json())
    .then(json=>{
      if(json.status === 'success'){
        alert('Tour deleted Successfully...')
        setTrips(trips.filter(trip=>{return trip.TRIP_ID !== i}))
      }
      else{
        alert('session expired...')
        history('/login')
      }
    })
  }

  return (
    <>
      <div
        style={{
          justifyContent: "center",
          height: "25vh",
          backgroundColor: "#c6ecc6",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h1>Special Tours for you</h1>
      </div>
      <Container
        className="text-center"
        style={{ maxWidth: "none", padding: "4vw" }}
      >
        <Row>
          <Col>
            <span
              onClick={() => handleAddtour()}
              style={{ float: "right", color: "blue", cursor: "pointer" }}
            >
              +Add
            </span>
          </Col>
          <Addtour show={modalShow} onHide={() => setModalShow(false)} />
        </Row>
        <Row>
          {trips.map((trip, id) => {
            return <Cardcomp key={id} trip={trip} handleDelete={handleDelete} />;
          })}
        </Row>
      </Container>
    </>
  );
};

export default Tours;
