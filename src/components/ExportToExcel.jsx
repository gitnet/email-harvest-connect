import React from 'react'
import * as XLSX from "xlsx"; // ⬅️ Add this to your imports

 
      // Extract emails to excel file 
  export default function exportEmailsToExcel (emails ) {
      const rows = [];

      emails.forEach((entry) => {
        entry.emails.forEach((email) => {
          rows.push({
            Email: email,
            Domain: entry.domain,
            URL: entry.url,
            "Scraped At": new Date(entry.scrapedAt).toLocaleString(),
          });
        });
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Emails");

      XLSX.writeFile(workbook, "scraped-emails.xlsx");
    }

  