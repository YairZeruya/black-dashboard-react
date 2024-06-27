import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

const MapWrapper = () => {
  const [strategyDescriptions, setStrategyDescriptions] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5586/strategy_descriptions")
      .then((response) => response.json())
      .then((data) => setStrategyDescriptions(data))
      .catch((error) => console.error("Error fetching strategy descriptions:", error));
  }, []);

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>Bot Descriptions</CardHeader>
              <CardBody>
                <div>
                  {Object.keys(strategyDescriptions).map((strategyName) => (
                    <div key={strategyName}>
                      <h4>{strategyName}</h4>
                      <p>{strategyDescriptions[strategyName].description}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MapWrapper;
