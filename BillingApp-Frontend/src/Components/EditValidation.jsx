function EditValidation(data) {
  const errors = {};
  if (!data.product_id) {
    errors.product_id = "Product id is required";
  }
  if (!data.serial_no) {
    errors.serial_no = "S No is required";
  }
  if (!data.product_name) {
    errors.product_name = "Product name is required";
  }
  if (!data.product_quantity) {
    errors.product_quantity = "Quantity is required";
  }
  if (!data.product_price) {
    errors.product_price = "Price is required";
  }
  if (!data.total_price) {
    errors.total_price = "Total is required";
  }
  return errors;
}

export default EditValidation;
