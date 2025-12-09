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
      .get("http://localhost:8090/api/resources/readlist")
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
      await axios.delete("http://localhost:8090/api/resources/deleteall");
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
    await axios.delete(`http://localhost:8090/api/resources/delete/${id}`);
    window.location.reload();
  };
  return (
    <div>
      {error && (
        <>
          <div>{error}</div>
        </>
      )}
      {!error && (
        <table>
          <thead>
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
          <tbody>
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
                    ✏️
                  </Link>
                </td>
                <td>
                  <Link onClick={() => delItem(`${product.product_id}`)}>
                    🗑️
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleClick}>New Item</button>
      <button onClick={handleDelete}>Clear Table</button>
    </div>
  );
}

export default BillTable;
