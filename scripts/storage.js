export function storage(action, data) {
    switch(action) {
        case 'read': {
            chrome.storage.local.get(['nextUp'], function(data) {
                console.log(`reading storage`)
                console.log(data)
                return data
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