
class IconUI {

    constructor() {
        this.disableIcon = 'disable.png';
        this.enableIcon = 'enable.png';
        this.disableTitle = 'Paste Pro is Disabled';
        this.enableTitle = 'Paste Pro is Enabled';
    } 
    
    setTitle(title) {
        chrome.browserAction.setTitle({
            title:title
        })
    }

    setIcon(path) {
        chrome.browserAction.setIcon({
            path:path
        })
    }

    sendMessage(tabId,isEnabled) {
        chrome.tabs.sendMessage(tabId,{
            isEnabled : isEnabled
        })
    }

}



let active = false;
    let tabs = []; 

const UI = new IconUI;
chrome.browserAction.onClicked.addListener((currentTab)=>{

    

    const tab = {};
    tab.id = currentTab.id;
    if(!active) {
        tab.isInjected = true;
        active = true;
        UI.setIcon(UI.enableIcon);
        UI.setTitle(UI.enableTitle);
        UI.sendMessage(currentTab.id,active);
    }
    else {
        tab.isInjected = false;
        active = false;
        UI.setIcon(UI.disableIcon);
        UI.setTitle(UI.disableTitle);
        UI.sendMessage(currentTab.id,active);
    }

    tabs.forEach((value,index)=>{
        if(value.id===currentTab.id) {
            tabs.splice(index,1);
            return true;
        }
    })

    tabs.push(tab);
});
  

chrome.tabs.onActivated.addListener((newTab)=>{
    active = false;
    UI.setIcon(UI.disableIcon);
    UI.setTitle(UI.disableTitle);
        
    tabs.forEach((value,index)=>{
        if(value.id===newTab.tabId && value.isInjected) {
            active = true;
            value.isInjected = true;
            UI.setTitle(UI.enableTitle);
            UI.setIcon(UI.enableIcon);
            return true;
        }
    })
}) 

chrome.runtime.onMessage.addListener((response,sender)=>{

    if(response.refresh==="yes") {
        active = false;
        UI.setIcon(UI.disableIcon);
        UI.setTitle(UI.disableTitle);
        tabs.forEach((value,index) =>{
            if(value.id===sender.tab.id) {
                tabs.splice(index,1);
                return true;
            }
        })
    }
})


chrome.tabs.onUpdated.addListener((currentTabId)=>{
        active = false;
        UI.setIcon(UI.disableIcon);
        UI.setTitle(UI.disableTitle);
        tabs.forEach((value,index) =>{
            if(value.id===currentTabId) {
                tabs.splice(index,1);
                return true;
            }
        })
})