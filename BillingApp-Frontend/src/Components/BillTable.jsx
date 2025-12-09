import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function BillTable() {
  const [products, setProduct] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8090/api/resources/readlist", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
        }
      })
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        if (error.response) {
          setError(
            `Error: ${error.response.status} - ${error.response.data.error} /
              ${error.response.data.message}`
          );
        } else if (error.request) {
          setError(
            `Error: No response from server. Check your network connection!!`
          );
        } else {
          setError(`Error:  ${error.message}`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const handleClick = () => {
    navigate("/add");
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8090/api/resources/deleteall", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
        }
      });
      window.location.reload();
    } catch (error) {
      if (error.response) {
        setError(
          `Error: ${error.response.status} - ${error.response.data.error} /
              ${error.response.data.message}`
        );
      } else if (error.request) {
        setError(
          `Error: No response from server. Check your network connection!!`
        );
      } else {
        setError(`Error:  ${error.message}`);
      }
    }
  };
  const delItem = async (id) => {
   await axios.delete(`http://localhost:8090/api/resources/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
      }
    });
    window.location.reload();
  };
  return (
    <div className="error">
      {error && (
        <>
          <div className="error_message">{error}</div>
        </>
      )}
      {!error && (
        <table className="tab">
          <thead className="header">
            <tr>
              <th>Item ID</th>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total Price</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="tab_body">
            {products.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.serial_no}</td>
                <td>{product.product_name}</td>
                <td>{product.product_quantity}</td>
                <td>{product.product_price}</td>
                <td>{product.total_price}</td>
                <td>
                   <Link to={`/edit/${product.product_id}`} state={{ product }}>
                    <img
                      className="edit"
                      src="src/assets/edit.svg "
                      alt="edit"
                    ></img>
                  </Link>
                </td>
                <td>
                  <Link onClick={() => delItem(`${product.product_id}`)}>
                    <img
                      className="delete"
                      src="src/assets/delete.svg "
                      alt="delete"
                    ></img>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <img
        className="add"
        onClick={handleClick}
        src="src/assets/add.svg "
        alt="add"
      ></img>
      <img
        className="clear"
        onClick={handleDelete}
        src="src/assets/clear.svg "
        alt="clear"
      ></img>
    </div>
  );
}

export default BillTable;
