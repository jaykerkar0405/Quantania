import ContactContext from "./ContactContext";
import { useState } from "react";

const ContactState = (props) => {
  const [contact_entry, set_contact_entry] = useState([]);
  const [request_result, set_request_result] = useState([]);

  // Function To Fetch The Contact Entry
  async function fetch_contact_entry() {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/contact/fetch_contact_entry/administrator`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const fetched_contact_entry = await request.json();
    set_contact_entry(fetched_contact_entry.contact_entry);
    set_request_result(fetched_contact_entry.result);
  }

  // Function To Resolve The Contact entry
  async function resolve_contact_entry(id, solution) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/contact/resolve_contact_entry/${id}`;
    let request = await fetch(api_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({ solution: solution }),
    });

    let resolved_contact_entry = await request.json();
    let remaining_contact_entry = contact_entry.filter(
      (resolved_contact_entry) => {
        return resolved_contact_entry._id !== id;
      }
    );

    set_contact_entry(remaining_contact_entry);
    set_request_result(resolved_contact_entry.result);
  }

  // Function To Delete The Contact Entry
  async function delete_contact_entry(id) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/contact/delete_contact_entry/${id}`;
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
    const remaining_contact_entry = contact_entry.filter(
      (deleted_contact_entry) => {
        return deleted_contact_entry._id !== id;
      }
    );
    set_contact_entry(remaining_contact_entry);
    set_request_result(deleted_contact_entry.result);
  }

  return (
    <ContactContext.Provider
      value={{
        contact_entry,
        request_result,
        fetch_contact_entry,
        resolve_contact_entry,
        delete_contact_entry,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
