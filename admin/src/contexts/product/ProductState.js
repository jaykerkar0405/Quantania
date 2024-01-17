import ProductContext from "./ProductContext";
import { useState } from "react";

const ProductState = (props) => {
  const [product, set_product] = useState([]);
  const [request_result, set_request_result] = useState([]);

  // Function To Fetch The Product
  async function fetch_product() {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/product/fetch_product/administrator`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const fetched_product = await request.json();
    set_product(fetched_product.fetch_product);
    set_request_result(fetched_product.result);
  }

  // Function To Add The product
  async function add_product(product_data, product_image) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/product/add_product`;
    let product_category = {
      category_id: product_data.product_category.split(",")[0],
      category_name: product_data.product_category.split(",")[1],
    };

    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({
        product_name: product_data.product_name,
        product_category: {
          category_id: product_category.category_id,
          category_name: product_category.category_name,
        },
        product_details: product_data.product_details,
        product_mrp: product_data.product_mrp,
        product_price: product_data.product_price,
        product_developer: product_data.product_developer,
        product_image: product_image,
        download_link: "https://www.snackspace.ml/",
      }),
    });

    const added_product = await request.json();
    set_product(product.concat(added_product.add_product));
    set_request_result(added_product.result);
  }

  // Function To Update The Product
  async function update_product(id, product_data, product_image) {
    let category;
    if (typeof product_data.product_category === "string") {
      category = {
        category_id: product_data.product_category.split(",")[0],
        category_name: product_data.product_category.split(",")[1],
      };
    } else {
      category = product_data.product_category;
    }

    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/product/update_product/${id}`;
    const request = await fetch(api_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({
        product_name: product_data.product_name,
        product_category: category,
        product_details: product_data.product_details,
        product_mrp: product_data.product_mrp,
        product_price: product_data.product_price,
        product_developer: product_data.product_developer,
        product_image:
          product_image === "/image_preview.jpg" ? false : product_image,
        status: product_data.status,
        download_link: product_data.download_link,
      }),
    });
    const data = await request.json();
    set_request_result(data.result);

    let updated_product = JSON.parse(JSON.stringify(product));
    for (let index = 0; index < updated_product.length; index++) {
      const element = updated_product[index];
      if (element._id === id) {
        updated_product[index].product_name = product_data.product_name;
        updated_product[index].product_category = category;
        updated_product[index].product_mrp = product_data.product_mrp;
        updated_product[index].product_price = product_data.product_price;
        updated_product[index].product_developer =
          product_data.product_developer;
        updated_product[index].product_details = product_data.product_details;
        updated_product[index].product_registrar =
          product_data.product_registrar;
        updated_product[index].product_image =
          data.update_product.product_image;
        updated_product[index].status = product_data.status;
        updated_product[index].download_link = product_data.download_link;
        break;
      }
    }
    set_product(updated_product);
  }

  // Function To Delete The product
  async function delete_product(id) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/product/delete_product/${id}`;
    const request = await fetch(api_url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const data = await request.json();
    const remaining_product = product.filter((deleted_product) => {
      return deleted_product._id !== id;
    });
    set_product(remaining_product);
    set_request_result(data.result);
  }

  return (
    <ProductContext.Provider
      value={{
        product,
        request_result,
        fetch_product,
        add_product,
        update_product,
        delete_product,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductState;
