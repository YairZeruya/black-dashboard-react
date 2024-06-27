import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Card, CardHeader, CardBody, Row, Col } from "reactstrap";

function TradeTable() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5586/trades")
      .then(response => setTrades(response.data))
      .catch(error => console.error("Error fetching trade data:", error));
  }, []);

  if (!trades.length) {
    return <div>Loading...</div>;
  }

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Symbol</th>
          <th>Strategy</th>
          <th>Start Price</th>
          <th>End Price</th>
          <th>Cost</th>
          <th>Return</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {trades.map(trade => (
          <tr key={trade.id}>
            <td>{trade.id}</td>
            <td>{trade.symbol}</td>
            <td>{trade.strategy}</td>
            <td>{trade.start_price}</td>
            <td>{trade.end_price}</td>
            <td>{trade.cost}</td>
            <td>{trade.return}</td>
            <td>{trade.start_time}</td>
            <td>{trade.end_time}</td>
            <td>{trade.end_price ? "closed" : "open"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default function CombinedComponent() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5586/trades")
      .then(response => setTrades(response.data))
      .catch(error => console.error("Error fetching trade data:", error));
  }, []);

  if (!trades.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <h5 className="title">My Trades</h5>
            </CardHeader>
            <CardBody>
              <TradeTable trades={trades} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
