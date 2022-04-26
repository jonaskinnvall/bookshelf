function client(endpoint, customConfig = {}) {
  const fullURL = `${process.env.REACT_APP_API_URL}/${endpoint}`
  const config = {method: 'GET', ...customConfig}

  return window.fetch(fullURL, config).then(response => response.json())
}

export {client}
