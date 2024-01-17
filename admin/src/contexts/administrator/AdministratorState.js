import AdministratorContext from "./AdministratorContext";
import { useState } from "react";

const AdministratorState = (props) => {
  const [administrator, set_administrator] = useState([]);
  const [request_result, set_request_result] = useState([]);

  // Function To Fetch The Administrator
  async function fetch_administrator() {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/fetch_administrator`;
    const response = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const fetched_administrator = await response.json();
    set_administrator(fetched_administrator.administrator);
    set_request_result(fetched_administrator.result);
  }

  // Function To Update The Administrator
  async function update_administrator(id, administrator_status) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/update_administrator_status/administrator_id/${id}`;
    const response = await fetch(api_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({ status: administrator_status }),
    });
    let updated_administrator_data = await response.json();

    let updated_administrator = JSON.parse(JSON.stringify(administrator));
    for (let index = 0; index < updated_administrator.length; index++) {
      const element = updated_administrator[index];
      if (element._id === id) {
        updated_administrator[index].status = administrator_status;
        break;
      }
    }
    set_administrator(updated_administrator);
    set_request_result(updated_administrator_data.result);
  }

  // Function To Delete The Administrator
  async function delete_administrator(id) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/delete_administrator/${id}`;
    const response = await fetch(api_url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const deleted_administrator_data = await response.json();

    const remaining_administrator = administrator.filter(
      (deleted_administrator) => {
        return deleted_administrator._id !== id;
      }
    );
    set_administrator(remaining_administrator);
    set_request_result(deleted_administrator_data.result);
  }

  return (
    <AdministratorContext.Provider
      value={{
        administrator,
        request_result,
        fetch_administrator,
        update_administrator,
        delete_administrator,
      }}
    >
      {props.children}
    </AdministratorContext.Provider>
  );
};

export default AdministratorState;
