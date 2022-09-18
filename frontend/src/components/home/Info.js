import React from "react";
import india from "../../images/incredible.jpg";
import { Container, Row, Col } from "react-bootstrap";

const Info = () => {
  return (
    <Container
      className="text-center"
      style={{ position: "relative", top: "-26vh" }}
    >
      <Row>
        <Col
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            fontSize: "3rem",
            zIndex: 1000,
            margin: "1rem",
            fontStyle:'italic'
          }}
        >
            
                <span>Incredible&nbsp;</span> <span style={{ color: "red" }}>!</span>ndia
            
        </Col>
      </Row>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Col lg={6} sm={12}>
          <p>
            <img
              src={india}
              alt="incredible india"
              height="450px"
              width="450px"
            />
          </p>
        </Col>
        <Col>
          <div style={{ fontSize: "1.4rem", padding: "1rem",fontWeight:"15"}}>
            <p>
              &emsp;&emsp;&emsp;&emsp;One of the oldest civilisations in the
              world, India is a mosaic of multicultural experiences. With a rich
              heritage and myriad attractions, the country is among the most
              popular tourist destinations in the world. It covers an area of
              32, 87,263 sq. km, extending from the snow-covered Himalayan
              heights to the tropical rain forests of the south. As the 7th
              largest country in the world, India stands apart from the rest of
              Asia, marked off as it is by mountains and the sea, which give the
              country a distinct geographical entity.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Info;
