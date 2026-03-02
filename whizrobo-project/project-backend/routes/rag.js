const express = require("express");

const router = express.Router();

const resolveAnswerText = (payload) => {
  if (!payload || typeof payload !== "object") return "";
  return (
    payload?.data?.answer ||
    payload.answer ||
    payload.response ||
    payload.result ||
    payload.message ||
    ""
  );
};

const parseDataUrlImage = (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) return null;
  const mimeType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  return { mimeType, buffer };
};

const getFileExtension = (mimeType = "") => {
  const map = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/bmp": "bmp",
  };
  return map[mimeType.toLowerCase()] || "png";
};

const buildFlaskUrl = () => {
  const configuredUrl = (process.env.RAG_FLASK_URL || "").trim();
  const configuredBaseUrl = process.env.RAG_FLASK_BASE_URL || "http://127.0.0.1:5000";
  const configuredEndpoint = process.env.RAG_FLASK_ENDPOINT || "/api/query";
  const queryUrl = configuredUrl
    || `${configuredBaseUrl.replace(/\/$/, "")}/${configuredEndpoint.replace(/^\//, "")}`;
  const baseUrl = new URL(queryUrl).origin;
  const imageQueryUrl =
    (process.env.RAG_FLASK_IMAGE_URL || "").trim() || `${baseUrl}/api/image-query`;
  const ocrUrl =
    (process.env.RAG_FLASK_OCR_URL || "").trim() || `${baseUrl}/api/ocr`;
  const robotQueryUrl =
    (process.env.RAG_FLASK_ROBOT_URL || "").trim() || `${baseUrl}/api/robot-query`;

  return { queryUrl, imageQueryUrl, ocrUrl, robotQueryUrl };
};

const dataUrlToUpload = (image, imageType, imageName) => {
  const parsed = parseDataUrlImage(image);
  if (!parsed) return null;
  const ext = getFileExtension(parsed.mimeType || imageType);
  return {
    mimeType: parsed.mimeType,
    blob: new Blob([parsed.buffer], { type: parsed.mimeType }),
    uploadName: imageName || `uploaded-image.${ext}`,
  };
};

router.post("/ocr", async (req, res) => {
  const { image = "", imageName = "", imageType = "" } = req.body || {};
  if (!image) return res.status(400).json({ msg: "Image is required." });

  const upload = dataUrlToUpload(image, imageType, imageName);
  if (!upload) return res.status(400).json({ msg: "Invalid image payload." });

  const { ocrUrl } = buildFlaskUrl();
  const form = new FormData();
  form.append("image", upload.blob, upload.uploadName);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const flaskRes = await fetch(ocrUrl, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });

    const data = await flaskRes.json().catch(() => ({}));
    if (!flaskRes.ok) {
      return res.status(flaskRes.status).json({
        msg: data.msg || data.error || "Flask OCR request failed.",
        source: ocrUrl,
      });
    }

    const extractedText = data?.data?.extracted_text || data?.extracted_text || "";
    return res.json({ extractedText, raw: data, source: ocrUrl });
  } catch (error) {
    const isTimeout = error.name === "AbortError";
    return res.status(isTimeout ? 504 : 502).json({
      msg: isTimeout ? "OCR request timed out." : "Unable to connect to Flask OCR service.",
      details: error.message,
      source: ocrUrl,
    });
  } finally {
    clearTimeout(timeout);
  }
});

router.post("/tts", async (req, res) => {
  const { text = "" } = req.body || {};
  const cleanText = String(text || "").trim();
  if (!cleanText) return res.status(400).json({ msg: "Text is required." });

  const { queryUrl } = buildFlaskUrl();
  const baseUrl = new URL(queryUrl).origin;
  const ttsUrl =
    (process.env.RAG_FLASK_TTS_URL || "").trim() || `${baseUrl}/api/tts`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const flaskRes = await fetch(ttsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: cleanText }),
      signal: controller.signal,
    });

    if (!flaskRes.ok) {
      const errData = await flaskRes.json().catch(() => ({}));
      return res.status(flaskRes.status).json({
        msg: errData.msg || errData.error || "Flask TTS request failed.",
        source: ttsUrl,
      });
    }

    const audioBuffer = Buffer.from(await flaskRes.arrayBuffer());
    res.setHeader("Content-Type", flaskRes.headers.get("content-type") || "audio/mpeg");
    return res.send(audioBuffer);
  } catch (error) {
    const isTimeout = error.name === "AbortError";
    return res.status(isTimeout ? 504 : 502).json({
      msg: isTimeout ? "TTS request timed out." : "Unable to connect to Flask TTS service.",
      details: error.message,
      source: ttsUrl,
    });
  } finally {
    clearTimeout(timeout);
  }
});

router.post("/ask", async (req, res) => {
  const { query, kitContext, history = [], image = "", imageName = "", imageType = "" } = req.body || {};

  if (!query || typeof query !== "string") {
    return res.status(400).json({ msg: "Query is required." });
  }

  const { queryUrl: targetUrl, imageQueryUrl } = buildFlaskUrl();

  const payload = {
    query,
    question: query,
    top_k: 5,
    context: kitContext || "",
    history,
    image,
    image_name: imageName,
    image_type: imageType,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), image ? 60000 : 20000);

  try {
    let flaskRes;
    let usedUrl = targetUrl;
    if (image) {
      const upload = dataUrlToUpload(image, imageType, imageName);
      if (!upload) {
        return res.status(400).json({ msg: "Invalid image payload." });
      }
      usedUrl = imageQueryUrl;

      const form = new FormData();
      form.append("query", query);
      form.append("top_k", "5");
      form.append("image", upload.blob, upload.uploadName);

      flaskRes = await fetch(imageQueryUrl, {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
    } else {
      flaskRes = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    }

    const data = await flaskRes.json().catch(() => ({}));
    const answer = resolveAnswerText(data);

    if (!flaskRes.ok) {
      return res.status(flaskRes.status).json({
        msg: data.msg || data.error || "Flask RAG request failed.",
        source: targetUrl,
      });
    }

    return res.json({
      answer: answer || "No answer returned from RAG service.",
      raw: data,
      source: usedUrl,
    });
  } catch (error) {
    const isTimeout = error.name === "AbortError";
    return res.status(isTimeout ? 504 : 502).json({
      msg: isTimeout
        ? "RAG request timed out."
        : "Unable to connect to Flask RAG service.",
      details: error.message,
      source: targetUrl,
    });
  } finally {
    clearTimeout(timeout);
  }
});

router.post("/ask-robot", async (req, res) => {
  const { query, history = [] } = req.body || {};
  if (!query || typeof query !== "string") {
    return res.status(400).json({ msg: "Query is required." });
  }

  const { robotQueryUrl } = buildFlaskUrl();
  const payload = {
    query,
    question: query,
    top_k: 5,
    history,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const flaskRes = await fetch(robotQueryUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await flaskRes.json().catch(() => ({}));
    const answer = resolveAnswerText(data);

    if (!flaskRes.ok) {
      return res.status(flaskRes.status).json({
        msg: data.msg || data.error || "Flask robot RAG request failed.",
        source: robotQueryUrl,
      });
    }

    return res.json({
      answer: answer || "No answer returned from robot RAG service.",
      raw: data,
      source: robotQueryUrl,
    });
  } catch (error) {
    const isTimeout = error.name === "AbortError";
    return res.status(isTimeout ? 504 : 502).json({
      msg: isTimeout
        ? "Robot RAG request timed out."
        : "Unable to connect to Flask robot RAG service.",
      details: error.message,
      source: robotQueryUrl,
    });
  } finally {
    clearTimeout(timeout);
  }
});

module.exports = router;
