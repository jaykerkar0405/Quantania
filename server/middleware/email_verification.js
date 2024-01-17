const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const email_verification = async (
  username,
  email_id,
  authentication_token,
  type
) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      secureConnection: false,
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: process.env.SMTP_EMAIL_ADDRESS,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(success);
        }
      });
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL_ADDRESS,
      to: email_id,
      subject: `Verification of email address - ${
        type == "administrator" ? "Quantania || Admin Panel" : "Quantania"
      }`,
      html: `<!DOCTYPE html>
      <html
        data-editor-version="2"
        className="sg-campaigns"
        xmlns="http://www.w3.org/1999/xhtml"
      >
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
          />
          <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
          <style type="text/css">
            body,
            p,
            div {
              font-family: inherit;
              font-size: 14px;
            }
            body {
              color: #000000;
            }
            body a {
              color: #1188e6;
              text-decoration: none;
            }
            p {
              margin: 0;
              padding: 0;
            }
            table.wrapper {
              width: 100% !important;
              table-layout: fixed;
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: 100%;
              -moz-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
            img.max-width {
              max-width: 100% !important;
            }
            .column.of-2 {
              width: 50%;
            }
            .column.of-3 {
              width: 33.333%;
            }
            .column.of-4 {
              width: 25%;
            }
            @media screen and (max-width: 480px) {
              .preheader .rightColumnContent,
              .footer .rightColumnContent {
                text-align: left !important;
              }
              .preheader .rightColumnContent div,
              .preheader .rightColumnContent span,
              .footer .rightColumnContent div,
              .footer .rightColumnContent span {
                text-align: left !important;
              }
              .preheader .rightColumnContent,
              .preheader .leftColumnContent {
                font-size: 80% !important;
                padding: 5px 0;
              }
              table.wrapper-mobile {
                width: 100% !important;
                table-layout: fixed;
              }
              img.max-width {
                height: auto !important;
                max-width: 100% !important;
              }
              a.bulletproof-button {
                display: block !important;
                width: auto !important;
                font-size: 80%;
                padding-left: 0 !important;
                padding-right: 0 !important;
              }
              .columns {
                width: 100% !important;
              }
              .column {
                display: block !important;
                width: 100% !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
              }
            }
          </style>
          <link
            href="https://fonts.googleapis.com/css?family=Muli&display=swap"
            rel="stylesheet"
          />
          <style>
            body {
              font-family: "Muli", sans-serif;
            }
          </style>
        </head>
        <body>
          <center
            className="wrapper"
            data-link-color="#1188E6"
            data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;"
          >
            <div className="webkit">
              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
                className="wrapper"
                bgcolor="#FFFFFF"
              >
                <tbody>
                  <tr>
                    <td valign="top" bgcolor="#FFFFFF" width="100%">
                      <table
                        width="100%"
                        role="content-container"
                        className="outer"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                      >
                        <tbody>
                          <tr>
                            <td width="100%">
                              <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                              >
                                <tbody>
                                  <tr>
                                    <td>
                                      <table
                                        width="100%"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        style="width: 100%; max-width: 600px"
                                        align="center"
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              role="modules-container"
                                              style="
                                                padding: 0px 0px 0px 0px;
                                                color: #000000;
                                                text-align: left;
                                              "
                                              bgcolor="#FFFFFF"
                                              width="100%"
                                              align="left"
                                            >
                                              <table
                                                className="module preheader preheader-hide"
                                                role="module"
                                                data-type="preheader"
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                width="100%"
                                                style="
                                                  display: none !important;
                                                  visibility: hidden;
                                                  opacity: 0;
                                                  color: transparent;
                                                  height: 0;
                                                  width: 0;
                                                "
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td role="module-content">
                                                      <p></p>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <table
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                align="center"
                                                width="100%"
                                                role="module"
                                                data-type="columns"
                                                style="padding: 30px 20px 30px 20px"
                                                bgcolor="#f6f6f6"
                                              >
                                                <tbody>
                                                  <tr role="module-content">
                                                    <td height="100%" valign="top">
                                                      <table
                                                        className="column"
                                                        width="540"
                                                        style="
                                                          width: 540px;
                                                          border-spacing: 0;
                                                          border-collapse: collapse;
                                                          margin: 0px 10px 0px 10px;
                                                        "
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        align="left"
                                                        border="0"
                                                        bgcolor=""
                                                      >
                                                        <tbody>
                                                          <tr>
                                                            <td
                                                              style="
                                                                padding: 0px;
                                                                margin: 0px;
                                                                border-spacing: 0;
                                                              "
                                                            >
                                                              <table
                                                                className="wrapper"
                                                                role="module"
                                                                data-type="image"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                style="
                                                                  table-layout: fixed;
                                                                "
                                                                data-muid="72aac1ba-9036-4a77-b9d5-9a60d9b05cba"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      style="
                                                                        font-size: 6px;
                                                                        line-height: 10px;
                                                                        padding: 0px
                                                                          0px 0px 0px;
                                                                      "
                                                                      valign="top"
                                                                      align="center"
                                                                    >
                                                                      <img
                                                                        className="max-width"
                                                                        border="0"
                                                                        style="
                                                                          display: block;
                                                                          color: #000000;
                                                                          text-decoration: none;
                                                                          font-family: Helvetica,
                                                                            arial,
                                                                            sans-serif;
                                                                          font-size: 16px;
                                                                          height: 5rem;
                                                                          width: 5rem;
                                                                        "
                                                                        width="29"
                                                                        alt=""
                                                                        data-proportionally-constrained="true"
                                                                        data-responsive="false"
                                                                        src="https://bl3302files.storage.live.com/y4mToGADG3rdSGaZWjQGnbzDcp9awyLJYDD8j0g0x1snRQAp4HP2QSzGZr3yoGH0y0rcijm-CeV4XPzRgoemX3PNnEGYNpiFZNmKauWBcZbZaCre3DkiMUunxXHFOpafLYX2yhagBQo-Ll0nH274JDTLKmzKiU1MQNvaKGW967wc-WgX5vUPKWQj5-e1hlH4oDY?width=499&height=499&cropmode=none"
                                                                        height="27"
                                                                      />
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table
                                                                className="module"
                                                                role="module"
                                                                data-type="spacer"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                style="
                                                                  table-layout: fixed;
                                                                "
                                                                data-muid="331cde94-eb45-45dc-8852-b7dbeb9101d7"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      style="
                                                                        padding: 0px
                                                                          0px 20px 0px;
                                                                      "
                                                                      role="module-content"
                                                                      bgcolor=""
                                                                    ></td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table
                                                                className="wrapper"
                                                                role="module"
                                                                data-type="image"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                style="
                                                                  table-layout: fixed;
                                                                "
                                                                data-muid="d8508015-a2cb-488c-9877-d46adf313282"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      style="
                                                                        font-size: 6px;
                                                                        line-height: 10px;
                                                                        padding: 0px
                                                                          0px 0px 0px;
                                                                      "
                                                                      valign="top"
                                                                      align="center"
                                                                    >
                                                                     <h1 style="font-size:2rem;">Quantania</h1>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table
                                                                className="module"
                                                                role="module"
                                                                data-type="spacer"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                style="
                                                                  table-layout: fixed;
                                                                "
                                                                data-muid="27716fe9-ee64-4a64-94f9-a4f28bc172a0"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      style="
                                                                        padding: 0px
                                                                          0px 30px 0px;
                                                                      "
                                                                      role="module-content"
                                                                      bgcolor=""
                                                                    ></td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table
                                                                className="module"
                                                                role="module"
                                                                data-type="text"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                style="
                                                                  table-layout: fixed;
                                                                "
                                                                data-muid="948e3f3f-5214-4721-a90e-625a47b1c957"
                                                                data-mc-module-version="2019-10-22"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      style="
                                                                        padding: 50px
                                                                          30px 18px
                                                                          30px;
                                                                        line-height: 36px;
                                                                        text-align: inherit;
                                                                        background-color: #ffffff;
                                                                      "
                                                                      height="100%"
                                                                      valign="top"
                                                                      bgcolor="#ffffff"
                                                                      role="module-content"
                                                                    >
                                                                      <div>
                                                                        <div
                                                                          style="
                                                                            font-family: inherit;
                                                                            text-align: center;
                                                                          "
                                                                        >
                                                                          <span
                                                                            style="
                                                                              font-size: 43px;
                                                                            "
                                                                            >Thanks
                                                                            for
                                                                            signing
                                                                            up,
                                                                            ${username} !&nbsp;</span
                                                                          >
                                                                        </div>
                                                                        <div></div>
                                                                      </div>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table
                                                                className="module"
                                                                role="module"
                                                                data-type="text"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                style="
                                                                  table-layout: fixed;
                                                                "
                                                                data-muid="a10dcb57-ad22-4f4d-b765-1d427dfddb4e"
                                                                data-mc-module-version="2019-10-22"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      style="
                                                                        padding: 18px
                                                                          30px 18px
                                                                          30px;
                                                                        line-height: 22px;
                                                                        text-align: inherit;
                                                                        background-color: #ffffff;
                                                                      "
                                                                      height="100%"
                                                                      valign="top"
                                                                      bgcolor="#ffffff"
                                                                      role="module-content"
                                                                    >
                                                                      <div>
                                                                        <div
                                                                          style="
                                                                            font-family: inherit;
                                                                            text-align: center;
                                                                          "
                                                                        >
                                                                          <span
                                                                            style="
                                                                              font-size: 18px;
                                                                            "
                                                                            >Please
                                                                            verify
                                                                            your email
                                                                            address
                                                                            to</span
                                                                          ><span
                                                                            style="
                                                                              color: #000000;
                                                                              font-size: 18px;
                                                                              font-family: arial,
                                                                                helvetica,
                                                                                sans-serif;
                                                                            "
                                                                          >
                                                                          get access
                                                                          to the
                                                                          website and
                                                                          avail
                                                                          various
                                                                          services
                                                                          of our
                                                                          company
                                                                          </span
                                                                          ><span
                                                                            style="
                                                                              font-size: 18px;
                                                                            "
                                                                            >.</span
                                                                          >
                                                                        </div>
                                                                        <div
                                                                          style="
                                                                            font-family: inherit;
                                                                            text-align: center;
                                                                          "
                                                                        >
                                                                          <span
                                                                            style="
                                                                              color: #ffbe00;
                                                                              font-size: 18px;
                                                                            "
                                                                            ><strong
                                                                              >Thank
                                                                              you!&nbsp;</strong
                                                                            ></span
                                                                          >
                                                                        </div>
                                                                        <div></div>
                                                                      </div>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table
                                                                className="module"
                                                                role="module"
                                                                data-type="spacer"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                style="
                                                                  table-layout: fixed;
                                                                "
                                                                data-muid="7770fdab-634a-4f62-a277-1c66b2646d8d"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      style="
                                                                        padding: 0px
                                                                          0px 20px 0px;
                                                                      "
                                                                      role="module-content"
                                                                      bgcolor="#ffffff"
                                                                    ></td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                className="module"
                                                                data-role="module-button"
                                                                data-type="button"
                                                                role="module"
                                                                style="
                                                                  table-layout: fixed;
                                                                "
                                                                width="100%"
                                                                data-muid="d050540f-4672-4f31-80d9-b395dc08abe1"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      align="center"
                                                                      bgcolor="#ffffff"
                                                                      className="outer-td"
                                                                      style="
                                                                        padding: 0px
                                                                          0px 0px 0px;
                                                                      "
                                                                    >
                                                                      <table
                                                                        border="0"
                                                                        cellpadding="0"
                                                                        cellspacing="0"
                                                                        className="wrapper-mobile"
                                                                        style="
                                                                          text-align: center;
                                                                        "
                                                                      >
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              align="center"
                                                                              bgcolor="#ffbe00"
                                                                              className="inner-td"
                                                                              style="
                                                                                border-radius: 6px;
                                                                                font-size: 16px;
                                                                                text-align: center;
                                                                                background-color: inherit;
                                                                              "
                                                                            >
                                                                              <a
                                                                                href=${
                                                                                  type ==
                                                                                  "administrator"
                                                                                    ? `${process.env.ADMIN_PANEL_URL}/#/admin_panel/email_verification?administrator_authentication_token=${authentication_token}`
                                                                                    : `${process.env.CLIENT_SIDE_URL}/authentication/email_verification?customer_authentication_token=${authentication_token}`
                                                                                }
                                                                                style="
                                                                                  background-color: #ffbe00;
                                                                                  border: 1px
                                                                                    solid
                                                                                    #ffbe00;
                                                                                  border-color: #ffbe00;
                                                                                  border-radius: 0px;
                                                                                  border-width: 1px;
                                                                                  color: #000000;
                                                                                  display: inline-block;
                                                                                  font-size: 14px;
                                                                                  font-weight: normal;
                                                                                  letter-spacing: 0px;
                                                                                  line-height: normal;
                                                                                  padding: 12px
                                                                                    40px
                                                                                    12px
                                                                                    40px;
                                                                                  text-align: center;
                                                                                  text-decoration: none;
                                                                                  border-style: solid;
                                                                                  font-family: inherit;
                                                                                "
                                                                                target="_blank"
                                                                                >Verify
                                                                                Email
                                                                                Now</a
                                                                              >
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table
                                                                className="module"
                                                                role="module"
                                                                data-type="spacer"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                style="
                                                                  table-layout: fixed;
                                                                "
                                                                data-muid="7770fdab-634a-4f62-a277-1c66b2646d8d.1"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      style="
                                                                        padding: 0px
                                                                          0px 50px 0px;
                                                                      "
                                                                      role="module-content"
                                                                      bgcolor="#ffffff"
                                                                    ></td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table
                                                                className="module"
                                                                role="module"
                                                                data-type="spacer"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                style="
                                                                  table-layout: fixed;
                                                                "
                                                                data-muid="c37cc5b7-79f4-4ac8-b825-9645974c984e"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      style="
                                                                        padding: 0px
                                                                          0px 30px 0px;
                                                                      "
                                                                      role="module-content"
                                                                      bgcolor="6E6E6E"
                                                                    ></td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <table
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                className="module"
                                                data-role="module-button"
                                                data-type="button"
                                                role="module"
                                                style="table-layout: fixed"
                                                width="100%"
                                                data-muid="550f60a9-c478-496c-b705-077cf7b1ba9a"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      align="center"
                                                      bgcolor=""
                                                      className="outer-td"
                                                      style="
                                                        padding: 0px 0px 20px 0px;
                                                      "
                                                    >
                                                      <table
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        className="wrapper-mobile"
                                                        style="text-align: center"
                                                      >
                                                        <tbody>
                                                          <tr>
                                                            <td
                                                              align="center"
                                                              bgcolor="#f5f8fd"
                                                              className="inner-td"
                                                              style="
                                                                border-radius: 6px;
                                                                font-size: 16px;
                                                                text-align: center;
                                                                background-color: inherit;
                                                              "
                                                            >
                                                              <a
                                                                href=${
                                                                  process.env
                                                                    .ADMIN_PANEL_URL
                                                                }/#/admin_panel/dashboard
                                                                style="
                                                                  background-color: #f5f8fd;
                                                                  border: 1px solid
                                                                    #f5f8fd;
                                                                  border-color: #f5f8fd;
                                                                  border-radius: 25px;
                                                                  border-width: 1px;
                                                                  color: #a8b9d5;
                                                                  display: inline-block;
                                                                  font-size: 10px;
                                                                  font-weight: normal;
                                                                  letter-spacing: 0px;
                                                                  line-height: normal;
                                                                  padding: 5px 18px
                                                                    5px 18px;
                                                                  text-align: center;
                                                                  text-decoration: none;
                                                                  border-style: solid;
                                                                  font-family: helvetica,
                                                                    sans-serif;
                                                                "
                                                                target="_blank"
                                                                >♥ POWERED BY QUANTANIA & TEAM</a
                                                              >
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </center>
        </body>
      </html>`,
    };

    const result = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });

    if (result.accepted[0].length != 0) {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = email_verification;
