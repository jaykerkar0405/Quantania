import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      document.write =
        "About Us ||  Quantania - An efficient computer programs and application source code provider";
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <main class="main">
      <nav aria-label="breadcrumb" class="breadcrumb-nav border-0 mb-0">
        <div class="container">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li class="breadcrumb-item">
              <Link to="/about">About</Link>
            </li>
          </ol>
        </div>
      </nav>

      <div class="container" id="about-us">
        <div class="page-header page-header-big text-center">
          <h1 class="page-title text-white">
            About us<span class="text-white">Know who we are</span>
          </h1>
        </div>
      </div>

      <div class="page-content pb-0">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 mb-3 mb-lg-0">
              <h2 class="title">Our Vision</h2>
              <p style={{ color: "gray" }}>
                Our vision is to be earth's most customer centric company; to
                build a place where people can come to find and discover
                anything they might want to buy online.{" "}
              </p>
            </div>

            <div class="col-lg-6">
              <h2 class="title">Our Mission</h2>
              <p style={{ color: "gray" }}>
                To offer a wide range of well-designed, functional programs at
                prices so low that as many people as possible will be able to
                afford them.{" "}
              </p>
            </div>
          </div>

          <div class="mb-5"></div>
        </div>

        <div class="container">
          <hr class="mt-4 mb-6" />
          <h2 class="title text-center mb-4">Meet Our Team</h2>
          <div class="row">
            <div class="col-md-4">
              <div class="member member-anim text-center">
                <figure class="member-media">
                  <img src="/about_us.jpg" alt="member_photo" />

                  <figcaption class="member-overlay">
                    <div class="member-overlay-content">
                      <h3 class="member-title">
                        Jay Kerkar<span>Founder & Sole Developer</span>
                      </h3>
                      <p>
                        A fullstack web & app developer, high level experience
                        and knowledge, producing quality work.
                      </p>
                      <div class="social-icons social-icons-simple">
                        <a
                          href="https://www.facebook.com/"
                          class="social-icon"
                          title="Facebook"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <i
                            class="icon-facebook-f"
                            style={{ color: "black" }}
                          ></i>
                        </a>
                        <a
                          href="https://twitter.com/"
                          class="social-icon"
                          title="Twitter"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <i
                            class="icon-twitter"
                            style={{ color: "black" }}
                          ></i>
                        </a>
                        <a
                          href="https://www.instagram.com/"
                          class="social-icon"
                          title="Instagram"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <i
                            class="icon-instagram"
                            style={{ color: "black" }}
                          ></i>
                        </a>
                        <a
                          href="https://github.com/Jay-Kerkar/"
                          class="social-icon"
                          title="GitHub"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <i class="icon-github" style={{ color: "black" }}></i>
                        </a>
                        <a
                          href="https://www.snackspace.ml/"
                          class="social-icon"
                          title="GitHub"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <i
                            class="icon-arrow-up"
                            style={{ color: "black" }}
                          ></i>
                        </a>
                      </div>
                    </div>
                  </figcaption>
                </figure>
                <div class="member-content">
                  <h3 class="member-title">
                    <text style={{ color: "hsl(250,69%,61%)" }}>
                      Jay Kerkar
                    </text>
                    <span>Founder & Sole Developer</span>
                  </h3>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="member member-anim text-center">
                <figure class="member-media">
                  <img
                    src="https://avatars.githubusercontent.com/u/70322184?v=4"
                    alt="member_photo"
                  />
                  <figcaption class="member-overlay">
                    <div class="member-overlay-content">
                      <h3 class="member-title">
                        Pranay Bhoir
                        <span>Ex Team Member & Bussiness Developer</span>
                      </h3>
                      <p>
                        A proffessional Python developer and Machine Learning
                        Expert.
                      </p>
                      <div class="social-icons social-icons-simple">
                        <a
                          href="https://www.facebook.com/"
                          class="social-icon"
                          title="Facebook"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i
                            class="icon-facebook-f"
                            style={{ color: "black" }}
                          ></i>
                        </a>
                        <a
                          href="https://twitter.com/"
                          class="social-icon"
                          title="Twitter"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <i
                            class="icon-twitter"
                            style={{ color: "black" }}
                          ></i>
                        </a>
                        <a
                          href="https://www.instagram.com/"
                          class="social-icon"
                          rel="noopener noreferrer"
                          title="Instagram"
                          target="_blank"
                        >
                          <i
                            class="icon-instagram"
                            style={{ color: "black" }}
                          ></i>
                        </a>
                        <a
                          href="https://github.com/pranayb1256/"
                          class="social-icon"
                          title="GitHub"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <i class="icon-github" style={{ color: "black" }}></i>
                        </a>
                      </div>
                    </div>
                  </figcaption>
                </figure>
                <div class="member-content">
                  <h3 class="member-title">
                    <text style={{ color: "hsl(250,69%,61%)" }}>
                      Pranay Bhoir
                    </text>
                    <span>Ex Team Member & Bussiness Developer</span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-2"></div>
      </div>
    </main>
  );
};

export default About;
