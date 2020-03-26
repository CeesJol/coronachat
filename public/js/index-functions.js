/**
 * Return true if window location parameter developer is true
 */
function isDeveloper() {
  return window.location.search.includes("developer=true");
}

function unselectAll() {
  for (var row of document.getElementById("rooms").rows) {
    row.removeAttribute('class');
  }
}