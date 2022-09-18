import { Image, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useParams ,useNavigate} from "react-router-dom";
import Review from "./Review";
import Placeinfo from "./Placeinfo";
import Addreview from "./Addreview";
import Gallery from "./Gallery";
import Mapcontainer from "./Mapcontainer";

const Place = () => {
  const [place, setPlace] = useState([]);
  const [coords, setCoords] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const { pid } = useParams();
  const history = useNavigate();


  useEffect(()=>{
    fetch(`/api/v1/places/${pid}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "success") setPlace(json.data);
        else alert(json.message)
      })
      .catch((e) => console.log(e));

    fetch(`/api/v1/coords/${pid}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "success") setCoords(json.data);
      })
      .catch((e) => console.log(e));

    fetch(`/api/v1/review/${pid}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "success") setReviews(json.data);
      })
      .catch((e)=> console.log(e));

      return () => {
        setPlace([]);
        setCoords([]);
        setReviews([]);
      };

  }, [pid]);

  const handleAddreview = ()=>{
    setModalShow(true)
    if(localStorage.getItem('pubtoken') === null){
      history('/login')
      alert("Please Login to add a Review")
    }
  }

  return (
    <Container style={{ minHeight: "74vh", maxWidth: "95vw" }}>
      <Row>
        <Link
          to="/places"
          style={{ margin: "4vh 0", textDecoration: "none", color: "black" }}
        >
          <h6>{"< Back"}</h6>
        </Link>
      </Row>
      <Row>
        <Col lg={6} md={12} style={{ padding: "1rem" }}>
          <Image
            src={place[0] && place[0].IMG}
            style={{ width: "100%" }}
            fluid
          />
        </Col>
        <Col lg={6} md={12} style={{ padding: "2rem" }}>
          <h1 style={{ fontSize: "4rem" }}>
            {place[0] && place[0].PLACE_NAME}
          </h1>
          <i className="fa fa-map-marker" style={{ fontSize: "1.5rem" }}></i>
          <span style={{ fontSize: "1.5rem" }}>
            &nbsp;{place[0] && place[0].LOCATION}
          </span>
        </Col>
      </Row>

      {place[0] &&
        JSON.parse(place[0].DESCRIPTION.replace(/\s+/g, ' ').trim()).map((ele, i) => {
          return (
            <Row key={i}>
              <Placeinfo title={ele[`title${i}`]} desc={ele[`desc${i}`]} />
            </Row>
          );
        })}

      <Container>
      <Row className='my-5'>
        <Col lg={{span:6,order:1}} md={{span:12,order:2}} sm={{span:12,order:2}} xs={{span:12,order:2}}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Mapcontainer
              name={place[0] && place[0].PLACE_NAME}
              coords={
                coords[0] && {
                  lat:coords[0].LAT,
                  lng:coords[0].LNG,
                }
              }
            />
          </div>
        </Col>
        <Col lg={{span:6,order:2}} md={{span:12,order:1}} sm={{span:12,order:1}} xs={{span:12,order:1}} style={{display:"flex",justifyContent:'center',alignItems:"center",marginBottom:"1rem"}}><h1>Location</h1></Col>
      </Row>
      </Container>

      <Row>
        <Gallery pid={pid}/>
      </Row>

      <Row>
        <Col>
          <h4>Review</h4>
        </Col>
        <Col>
          <span
            onClick={() =>handleAddreview()}
            style={{ float: "right", color: "blue", cursor: "pointer" }}
          >
            +Add
          </span>
        </Col>
        <Addreview show={modalShow} onHide={() =>setModalShow(false)} reviews={reviews} setReviews={setReviews} />
      </Row>
      <Row>
           {reviews.map((review)=>{
            return(<Review key={review.RID} data={review} setReviews={setReviews} reviews={reviews} />)
        })}


      </Row>
    </Container>
  );
};

export default Place;
