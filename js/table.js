window.onload = function() {
    const today = new Date();
    const typeNames = ["Cute", "Cool", "Passion"];
    const voiceTypes = ["Voiced", "UnVoiced"];
    const episodeTypes = ["Permanent", "Limited", "Blanc", "Noir", "PermanentOFF", "LimitedOFF", "BlancOFF", "NoirOFF"];
    const idolProfiles = window.profiles;
    const idolEpisodes = window.episodes;
    
    const idolList = [];
    idolProfiles.forEach((profile)=>{
        const idolProfile = getEpisodeSummaryById(profile.id, profile.type, profile.name, idolEpisodes, today);
        idolProfile["cv"] = profile.cv;
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
        const box = document.querySelector(id);
        box.addEventListener('change', () => {
            updateDisplay();
        });
    });
    
    voiceTypes.forEach(typeName=>{
        const id = "#check" + typeName;
        const box = document.querySelector(id);
        box.addEventListener('change', () => {
            updateDisplay();
        });
    });
    
    episodeTypes.forEach(typeName=>{
        const id = "#check" + typeName;
        const box = document.querySelector(id);
        box.addEventListener('change', () => {
            updateDisplay();
        });
    });
};

/**
 * チェックボックスの状態を見て各行の表示設定を行う
 */
function updateDisplay()
{
    const prefix = "#check";
    const keys = ["Permanent", "Limited", "Blanc", "Noir"];
    const checkBoxes = {
        typeNames :    [{key:"Cute", value:true}, {key:"Cool", value:true}, {key:"Passion", value:true}],
        voiceTypes :   [{key:"Voiced", value:true}, {key:"UnVoiced", value:true}],
        episodeTypes : [{key:"Permanent", value:true}, {key:"Limited", value:true}, {key:"Blanc", value:true}, {key:"Noir", value:true}],
        episodeTypesOFF : [{key:"Permanent", value:true}, {key:"Limited", value:true}, {key:"Blanc", value:true}, {key:"Noir", value:true}]
    };
    // 各チェックボックスの状態を取得する
    checkBoxes.typeNames.forEach(box=>box.value=(document.querySelector(`${prefix}${box.key}`).checked ? true : false));
    checkBoxes.voiceTypes.forEach(box=>box.value=(document.querySelector(`${prefix}${box.key}`).checked ? true : false));
    checkBoxes.episodeTypes.forEach(box=>box.value=(document.querySelector(`${prefix}${box.key}`).checked ? true : false));
    checkBoxes.episodeTypesOFF.forEach(box=>box.value=(document.querySelector(`${prefix}${box.key}OFF`).checked ? true : false));

    // 各行の表示設定を行う
    checkBoxes.typeNames.forEach(typeName=>{
        const shortName = typeName.key.substring(0, 2);
        // 一旦全て非表示にする
        const hideRows = document.querySelectorAll('.' + shortName);
        hideRows.forEach(row=>row.style.display = "none");
        if(typeName.value) {
            checkBoxes.voiceTypes.forEach(voiceTypeName=>{
                if(voiceTypeName.value) {
                    let baseClassName = `.${shortName}.${voiceTypeName.key}`;
                    let viewClassName = "";
                    keys.forEach(key=>{
                        const targetType = checkBoxes.episodeTypes.filter(type=>type.key===key)[0].value;
                        const targetTypeOff = checkBoxes.episodeTypesOFF.filter(type=>type.key===key)[0].value;
                        if(targetType != targetTypeOff) {
                            if(targetType) {
                                viewClassName = viewClassName + `.${key}`;
                            } else {
                                viewClassName = viewClassName + `.Non${key}`;
                            }
                        }
                    });
                    const dispRows = document.querySelectorAll(baseClassName + viewClassName);
                    dispRows.forEach(row=>row.style.display = "table-row");
                }
            });
        }
    });
}

/**
 * SSR枚数別表の作成
 */
function createIdolListByNumbers(idols, divRow, divCol, divColId, numberofssr)
{
    const prefixNone = "Non";
    const episodeTypeNames = [{name:"恒常", class:"Permanent"}, {name:"期間限定", class:"Limited"}, {name:"ブラン限定", class:"Blanc"}, {name:"ノワール限定", class:"Noir"}];
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
        const epTypes = [...new Set(idol.episodeTypes)];
        const episodeClass = [];
        const nonEpisodeClass = [];
        episodeTypeNames.forEach(epTypeName=>epTypes.includes(epTypeName.name)?episodeClass.push(epTypeName.class):nonEpisodeClass.push(`${prefixNone}${epTypeName.class}`));
        const rowClassName = `${idol.type} ${idol.cv == '-' ? 'UnVoiced' : 'Voiced'} ${episodeClass.join(" ")} ${nonEpisodeClass.join(" ")}` ;

        const idolRow = tbody.insertRow();
        idolRow.className = rowClassName;

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

