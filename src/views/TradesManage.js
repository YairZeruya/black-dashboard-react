import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";

function TradesManage() {
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [symbol, setSymbol] = useState("");
  const [cost, setCost] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [unsubscribeTradeId, setUnsubscribeTradeId] = useState("");
  const [notification, setNotification] = useState({ message: "", visible: false });

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5586/strategies");
      setStrategies(response.data);
    } catch (error) {
      console.error("Error fetching strategies:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = {
        symbol: symbol.toUpperCase(),
        cost: parseInt(cost),
        start_time: startDateTime,
        bot_name: selectedStrategy,
      };
      const response = await axios.post("http://127.0.0.1:5586/trade/buy", data);
      console.log("Trade registration response:", response);
      setNotification({ message: "Trade registration successful!", visible: true });
    } catch (error) {
      console.error("Error registering trade:", error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const now = new Date();
      const offset = now.getTimezoneOffset();
      now.setMinutes(now.getMinutes() - offset);

      const formattedEndTime = now.toISOString().slice(0, 16);

      const response = await axios.put(
        `http://127.0.0.1:5586/trade/${unsubscribeTradeId}`,
        {
          end_time: formattedEndTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      console.log("Trade unsubscribe response:", response);
      setNotification({ message: "Trade unsubscribe successful!", visible: true });
    } catch (error) {
      console.error("Error unsubscribing trade:", error);
    }
  };

  const dismissNotification = () => {
    setNotification({ message: "", visible: false });
  };

  return (
    <div className="content">
      {notification.visible && (
        <Alert color="success" toggle={dismissNotification}>
          {notification.message}
        </Alert>
      )}
      <Row>
        <Col lg="6" md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Trade Registration</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="symbolInput">Symbol</Label>
                  <Input
                    type="text"
                    name="symbol"
                    id="symbolInput"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="strategySelect">Strategy (Bot Name)</Label>
                  <Input
                    type="select"
                    name="strategy"
                    id="strategySelect"
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    required
                  >
                    <option value="">Select a strategy</option>
                    {strategies.map((strategy, index) => (
                      <option key={index} value={strategy}>
                        {strategy}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="costInput">Cost</Label>
                  <Input
                    type="text"
                    name="cost"
                    id="costInput"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="startDateTimeInput">Start Time</Label>
                  <Input
                    type="datetime-local"
                    name="startDateTime"
                    id="startDateTimeInput"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    required
                  />
                </FormGroup>
                <Button type="submit" color="primary">
                  Register
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6" md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Unsubscribe from Trade</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={(e) => { e.preventDefault(); handleUnsubscribe(); }}>
                <FormGroup>
                  <Label for="unsubscribeTradeIdInput">Trade ID</Label>
                  <Input
                    type="number"
                    name="unsubscribeTradeId"
                    id="unsubscribeTradeIdInput"
                    value={unsubscribeTradeId}
                    onChange={(e) => setUnsubscribeTradeId(e.target.value)}
                    required
                  />
                </FormGroup>
                <Button type="submit" color="danger">
                  Unsubscribe
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default TradesManage;
