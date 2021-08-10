import { db } from "./lib.js";

export const main = async (body) => {
  let query = await db.collection("entries").find({ verified: true });
  if (body.search) {
    if (
      (await db.collection("entries").find({ userTag: body.search }).count()) >
      0
    ) {
      query = await db
        .collection("entries")
        .find({ verified: true, userTag: body.search });
    } else if (
      (await db
        .collection("entries")
        .find({ youtubeId: body.search })
        .count()) > 0
    ) {
      query = await db
        .collection("entries")
        .find({ verified: true, youtubeId: body.search });
    } else if (
      (await db.collection("entries").find({ comment: body.search }).count()) >
      0
    ) {
      query = await db
        .collection("entries")
        .find({ verified: true, comment: body.search });
    }
  }
  const dbComments = await query
    .sort({ time: -1 })
    .skip(body.start)
    .limit(body.count)
    .project({ youtubeId: 1 })
    .toArray();
  let comments = [];
  for (let i in dbComments) {
    comments.push(await getComment(dbComments[i].youtubeId));
  }
  return { comments };
};

const getComment = async (youtubeId) => {
  const comment = (
    await db.collection("entries").find({ youtubeId }).toArray()
  )[0];
  const points = await db
    .collection("entries")
    .find({ userId: comment.userId })
    .count();
  return {
    success: true,
    text: comment.comment,
    userName: comment.userTag,
    userImage: comment.avatar,
    userPoints: points,
    image: comment.comment_url,
    link: comment.videoUrl,
  };
};
