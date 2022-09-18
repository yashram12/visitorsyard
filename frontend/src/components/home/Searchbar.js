import {useState,useEffect} from "react";
import {Container,Row} from 'react-bootstrap'
import {Link} from 'react-router-dom';

const Searchbar = () => {

  const [search,setSearch] = useState("")
  const [places,setPlaces] = useState([])

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
      style={{
        width: "120%",
        left: "-10vw",
        zIndex: "2",
        position: "relative",
        top: "-30vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "5vh auto",
        transform: "rotate(5deg)",
        height: "400px",
        backgroundColor: "#c6ecc6",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          transform: "rotate(-5deg)",
          top: "36vh",
        }}
      >
        <Container>
          <Row>
            <input
              type="text"
              placeholder=" Find your Dream place here ... "
              name="search"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              style={{
                borderRadius: "4px 0 0 4px",
                border: "1px solid #198754",
                height: "40px",
                width: "50vw",
              }}
              autoComplete="off"
            />
            <button
              id="button"
              style={{
                width:"4rem",
                borderRadius: "0 4px 4px 0",
                border: "1px solid #198754",
                height: "40px",
                backgroundColor: "#198754",
                color: "white",
                display:"flex",
                justifyContent:"center",
                alignItems:"center"
              }}
            >
              search
            </button>
          </Row>
          <Row>
            <div >
              <ul style={{backgroundColor:"white",border:"0.1px solid #198754",maxHeight:'30vh',overflowX:'hidden',overflowY:"scroll",textAlign:'justify'}}>
                {
                  places.length !== 0 &&  
                  places.filter(place=>search && place.PLACE_NAME.toLowerCase().includes(search.toLowerCase())).map((place,i)=>{
                    return <li style={{listStyleType:"none",color:"#198754"}} key={i}><Link style={{textDecoration:"none",cursor:'pointer'}} to={`/place/${place.PLACE_ID}`}><div style={{color:"#198754"}}>{place.PLACE_NAME}</div><hr className="my-1 py-0"/></Link></li>
                  })
                }
              </ul>
            </div>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Searchbar;
