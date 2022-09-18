import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

const Registercomp = ({ handlereg }) => {
  const [data, setData] = useState({
    fname: "",
    lname: "",
    phone: "",
    gender: "",
    email: "",
    password: "",
    confirmpass: "",
  });

  const [err, setErr] = useState("");

  useEffect(() => {
    if (data.password !== data.confirmpass) {
      setErr("Passwords are not matching...");
    } else setErr("");
    // eslint-disable-next-line
  }, [data.confirmpass]);

  const handleChange = ({ name, value }) => {
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    let info = {
      fname: data.fname,
      lname: data.lname,
      gender: data.gender,
      phone: data.phone,
      username: data.email,
      password: data.confirmpass,
    };
    e.preventDefault();
    //code
    if (err === "") {
      fetch("/api/v1/register", {
        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify(info),

        // Adding headers to the request
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        // Converting to JSON
        .then((response) => response.json())

        // Displaying results to console
        .then((json) => alert(json.message));
      handlereg();
      setData({
        fname: "",
        lname: "",
        phone: "",
        gender: "m",
        email: "",
        password: "",
        confirmpass: "",
      });
    }
  };

  return (
    <div>
      <Row style={{}}>
        <h1>Register</h1>
      </Row>
      <Row>
        <Col lg={5} md={6} sm={12}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <Row>
              <Col>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    name="fname"
                    value={data.fname}
                    onChange={(e) => handleChange(e.target)}
                    required
                  />
                </div>
              </Col>
              <Col>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    name="lname"
                    value={data.lname}
                    onChange={(e) => handleChange(e.target)}
                  />
                </div>
              </Col>
            </Row>
            <Row style={{ alignItems: "center" }}>
              <Col>
                <div className="col-auto mb-3">
                  <div className="input-group">
                    <div className="input-group-text">+91</div>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone"
                      pattern="[0-9]{10}"
                      name="phone"
                      value={data.phone}
                      onChange={(e) => handleChange(e.target)}
                      required
                    />
                  </div>
                </div>
              </Col>
              <Col>
                <div
                  className="mb-3"
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                  name="gender"
                  value={data.gender}
                >
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="male"
                      value="m"
                      onChange={(e) => handleChange(e.target)}
                      checked={data.gender === "m"}
                      required
                    />
                    <label className="form-check-label" htmlFor="male">
                      Male
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="f"
                      checked={data.gender === "f"}
                      id="Female"
                      onChange={(e) => handleChange(e.target)}
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
                <div className="mb-1">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    value={data.email}
                    onChange={(e) => handleChange(e.target)}
                    required
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <div id="emailHelp" style={{color:'gainsboro'}} className=" mt-0 mb-2 form-text">
                This will be your Username.
              </div>
            </Row>
            <Row>
              <Col>
                <div className="mb-1 mt-1">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    value={data.password}
                    onChange={(e) => handleChange(e.target)}
                    required
                  />
                </div>
              </Col>
              <Col>
                <div className="mb-1 mt-1">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    name="confirmpass"
                    value={data.confirmpass}
                    onChange={(e) => handleChange(e.target)}
                    required
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <div id="emailHelp" style={{color:'gainsboro'}} className="mb-2 form-text">
                Atleast 8 Characters with Numbers,Upper and Lower case alphabets
              </div>
            </Row>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
                defaultChecked={true}
                required
              />
              <label style={{fontSize:'16px'}} className="form-check-label" htmlFor="exampleCheck1">
                I agree for the terms and conditions.
              </label>
            </div>
            <Row>
              <Col>
                <button type="submit" className="btn btn-success">
                  Submit
                </button>
              </Col>
              <Col>
                <div onClick={()=>handlereg()} style={{cursor:"pointer",color:'skyblue'}}>I already have an account</div>
              </Col>
            </Row>
          </form>{" "}
        </Col>
      </Row>
      <div style={{ color: "gainsboro", marginTop: "1vh" ,fontSize:"14px",marginBottom:'2rem' }}>{err}</div>
    </div>
  );
};

export default Registercomp;
