let storageProxy = {config:{}, data:[]}

chrome.runtime.onInstalled.addListener(async () => {
    console.log(`init`)
    chrome.contextMenus.create({
        id: '0',
        title: 'Next up',
        type: 'normal',
        contexts: ['link'],
    })
    chrome.contextMenus.onClicked.addListener(
        handleOnclick
    )

    // chrome.storage.onChanged.addListener((changes, area) => {
    //     const vals = changes['nextUp']['newValue']
    //     storageProxy = vals 
    //     console.log(`storage changed in background.js`, changes, storageProxy)
    // })
    storage('read')
    //storage('update', {config:{}, data:[]})
});

function handleOnclick(data) {
    console.log(`clicked`, data, storageProxy)
    storageProxy.data.push(data)
    //add to local storage
    storage('update', storageProxy)
    //storage('read')
}



function storage(action, data) {
    switch(action) {
        case 'read': {
            chrome.storage.local.get(['nextUp'], function(data) {
                console.log(`reading storage`)
                console.log(data['nextUp'])
                storageProxy = data['nextUp']
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