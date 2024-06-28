## Setup

**Run the following commands:**

```bash
npm install
```

```bash
pip install react
```

**Start the server**

```bash
npm start
```

```bash
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table, Form, FormGroup, Label, Input, Button } from "reactstrap";

function Backtesting() {
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [timeFrame, setTimeFrame] = useState("1h");
  const [interval, setInterval] = useState(30); // Default interval in days
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the strategy mapping keys
    const fetchStrategies = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5586/strategies');
        setStrategies(response.data);
      } catch (error) {
        console.error("Error fetching strategies:", error);
      }
    };
    fetchStrategies();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Show loading indicator
    setData([]); // Clear previous data
    try {
      const response = await axios.get(`http://127.0.0.1:5586/backtest/${selectedStrategy}?timeframe=${timeFrame}&interval=${interval}`, {
        transformResponse: [(data) => {
          // Sanitize NaN values
          return data.replace(/NaN/g, "null");
        }]
      });

      const parsedData = JSON.parse(response.data);
      if (Array.isArray(parsedData)) {
        const sortedData = parsedData.sort((a, b) => b.return - a.return).slice(0, 10); // Get top 10 sorted by return
        setData(sortedData);
      } else {
        console.error('Expected an array but got:', typeof parsedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Get all keys from the first data item to create the table headers
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="content">
      <Row>
        <Col lg="4" md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Select Strategy</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="strategySelect">Strategy</Label>
                  <Input
                    type="select"
                    name="strategy"
                    id="strategySelect"
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
                  <Label for="timeFrameSelect">Time Frame</Label>
                  <Input
                    type="select"
                    name="timeFrame"
                    id="timeFrameSelect"
                    onChange={(e) => setTimeFrame(e.target.value)}
                    required
                  >
                    <option value="1h">1 Hour</option>
                    <option value="4h">4 Hours</option>
                    <option value="1d">1 Day</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="intervalInput">Interval (days)</Label>
                  <Input
                    type="number"
                    name="interval"
                    id="intervalInput"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    min="1"
                    required
                  />
                </FormGroup>
                <Button type="submit" color="primary">Run Backtest</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {loading ? ( // Display loading indicator if data is loading
        <div>Loading data...</div>
      ) : data.length > 0 && (
        <Row>
          <Col lg="12" md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">{selectedStrategy}</CardTitle>
                <div>
                  <strong>Time Frame: </strong>{timeFrame}
                </div>
                <div>
                  <strong>Interval: </strong>{interval} days
                </div>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Currency</th> {/* Ensure 'Currency' is the first column */}
                      <th>Return</th> {/* Ensure 'Return' is the second column */}
                      {headers.filter(header => header !== 'currency' && header !== 'return').map((header, index) => (
                        <th key={index}>{header.charAt(0).toUpperCase() + header.slice(1)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.currency}</td>
                        <td className="text-center">
                          {item.return !== undefined && !isNaN(item.return)
                            ? item.return.toFixed(6)
                            : 'N/A'}
                        </td>
                        {headers.filter(header => header !== 'currency' && header !== 'return').map((header, idx) => (
                          <td key={idx}>{item[header]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default Backtesting;
```
