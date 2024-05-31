import React, { useEffect, useState } from "react";
import axios from "axios";
import NotificationAlert from "react-notification-alert";
import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

function Strategies() {
  const [strategies, setStrategies] = useState([]);
  const [error, setError] = useState(null);
  const notificationAlertRef = React.useRef(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5586/strategy_descriptions');
        setStrategies(response.data);
      } catch (error) {
        setError(error.message);
        notify("tc", "danger", "Error", "success", error.message);
      }
    };

    fetchStrategies();
  }, []);

  const notify = (place, type, title, message) => {
    var options = {
      place: place,
      message: (
        <div>
          <div>
            <b>{title}</b> - {message}
          </div>
        </div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  return (
    <div className="content">
      <div className="react-notification-alert-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Strategies</CardTitle>
            </CardHeader>
            <CardBody>
              {error ? (
                <Alert color="success">
                  <span>Error: {error}</span>
                </Alert>
              ) : (
                <Row>
                  {Object.keys(strategies).map((key) => (
                    <Col md="12" key={key}>
                      <Card className="mb-3">
                        <CardHeader>
                          <CardTitle tag="h5">{strategies[key].name}</CardTitle>
                        </CardHeader>
                        <CardBody>
                          <p>{strategies[key].description}</p>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Strategies;
