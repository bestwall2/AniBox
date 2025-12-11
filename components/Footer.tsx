import Image from "next/image";
import logo from "../app/images/logo.png";

export default function Footer() {
  return (
    <div id="footer" className="pl-5 pr-5">
      <div id="footer-left">
        <div
          style={{
            display: "flex",
            fontSize: "1.1rem",
            fontWeight: "bold",
            gap: "4px",
          }}
        >
          <p>Welcome to</p>
          <div id="footer-logo">
            <Image
              src={logo}
              alt="Logo"
              width={90}
              height={25}
            />
          </div>
        </div>
        <div style={{ fontSize: "0.875rem" }}>
          <p>
            This site does not store any files on our server, we only link to
            the media which is hosted on 3rd party services.
          </p>
        </div>
        <div style={{ fontSize: "0.875rem" }}>Copyright © AniBox 2024</div>
      </div>
      <div id="footer-right">
        <a
          target="_blank"
          href="https://github.com/bestwall2"
          rel="noopener noreferrer"
        >
          <i
            className="fa-brands fa-github"
            style={{ color: "#ffffff" }}
            id="github"
            title="Github Icon"
          ></i>
        </a>
      </div>
    </div>
  );
}
