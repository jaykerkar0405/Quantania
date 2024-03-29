import React, { useEffect } from "react";

const Error = () => {
  useEffect(() => {
    document.title = "Page Could Not Be Fount Product - Quantania Admin Panel";
  }, []);

  return (
    <div className="row justify-content-center">
      <div className="col-md-12 col-sm-12">
        <div
          className="card shadow-lg border-0 rounded-lg mt-5 mx-auto"
          style={{ width: "30rem" }}
        >
          <h3 className="card-header display-1 text-muted text-center">404</h3>

          <span className="card-subtitle mb-2 text-muted text-center">
            Page Could Not Be Found
          </span>

          <div className="card-body mx-auto">
            <a
              type="button"
              href="#/admin_panel/dashboard"
              className="btn btn-sm btn-primary text-white"
            >
              {" "}
              Back To Home{" "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
