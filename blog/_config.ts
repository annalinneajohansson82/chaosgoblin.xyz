import lume from "lume/mod.ts";
import blog from "blog/mod.ts";
import sass from "lume/plugins/sass.ts";
import unocss from "lume/plugins/unocss.ts";

const site = lume();

site.use(blog());
site.use(sass());
site.use(unocss({ cssFile: "uno.css" }));

// The blog theme registers a remote styles.css; our styles.scss compiles to the
// same output path. Remove the remote registration so ours is the sole source.
// deno-lint-ignore no-explicit-any
(site as any).fs.remoteFiles.delete("/styles.css");

site.add("styles.scss");
site.copy("fonts");
site.copy("chaos_inc.png");

export default site;
