window.onload = function() {
    const today = new Date();
    const typeNames = ["Cute", "Cool", "Passion"];
    const voiceTypes = ["Voiced", "UnVoiced"];
    const episodeTypes = ["Permanent", "Limited", "Blanc", "Noir"];
    const idolProfiles = window.profiles;
    const idolEpisodes = window.episodes;
    //const headerNames = idolProfiles.filter(profile=>profile.id=="0");

    createSSRList(idolEpisodes, idolProfiles, "#episodes");

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
        episodeTypes : [{key:"Permanent", value:true}, {key:"Limited", value:true}, {key:"Blanc", value:true}, {key:"Noir", value:true}]
    };
    // 各チェックボックスの状態を取得する
    checkBoxes.typeNames.forEach(box=>box.value=(document.querySelector(`${prefix}${box.key}`).checked ? true : false));
    checkBoxes.voiceTypes.forEach(box=>box.value=(document.querySelector(`${prefix}${box.key}`).checked ? true : false));
    checkBoxes.episodeTypes.forEach(box=>box.value=(document.querySelector(`${prefix}${box.key}`).checked ? true : false));

    // 各行の表示設定を行う
    checkBoxes.typeNames.forEach(typeName=>{
        const shortName = typeName.key.substring(0, 2);
        // 一旦全て非表示にする
        const hideRows = document.querySelectorAll('.' + shortName);
        hideRows.forEach(row=>row.style.display = "none");
        if(typeName.value) {
            checkBoxes.voiceTypes.forEach(voiceTypeName=>{
                if(voiceTypeName.value) {
                    checkBoxes.episodeTypes.forEach(epTypeName=>{
                        if(epTypeName.value) {
                            let viewClassName = `.${shortName}.${voiceTypeName.key}.${epTypeName.key}`;
                            const dispRows = document.querySelectorAll(viewClassName);
                            dispRows.forEach(row=>row.style.display = "table-row");
                        }
                    });
                    

                }
            });
        }
    });
}

/**
 * SSR一覧の作成
 */
function createSSRList(episodes, profiles, targetTableId)
{
    const episodeTypeNames = [{name:"恒常", class:"Permanent"}, {name:"期間限定", class:"Limited"}, {name:"ブラン限定", class:"Blanc"}, {name:"ノワール限定", class:"Noir"}];
    const section = document.querySelector(targetTableId);

    episodes.forEach((episode)=>{
        const episodeIdolProfile = profiles.filter((profile)=>{return profile.id==episode.id})[0];
        const detailLink = `detail.html?id=${episode.id}`;
        const imgUrl = `images/icons/icon_${episodeIdolProfile.type}.png`;
        const iconSize = 24;

        const anchor = document.createElement("a");
        anchor.href = detailLink;
        anchor.innerText = episode.idol;
        const img = document.createElement("img");
        img.src = imgUrl;
        img.width = iconSize;
        img.height = iconSize;

        //const rowClassName = "";
        const episodeTypeName = episodeTypeNames.filter((epTypeName)=>{return episode.type===epTypeName.name})[0];
        const rowClassName = `${episodeIdolProfile.type} ${episodeIdolProfile.cv == '-' ? 'UnVoiced' : 'Voiced'} ${episodeTypeName.class}`;

        const episodeRow = section.insertRow(0);
        episodeRow.className = rowClassName;

        const impDateCell = episodeRow.insertCell();
        impDateCell.appendChild(document.createTextNode(episode.implementationdate));

        const attrCell = episodeRow.insertCell();
        attrCell.className = "attr";
        attrCell.appendChild(img);

        const typeCell = episodeRow.insertCell();
        typeCell.appendChild(document.createTextNode(episode.type));

        const episodeNameCell = episodeRow.insertCell();
        episodeNameCell.appendChild(document.createTextNode(episode.episode));

        const idolNameCell = episodeRow.insertCell();
        idolNameCell.appendChild(anchor);
    });
}
