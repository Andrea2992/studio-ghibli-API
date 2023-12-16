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

export const highlightSearchedText = (text) => {
    var nodeToChange = document.querySelectorAll('#filmTab [data-searchable]');
    nodeToChange.forEach((node) => {
        node.innerHTML = node.innerHTML.replaceAll('<mark>', '');
        node.innerHTML = node.innerHTML.replaceAll('</mark>', '');
        const currentText = node.innerHTML;
        const regex = new RegExp(text, "gi");
        const newText = currentText.replaceAll(regex, '<mark>$&</mark>');
        node.innerHTML = newText;
    })
}