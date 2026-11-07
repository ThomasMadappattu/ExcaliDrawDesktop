const { execFileSync } = require("child_process");
const path = require("path");

// Ad-hoc sign the macOS app so Apple Silicon doesn't report it as "damaged".
exports.default = async function (context) {
  if (context.electronPlatformName !== "darwin") return;
  const app = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`,
  );
  execFileSync("xattr", ["-cr", app], { stdio: "inherit" });
  execFileSync("codesign", ["--force", "--deep", "--sign", "-", app], {
    stdio: "inherit",
  });
};
