import {Col,Card} from 'react-bootstrap'
import Star from '../Star'

const Review = ({data}) => {
    
  
  const handleDelete = ()=>{
    fetch(`/api/v1/review/${data.RID}`,{
      method:'DELETE',
      headers:{"authorization":localStorage.getItem('pubtoken')}
    })
    .then(response=>response.json())
    .then(json=>{
      if(json.status === 'success')
        alert(json.message);
      else
        alert('cannot delete the review for some reason....')
    })
    
  }

    return (
      <Col lg={3} md={4} sm={6} xs={12} >
        <Card style={{margin:"1rem auto"}}>
          <Card.Body>
            <div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{display:'flex',alignItems:"center",justifyContent:"flex-start"}}>
                  <div style={{backgroundColor:"gray",borderRadius:'50%',width:'1.5rem',height:'1.5rem',margin:"0 0.5rem"}} className='text-center'>
                    <i className="fa fa-location-arrow" style={{color:"white",padding:'0.2rem',fontSize:'1.2rem'}}/>
                  </div>   
                  <h6>{data && data.PLACE_NAME}</h6>
                </div>
                <div style={{cursor:'pointer'}} onClick={()=>handleDelete()}><i className="fa fa-trash-o" style={{fontSize:"1.5rem",color:'red'}} /></div>
              </div>
              <Star n={data && data.RATING} />
              <h6>{data && data.RTITLE}</h6>
              <p>{data && data.RDESC}</p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    )
}

export default Review
