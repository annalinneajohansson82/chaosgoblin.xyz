import lume from "lume/mod.ts";
import blog from "blog/mod.ts";

const site = lume();

site.use(blog());

site.copy("chaos_inc.png");

export default site;
