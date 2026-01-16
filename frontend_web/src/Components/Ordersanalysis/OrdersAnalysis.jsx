import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { FaDownload, FaChartLine, FaTable, FaChartPie, FaChartBar } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import api from "../../services/api";
import "./OrdersAnalysis.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function OrdersAnalysis() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders.php");
        const data = response.data;

        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          throw new Error("Invalid data structure received from API.");
        }
      } catch (err) {
        setError(err.message);
        // Fallback for demo purposes if API fails (remove in production)
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="analysis-loading">Loading analysis data...</div>;
  if (error) return <div className="analysis-error">Error: {error}</div>;

  // --- Data Processing ---
  const productSales = {};
  const categorySales = {};
  const paymentMethodCount = {};
  const ordersByHour = {};
  const ordersByDay = {};
  
  // Helper for sorting logic could go here, keeping it simple for now
  orders.forEach((order) => {
    const price = parseFloat(order.price) || 0;
    const dateObj = new Date(order.order_date);
    const hour = dateObj.getHours() + ":00";
    const day = dateObj.toLocaleDateString();

    productSales[order.product_name] = (productSales[order.product_name] || 0) + price;
    categorySales[order.category_name] = (categorySales[order.category_name] || 0) + price;
    paymentMethodCount[order.payment_method] = (paymentMethodCount[order.payment_method] || 0) + 1;
    
    ordersByHour[hour] = (ordersByHour[hour] || 0) + price;
    ordersByDay[day] = (ordersByDay[day] || 0) + price;
  });

  // --- Chart Configs ---
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    }
  };

  const productBarData = {
    labels: Object.keys(productSales),
    datasets: [{ label: "Revenue (KSh)", data: Object.values(productSales), backgroundColor: "#0f172a", borderRadius: 4 }],
  };

  const categoryBarData = {
    labels: Object.keys(categorySales),
    datasets: [{ label: "Revenue by Category", data: Object.values(categorySales), backgroundColor: "#3b82f6", borderRadius: 4 }],
  };

  const paymentPieData = {
    labels: Object.keys(paymentMethodCount),
    datasets: [{ label: "Count", data: Object.values(paymentMethodCount), backgroundColor: ["#0f172a", "#3b82f6", "#94a3b8"], borderWidth: 0 }],
  };

  const trendLineData = {
    labels: Object.keys(ordersByDay),
    datasets: [{ 
      label: "Daily Revenue", 
      data: Object.values(ordersByDay), 
      borderColor: "#ef4444", 
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      fill: true,
      tension: 0.4 
    }],
  };

  // --- Export CSV ---
  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += ["Product", "Category", "Qty", "Revenue", "Payment", "Email", "Date"].join(",") + "\r\n";

    orders.forEach((o) => {
      csvContent += [o.product_name, o.category_name, o.quantity || 1, o.price, o.payment_method, o.user_email, o.order_date].join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "PhoneMart_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="analysis-container">
      
      {/* HEADER */}
      <div className="analysis-header">
        <div>
          <h1>Orders Analysis</h1>
          <p>Real-time performance metrics</p>
        </div>
        <button onClick={downloadCSV} className="download-btn">
          <FaDownload /> Export Report
        </button>
      </div>

      {/* KEY METRICS ROW (Optional placeholders for quick stats) */}
      <div className="metrics-row">
        <div className="metric-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p>KSh {orders.reduce((acc, curr) => acc + parseFloat(curr.price), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="charts-grid">
        <div className="chart-card wide">
          <div className="chart-title"><FaChartLine /> Sales Trend (Daily)</div>
          <div className="chart-wrapper"><Line data={trendLineData} options={commonOptions} /></div>
        </div>

        <div className="chart-card">
          <div className="chart-title"><FaChartPie /> Payment Methods</div>
          <div className="chart-wrapper"><Pie data={paymentPieData} options={commonOptions} /></div>
        </div>

        <div className="chart-card">
          <div className="chart-title"><FaChartBar /> Top Categories</div>
          <div className="chart-wrapper"><Bar data={categoryBarData} options={commonOptions} /></div>
        </div>

        <div className="chart-card wide">
          <div className="chart-title"><FaChartBar /> Product Performance</div>
          <div className="chart-wrapper"><Bar data={productBarData} options={commonOptions} /></div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="table-card">
        <div className="table-header">
          <h2><FaTable /> Recent Transaction History</h2>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="product-cell">
                    <img src={order.image_url} alt="" className="mini-thumb" onError={(e) => e.target.style.display='none'} />
                    <span>{order.product_name}</span>
                  </td>
                  <td><span className="badge category">{order.category_name}</span></td>
                  <td>{order.quantity || 1}</td>
                  <td className="price-cell">KSh {Number(order.price).toLocaleString()}</td>
                  <td>{order.payment_method}</td>
                  <td className="date-cell">{new Date(order.order_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}