import {useState,useEffect} from 'react';
import {Container,Row,Col} from 'react-bootstrap';

const Admin = () => {

  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [trips, setTrips] = useState([]);


  useEffect(() => {
    fetch("/api/v1/users",{
      method:'GET',
      headers:{"authorization":localStorage.getItem('pubtoken')}
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "success") 
          setUsers(json.data);
      });

    fetch("/api/v1/places")
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "success") setPlaces(json.data);
    });

    fetch("/api/v1/tours")
      .then((response) => response.json())
      .then((json) => {
      if (json.status === "success") setTrips(json.data);
    });

  },[]);

  const onDelete =(uid)=>{
    fetch(`/api/v1/user/${uid}`,{
      method:"DELETE",
      headers:{"authorization":localStorage.getItem('pubtoken')}
    })
    .then(response=>response.json())
    .then(json=>{
      if(json.status === 'success'){
        alert('User deleted successfully...')
        setUsers(users.filter(user=>{return user.USER_ID !== uid}))
      }
    })
  }

  return( 
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
        <h1>Admin Dashboard</h1>
      </div>
      <Container style={{maxWidth:"100vw"}}>
        <Row style={{margin:'1rem auto'}}>
          <Col lg={3} sm={6} xs={12} style={{height:"10rem",margin:"1rem auto",borderRadius:"5px"}}>
            <h4 className="text-center">Total Number of Users</h4> <h1 className="text-center">{users.length}</h1>
          </Col>
          <Col lg={3} sm={6} xs={12} style={{height:"10rem",margin:"1rem auto",borderRadius:"5px"}}>
            <h4 className="text-center">Total Number of Places</h4> <h1 className="text-center">{places.length}</h1>
          </Col>
          <Col lg={3} sm={6} xs={12} style={{height:"10rem",margin:"1rem auto",borderRadius:"5px"}}>
            <h4 className="text-center">Total Number of Tours</h4> <h1 className="text-center">{trips.length}</h1>
          </Col>
          {/* <Col lg={3} sm={6} xs={12} style={{height:"10rem",margin:"1rem auto",borderRadius:"5px"}}>
            <h4 className="text-center">Total Number of Reviews</h4> <h1 className="text-center">40</h1>
          </Col> */}
        </Row>
        <Row className="text-center"><h2>Users Info</h2></Row>
        <Col className="text-center">
          
          <Row style={{color:"white",backgroundColor:'#198754',borderLeft:"5px solid #c6ecc6",margin:'1rem auto',minHeight:'3rem',width:"80%",alignItems:"center"}}>
            <Col style={{fontSize:"1.5rem"}}>NAME</Col>
            <Col style={{fontSize:"1.5rem"}}>LAST NAME</Col>
            <Col style={{fontSize:"1.5rem"}}>PHONE</Col>
            <Col style={{fontSize:"1.5rem"}}>NO_OF_REVIEWS</Col>
            <Col style={{fontSize:"1.5rem"}}></Col>
          </Row>
          {
            users[0] && 
            users.map((user,i)=>{
              return(
              <Row key={i} style={{backgroundColor:'#c6ecc6',borderLeft:"5px solid #c6ecc6",margin:'1rem auto',minHeight:'3rem',width:"80%",alignItems:"center"}}>
                <Col style={{fontSize:"1.3rem"}}>{ user.FNAME}</Col>
                <Col style={{fontSize:"1.3rem"}}>{ user.LNAME}</Col>
                <Col style={{fontSize:"1.3rem"}}>{ user.PHONE}</Col>
                <Col style={{fontSize:"1.3rem"}}>{ user.NO_OF_REVIEWS?user.NO_OF_REVIEWS:0}</Col>
                <Col><i className='fa fa-trash-o' style={{color:"red",fontSize:'1.3 rem',cursor:"pointer"}} onClick={()=>onDelete(user.USER_ID)}/></Col>
              </Row>)
            })
          }
        </Col>

      </Container>
    </>
  )
};

export default Admin;
