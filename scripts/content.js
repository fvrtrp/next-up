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
    if(storageProxy['data'].length===0) {
        const popupNoData = document.createElement('div')
        popupNoData.className = "popupNoData-nextup"
        popupNoData.innerHTML = "Right click on links to see them here xoxo."
        popupContainer.appendChild(popupNoData)
    }
    else {
        const goNext = document.createElement('div')
        goNext.innerText = 'Next'
        goNext.addEventListener('click', () => playNext())
        popupContainer.appendChild(goNext)
        for(let item of storageProxy['data']) {
            const popupItem = document.createElement('div')
            popupItem.className = "popupItem-nextup"
            const popupDelete = document.createElement('div')
            popupDelete.className = "popupDelete"
            popupDelete.innerHTML = 'x'
            popupDelete.addEventListener('click', ()=>deleteItem(item.id))
            popupItem.innerHTML = item.linkUrl
            // const go = document.createElement('div')
            // go.innerText = 'go'
            // go.addEventListener('click', ()=>deleteItem(item.id))
            // popupItem.appendChild(go)
            popupItem.appendChild(popupDelete)
            popupContainer.appendChild(popupItem)
        }
    }
    popupClose = document.createElement('div')
    popupClose.className = "popupClose-nextup"
    popupClose.innerHTML = 'x'
    popupContainer.appendChild(popupClose)
    popupClose.addEventListener('click', ()=>closeMenu())
    document.body.appendChild(popupContainer)
}

function playNext() {
    const firstItem = storageProxy.data.shift()
    storage('update', storageProxy)
    window.location.href = firstItem.linkUrl
}

function deleteItem(id) {
    const newItems = storageProxy.data.filter(i => i.id !== id)
    const newData = {...storageProxy, data: newItems}
    storage('update', newData)
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
        case 'update': {
            chrome.storage.local.set({'nextUp': data}, function() {
                console.log('Value is set to ' + data)
            })
            break
        }
    }
}


