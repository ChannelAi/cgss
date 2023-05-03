window.onload = function() {
    const today = new Date();
    const typeNames = ["Cute", "Cool", "Passion"];
    const idolProfiles = window.profiles;
    const idolEpisodes = window.episodes;
    //const headerNames = idolProfiles.filter(profile=>profile.id=="0");
    
    const idolList = [];
    idolProfiles.forEach((profile)=>{
        const idolProfile = getEpisodeSummaryById(profile.id, profile.type, profile.name, idolEpisodes, today);
        idolList.push(idolProfile);
    });
    createIdolList(idolList, "#idols");

    setLatestEpisodes(idolEpisodes);

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
 * 
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
 * 
 */
function getLatestEpisodes(idols)
{
    const lastEpisode = idols.reduce((a, b)=>a.implementationdate>b.implementationdate?a:b);
    const lastEpisodeDay = lastEpisode.implementationdate;
    return idols.filter(idol=>idol.implementationdate===lastEpisodeDay);
}

/**
 * 
 */
function createIdolList(idols, targetTableId)
{
    const [headers, ...profiles] = idols;
    const section = document.querySelector(targetTableId);
    profiles.forEach((profile)=>{
        //const detailLink = `detail.html?id=${profile.id}`;
        const anchor = document.createElement("a");
        anchor.href = `detail.html?id=${profile.id}`;
        anchor.innerText = profile.name;
        const img = document.createElement("img");
        img.src = `images/icons/icon_${profile.type}.png`;
        img.width = 24;
        img.height = 24;

        const idolRow = section.insertRow();
        idolRow.className = profile.type;

        const typeCell = idolRow.insertCell();
        typeCell.className = "attr";
        typeCell.appendChild(img);

        idolRow.insertCell().appendChild(anchor);
        const numbersCell = idolRow.insertCell();
        numbersCell.className = "days"
        numbersCell.appendChild(document.createTextNode(profile.numberofepisodes));
        idolRow.insertCell().appendChild(document.createTextNode(joinEpisodeType(profile.episodeTypes)));

        const waitingDaysCell = idolRow.insertCell();
        waitingDaysCell.className = "days";
        waitingDaysCell.appendChild(document.createTextNode(profile.waitingDays));

        idolRow.insertCell().appendChild(document.createTextNode(profile.last));
        //idolRow.insertCell().appendChild(document.createTextNode(profile.first));
    });
}

function setLatestEpisodes(episodes)
{
    const latestEpisodes = getLatestEpisodes(episodes);
    const captionContents = [];
    latestEpisodes.forEach(episode=>captionContents.push(`${episode.episode}${episode.idol}`));
    const captionText = latestEpisodes[0].implementationdate + " " + captionContents.join(",") + " まで反映";

    const caption = document.querySelector("#latestEpisode");
    caption.appendChild(document.createTextNode(captionText));

}

function joinEpisodeType(types)
{
    const result = [];
    types.forEach(type=>result.push(type.charAt(0)));
    return result.join("");
}
