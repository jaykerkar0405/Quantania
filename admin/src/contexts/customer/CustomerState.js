import CustomerContext from "./CustomerContext";
import { useState } from "react";

const CustomerState = (props) => {
  const [customer, set_customer] = useState([]);
  const [request_result, set_request_result] = useState([]);

  // Function To Fetch The Customer
  async function fetch_customer() {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/customer/fetch_customer`;
    const response = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const fetched_customer = await response.json();
    set_customer(fetched_customer.customer);
    set_request_result(fetched_customer.result);
  }

  // Function To Update The Customer
  async function update_customer(id, customer_status) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/customer/update_customer_status/customer_id/${id}`;
    let response = await fetch(api_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({ status: customer_status }),
    });
    let updated_customer_data = await response.json();

    let updated_customer = JSON.parse(JSON.stringify(customer));
    for (let index = 0; index < updated_customer.length; index++) {
      const element = updated_customer[index];
      if (element._id === id) {
        updated_customer[index].status = customer_status;
        break;
      }
    }
    set_customer(updated_customer);
    set_request_result(updated_customer_data.result);
  }

  // Function To Delete The Customer
  async function delete_customer(id) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/customer/delete_customer/${id}`;
    const response = await fetch(api_url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const deleted_customer_data = await response.json();

    const remaining_customer = customer.filter((deleted_customer) => {
      return deleted_customer._id !== id;
    });
    set_customer(remaining_customer);
    set_request_result(deleted_customer_data.result);
  }

  return (
    <CustomerContext.Provider
      value={{
        customer,
        request_result,
        fetch_customer,
        update_customer,
        delete_customer,
      }}
    >
      {props.children}
    </CustomerContext.Provider>
  );
};

export default CustomerState;
