import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 12, fontWeight: "bold" },
  body: { lineHeight: 1.5 },
});

export async function generateResumePdf(title: string, content: string) {
  const lines = content.split("\n");
  const doc = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(Text, { style: styles.title }, title),
      React.createElement(
        View,
        null,
        ...lines.map((line, i) =>
          React.createElement(Text, { key: i, style: styles.body }, line || " ")
        )
      )
    )
  );
  return renderToBuffer(doc);
}
