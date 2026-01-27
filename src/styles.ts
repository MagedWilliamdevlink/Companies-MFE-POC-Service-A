import React from "react";

export const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    direction: "rtl",
    fontFamily: "'Cairo', 'Helvetica Neue', sans-serif",
    backgroundColor: "#f5f7fa",
    height: "100%",
    minHeight: "100%",
  },
  sidebar: {
    width: "25%",
    backgroundColor: "#ffffff",
    borderLeft: "1px solid #e8e8e8",
    padding: "32px 24px",
    flexShrink: 0,
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f7fa",
  },
  mainContent: {
    flex: 1,
    padding: "32px 48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  contentHeader: {
    textAlign: "right",
    marginBottom: "32px",
    width: "100%",
    maxWidth: "500px",
  },
  stepIndicator: {
    fontSize: "14px",
    color: "#1890ff",
    fontWeight: 500,
    margin: "0 0 8px 0",
  },
  stepTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1a1a2e",
    margin: "8px 0",
  },
  stepSubtitle: {
    fontSize: "14px",
    color: "#8c8c8c",
    margin: 0,
  },
  contentBody: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    flex: 1,
    flexDirection: "column",
  },
  // Form styles
  formContainer: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
  },
  formRow: {
    display: "flex",
    gap: "24px",
    marginBottom: "24px",
  },
  formField: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
};
