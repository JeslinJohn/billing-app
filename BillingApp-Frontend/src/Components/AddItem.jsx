import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Validation from "./Validation";

function AddItem() {
  const navigate = useNavigate();
  const [productData, setproductData] = useState({
    serial_no: "",
    product_id: "",
    product_name: "",
    product_quantity: "",
    product_price: "",
    total_price: ""
  });

  const [error, setError] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newTotalPrice = productData.total_price;

    if (name === "product_quantity" || name === "product_price") {
      const quantity =
        parseInt(
          name === "product_quantity" ? value : productData.product_quantity
        ) || 0;
      const price =
        parseInt(
          name === "product_price" ? value : productData.product_price
        ) || 0;
      newTotalPrice = quantity * price;
    }

    setproductData({
      ...productData,
      [name]: value,
      total_price: newTotalPrice
    });
  };

  const submitData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = Validation(productData);
    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully!");
    } else {
      console.log("Form submission failed due to validation errors.");
    }

    await axios
      .post("http://localhost:8090/api/resources/create", productData)
      .then((res) => {
        setApiError(null);
        navigate("/");
      })
      .catch((err) => {
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
      });
    setIsLoading(false);
  };

  <Validation />;

  return (
    <div>
      {apiError && (
        <>
          <div>{apiError}</div>
        </>
      )}

      <form onSubmit={submitData}>
        <div>
          <label>
            S. No:
            <input
              type="text"
              name="serial_no"
              value={productData.serial_no}
              onChange={handleChange}
            />
            {error.serial_no && <span>{error.serial_no}</span>}
          </label>
        </div>
        <div>
          <label>
            Item Id:
            <input
              type="text"
              name="product_id"
              value={productData.product_id}
              onChange={handleChange}
            />
            {error.product_id && <span>{error.product_id}</span>}
          </label>
        </div>
        <div>
          <label>
            Product Name:
            <input
              type="text"
              name="product_name"
              value={productData.product_name}
              onChange={handleChange}
            />
            {error.product_name && <span>{error.product_name}</span>}
          </label>
        </div>
        <div>
          <label>
            Quantity:
            <input
              type="text"
              name="product_quantity"
              value={productData.product_quantity}
              onChange={handleChange}
            />
            {error.product_quantity && <span>{error.product_quantity}</span>}
          </label>
        </div>
        <div>
          <label>
            Price:
            <input
              type="text"
              name="product_price"
              value={productData.product_price}
              onChange={handleChange}
            />
            {error.product_price && <span>{error.product_price}</span>}
          </label>
        </div>
        <div>
          <label>
            Total:
            <input
              type="text"
              name="total_price"
              value={productData.total_price}
              onChange={handleChange}
              readOnly
            />
            {error.total_price && <span>{error.total_price}</span>}
          </label>
          <div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddItem;
