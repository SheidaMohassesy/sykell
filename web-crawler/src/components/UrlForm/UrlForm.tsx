import React, { useState } from "react";
import styles from "./UrlForm.module.scss";

const UrlForm = ({ onSubmit }: { onSubmit: (url: string) => void }) => {
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
};

export default UrlForm;
