const ELEMENTLIST = (x) => `<div class="hover:bg-primary hover:text-white"><a class="block px-6 py-2 border-b-2 border-primary text-center" href=${x.link} target="_blank">${x.name}</a></div>`

function makeList(json) {
    fetch(json).then(
        async x => {
            document.getElementById("projects-list").innerHTML = (await x.json()).sort((a, b) => b.date.localeCompare(a.date)).map(el => ELEMENTLIST(el)).join("\n")
        }
    ).catch(reason => console.log(reason))
}

function getSemScholarList() {
    fetch("https://api.semanticscholar.org/graph/v1/author/2205886540/papers?fields=title,url,year,publicationDate").then(x => x.json()).then(
        async response => {
            let data = response["data"].map(x => ({ name: x["title"], link: x["url"], date: x["publicationDate"] ?? `${x["year"]}-01-01` }))
            document.getElementById("projects-list").innerHTML = data.sort((a, b) => b.date.localeCompare(a.date)).map(el => ELEMENTLIST(el)).join("\n")
        }
    ).catch(reason => console.log(reason))
}