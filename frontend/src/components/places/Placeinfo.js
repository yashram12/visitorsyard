import {Row,Col} from 'react-bootstrap'

const Placeinfo = ({title,desc}) => {
    return (
        <div>
            <Row>
        <h3>{title && title}</h3>
      </Row>
      <Row>
        <Col>
          <p>
            {desc && desc}
          </p>
        </Col>
      </Row>
        </div>
    )
}

export default Placeinfo
