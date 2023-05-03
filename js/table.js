window.onload = function() {
    const today = new Date();
    const typeNames = ["Cute", "Cool", "Passion"];
    const idolProfiles = window.profiles;
    const idolEpisodes = window.episodes;
    
    const idolList = [];
    idolProfiles.forEach((profile)=>{
        const idolProfile = getEpisodeSummaryById(profile.id, profile.type, profile.name, idolEpisodes, today);
        idolList.push(idolProfile);
    });

    const maxSSRs = idolList.reduce((a, b)=>a.numberofepisodes>b.numberofepisodes?a:b);
    const minSSRs = idolList.reduce((a, b)=>a.numberofepisodes<b.numberofepisodes?a:b);
    const divRow = document.querySelector("#tables");
    const divColId = "#colssr";
    const baseCol = document.querySelector(divColId);
    const sortedIdols = idolList.sort((a, b)=>a.waitingDays<b.waitingDays?1:-1);
    for(let i=maxSSRs.numberofepisodes; i>minSSRs.numberofepisodes; i--) {
        const idolsByNumbers = sortedIdols.filter(idol=>idol.numberofepisodes==i);
        createIdolListByNumbers(idolsByNumbers, divRow, baseCol, divColId, i);
    }
    baseCol.remove();
    
    typeNames.forEach(typeName=>{
        const id = "#check" + typeName;
        const shortName = typeName.substring(0, 2);
        const box = document.querySelector(id);
        box.addEventListener('change', () => {
            const rows = document.querySelectorAll('.' + shortName);
            rows.forEach(row=>row.style.display = box.checked ? "table-row" : "none");
        });
    });
};

/**
 * SSR枚数別表の作成
 */
function createIdolListByNumbers(idols, divRow, divCol, divColId, numberofssr)
{
    const newCol = divCol.cloneNode(true);
    newCol.id = `${divColId}${numberofssr}`;
    const tbody = newCol.getElementsByTagName("tbody")[0];
    const caption = newCol.getElementsByTagName("caption")[0];
    caption.appendChild(document.createTextNode(`SSR:${numberofssr}枚`));

    idols.forEach((idol)=>{
        const anchor = document.createElement("a");
        anchor.href = `detail.html?id=${idol.id}`;
        anchor.innerText = idol.name;
        const img = document.createElement("img");
        img.src = `images/icons/icon_${idol.type}.png`;
        img.width = 24;
        img.height = 24;

        const idolRow = tbody.insertRow();
        idolRow.className = idol.type;

        const typeCell = idolRow.insertCell();
        typeCell.className = "attr";
        typeCell.appendChild(img);
        idolRow.insertCell().appendChild(anchor);
        idolRow.insertCell().appendChild(document.createTextNode(joinEpisodeType(idol.episodeTypes)));
        const waitingDaysCell = idolRow.insertCell();
        waitingDaysCell.className = "days";
        waitingDaysCell.appendChild(document.createTextNode(idol.waitingDays));
    });
    divRow.appendChild(newCol);

}

/**
 * アイドル毎のエピソード整理
 */
function getEpisodeSummaryById(id, type, name, episodes, today)
{
    const result = {
        id : id,
        type : type, 
        name : name,
        first : null,
        last : null,
        numberofepisodes : 0,
        waitingDays : 0,
        episodeTypes : []
    };
    const idolEpisodes = episodes.filter(episode=>episode.id==id);
    if(idolEpisodes.length == 0) {
        const releaseDate = new Date("2015/09/03");
        result.waitingDays = Math.trunc((today.getTime() - releaseDate.getTime())/(1000*60*60*24));
        return result;
    }
    const lastEpisode = idolEpisodes.reduce((a, b)=>a.implementationdate>b.implementationdate?a:b);
    const firstEpisode = idolEpisodes.reduce((a, b)=>a.implementationdate<b.implementationdate?a:b);
    const lastEpisodeDay = new Date(lastEpisode.implementationdate);

    result.last = lastEpisode.implementationdate;
    result.first = firstEpisode.implementationdate;
    result.numberofepisodes = idolEpisodes.length;
    result.waitingDays = Math.trunc((today.getTime() - lastEpisodeDay.getTime())/(1000*60*60*24));
    idolEpisodes.forEach(epi=>result.episodeTypes.push(epi.type));

    return result;
}

/**
 * 実装タイプ文字列作成
 */
function joinEpisodeType(types)
{
    const result = [];
    types.forEach(type=>result.push(type.charAt(0)));
    return result.join("");
}
