import { useState, useEffect } from "react";
import Placecard from "./Placecard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";

const Placewindow = () => {
  const [places, setPlaces] = useState({});

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    fetch("/api/v1/places")
      .then((response) => response.json())
      .then((json) => {
        if(json.status === 'success')
        setPlaces(json.data);
      });
  }, []);

  return (
    <div
      className="tripContainer"
      style={{ position: "relative", top: "-25vh" }}
    >
      <h2 style={{ margin: "2rem 3rem" }}>Popular Places</h2>

      <Carousel
        responsive={responsive}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Placecard place={places[0]} />
        <Placecard place={places[1]} />
        <Placecard place={places[2]} />
        <Placecard place={places[3]} />
        <Placecard place={places[4]} />

        {/* {places.map((el, i) => {
          return (
            <Placecard
              key={i}
              id={el.PLACE_ID}
              name={el.PLACE_NAME}
              loc={el.LOCATION}
              img={el.IMG}
              star={el.RATING}
            />
          );
        })} */}

        <div
          style={{
            height: "16rem",
            width: "18rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link to="/places" style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "#198754",
                borderRadius: "50%",
                width: "3rem",
                height: "3rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <h1
                style={{
                  color: "white",
                  diaplay: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {"+"}
              </h1>
            </div>
          </Link>
        </div>
      </Carousel>
    </div>
  );
};

export default Placewindow;
