import React from "react";
import { Box, Typography, TableCell, TableRow } from "@material-ui/core";
import "../../assets/css/contact.css";

const ContactTableItem = (props) => {
  //eslint-disable-next-line
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    contact_entry_data,
    resolve_contact_entry_data,
    delete_contact_entry_data,
    sr_no,
  } = props;

  return (
    <>
      <div
        className="modal fade"
        id="view_contact_message_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="view_contact_message_modal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          role="document"
          style={{ marginTop: "10rem" }}
        >
          <div className="modal-content" style={{ marginLeft: "9rem" }}>
            <div className="modal-header">
              <h5
                className="modal-title text-black font-bold"
                id="view_contact_message_modal"
              >
                Contact request message
              </h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Id
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={contact_entry_data._id}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={contact_entry_data.username}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Subject
                  </label>
                  <textarea
                    className="form-control"
                    value={contact_entry_data.subject}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    value={contact_entry_data.message}
                    rows="5"
                    readOnly
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <TableRow>
        <TableCell>
          <Typography
            color="textSecondary"
            sx={{
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            {sr_no}
          </Typography>
        </TableCell>

        <TableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                color="textSecondary"
                variant="h6"
                sx={{
                  fontWeight: "600",
                }}
              >
                {contact_entry_data._id}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Typography color="textSecondary" variant="h6">
            {contact_entry_data.username}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography color="textSecondary" variant="h6">
            <a
              href={`mailto:${contact_entry_data.email_id}`}
              style={{ textDecoration: "none" }}
            >
              {contact_entry_data.email_id}
            </a>
          </Typography>
        </TableCell>

        <TableCell>
          <Typography color="textSecondary" variant="h6">
            {contact_entry_data.subject.slice(0, 20)}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography color="textSecondary">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#view_contact_message_modal"
            >
              View message
            </button>
          </Typography>
        </TableCell>

        <TableCell>
          <i
            className="fa-solid fa-pen-to-square"
            onClick={() => {
              resolve_contact_entry_data(contact_entry_data);
              handleClose();
            }}
            style={{ cursor: "pointer", color: "blue" }}
          ></i>
          <i
            className="fa-solid fa-trash"
            style={{ marginLeft: "1rem", cursor: "pointer", color: "red" }}
            onClick={() => {
              delete_contact_entry_data(contact_entry_data);
              handleClose();
            }}
          ></i>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ContactTableItem;
