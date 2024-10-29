// Work in progress
const { LoggerUtil } = require('helios-core')

const logger = LoggerUtil.getLogger('DiscordWrapper')

const { Client } = require('discord-rpc-patch')

const Lang = require('./langloader')

let client
let activity

exports.initRPC = function(){
    client = new Client({ transport: 'ipc' })

    activity = {
        details: Lang.queryJS('discord.starting'),
        largeImageKey: "oig",
        largeImageText: "MADE BY TNTVLOGS",
        buttons: [
            { label: "Discord", url: "https://discord.gg/yScnSw7cFt" },
            { label: "HellMC WEBSITE", url: "https://hellmc.sytes.net" }
        ],
        instance: false
    }

    client.on('ready', () => {
        logger.info('Discord RPC Connected')
        client.setActivity(activity)
    })
    
    client.login({clientId: "1187034841716379699"}).catch(error => {
        if(error.message.includes('ENOENT')) {
            logger.info('Unable to initialize Discord Rich Presence, no client detected.')
        } else {
            logger.info('Unable to initialize Discord Rich Presence: ' + error.message, error)
        }
    })
}

exports.updateActivity = function(newActivity){
    const updatedActivity = { ...activity, ...newActivity };
    activity = updatedActivity
    client.setActivity(activity)
}

exports.updateDetails = function(details){
    activity.details = details
    client.setActivity(activity)
}

exports.updateState = function(state){
    activity.state = state
    client.setActivity(activity)
}

exports.shutdownRPC = function(){
    if(!client) return
    client.clearActivity()
    client.destroy()
    client = null
    activity = null
}