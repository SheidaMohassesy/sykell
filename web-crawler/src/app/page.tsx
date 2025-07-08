"use client";

import Image from "next/image";
import styles from "./page.module.css";
import UrlForm from "@/components/UrlForm/UrlForm";
import UrlTable from "@/components/UrlTable/UrlTable";

import { useState } from "react";

export default function Page() {
  const [result, setResult] = useState(null);

  const [error, setError] = useState<string | null>(null);

  const handleAddUrl = (url: string) => {
    // later: send to backend
    console.log("Submitted URL:", url);
    if (url.trim() === "") {
      setError("URL cannot be empty");
      return;
    }

    fetchData(url);
  };

  const fetchData = async (url: string) => {
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8080/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Web Crawler Dashboard</h1>
      <UrlForm onSubmit={handleAddUrl} />
      <UrlTable data={result} />
    </main>
  );
}
