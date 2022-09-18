import {Row,Col} from "react-bootstrap"

const Footer = () => {
    return (
        <div style={{position:"relative",backgroundColor:"#198754",color:"white",maxWidth:"100vw",height:"20vh",bottom:"0",width:"100%",padding:"5px"}}>
            <Row>
                <Col  style={{display:"flex",justifyContent:"center",fontSize:"1.5rem"}}>PaCkUrBaGs</Col>
                <Col  style={{display:"flex",justifyContent:"center",fontSize:"1.25rem"}}>
                    <ul>
                        <li>About</li>
                        <li>Contact us</li>
                    </ul>
                </Col>
            </Row>
            <Row style={{justifyContent:"center",fontSize:"1.2rem"}}>
                © All rights reserved
            </Row>
        </div>
    )
}

export default Footer
