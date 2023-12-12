export const saveFavoriteToLocalStorage = (id) => {
    var storageData = JSON.parse(localStorage.getItem("filmsIdArray"));
    if (storageData === null) {
        storageData = []
    }
    storageData.push(id);
    localStorage.setItem("filmsIdArray", JSON.stringify(storageData));
}

export const deleteFavoriteToLocalStorage = (id) => {
    var storageData = JSON.parse(localStorage.getItem("filmsIdArray"));
    let elementIndex = storageData.indexOf(id);
    storageData.splice(elementIndex, 1);
    localStorage.setItem("filmsIdArray", JSON.stringify(storageData));
}