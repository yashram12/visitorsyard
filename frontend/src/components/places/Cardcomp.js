import { Card, Col , Row} from "react-bootstrap";
import {useState,useContext} from 'react'
import { Link } from "react-router-dom";
import Star from '../Star'
import Logincontext from '../../contexts/Logincontext'


const Cardcomp = ({place,handleDelete}) => {

  const [disable,setDisable] = useState(false)
  const {admin} = useContext(Logincontext)

  return (
    <Col
      xl={3}
      lg={3}
      sm={6}
      xs={12}
      style={{ padding: "1rem 1rem" }}
    >
      <Link to={!disable && `/place/${place.PLACE_ID}`} style={{textDecoration:"none",color:"black"}}>
        <Card>
          <Card.Img
          style={{height:'10rem '}}
            variant="top"
            src={place && place.IMG}
          />
          <Card.Body>
            <Card.Title style={{display:'flex',justifyContent:'flex-start'}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
                {place && place.PLACE_NAME}
                {admin && <div onMouseOver={()=>{setDisable(true)}}><i onClick={()=>handleDelete(place.PLACE_ID)} className="fa fa-trash" style={{color:"red",fontSize:"1.3rem",cursor:"alias"}}/></div>}
              </div>
            </Card.Title>
            <div>
              <Row style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",width:"100%"}}>
                <Col xl={8} style={{textAlign:'left'}} >
                  <p>{place && place.LOCATION.replace(/,/g,', ')}</p>
                </Col>
                <Col xl={4} >
                  <Star n={place && place.RATING}/>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};

export default Cardcomp;
