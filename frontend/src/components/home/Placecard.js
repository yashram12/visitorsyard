import {Card,Row,Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Star from '../Star'

const Placecard = ({place}) => {
  return (
    <div>
      <Link to={`/place/${place && place.PLACE_ID}`} style={{textDecoration:"none",color:"black"}}>
      <Card style={{ margin: "auto 2vw" }}>
        <Card.Img
          style={{height:'14rem'}}
          variant="top"
          src={place && place.IMG}
          // src='https://www.threetrekkers.com/wp-content/uploads/2020/08/DD-Hills-Bangalore-Banner.png'
        />
        <Card.Body>
          <Card.Title>{place && place.PLACE_NAME}</Card.Title>
          <Card.Text>
            <Row>
              <Col>
                <div>{place && place.LOCATION}</div>
              </Col>
              <Col >
                <Star n={place && place.RATING}/>
              </Col>
            </Row>
          </Card.Text>
        </Card.Body>
      </Card>
      </Link>
    </div>
  );
};

export default Placecard;
