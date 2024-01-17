import CategoryContext from "./CategoryContext";
import { useState } from "react";

const CategoryState = (props) => {
  const [category, setCategory] = useState([]);
  const [request_result, set_request_result] = useState([]);

  // Function To Fetch The Category
  async function fetch_category() {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/fetch_category/administrator`;
    const response = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const fetched_category = await response.json();
    setCategory(fetched_category.category);
    set_request_result(fetched_category.result);
  }

  // Function To Add The Category
  async function add_category(category_name, category_image) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/add_category`;
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({
        category_name: category_name,
        category_image: category_image,
      }),
    });
    const added_category = await response.json();
    setCategory(category.concat(added_category.category_details));
    set_request_result(added_category.result);
  }

  // Function To Update The Category
  async function update_category(
    id,
    category_name,
    category_status,
    category_image
  ) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/update_category/${id}`;
    const request = await fetch(api_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({
        category_name: category_name,
        category_status: category_status,
        category_image:
          category_image === "/image_preview.jpg" ? false : category_image,
      }),
    });
    const request_result = await request.json();
    set_request_result(request_result.result);

    let updated_category = JSON.parse(JSON.stringify(category));
    for (let index = 0; index < updated_category.length; index++) {
      const element = updated_category[index];
      if (element._id === id) {
        updated_category[index].category_name = category_name;
        updated_category[index].category_status = category_status;
        updated_category[index].category_image =
          request_result.category_details.category_image;
        break;
      }
    }
    setCategory(updated_category);
  }

  // Function To Delete The Category
  async function delete_category(id) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/delete_category/${id}`;
    const request = await fetch(api_url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const remaining_category = category.filter((deleted_category) => {
      return deleted_category._id !== id;
    });
    setCategory(remaining_category);
    const request_result = await request.json();
    set_request_result(request_result.result);
  }

  return (
    <CategoryContext.Provider
      value={{
        category,
        request_result,
        fetch_category,
        add_category,
        update_category,
        delete_category,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryState;
