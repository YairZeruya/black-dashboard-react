import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
  Spinner,
  Alert,
} from "reactstrap";
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
} from "variables/charts.js";

function Dashboard(props) {
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("BTC");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [coinName, setCoinName] = useState("Bitcoin");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://127.0.0.1:5586/binance/${searchTerm}`);
        setHistoricalPrices(response.data.historical_prices);
        setCurrentPrice(response.data.current_price); // Assuming the API returns the current price
        setCoinName(response.data.coin_name); // Assuming the API returns the coin name
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("There is no such symbol.");
      }
      setIsLoading(false);
    };
    fetchHistoricalData();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    const symbol = e.target.elements.symbol.value.toUpperCase();
    setSearchTerm(symbol);
  };

  const dates = historicalPrices.map((data) => data.date);
  const prices = historicalPrices.map((data) => data.price);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Price By Day",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: prices,
      },
    ],
  };

  const aggregatedData = historicalPrices.reduce((acc, data) => {
    const date = new Date(data.date);
    const month = date.toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { total: 0, count: 0 };
    }
    acc[month].total += data.price;
    acc[month].count += 1;
    return acc;
  }, {});

  const months = Object.keys(aggregatedData);
  const averagePrices = months.map((month) => {
    return aggregatedData[month].total / aggregatedData[month].count;
  });

  const chartDataByMonth = {
    labels: months,
    datasets: [
      {
        label: "Price by Month",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(192,75,192,0.4)",
        borderColor: "rgba(192,75,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(192,75,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(192,75,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: averagePrices,
      },
    ],
  };

  function getWeekNumber(date) {
    const dayOfWeek = date.getDay() || 7;
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - dayOfWeek);
    const yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  }

  const aggregateData = historicalPrices.reduce((acc, data) => {
    const date = new Date(data.date);
    const week = `Week ${getWeekNumber(date)}`;
    if (!acc[week]) {
      acc[week] = { total: 0, count: 0 };
    }
    acc[week].total += data.price;
    acc[week].count += 1;
    return acc;
  }, {});

  const weeks = Object.keys(aggregateData);
  const avgPrices = weeks.map((week) => {
    return aggregateData[week].total / aggregateData[week].count;
  });

  const chartDataByWeek = {
    labels: weeks,
    datasets: [
      {
        label: "Price by Week",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(4, 162, 235, 0.2)", 
        borderColor: "rgba(54, 162, 235, 1)", 
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(54, 162, 235, 1)",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: avgPrices,
      },
    ],
  };

  return (
    <>
      <div className="content">
        <Row lg="12">
          <Col lg="12">
            <Card className="card-chart" style={{ width: '100%', maxWidth: '100%' }}>
              <CardHeader>
                <h5 className="card-category">Overview</h5>
                <CardTitle tag="h3">
                  <FormGroup>
                    <form onSubmit={handleSearch}>
                      <Input type="text" name="symbol" placeholder="Enter Currency Symbol (e.g., BTC)" />
                      <Button type="submit">Search</Button>
                    </form>
                  </FormGroup>
                  {currentPrice && coinName && (
                    <div>
                      <h4>{coinName}</h4>
                      <h5>Current Price: ${currentPrice}</h5>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area-wrapper">
                  <div className="chart-area">
                    {isLoading ? (
                      <Spinner color="primary" />
                    ) : error ? (
                      <Alert color="danger">{error}</Alert>
                    ) : (
                      <Line data={chartData} />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Months</h5>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartDataByMonth}
                    //options={chartExample1.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Daily Sales</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                  3,500€
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Bar
                    data={chartExample3.data}
                    options={chartExample3.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Weeks</h5>
                {/* <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-success" /> 12,100K
                </CardTitle> */}
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartDataByWeek}
                    // options={chartExample4.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="6" md="12">
            <Card className="card-tasks">
              <CardHeader>
                <h6 className="title d-inline">Tasks(5)</h6>
                <p className="card-category d-inline"> today</p>
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon"
                    color="link"
                    data-toggle="dropdown"
                    type="button"
                  >
                    <i className="tim-icons icon-settings-gear-63" />
                  </DropdownToggle>
                  <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Action
                    </DropdownItem>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Another action
                    </DropdownItem>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Something else
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Update the Documentation</p>
                          <p className="text-muted">
                            Dwuamish Head, Seattle, WA 8:47 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip636901683"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip636901683"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">GDPR Compliance</p>
                          <p className="text-muted">
                            The GDPR is a regulation that requires businesses to
                            protect the personal data and privacy of Europe
                            citizens for transactions that occur within EU
                            member states.
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip457194718"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip457194718"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Solve the issues</p>
                          <p className="text-muted">
                            Fifty percent of all respondents said they would be
                            more likely to shop at a company
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip362404923"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip362404923"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Release v2.0.0</p>
                          <p className="text-muted">
                            Ra Ave SW, Seattle, WA 98116, SUA 11:19 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip818217463"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip818217463"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Export the processed files</p>
                          <p className="text-muted">
                            The report also shows that consumers will not easily
                            forgive a company once a breach exposing their
                            personal data occurs.
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip831835125"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip831835125"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Arival at export process</p>
                          <p className="text-muted">
                            Capitol Hill, Seattle, WA 12:34 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip217595172"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip217595172"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Simple Table</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>City</th>
                      <th className="text-center">Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-center">$36,738</td>
                    </tr>
                    <tr>
                      <td>Minerva Hooper</td>
                      <td>Curaçao</td>
                      <td>Sinaai-Waas</td>
                      <td className="text-center">$23,789</td>
                    </tr>
                    <tr>
                      <td>Sage Rodriguez</td>
                      <td>Netherlands</td>
                      <td>Baileux</td>
                      <td className="text-center">$56,142</td>
                    </tr>
                    <tr>
                      <td>Philip Chaney</td>
                      <td>Korea, South</td>
                      <td>Overland Park</td>
                      <td className="text-center">$38,735</td>
                    </tr>
                    <tr>
                      <td>Doris Greene</td>
                      <td>Malawi</td>
                      <td>Feldkirchen in Kärnten</td>
                      <td className="text-center">$63,542</td>
                    </tr>
                    <tr>
                      <td>Mason Porter</td>
                      <td>Chile</td>
                      <td>Gloucester</td>
                      <td className="text-center">$78,615</td>
                    </tr>
                    <tr>
                      <td>Jon Porter</td>
                      <td>Portugal</td>
                      <td>Gloucester</td>
                      <td className="text-center">$98,615</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
