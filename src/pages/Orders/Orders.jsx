import React from "react";
import "./orders.scss";
import Axios from "axios";
import DisplayedRows from "./DisplayedRows";
import Pagination from "../Products/Pagination";
import { useSearchParams } from "react-router-dom";

function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = React.useState(true);
  const [myTotalOrders, setMyTotalOrders] = React.useState([]);
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage, setPostsPerPage] = React.useState(5);
  const [selectedFilter, setSelectedFilter] = React.useState({
    sorting: "-date",
  });

  React.useEffect(() => {
    const getOrders = async () => {
      try {
        const sorting = searchParams.get("sorting");
        setLoading(true);
        const allOrders = await Axios.get(
          "http://localhost:3000/api/products/earnings",
          {
            headers: {
              Authorization: token,
            },

            params: {
              sorting: sorting,
            },
          }
        );

        console.log("All orders are:");
        console.log(allOrders.data);
        console.log;
        setMyTotalOrders([...allOrders.data.myEarnings]);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [selectedFilter.sorting]);

  const onChangeDate = (e) => {
    const { name, value } = e.target;

    setSelectedFilter((prev) => ({ ...prev, [name]: value }));

    setSearchParams((params) => {
      params.set(name, value);
      return params;
    });
  };

  console.log("All orders are:");
  console.log(myTotalOrders);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = myTotalOrders.slice(firstPostIndex, lastPostIndex);
  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 style={{ color: "royalblue" }}>All your Orders</h1>
        <select
          onChange={onChangeDate}
          className="date-sort"
          name="sorting"
          defaultValue="-date"
        >
          <option value="-date">Recent to old</option>
          <option value="date">Old to recent</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>TransactionID</th>
            <th>Client</th>
            <th style={{ width: "200px" }}>Contact</th>
            <th style={{ width: "150px" }}>Type of Products</th>
            <th>Paid</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr style={{ border: "none" }}>
              <td>
                <span style={{ fontWeight: "bold", fontSize: "40px" }}>
                  Loading...
                </span>
              </td>
            </tr>
          ) : (
            <DisplayedRows ordersData={currentPosts} />
          )}
        </tbody>
      </table>
      <Pagination
        totalPosts={myTotalOrders.length}
        postsPerPage={postsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}

export default Orders;
