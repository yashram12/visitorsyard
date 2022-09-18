import {Link} from 'react-router-dom'
import {useState,useContext} from 'react'
import Logincontext from '../../contexts/Logincontext'
import {Card ,Col} from 'react-bootstrap'

const Cardcomp = ({trip,handleDelete}) => {

  const [disable,setDisable] = useState(false)
  const {admin} = useContext(Logincontext);

    return (
            <Col xl={3} lg={3} sm={6} xs={12} style={{ padding: "1rem 1rem"}}>
            <Link to={!disable && `/tour/${trip.TRIP_ID}`} style={{textDecoration:"none",color:'black'}}>
              <Card>
                <Card.Img
                  style={{height:"10rem"}}
                  variant="top"
                  src={trip && trip.IMG}
                />
                <Card.Body>
                  <Card.Title>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
                      {trip && trip.TRIP_NAME}
                      {admin && <div onMouseOver={()=>setDisable(true)}><i onClick={()=>handleDelete(trip.TRIP_ID)} className="fa fa-trash" style={{color:"red",fontSize:"1.3rem",cursor:"alias"}}/></div>}
                    </div>
                  </Card.Title>
                  <Card.Text>
                    {trip && trip.TIME} Days
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
    )
}

export default Cardcomp
