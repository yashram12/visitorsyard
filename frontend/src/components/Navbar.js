import {useContext} from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'
import Logincontext from '../contexts/Logincontext'
import Logo from '../images/logo.png';

const Navbarcomp = () => {


    const {loggedIn} = useContext(Logincontext);


  return (
        <div>
            <Navbar bg="success" variant="dark" expand="lg" style={{zIndex:"100"}}>
                <Container fluid>
                    <LinkContainer to='/' style={{backgroundColor:"#198754"}}>
                        <Navbar.Brand style={{marginLeft:"60px"}}><img src={Logo} alt='logo' style={{height:"24px",margin:"auto 1rem"}}/><span style={{fontSize:"20px",fontWeight:"500"}}>VisitorsYard</span></Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="ms-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                        <LinkContainer to='/' style={{backgroundColor:"#198754"}}><Nav.Link>Home</Nav.Link></LinkContainer>
                        <LinkContainer to='/places' style={{backgroundColor:"#198754"}}><Nav.Link>Places</Nav.Link></LinkContainer>
                        <LinkContainer to='/tours' style={{backgroundColor:"#198754"}}><Nav.Link>Tours</Nav.Link></LinkContainer>
                        <LinkContainer to='/about' style={{backgroundColor:"#198754"}}><Nav.Link>About</Nav.Link></LinkContainer>
                        {loggedIn?
                        <LinkContainer to='/profile' style={{backgroundColor:"#198754"}}>
                            <Nav.Link><i style={{fontSize:"1.3rem"}} className="fa fa-user-o me-2"/></Nav.Link></LinkContainer>:
                        <LinkContainer to='/login' style={{backgroundColor:"#198754"}}><Nav.Link>Login</Nav.Link></LinkContainer>}
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
  );
};

export default Navbarcomp;
