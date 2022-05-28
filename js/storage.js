export default { saveLocaleStorage, getLocalStorage, removeLocalStorage };

function saveLocaleStorage(key, value) {
  try {
    let valueToJson = JSON.stringify(value);

    localStorage.setItem(key, valueToJson);
  } catch (error) {
    console.error(error.message);
  }
}

function getLocalStorage(key) {
  const savedData = localStorage.getItem(key);

  if (!savedData) {
    return;
  }

  try {
    return JSON.parse(savedData);
  } catch (error) {
    console.log(error.message);
  }
}

function removeLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(error.message);
  }
}
