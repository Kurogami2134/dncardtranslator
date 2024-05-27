function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    psct: document.querySelector("#psct").checked,
    lang: document.querySelector("#lang").value,
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#psct").checked = result.psct || false;
    document.querySelector("#lang").value = result.lang || "es";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.local.get(["lang", "psct"]);
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
