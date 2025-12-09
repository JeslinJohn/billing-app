function Validation(data) {
  const errors = {};
  if (!data.product_id.trim()) {
    errors.product_id = "Product id is required";
  } else if (data.product_id.length !== 3) {
    errors.product_id = "Product id should be 3 digits";
  }
  if (!data.serial_no.trim()) {
    errors.serial_no = "S No is required";
  }
  if (!data.product_name.trim()) {
    errors.product_name = "Product name is required";
  }
  if (!data.product_quantity.trim()) {
    errors.product_quantity = "Quantity is required";
  }
  if (!data.product_price.trim()) {
    errors.product_price = "Price is required";
  }
  if (!data.total_price) {
    errors.total_price = "Total is required";
  }
  return errors;
}

export default Validation;
