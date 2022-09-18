import { useState, useEffect, useContext } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Review from './userProfile/Review'
import Logincontext from "../contexts/Logincontext";

const Profile = () => {
  const [user, setUser] = useState({});
  const [edit,setEdit] = useState(false);
  const [reviews,setReviews] = useState([]);
  const { setLoggedIn ,setAdmin} = useContext(Logincontext);
  const history = useNavigate();


  useEffect(() => {
    fetch(`/api/v1/user`, {
      method: "GET",
      headers: { "authorization": localStorage.getItem("pubtoken") },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "success") setUser(json.data);
        else {
          alert("Session Expired...");
          setAdmin(false);
          setLoggedIn(false);
          localStorage.clear();
          history("/login");
        }
      });
    // eslint-disable-next-line
  }, []);

  useEffect(()=>{
    fetch('/api/v1/review',{
      method:'GET',
      headers:{"authorization":localStorage.getItem("pubtoken")}
    })
    .then(response=>response.json())
    .then(json=>{
      if(json.status === "success")
        setReviews(json.data)
    })
  },[])

  const logout = () => {
    alert("Logged out");
    setAdmin(false)
    setLoggedIn(false);
    localStorage.clear();
    history("/login");
  };

  const handleChange = (e)=>{
      setUser({...user,[e.target.name]:e.target.value})
  }

  const handleSubmit = (e) =>{
      e.preventDefault();
      if(edit){
          fetch('/api/v1/user',{
              method:"PUT",
              body:JSON.stringify({
                  FNAME:user.FNAME,
                  LNAME:user.LNAME,
                  GENDER:user.GENDER,
                  PHONE:user.PHONE
              }),
              headers:{"Content-Type":"application/json","authorization": localStorage.getItem("pubtoken")}
          })
          .then(response=>response.json())
          .then(json=>{
              if(json.status === 'success')
                alert(json.message)
              else  
                alert(json.message)
          })
          setEdit(false)
          
      }
      else{
          setEdit(true);
      }
  }

  return (
    <div style={{minHeight:"74vh"}}>
      <Container>
        <Row>
          <div
            style={{
              margin: "1rem",
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              className="btn btn-danger"
              style={{ margin: "1rem", width: "80px" }}
              onClick={() => logout()}
            >
              Logout
            </Button>
          </div>
          <Col xl={6} lg={6} md={4} sm={12}>
            <i
              className="fa fa-user-circle"
              style={{ color: "gainsboro", fontSize: "10rem", margin: "2rem" }}
            />
          </Col>
          <Col>
          <form onSubmit={(e) => handleSubmit(e)}>
            <Row>
              <Col>
                <div className="mb-3">
                  <label className="m-2" for="fn">Name</label>
                  <input
                    id="fn"
                    disabled={!edit}
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    name="FNAME"
                    value={user.FNAME}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </div>
              </Col>
              <Col>
                <div className="mb-3">
                  <label className="m-2" for="ln">Last Name</label>
                  <input
                    id="ln"
                    disabled={!edit}
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    name="LNAME"
                    value={user.LNAME}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </Col>
            </Row>
            <Row style={{ alignItems: "center" }}>
              <Col>
                <div className="col-auto mb-3">
                  <label className="m-2" for="phone">Phone</label>
                  <div className="input-group">
                    <div className="input-group-text">+91</div>
                    <input
                      id="phone"
                      disabled={!edit}
                      type="tel"
                      className="form-control"
                      placeholder="Phone"
                      pattern="[0-9]{10}"
                      name="PHONE"
                      value={user.PHONE}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                </div>
              </Col>
              <Col>
              <label for='g' className="m-2" >Gender</label>
                <div
                  className="mb-3"
                  id='g'
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                  name="GENDER"
                  value={user.GENDER}
                >
                  <div className="form-check">
                    <input
                      disabled={!edit}
                      className="form-check-input"
                      type="radio"
                      name="GENDER"
                      id="male"
                      value="m"
                      onChange={(e) => handleChange(e)}
                      checked={user.GENDER === "m"}
                      required
                    />
                    <label className="form-check-label" htmlFor="male">
                      Male
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      disabled={!edit}
                      className="form-check-input"
                      type="radio"
                      name="GENDER"
                      value="f"
                      checked={user.GENDER === "f"}
                      id="female"
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    <label className="form-check-label" htmlFor="Female">
                      Female
                    </label>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="mb-3">
                  <label className="m-2" for="email">Username</label>
                  <input
                    id="email"
                    disabled
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="USERNAME"
                    value={user.USERNAME}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </div>
              </Col>
            </Row>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
                <button type="submit" className={`btn btn-${edit?'primary':'success'}`}>
                {!edit?'Edit':'Update'}
                </button>
            </div>
          </form>{" "}
          </Col>
        </Row>
        <Row className="my-3">
          <div><h3>Your Reviews</h3></div>
          {reviews.map((review)=>{
            console.log('review')
              return(<Review key={review.RID} data={review}/>)
          })}
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
