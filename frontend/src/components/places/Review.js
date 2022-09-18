import {Col,Card} from 'react-bootstrap'
import Star from '../Star'
import {useContext} from 'react';
import Logincontext from '../../contexts/Logincontext';

const Review = ({data,setReviews,reviews}) => {

  const {admin} = useContext(Logincontext);
  const handleDelete = (rid)=>{
    fetch(`/api/v1/review/${rid}`,{
      method:'DELETE',
      headers:{"authorization":localStorage.getItem('pubtoken')}
    })
    .then(response=>response.json())
    .then(json=>{
      if(json.status === 'success'){
        alert(json.message);
        setReviews(reviews.filter(review=> review.RID !== rid))
      }
      else
        alert('cannot delete the review for some reason....')
    })
    
  }

    return (
        <Col lg={3} md={4} sm={6} xs={12} >
        <Card style={{margin:"1rem auto"}}>
          <Card.Body>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:"center"}}>
                <div style={{display:'flex',alignItems:"center",justifyContent:"flex-start"}}>
                 <div style={{backgroundColor:"gray",borderRadius:'50%',width:'1.5rem',height:'1.5rem',margin:"0 0.5rem"}} className='text-center'>
                    <i className="fa fa-user" style={{color:"white",padding:'0.2rem',fontSize:'1.2rem'}}/>
                  </div>   
                  <h6>{data && data.FNAME}</h6>
                </div>
                {admin && <div style={{display:"flex",justifyContent:"flex-end",cursor:"pointer",color:"red",fontSize:"1.5rem"}} onClick={()=>handleDelete(data.RID)}><i className="fa fa-trash-o"/></div>}
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
