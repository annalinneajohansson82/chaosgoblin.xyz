import lume from "lume/mod.ts";
import blog from "blog/mod.ts";
import metas from "lume/plugins/metas.ts";

const site = lume({
  location: new URL("https://chaosgoblin.xyz"),
});

site.use(blog());
site.use(metas());

site.copy("chaos_inc.png");
site.copy("favicon.svg");
site.copy("scripts");

export default site;
