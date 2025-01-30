export const handleRequest = async (req: Request) => {
  const contentType = req.headers.get("Content-Type");

  if (contentType?.includes("application/json")) {
    const body = await req.json();
    return { type: "json", body };
  }

  if (contentType?.includes("multipart/form-data")) {
    const body = await req.formData();
    return { type: "formData", body };
  }

  return { type: "unsupported", body: null };
};
