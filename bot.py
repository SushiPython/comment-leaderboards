from discord.ext import commands
import discord
import pymongo
import datetime

comment_channel_id = 999

database_username = "dbUser"

db = c.main.entries

prefix = "?"
bot = commands.Bot(command_prefix=prefix)


@bot.event
async def on_ready():
    print("websocket active")

@bot.event
async def on_message(message):
    if message.author.bot: return
    error = False
    content_lines_split = message.content.split('\n')
    if len(content_lines_split) == 1:
        error = True
        error_reason = "Not all data included"
    youtube_url = content_lines_split[0]
    comment_content = content_lines_split[1]
    if db.count_documents({"comment": comment_content}) > 0:
        error = True
        error_reason = "Comment already submitted"
    if len(content_lines_split) == 3:
        image_url = content_lines_split[2]
    elif message.attachments > 0:
        image_url = message.attachments[0].url
    else:
        error = True
        error_reason = "Image not attatched"
    

    if error == True:
        await message.channel.send('Process error, reason: `{error_reason}`')
    else:
        await message.delete()
        embed=discord.Embed(title="Comment Info", description="After 2 verifications, comment will be added")
        embed.add_field(name="User", value=message.author.name, inline=False)
        embed.add_field(name="Comment", value=comment_content, inline=False)
        embed.add_field(name="Video", value=youtube_url, inline=False)
        embed.set_image(url=image_url)
        sent = await message.channel.send(embed=embed)
        await sent.add_reaction('👍')
        db.insert_one({
            "videoUrl": youtube_url,
            "youtubeId": youtube_url[-11:],
            "userTag": f"{message.author.display_name}#{message.author.discriminator}",
            "userId": message.author.id,
            "type": "comment",
            "time": datetime.datetime.now(),
            "messageId": sent.id,
            "verified": False,
            "comment": comment_content
        })
    

@bot.event
async def on_raw_reaction_add(payload):
    if payload.channel_id == comment_channel_id:
        if payload.emoji.name == "👍":
            channel = bot.get_channel(comment_channel_id)
            message = await channel.fetch_message(payload.message_id)
            reaction = discord.get(message.reactions, emoji=payload.emoji.name)
            if reaction and reaction.count >= 2:
                db.update_one({
                    "messageId": message.id
                },
                {"$set": {
                    "verified": True
                }})
                await message.channel.send("Comment verified, thanks!")

