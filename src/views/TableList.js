import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from "reactstrap";
import axios from "axios";

function Tables() {
  const url = "http://127.0.0.1:5586/binance";
  const [data, setData] = useState([]);

  const fetchInfo = () => {
    return axios.get(url).then((res) => setData(res.data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Coins Table</CardTitle>
            </CardHeader>
            <CardBody style={{ maxHeight: "435px", overflowY: "auto" }}>
              <Table className="tablesorter">
                <thead className="text-primary">
                  <tr>
                    <th>Coin</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((dataObj, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ fontSize: 20, color: 'white' }}>{dataObj.symbol}</td>
                        <td style={{ fontSize: 20, color: 'white' }}>${dataObj.price}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Tables;