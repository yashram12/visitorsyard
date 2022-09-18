import {Link} from 'react-router-dom'
import {Card} from 'react-bootstrap'

const Tripcard = ({trip}) => {
    return (
        <div>
            <Link to={`/tour/${trip && trip.TRIP_ID}`} style={{textDecoration:"none",color:"black"}}>
            <Card style={{ margin: "auto 2vw" }}>
            <Card.Img
            style={{height:"14rem"}}
              variant="top"
              src={trip && trip.IMG}
            />
            <Card.Body>
              <Card.Title>{trip && trip.TRIP_NAME}</Card.Title>
              <Card.Text>
                {trip && trip.TIME} Days
              </Card.Text>
            </Card.Body>
          </Card>
            </Link>
        </div>
    )
}

export default Tripcard
