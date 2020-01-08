const Discord = require('discord.js');
const axios = require('axios');
const{ prefix, token, clientID, clientSecret} = require('./config.json');

const client = new Discord.Client();

client.once('ready',() => {
  console.log('Ready!')
})


client.on('message', message =>{
  //console.log(message.content);

  if (message.content.startsWith(`${prefix}`)){

    if(message.content == (`${prefix}-affix`)){

      const getKeys = async() => {
        return await axios({
          url: 'https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=en'
        })



      }

      (async() => {
      const mythicPlusData = await getKeys()
      const keyData = mythicPlusData.data.affix_details;
      console.log(keyData[0].name)
      console.log(keyData[1].name)
      console.log(keyData[1].name)
      console.log(keyData[3].name)

      var keystoneInfo = new Discord.RichEmbed(keyData);
        keystoneInfo.setColor(0xF37D1B)

        keystoneInfo.setDescription(keyData[0].name + ":\n "+ keyData[0].description + "\n\n" + keyData[1].name + ": \n"+ keyData[1].description  + "\n\n"
                              + keyData[2].name + ": \n"+ keyData[2].description + "\n\n" + keyData[3].name + ": \n"+ keyData[3].description)



      message.channel.send("*" + keyData[0].name + " | " + keyData[1].name + " | "
                            + keyData[2].name + " | " + keyData[3].name + "*")

      message.channel.send(keystoneInfo);
      })()
    }

    else if(message.content == (`${prefix}-help`)){
      if(message.member == 'bojjo'){
      message.channel.send("Go Fuck Yourself")
      }
      else if(message.member == 'Treasures'){
      message.channel.send("Welcome to Chilis!")
      }
      else{
      message.channel.send("Hi! This bot is currently under development and more features are being added. \n\n" +
      " Current Features: \n>>> **!kw-affix:** \n*displays the current affixes for keystones* \n **!kw-weekly 'Character-Realm':** \n*shows the highest keystone completed by a character for the week*")
      message.channel.send("```If you have trouble or would like to submit feedback, feel free to message MatT#0001 on Discord.```")
      }
    }
    else if(message.content == (`${prefix}-leyv`)){
      message.channel.send("Yea... this is Leyv. We don't **REALLY** know what's wrong with him. ||He's Autistic|| But we love him and keep him anyway.")


    }
    else if(message.content.startsWith(`${prefix}-weekly`)){
      console.log(message.content.replace('!kw-weekly ', ''))
      console.log(message.content)
      var [character, realm] = message.content.replace('!kw-weekly ', '').split('-')


      const highestKey = async() => {
      return await axios({
          url: `https://raider.io/api/v1/characters/profile?region=us&realm=${realm}&name=${character}&fields=mythic_plus_weekly_highest_level_runs`
        })
        .then(results => {console.log('Sucessful Request')
              return results})
        .catch(error => {console.log('Error retreiving data from API')
        return null})
      }

      (async() => {
      const weeklyKeyData = await highestKey()
      const weeklyHighest = weeklyKeyData;


      console.log(`Checking key for ${character}-${realm}`)
      if (weeklyHighest == null){
        message.channel.send('No character found. Please enter **<Name-Realm>** when using this command.')
      }
      else{
      if(weeklyHighest.data.mythic_plus_weekly_highest_level_runs == "" ){
        console.log("No key done for this character.")
        message.channel.send(`No key completed this week for **${character}-${realm}**`)
      }
      else{


      //START OF OUTPUT
      var weeklyKey = new Discord.RichEmbed(weeklyHighest);
        weeklyKey.setColor(0xF37D1B)

        weeklyKey.setDescription("**" + weeklyHighest.data.mythic_plus_weekly_highest_level_runs[0].dungeon +
                                  " " + weeklyHighest.data.mythic_plus_weekly_highest_level_runs[0].mythic_level + "**\n"
                                      + weeklyHighest.data.mythic_plus_weekly_highest_level_runs[0].affixes[0].name + " "
                                      + weeklyHighest.data.mythic_plus_weekly_highest_level_runs[0].affixes[1].name + " "
                                      + weeklyHighest.data.mythic_plus_weekly_highest_level_runs[0].affixes[2].name + " "
                                      + weeklyHighest.data.mythic_plus_weekly_highest_level_runs[0].affixes[3].name + "\n"
                                      + weeklyHighest.data.mythic_plus_weekly_highest_level_runs[0].url
                                  )

      weeklyKey.setThumbnail(weeklyHighest.data.thumbnail_url)
      //  weeklyKey.setImage('https://cdnassets.raider.io/images/dungeons/the-underrot.jpg')
      weeklyKey.setURL(weeklyHighest.data.mythic_plus_weekly_highest_level_runs[0].url)
      //weeklyKey.setFooter(weeklyHighest.data.mythic_plus_weekly_highest_level_runs[0].url)
      message.channel.send(`Highest Completed Key this week for **${character}-${realm}**`)
      message.channel.send(weeklyKey)
      //END OF OUTPUT



      //end of highest key
    }}
      })()



    }
    else{
      message.channel.send("That's not a valid command. Please type !KW-help for help.")
    }

  }
})

client.login(token);
