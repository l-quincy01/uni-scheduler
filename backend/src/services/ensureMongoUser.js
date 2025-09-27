const { connectMongo } = require("../db/mongo.ts");
const { UserProfile } = require("../models/User.ts");

async function ensureMongoUserProfile(sqlUser, profileData = {}) {
  await connectMongo();

  const DEFAULT_AVATAR =
    "https://preview.redd.it/the-new-discord-default-profile-pictures-v0-uqvmqo1cdj7f1.png?width=1024&auto=webp&s=6c1ac3264c8febf1eb3d2bdd0534eef83f2b94f3";

  const update = {
    $setOnInsert: {
      sqlUserId: sqlUser.id,
      email: sqlUser.email,

      avatarUrl:
        profileData.avatarUrl !== undefined
          ? profileData.avatarUrl
          : DEFAULT_AVATAR,
    },
  };

  const set = {};
  if (profileData.firstName !== undefined)
    set.firstName = profileData.firstName;
  if (profileData.lastName !== undefined) set.lastName = profileData.lastName;
  if (profileData.phone !== undefined) set.phone = profileData.phone;
  if (profileData.school !== undefined) set.school = profileData.school;
  if (profileData.avatarUrl !== undefined)
    set.avatarUrl = profileData.avatarUrl;
  if (profileData.email !== undefined) set.email = profileData.email;

  if (Object.keys(set).length > 0) {
    update.$set = set;
  }

  await UserProfile.updateOne({ sqlUserId: sqlUser.id }, update, {
    upsert: true,
  });
}

module.exports = { ensureMongoUserProfile };
