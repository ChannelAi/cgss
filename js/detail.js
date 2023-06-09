window.onload = function() {
    const [headerNames, ...idolProfiles] = window.profiles;
    const idolEpisodes = window.episodes;
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const test = params.get("id");
    const selectedIdolId = test;
    const selectedIdol = idolProfiles.filter(profile=>profile.id===selectedIdolId);
    const selectedIdolEpisodes = idolEpisodes.filter(episode=>episode.id===selectedIdolId);
    if(selectedIdol.length < 1) {
        return;
    }
    createIdolProfileTable(headerNames, selectedIdol[0]);
    createEpisodesList(selectedIdolEpisodes, selectedIdol[0].implementationdate);
};

/**
 * プロフィール表を作成
 */
function createIdolProfileTable(columnInfo, idol)
{
    const name = document.querySelector("#idolName");
    name.appendChild(document.createTextNode(idol.name));

    const section = document.querySelector("#profile");
    const ageRow = section.insertRow();
    createProfileRow(ageRow, `${columnInfo.age} / ${columnInfo.birthplace}`, idol.age, idol.birthplace);
    const birthRow = section.insertRow();
    createProfileRow(birthRow, `${columnInfo.birthday} / ${columnInfo.zodiacsign}`, idol.birthday, idol.zodiacsign);    
    const row1 = section.insertRow();
    createProfileRow(row1, `${columnInfo.height} / ${columnInfo.weight}`, chcekDataType(idol.height, `${idol.height}cm`), chcekDataType(idol.weight, `${idol.weight}kg`));
    const row2 = section.insertRow();
    createProfileRow(row2, `${columnInfo.size}`, `${idol.bust} / ${idol.waist} / ${idol.hip}`, null);
    const row3 = section.insertRow();
    createProfileRow(row3, `${columnInfo.dominanthand} / ${columnInfo.bloodtype}`, idol.dominanthand, idol.bloodtype);
    const row4 = section.insertRow();
    createProfileRow(row4, `${columnInfo.hobby}`, idol.hobby, null);
    const row5 = section.insertRow();
    createProfileRow(row5, `${columnInfo.cv}`, idol.cv, null);
    const row6 = section.insertRow();
    createProfileRow(row6, `${columnInfo.implementationdate}`, idol.implementationdate, null);
}

/**
 * 数値かどうか判定
 */
function chcekDataType(data, data2)
{
    return isNaN(Number(data)) ? data : data2;
}

/**
 * プロフィール行を作成
 */
function createProfileRow(row, title, data1, data2)
{
    row.insertCell().appendChild(document.createTextNode(title));
    if(data2 == null) {
        const cell = row.insertCell();
        cell.colSpan = "2";
        cell.appendChild(document.createTextNode(data1));
    } else {
        row.insertCell().appendChild(document.createTextNode(data1));
        row.insertCell().appendChild(document.createTextNode(data2));
    }
}

/**
 * 実装状況表を作成
 */
function createEpisodesList(episodes, idolImplementationdate)
{
    const table = document.querySelector("#episode");

    const info = {
        prevImpDate : new Date(idolImplementationdate)
    };
    for(const episode of episodes) {
        const upperRow = table.insertRow();
        const impDate = new Date(episode.implementationdate)
        const interval = (impDate - info.prevImpDate) / 86400000;
        info.prevImpDate = impDate;
        upperRow.insertCell().appendChild(document.createTextNode(episode.implementationdate));
        upperRow.insertCell().appendChild(document.createTextNode(episode.rarity));
        upperRow.insertCell().appendChild(document.createTextNode(episode.type));
        const interValCell = upperRow.insertCell();
        interValCell.className = "days";
        interValCell.appendChild(document.createTextNode(interval));
        const nameCell = upperRow.insertCell();
        nameCell.colSpan = 2;
        nameCell.appendChild(document.createTextNode(episode.episode));
    }

}