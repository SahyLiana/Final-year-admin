import React from "react";
import "./order.scss";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { useSnackbar, enqueueSnackbar } from "notistack";

function Order() {
  const { id } = useParams();
  const [singleOrder, setSingleOrder] = React.useState({});
  const [transactions, setTransactions] = React.useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const { enqueueSnackbar, closeSnacbar } = useSnackbar();
  React.useEffect(() => {
    const getOrder = async () => {
      try {
        setLoading(true);
        const order = await Axios.get(
          `http://localhost:3000/api/products/order/${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        // console.log(order.data.findOrder);
        setSingleOrder(order.data.findOrder);
        setStatus(order.data.findOrder.status);
        // console.log(order.data.findOrder.transactions);
        setTransactions(order.data.findOrder.transactions);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [id]);

  console.log("My order is");
  console.log(singleOrder);
  console.log("My transactions are ");
  console.log(transactions);

  const handleSubmit = async () => {
    if (status && status !== singleOrder.status) {
      console.log("The new status is");
      console.log(status);

      try {
        setUpdateLoading(true);
        const updateStatus = await Axios.patch(
          `http://localhost:3000/api/products/order/${id}`,
          {
            status: status,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        // setStatus(order.data.findOrder.status);
        setStatus(status);
        setSingleOrder((prev) => ({ ...prev, status: status }));
        enqueueSnackbar("Order has been delivered", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      } finally {
        setUpdateLoading(false);
      }
    } else {
      enqueueSnackbar("Please select the status", { variant: "warning" });
    }
  };

  return (
    <div className="order-container">
      <div className="order-header">
        <h1>Order details</h1>
        {singleOrder.status === "Pending" && (
          <div className="right-header">
            <button
              className={` ${updateLoading && "loading"}`}
              onClick={handleSubmit}
            >
              {updateLoading ? "Updating..." : "Update"}
            </button>
            <select onChange={(e) => setStatus(e.target.value)} name="status">
              <option defaultValue="" value="">
                Change Status
              </option>
              <option value="Delivered">Deliver</option>
            </select>
          </div>
        )}
      </div>
      <table className="details">
        <tbody>
          <tr>
            <td> Transaction ID:</td>
            <td>
              <span>{singleOrder._id}</span>
            </td>
          </tr>
          <tr>
            <td> Date:</td>
            <td>
              <span>{singleOrder.date}</span>
            </td>
          </tr>
          <tr>
            <td>Status:</td>
            <td>
              <span>{singleOrder.status}</span>
            </td>
          </tr>
        </tbody>
      </table>

      {!loading ? (
        <>
          <table className="transactions">
            <thead>
              <tr>
                <td style={{ width: "50%" }}>Product</td>
                <td>Quantity</td>
                <td>Unit Price</td>
                <td style={{ textAlign: "right" }}>Total</td>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, key) => {
                  return (
                    <tr key={key}>
                      <td className="product">
                        <img
                          src={`http://localhost:3000/products/${transaction.image}`}
                        />
                        <span className="name">{transaction.name}</span>
                      </td>
                      <td>{transaction.nb}</td>
                      <td>${transaction.price}</td>
                      <td style={{ textAlign: "right" }}>
                        ${transaction.indTotal}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ border: "none" }}>
                  <td style={{ fontSize: "30px" }}>Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="calculate-total">
            <table>
              <tbody>
                <tr>
                  <td className="left">Subtotal</td>
                  <td className="right">${singleOrder.total}</td>
                </tr>
                <tr>
                  <td className="left">Shipping Cost</td>
                  <td className="right">Free Shipping</td>
                </tr>
                <tr>
                  <td className="left">Total price</td>
                  <td className="right total">${singleOrder.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="payment">
            <h4>Payment made</h4>
          </div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default Order;
