const LANGDIV = (lang, perc) => 
`<div>
    <div class="flex items-end justify-between">
    <h4 class="font-body font-semibold uppercase text-black">
        ${lang}
    </h4>
    <h3 class="font-body text-3xl font-bold text-primary">${perc}%</h3>
    </div>
    <div class="mt-2 h-3 w-full rounded-full bg-lila">
    <div class="h-3 rounded-full bg-primary" style="width: ${perc}%"></div>
    </div>
</div>`

const SIMILIA = {"Jupyter Notebook": "Python"}

async function getAllRepos() {
    let repos = await fetch("https://api.github.com/users/DarthReca/repos")
    if(repos.ok)
        return (await repos.json()).map(x => x.name) 
    else 
        return [];
}

async function getLanguage(repo) {
    let repos = await fetch(`https://api.github.com/repos/DarthReca/${repo}/languages`)
    if(repos.ok)
        return await repos.json()
    else 
        return [];
}

async function getAllLanguages() {
    repos = await getAllRepos()
    repos = Promise.all(repos.map(async x => await getLanguage(x)))
    return repos
}

function mergeRecords(records) 
{
    let dict = {};
    const getValueOrDefault = (x) => dict.hasOwnProperty(x[0]) ? dict[x[0]] : 0;
    records.forEach(rec => Object.entries(rec).forEach(el => dict[el[0]] = getValueOrDefault(el) + el[1]));
    return dict;
}

function mergeSimilia(languageDict) 
{
    for(k in SIMILIA) 
    {
        if(!languageDict.hasOwnProperty(k) || !languageDict.hasOwnProperty(SIMILIA[k]))
            continue
        languageDict[SIMILIA[k]] += languageDict[k]
        delete languageDict[k]
    }
    return languageDict
}

async function getPercentages(top = 4) 
{
    let languagesDict = mergeSimilia(mergeRecords(await getAllLanguages()))
    let sum = Object.values(languagesDict).reduce((total, current) => total + current, 0)
    return Object.entries(languagesDict).map((v, _) => [v[0], v[1] / sum]).sort((a, b) => b[1] - a[1]).slice(0, top)
}


