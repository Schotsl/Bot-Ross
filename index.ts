import { getSettings } from "./helper.ts";

const settings = await getSettings();
const protocols = [];

import { Eagle } from "./protocol/Eagle.ts";
import { Prism } from "./protocol/Prism.ts";
import { Canary } from "./protocol/Canary.ts";

protocols.push(new Eagle(settings));
protocols.push(new Prism(settings));
protocols.push(new Canary(settings));

protocols.forEach(protocol => {
  protocol.initialize();
});
