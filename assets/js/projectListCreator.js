const ELEMENTLIST = (x) => `<div class="hover:bg-primary hover:text-white"><a class="block px-6 py-2 border-b-2 border-primary text-center" href=${x.link}>${x.name}</a></div>`

function makeList(json) 
{
    fetch(json).then(
        async x => {
            document.getElementById("projects-list").innerHTML = (await x.json()).sort((a, b) => b.date.localeCompare(a.date)).map(el => ELEMENTLIST(el)).join("\n")
        }
    ).catch(reason => console.log(reason))
}