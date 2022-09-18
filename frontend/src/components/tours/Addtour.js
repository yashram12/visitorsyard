import { useState ,useEffect} from "react";
import { Modal, Container, Row, Col, Button } from "react-bootstrap";

const Addtour = (props) => {
  const [newTour, setNewTour] = useState({
    img:"",
    name: "",
    places: "",
  });

  const [selected, setSelected] = useState([]);

  const [list , setList] = useState([])
  const [myLoc,setMyLoc] = useState({lat:0,lng:0})

  const [err,setErr] = useState([])


  useEffect(()=>{
    navigator.geolocation.getCurrentPosition((pos)=>{
      setMyLoc({
        lat:pos.coords.latitude,
        lng:pos.coords.longitude
      })
    })
    fetch('/api/v1/places')
    .then((response)=>response.json())
    .then(json=>{
      if(json.status === 'success'){
        setList(json.data)
      }
    })
  },[])

  const handleSubmit = (e) => {
    let info ={
      img:newTour.img,
      name:newTour.name,
      places:selected,
      myLoc:myLoc
    }
    console.log(info)
      e.preventDefault();
      //code
      if(selected.length < 2){
        
        setErr(['Minimum 2 places required'])
      }
      else{
        fetch('/api/v1/tour',{
          method:"POST",
          body: JSON.stringify(info),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
        })
        .then((response)=>response.json())
        .then((json)=>{
          if(json.status === 'success')
            alert(json.message)
          else
            console.log('something went wrong :(')
        }).catch(e=>console.log(e))
        props.onHide();
        setNewTour({
          img:"",
          name: "",
          places: "",
        })


        setSelected([])
        setErr([])
      }
  };

  const handleChange = ({name,value}) => {
      if(name !== 'places')
        setNewTour({...newTour,[name]:value})
  }
  

  const handleClick = ({id})=>{
    if(selected.includes(id)){
      setSelected(selected.filter(el=>el!==id).map(el=> el))
      setNewTour({...newTour,places:newTour.places.replace(list.filter(el=>el.PLACE_ID===id).map(el=>el.PLACE_NAME),'').trim()})
    }
    else{
      setSelected([...selected,id])
      setNewTour({...newTour,places:newTour.places+`\t${list.filter(el=>el.PLACE_ID===id).map(el=>el.PLACE_NAME)}`})
    }
  }

  const onClose = () =>{
    props.onHide();
    setNewTour({
      img:"",
      name: "",
      places: "",
    })
    setSelected([])
    setErr([])
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Add TOUR</Modal.Title>
      </Modal.Header>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <div>{err.map((el,i)=><p key={i} style={{color:'gainsboro'}}>{el}</p>)}</div>
          <Container>
            <div className="form-group m-2">
              <label htmlFor="name">Name</label>
              <input
                name="name"
                type="text"
                className="form-control"
                id="name"
                placeholder="Name of the Tour"
                value={newTour.name}
                autoComplete="off"
                onChange={(e) => handleChange(e.target)}
                required
              />
            </div>

            <div className="form-group m-2">
              <label htmlFor="img">imgSrc</label>
              <input
                name="img"
                type="text"
                className="form-control"
                id="img"
                placeholder="Image Source"
                value={newTour.img}
                autoComplete="off"
                onChange={(e) => handleChange(e.target)}
                required
              />
            </div>

            <div className="form-group m-2">
              <label htmlFor="places">Name</label>
              <textarea
                readOnly="readonly"
                name="places"
                type="text"
                className="form-control"
                id="places"
                placeholder="Places in this Tour"
                value={newTour.places}
                autoComplete="off"
                required
              />
            </div>
          </Container>

          <Container className='text-center'>
            {
                list.map((place,i)=>{
                    return(
                    <Row key={place.PLACE_ID}>
                        <Col>{place.PLACE_NAME}</Col>
                        <Col><Button className='sm' id={place.PLACE_ID} onClick={(e)=>{handleClick(e.target)}}>{selected.includes(place.PLACE_ID)?'Remove':'Select'}</Button></Col>
                    </Row>
                    )
                })
            }
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
          <Button className="btn-success" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default Addtour;
