const getToken = () => {
  // Try localStorage first, then sessionStorage as fallback
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export default getToken;
