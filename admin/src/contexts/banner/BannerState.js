import BannerContext from "./BannerContext";
import { useState } from "react";

const BannerState = (props) => {
  const [banner, set_banner] = useState([]);
  const [request_result, set_request_result] = useState([]);

  // Function To Fetch The Banner
  async function fetch_banner() {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/banner/fetch_banner/administrator`;
    const response = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const fetched_banner = await response.json();
    set_banner(fetched_banner.banner);
    set_request_result(fetched_banner.result);
  }

  // Function To Add The Banner
  async function add_banner(banner_data, banner_image) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/banner/add_banner`;
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({
        banner_title: banner_data.banner_title,
        banner_image: banner_image,
        button_text: banner_data.button_text,
        button_link: banner_data.button_link,
      }),
    });
    const added_banner = await response.json();
    set_banner(banner.concat(added_banner.add_banner));
    set_request_result(added_banner.result);
  }

  // Function To Update The Banner
  async function update_banner(banner_data, banner_image) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/banner/update_banner/${banner_data._id}`;
    const request = await fetch(api_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({
        banner_title: banner_data.banner_title,
        banner_image:
          banner_image === "/image_preview.jpg" ? false : banner_image,
        button_text: banner_data.button_text,
        button_link: banner_data.button_link,
        banner_status: banner_data.banner_status,
      }),
    });
    const request_result = await request.json();
    set_request_result(request_result.result);

    let updated_banner = JSON.parse(JSON.stringify(banner));
    for (let index = 0; index < updated_banner.length; index++) {
      const element = updated_banner[index];
      if (element._id === banner_data._id) {
        updated_banner[index].banner_title = banner_data.banner_title;
        updated_banner[index].button_text = banner_data.button_text;
        updated_banner[index].button_link = banner_data.button_link;
        updated_banner[index].banner_status = banner_data.banner_status;
        updated_banner[index].banner_image =
          request_result.update_banner.banner_image;
        break;
      }
    }
    set_banner(updated_banner);
  }

  // Function To Delete The Banner
  async function delete_banner(banner_data) {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/banner/delete_banner/${banner_data._id}`;
    const request = await fetch(api_url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const remaining_banner = banner.filter((deleted_banner) => {
      return deleted_banner._id !== banner_data._id;
    });
    set_banner(remaining_banner);
    const request_result = await request.json();
    set_request_result(request_result.result);
  }

  return (
    <BannerContext.Provider
      value={{
        banner,
        request_result,
        fetch_banner,
        add_banner,
        update_banner,
        delete_banner,
      }}
    >
      {props.children}
    </BannerContext.Provider>
  );
};

export default BannerState;
