/*!

=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Strategies from "views/Strategies";
import TradesManage from "views/TradesManage";
import Rtl from "views/Rtl.js";
import Coins from "views/Coins.js";
import Backtesting from "views/Backtesting.js";
import MyTrades from "views/MyTrades.js";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    rtlName: "الرموز",
    icon: "tim-icons icon-atom",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/map",
    name: "Map",
    rtlName: "خرائط",
    icon: "tim-icons icon-pin",
    component: <Strategies />,
    layout: "/admin",
  },
  {
    path: "/TradesManage",
    name: "Trades Manage",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: <TradesManage />,
    layout: "/admin",
  },
  {
    path: "/MyTrades",
    name: "My Trades",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: <MyTrades />,
    layout: "/admin",
  },
  {
    path: "/coins",
    name: "Coins",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-puzzle-10",
    component: <Coins />,
    layout: "/admin",
  },
  {
    path: "/Backtesting",
    name: "Backtesting",
    rtlName: "בדיקה לאחור",
    icon: "tim-icons icon-align-center",
    component: <Backtesting />,
    layout: "/admin",
  },
  {
    path: "/rtl-support",
    name: "RTL Support",
    rtlName: "ار تي ال",
    icon: "tim-icons icon-world",
    component: <Rtl />,
    layout: "/rtl",
  },
];
export default routes;
