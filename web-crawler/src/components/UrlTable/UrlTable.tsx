"use client";

import useIsMobile from "@/hooks/useIsMobile";
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
  login_form_found: boolean;
  broken_links: number;
  heading_count: Heading;
};

type UrlTableProps = {
  data: UrlData | null;
};

const UrlTable = ({ data }: UrlTableProps) => {
  const isMobile = useIsMobile();

  if (!data) {
    return <p>No URL is given</p>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        {!isMobile && (
          <>
            <tr>
              <th>Title</th>
              <th>HTML Version</th>
              <th>Internal Links</th>
              <th>External Links</th>
              <th>login_form_found</th>
              <th>broken_links</th>
              <th>heading_count </th>
            </tr>
            <tr key={data.id}>
              <td>{data.page_title}</td>
              <td>{data.html_version}</td>
              <td>{data.internal_links}</td>
              <td>{data.external_links}</td>
              <td>{data.login_form_found ? "yes" : "no"}</td>
              <td>{data.broken_links}</td>
              <td className={styles.headingWrapper}>
                {Object.entries(data.heading_count).map(([key, value]) => (
                  <span
                    className={styles.headingLable}
                  >{`${key.toUpperCase()}: ${value}`}</span>
                ))}
              </td>
            </tr>
          </>
        )}
        {isMobile && (
          <>
            <tr>
              <th>Title</th>
              <td>{data.page_title}</td>
            </tr>
            <tr>
              <th>HTML Version</th>
              <td>{data.html_version}</td>
            </tr>
            <tr>
              <th>Internal Links</th> <td>{data.internal_links}</td>
            </tr>
            <tr>
              <th>External Links</th>
              <td>{data.external_links}</td>
            </tr>
            <tr>
              <th>login_form_found</th>
              <td>{data.login_form_found ? "yes" : "no"}</td>
            </tr>
            <tr>
              <th>broken_links</th>
              <td>{data.broken_links}</td>
            </tr>
            <tr>
              <th>heading_count </th>
              <td className={styles.headingWrapper}>
                {Object.entries(data.heading_count).map(([key, value]) => (
                  <span
                    className={styles.headingLable}
                  >{`${key.toUpperCase()}: ${value}`}</span>
                ))}
              </td>
            </tr>
          </>
        )}
      </table>
    </div>
  );
};

export default UrlTable;
