import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import Cardcomp from "./places/Cardcomp";
import Addplace from "./places/Addplace";

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    fetch("/api/v1/places")
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "success") setPlaces(json.data);
      });
  },[]);

  const handleAddplace = ()=>{
    setModalShow(true)
    if(localStorage.getItem('pubtoken') === null){
      history('/login')
      alert("Please Login to add a Review")
    }
  }

  const handleDelete = (i)=>{
    fetch(`/api/v1/place/${i}`,{
      method:"DELETE",
      headers:{"authorization":localStorage.getItem('pubtoken')}
    })
    .then(response=>response.json())
    .then(json=>{
      if(json.status === 'success'){
        alert('Place deleted Successfully...')
        setPlaces(places.filter(place=>{return place.PLACE_ID !== i}))
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
        <h1>Special Places for you</h1>
      </div>
      <Container
        className="text-center"
        style={{ maxWidth: "none", padding: "4vw" }}
      >
        <Row>
          <Col>
            <span
              onClick={() => handleAddplace()}
              style={{ float: "right", color: "blue", cursor: "pointer" }}
            >
              +Add
            </span>
          </Col>
          <Addplace show={modalShow} onHide={() => setModalShow(false)} />
        </Row>
        <Row>
          {places.map((place,i) => {
            return <Cardcomp key={i} place={place} handleDelete={handleDelete}/>;
          })}
        </Row>
      </Container>
    </>
  );
};

export default Places;
