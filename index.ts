import { PlausibleAPI } from "../Plausible/index.ts";

const api = "nBJZCb0WGNmJ49tI3aEfEUsdu_vci3ZRsN1l4V7VkF2mkBW-p_KM-4W1kHPqAJBi";

const months = [
  'january', 
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
  ];

const sites = [
  {
    change: 0,
    views: 0,
    title: 'Bot-Ross',
    url: 'bot-ross.dev',
  },
  {
    change: 0,
    views: 0,
    title: 'Lxframes',
    url: 'lxframes.com',
  },
  {
    change: 0,
    views: 0,
    title: 'Presently',
    url: 'presently.dev',
  },
  {
    change: 0,
    views: 0,
    title: 'Sjors van Holst',
    url: 'sjorsvanholst.nl',
  },
  {
    change: 0,
    views: 0,
    title: 'Uwuifier',
    url: 'uwuifier.com',
  },
  {
    change: 0,
    views: 0,
    title: 'Wanneer naar Terschelling',
    url: 'wanneer-naar-terschelling.nl',
  }
];

await Promise.all(sites.map(async site => {
  const plausible = new PlausibleAPI(api, site.url);
  const results = await plausible.getAggregate("30d", "pageviews", true);

  site.change = results.change!;
  site.views = results.value;
}));

let views = 0;
let change = 0;

sites.forEach(site => {
  views += site.views;
  change += site.change;
})

console.log(views);
console.log(change);

// console.log(await plausibleAPI.getBreakdown("6mo", "visit:source"));

import { startBot, sendDirectMessage, CreateMessage, Embed, EmbedField } from "https://deno.land/x/discordeno/mod.ts";

startBot({
  token: "NTQ3ODA4MzIxNjg4Njk4ODk3.XG14QQ.fILB1RHa5zotn7sHzFhl68_ghDw",
  intents: ["Guilds", "GuildMessages"],
  eventHandlers: {
    ready() {
      console.log("Successfully connected to gateway");
    },
  },
});


const fields = sites.map(site => {
  return {
    name: site.title,
    value: `**${site.views}** (${site.change}%)`,
  };
});

const date = new Date();
const color = 21;
const title = `Plausible report for ${months[date.getMonth()]}`;
const content = `It's that time of the month again`;
const description = `This month we\'ve generated ${views} views!`;

const message: CreateMessage = {
  content,
  embeds: [{
    color,
    title,
    fields,
    description,
  }],
}

sendDirectMessage(BigInt(219765969571151872), message);