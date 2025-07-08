"use client";
import { useState } from "react";
import styles from "./UrlForm.module.scss";

export default function UrlForm({
  onSubmit,
}: {
  onSubmit: (url: string) => void;
}) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      setUrl(url.trim());
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter a website URL"
        required
      />
      <button type="submit">Analyze</button>
    </form>
  );
}
