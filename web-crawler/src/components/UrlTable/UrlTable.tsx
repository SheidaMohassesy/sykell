"use client";
import styles from "./UrlTable.module.scss";

type UrlData = {
  id: number;
  title: string;
  htmlVersion: string;
  internalLinks: number;
  externalLinks: number;
  status: string;
};

export default function UrlTable({ data }: { data: UrlData[] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Title</th>
          <th>HTML Version</th>
          <th># Internal Links</th>
          <th># External Links</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((url) => (
          <tr key={url.id}>
            <td>{url.title}</td>
            <td>{url.htmlVersion}</td>
            <td>{url.internalLinks}</td>
            <td>{url.externalLinks}</td>
            <td>{url.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
