import { join, extname } from "path";
import { existsSync, readFileSync } from "fs";
import { ImportDetails } from "./interfaces/ImportDetails";
import CleanCSS from "clean-css";
import { minify } from "html-minifier-terser";
import { DynamicObject } from "./interfaces/DynamicObject";
import { Options } from "./interfaces/Options";

export class ConstructImports {

    public static readonly OPTIMIZERS: DynamicObject<(content: string) => string> = {
        css: (content: string) => new CleanCSS().minify(content).styles,
        json: (content: string) => JSON.stringify(JSON.parse(content)),
        html: (content: string) => minify(content, {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        })
    }

    public readonly file: string;

    public readonly importDetails: ImportDetails[] = [];
    
    constructor({ path, mainFile, optimize, warnings }: Options) {
        const regex = /(?<!\/\/|\/\*.*?)constructImport\((['"`])((?:.(?!(?<!\/\/|\/\*)\1))*.?)\1\)/;
        let fileInfo = readFileSync(join("../", path, mainFile), "utf8");
        let parse: RegExpExecArray | null;

        if (warnings && !optimize) {
            console.warn("Unoptimized codes won't be verified as it's inefficient!");
        }

        while (parse = regex.exec(fileInfo)) {
            const details = {
                literal: parse[0],
                quote: parse[1],
                arg: parse[2],
                contents: "",
                valid: false
            };
            const importPath = join("../", path, details.arg);
            const fileType = extname(importPath).slice(1);

            if (existsSync(importPath)) {
                details.contents = readFileSync(importPath, "utf8");

                if (ConstructImports.OPTIMIZERS[fileType] && optimize) {
                    try {
                        details.contents = ConstructImports.OPTIMIZERS[fileType](details.contents);
                    } catch(error) {
                        console.error(error);
                    }
                }

                if (!/^js(on)?$/.test(fileType)) {
                    details.contents = "`" + details.contents.replace(/`/g, `\\${details.quote}`) + "`";
                }

                details.valid = true;
            } else if (warnings) {
                console.warn("%s is not a valid file path! replacing it with an empty string instead", importPath);
            }

            fileInfo = fileInfo.replace(details.literal, details.contents);
            this.importDetails.push(details);
        }

        this.file = fileInfo;
    }
}