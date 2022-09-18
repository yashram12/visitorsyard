import {useState , useEffect} from 'react'
import {Carousel, Container,Row,Col} from 'react-bootstrap'

const Gallery = ({pid})=> {

  const [images, setImages] = useState([{}]);

  useEffect(() => {
    fetch(`/api/v1/images/${pid}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "success") setImages(json.data);
      })
      .catch((e) => console.log(e));

      return () => {
        setImages([{}]); 
      };

  }, [pid]);
  

  return (

    <div className='my-5'>
      <Container style={{maxWidth:'96%'}} className='my-5'>
        <Row>
          <Col style={{display:'flex',alignItems:"center",justifyContent:"center",marginBottom:"1rem"}} ><h1>Image Gallery</h1></Col>
          <Col>
              <Carousel variant='dark'>
                {images && images.map((image,i)=>{
                  return(
                    <Carousel.Item key={i}>
                      <img
                        style={{height:"24rem",width:"40rem"}}
                        className="d-block"
                        src={image.image}
                        alt={`slide-${i+1}`}
                      />
                    </Carousel.Item>
                  )
                })}
              </Carousel>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Gallery;