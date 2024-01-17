import OrderContext from "./OrderContext";
import { useState } from "react";

const OrderState = (props) => {
  const [order_entry, set_order_entry] = useState([]);
  const [request_result, set_request_result] = useState([]);

  // Function To Fetch The Order Entry
  async function fetch_order_entry() {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/order/fetch_order_entry/administrator`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const fetched_order_entry = await request.json();
    set_order_entry(fetched_order_entry.fetch_order_entry);
    set_request_result(fetched_order_entry.result);
  }

  // Function To Update The Order Entry
  async function update_order_entry(id, payment_status) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/order/update_order_entry/${id}`;
    const request = await fetch(api_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({ payment_status }),
    });

    let updated_order_entry = await request.json();
    let remaining_order_entry = order_entry.filter((updated_order_entry) => {
      return updated_order_entry._id !== id;
    });
    set_order_entry(remaining_order_entry);
    set_request_result(updated_order_entry.result);
  }

  // Function To Delete The Order Entry
  async function delete_order_entry(id) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/order/delete_order_entry/${id}`;
    const request = await fetch(api_url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const deleted_contact_entry = await request.json();
    const remaining_order_entry = order_entry.filter((deleted_order_entry) => {
      return deleted_order_entry._id !== id;
    });
    set_order_entry(remaining_order_entry);
    set_request_result(deleted_contact_entry.result);
  }

  return (
    <OrderContext.Provider
      value={{
        order_entry,
        request_result,
        fetch_order_entry,
        update_order_entry,
        delete_order_entry,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};

export default OrderState;
