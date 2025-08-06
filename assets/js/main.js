function main() {
  getPercentages()
    .then((langs) => {
      document.getElementById("languages").innerHTML = langs
        .map((x) => LANGDIV(x[0], (x[1] * 100).toFixed(0)))
        .join("\n");
    })
    .catch((r) => console.log(r));

  showMap();
  fetchData("models", "models-list", "models-loader");
  fetchData("datasets", "datasets-list", "datasets-loader");
}
