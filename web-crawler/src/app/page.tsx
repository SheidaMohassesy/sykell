"use client";

import Image from "next/image";
import styles from "./page.module.css";
import UrlForm from "@/components/UrlForm/UrlForm";
import UrlTable from "@/components/UrlTable/UrlTable";

import { useState } from "react";

export default function Page() {
  const [urls, setUrls] = useState([
    {
      id: 1,
      title: "Example Site",
      htmlVersion: "HTML5",
      internalLinks: 10,
      externalLinks: 3,
      status: "done",
    },
  ]);

  const handleAddUrl = (url: string) => {
    // later: send to backend
    console.log("Submitted URL:", url);
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Web Crawler Dashboard</h1>
      <UrlForm onSubmit={handleAddUrl} />
      <UrlTable data={urls} />
    </main>
  );
}
