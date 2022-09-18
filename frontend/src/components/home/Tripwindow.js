import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import Tripcard from "./Tripcard";

const Tripwindow = () => {
  const [trips, setTrips] = useState([]);

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
    fetch("/api/v1/tours")
      .then((response) => response.json())
      .then((json) => {
        setTrips(json.data);
      });
  }, []);

  return (
    <div
      className="tripContainer"
      style={{ position: "relative", top: "-25vh" }}
    >
      <h2 style={{ margin: "2rem 3rem" }}>Popular Trips</h2>

      <Carousel
        responsive={responsive}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <Tripcard trip={trips[0]} />
        <Tripcard trip={trips[1]} />
        <Tripcard trip={trips[2]} />
        <Tripcard trip={trips[3]} />
        <Tripcard trip={trips[4]} />

        <div
          style={{
            height: "16rem",
            width: "18rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link to="/tours" style={{ textDecoration: "none" }}>
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

export default Tripwindow;
