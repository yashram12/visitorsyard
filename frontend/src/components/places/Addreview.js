import { Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState } from "react";

const Addreview = (props) => {

  const [newReview, setNewReview] = useState({
    title: "",
    desc: "",
    img: "",
    star: 0,
  });
  const { pid } = useParams();


  const handleSubmit = (e) => {
    e.preventDefault();
    //code on submit
    fetch("/api/v1/review", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8","authorization":localStorage.getItem('pubtoken') },
      body: JSON.stringify({
        rtitle: newReview.title.replace(/'/g,String.raw`\'`),
        rdesc: newReview.desc.replace(/'/g,String.raw`\'`),
        img: newReview.img.replace(/'/g,String.raw`\'`),
        rating: newReview.star,
        pid: pid,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "success"){
          alert(json.message);
          props.setReviews([...props.reviews,newReview])
        }
        else {
          alert("session expired");
        }
      })
      .catch((e) => console.log(e));
    props.onHide();
    setNewReview({ title: "", desc: "", img: "", star: 0 });
  };

  const handleChange = ({ name, value }) => {
    setNewReview({ ...newReview, [name]: value });
  };

  const onClose = ()=>{
    props.onHide();
    setNewReview({ title: "", desc: "", img: "", star: 0 });
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Add REVIEW</Modal.Title>
      </Modal.Header>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <div className="form-group m-2">
            <label htmlFor="title">Title</label>
            <input
              name="title"
              type="text"
              className="form-control"
              id="title"
              placeholder="Enter Title of the REVIEW"
              value={newReview.title}
              autoComplete="off"
              onChange={(e) => handleChange(e.target)}
              required
            />
          </div>
          <div className="form-group m-2">
            <label htmlFor="desc">Description</label>
            <textarea
              name="desc"
              type="text"
              className="form-control"
              id="desc"
              placeholder="Enter the Description of the REVIEW"
              value={newReview.desc}
              autoComplete="off"
              onChange={(e) => handleChange(e.target)}
              required
            />
          </div>
          <div className="form-group m-2">
            <label htmlFor="imgSrc">imgSrc</label>
            <input
              name="img"
              type="text"
              className="form-control"
              id="imgSrc"
              placeholder="Image Source"
              value={newReview.img}
              autoComplete="off"
              onChange={(e) => handleChange(e.target)}
              required
            />
          </div>
          <div className=" m-2">
            <label htmlFor="rating">Rating : {newReview.star} star</label>
            <br />
            <input
              name="star"
              type="range"
              className="custom-range"
              min="0"
              max="5"
              id="rating"
              value={newReview.star}
              onChange={(e) => handleChange(e.target)}
              required
              style={{ backgroundColor: "#198754" }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
          <Button className="btn-success" onClick={()=>onClose()}>
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default Addreview;
