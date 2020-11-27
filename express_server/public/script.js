const search_quotes = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const link = document.createElement("a")
  link.href = `/quotes?tag=${document.getElementById("input_form").value}&background=${urlParams.get("background")}&user=${urlParams.get("user")}`
  link.click()
}

const return_to_homepage = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const link = document.getElementById("selezionami")
  link.href = `/?background=${urlParams.get("background")}&user=${urlParams.get("user")}`
  link.click()
}