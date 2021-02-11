import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { minify } from "terser";
import { CheckFileState } from "./CheckFileState";
import { ConstructImports } from "./ConstructImports";
import { Options } from "./interfaces/Options";

class Pack {

    constructor() {
        const optionsPath = join("../", "options.json");
        const options: Options = {
            path: "./mod",
            mainFile: "ModClass.js",
            outPath: ".",
            outFile: "PackedMod.js",
            warnings: true,
            optimize: true
        };

        if (existsSync(optionsPath)) {
            try {
                Object.entries(JSON.parse(readFileSync(optionsPath, "utf8")))
                    .filter(([key, value]) => options[key as keyof Options] && 
                        typeof options[key as keyof Options] == typeof value)
                    // @ts-ignore haha nope not gonna fix this bs
                    .forEach(([key, value]) => options[key as keyof Options] = value);
            } catch (error) {
                console.error(error);
            }
        }

        const out = join("../", options.outPath, options.outFile);
        const { file } = new ConstructImports(options);
        
        new CheckFileState(file);

        if (options.optimize) {
            minify(file).then(({ code }) => {
                writeFileSync(out, code || "");
            }).catch(() => 0); // The file state checker will handle this already
        } else {
            writeFileSync(out, file);
        }
    }
}

new Pack();