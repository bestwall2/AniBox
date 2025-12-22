"use server";

let savedJSON = null; // in-memory JSON storage

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  // POST → save JSON
  if (req.method === "POST") {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        error: "JSON body is required",
      });
    }

    savedJSON = req.body;

    return res.status(200).json({
      success: true,
      message: "JSON saved successfully",
      data: savedJSON,
    });
  }

  // GET → return saved JSON
  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      data: savedJSON,
    });
  }

  return res.status(405).json({
    success: false,
    error: "Method not allowed",
  });
}
