storageProxy = {config:{}, data:[]}
openTrigger()
storage('read')

// Watch for changes & apply them
chrome.storage.onChanged.addListener((changes, area) => {
    console.log(`storage changed`, changes)
    const vals = changes['nextUp']['newValue']
    storageProxy = vals
    openMenu()
})

function openTrigger() {
    const trigger = document.createElement("div")
    trigger.id = "trigger-nextup"
    trigger.innerHTML = "Next Up"
    trigger.addEventListener('click', ()=>openMenu())
    document.body.appendChild(trigger)
}

function openMenu() {
    console.log(`menu opened`)
    const trigger = document.querySelector('#trigger-nextup')
    if(trigger) trigger.remove()
    let popupContainer = document.querySelector('.popupContainer-nextup')
    if(popupContainer) popupContainer.remove() 
    popupContainer = document.createElement('div')
    popupContainer.className = "popupContainer-nextup"
    console.log(storageProxy)
    for(let item of storageProxy['data']) {
        const popupItem = document.createElement('div')
        popupItem.className = "popupItem"
        popupItem.innerHTML = item.linkUrl
        popupContainer.appendChild(popupItem)
    }
    popupClose = document.createElement('div')
    popupClose.className = "popupClose-nextup"
    popupClose.innerHTML = 'x'
    popupContainer.appendChild(popupClose)
    popupClose.addEventListener('click', ()=>closeMenu())
    document.body.appendChild(popupContainer)
}

function closeMenu() {
    const popupContainer = document.querySelector('.popupContainer-nextup')
    if(popupContainer) popupContainer.remove()
    openTrigger()
}

function afterReadStorage(data) {
    console.log(`after`)
    storageProxy = data
}

function storage(action, data) {
    switch(action) {
        case 'read': {
            chrome.storage.local.get(['nextUp'], function(data) {
                if(!data) data = storageProxy
                console.log(`zzzreading`)
                console.log(data)
                afterReadStorage(data['nextUp'])
            })
            break
        }
        case 'add': {
            chrome.storage.local.set({'nextUp': data}, function() {
                console.log('Value is set to ' + data)
            })
            break
        }
    }
}


