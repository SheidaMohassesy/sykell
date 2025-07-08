"use client";

import styles from "./UrlTable.module.scss";

type Heading = {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
};

type UrlData = {
  id: number;
  page_title: string;
  html_version: string;
  internal_links: number;
  external_links: number;
  status: string;
  login_form_found: boolean;
  broken_links: number;
  heading_count: Heading;
};

type UrlTableProps = {
  data: UrlData | null;
};

export default function UrlTable({ data }: UrlTableProps) {
  console.log("Rendering UrlTable with data:", data);
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
        {data && (
          <tr key={data.id}>
            <td>{data.page_title}</td>
            <td>{data.html_version}</td>
            <td>{data.internal_links}</td>
            <td>{data.external_links}</td>
            <td>{data.status}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
