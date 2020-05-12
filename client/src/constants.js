module.exports = {
  BASE_API_URL:
    process.env.NODE_ENV === "production"
      ? "https://production.com"
      : "",
};
