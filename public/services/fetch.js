const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(endpoint, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }
  return response.json();
};

window.apiFetch = apiFetch;
