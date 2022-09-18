import { Container } from "react-bootstrap";
import { useState } from "react";
import Logincomp from "./login/Logincomp";
import Registercomp from "./login/Registercomp";
import loginbackground from "../images/login.jpg"

const Login = () => {
  const [islogin, setIslogin] = useState(true);

  const handlereg = () => {
    setIslogin(!islogin);
  };
  return (
    <div
      style={{
        backgroundImage:
          `url(${loginbackground})`,
        backgroundColor:"gainsboro",
        backgroundSize:'cover',
        color:"white",
        minHeight: "72vh",
        paddingTop:"2rem"
      }}
    >
      <Container style={{ }}>
        {islogin ? <Logincomp handlereg={handlereg} /> : <Registercomp handlereg={handlereg} />}
      </Container>
    </div>
  );
};

export default Login;
