import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Input,
  Row,
  Col,
  Spinner,
  Alert,
} from "reactstrap";

function Dashboard(props) {
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("BTC");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [coinName, setCoinName] = useState("Bitcoin");
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("day");

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

    // Function to aggregate data by month
    const aggregateDataByMonth = () => {
      const aggregatedData = historicalPrices.reduce((acc, data) => {
        const date = new Date(data.date);
        const month = date.toLocaleString("default", { month: "short" });
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
  
      return {
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
    };
  
    // Function to aggregate data by week
    const aggregateDataByWeek = () => {
      function getWeekNumber(date) {
        const dayOfWeek = date.getDay() || 7;
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 4 - dayOfWeek);
        const yearStart = new Date(date.getFullYear(), 0, 1);
        return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
      }
  
      const aggregatedData = historicalPrices.reduce((acc, data) => {
        const date = new Date(data.date);
        const week = `Week ${getWeekNumber(date)}`;
        if (!acc[week]) {
          acc[week] = { total: 0, count: 0 };
        }
        acc[week].total += data.price;
        acc[week].count += 1;
        return acc;
      }, {});
  
      const weeks = Object.keys(aggregatedData);
      const avgPrices = weeks.map((week) => {
        return aggregatedData[week].total / aggregatedData[week].count;
      });
  
      return {
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
    };
  
    const renderChart = () => {
      switch (chartType) {
        case "month":
          return <Line data={aggregateDataByMonth()} />;
        case "week":
          return <Line data={aggregateDataByWeek()} />;
        case "day":
        default:
          return <Line data={chartData} />;
      }
    };
  
    return (
      <>
        <div className="content">
          <Row className="align-items-center mb-4">
            <Col md="4" className="d-flex">
              <form onSubmit={handleSearch} className="d-flex w-100">
                <Input type="text" name="symbol" placeholder="Enter Currency Symbol (e.g., BTC)" />
                <Button type="submit" className="ml-2">Search</Button>
              </form>
            </Col>
            <Col md="8" className="d-flex justify-content-end">
              <ButtonGroup className="btn-group-toggle" data-toggle="buttons">
                <Button
                  tag="label"
                  className={classNames("btn-simple", {
                    active: chartType === "day",
                  })}
                  color="info"
                  id="0"
                  size="sm"
                  onClick={() => setChartType("day")}
                >
                  <input defaultChecked className="d-none" name="options" type="radio" />
                  <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Day</span>
                  <span className="d-block d-sm-none">
                    <i className="tim-icons icon-single-02" />
                  </span>
                </Button>
                <Button
                  tag="label"
                  className={classNames("btn-simple", {
                    active: chartType === "week",
                  })}
                  color="info"
                  id="1"
                  size="sm"
                  onClick={() => setChartType("week")}
                >
                  <input className="d-none" name="options" type="radio" />
                  <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Week</span>
                  <span className="d-block d-sm-none">
                    <i className="tim-icons icon-gift-2" />
                  </span>
                </Button>
                <Button
                  tag="label"
                  className={classNames("btn-simple", {
                    active: chartType === "month",
                  })}
                  color="info"
                  id="2"
                  size="sm"
                  onClick={() => setChartType("month")}
                >
                  <input className="d-none" name="options" type="radio" />
                  <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Month</span>
                  <span className="d-block d-sm-none">
                    <i className="tim-icons icon-tap-02" />
                  </span>
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Overview</h5>
                  <CardTitle tag="h3">
                    {currentPrice && coinName && (
                      <div>
                        <h4>{coinName}</h4>
                        <h5>Current Price: ${currentPrice}</h5>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">{renderChart()}</div>
                  {isLoading && <Spinner color="primary" />}
                  {error && <Alert color="danger">{error}</Alert>}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
  
  export default Dashboard;