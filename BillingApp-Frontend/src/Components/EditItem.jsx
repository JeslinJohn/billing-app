import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import axios from "axios";
import EditValidation from "./EditValidation";

function EditItem() {
  const { state } = useLocation();

  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState({
    serial_no: state?.product?.serial_no || "",
    product_id: state?.product?.product_id || "",
    product_name: state?.product?.product_name || "",
    product_quantity: state?.product?.product_quantity || "",
    product_price: state?.product?.product_price || "",
    total_price: state?.product?.total_price || ""
  });
  const [error, setError] = useState({});
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newTotalPrice = product.total_price;

    if (name === "product_quantity" || name === "product_price") {
      const quantity =
        parseInt(
          name === "product_quantity" ? value : product.product_quantity
        ) || 0;
      const price =
        parseInt(name === "product_price" ? value : product.product_price) || 0;
      newTotalPrice = quantity * price;
    }

    setProduct({
      ...product,
      [name]: value,
      total_price: newTotalPrice
    });
  };

  const updateData = async (e) => {
    e.preventDefault();
    const errorMessage = EditValidation(product);
    setError(errorMessage);

    try {
      await axios.put(
        `http://localhost:8090/api/resources/update/${id}`,
        product,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        }
      );
      navigate("/table");
    } catch (err) {
      if (err.response) {
        setApiError(
          `Error: ${err.response.status} - 
              ${err.response.data.message}`
        );
      } else if (err.request) {
        setApiError(
          `Error: No response from server. Check your network connection!!`
        );
      } else {
        setApiError(`Error:  ${err.message}`);
      }
    }
  };
  const cancel = () => {
    navigate("/table");
  };
  <EditValidation />;

  return (
    <div className="add-item-container">
      {apiError && (
        <>
          <div className="error_msg">{apiError}</div>
        </>
      )}
      <form className="form" onSubmit={updateData}>
        <div className="form_input 1">
          <label>
            S. No:
            <input
              type="text"
              name="serial_no"
              value={product.serial_no}
              onChange={handleChange}
            />
            {error.serial_no && <span>{error.serial_no}</span>}
          </label>
        </div>
        <div className="form_input 2">
          <label>
            Item Id:
            <input
              type="text"
              name="product_id"
              value={product.product_id}
              onChange={handleChange}
              readOnly
            />
            {error.product_id && <span>{error.product_id}</span>}
          </label>
        </div>
        <div className="form_input 3">
          <label>
            Product Name:
            <input
              type="text"
              name="product_name"
              value={product.product_name}
              onChange={handleChange}
            />
            {error.product_name && <span>{error.product_name}</span>}
          </label>
        </div>
        <div className="form_input 4">
          <label>
            Quantity:
            <input
              type="text"
              name="product_quantity"
              value={product.product_quantity}
              onChange={handleChange}
            />
            {error.product_quantity && <span>{error.product_quantity}</span>}
          </label>
        </div>
        <div className="form_input 5">
          <label>
            Price:
            <input
              type="text"
              name="product_price"
              value={product.product_price}
              onChange={handleChange}
            />
            {error.product_price && <span>{error.product_price}</span>}
          </label>
        </div>
        <div className="form_input 6">
          <label>
            Total:
            <input
              type="text"
              name="total_price"
              value={product.total_price}
              onChange={handleChange}
              readOnly
            />
            {error.total_price && <span>{error.total_price}</span>}
          </label>
          <div>
            <button className="form_submit" type="submit">
              Update
            </button>
          </div>
        </div>
        <button className="form_cancel" type="button" onClick={cancel}>
          Back
        </button>
      </form>
    </div>
  );
}

export default EditItem;
