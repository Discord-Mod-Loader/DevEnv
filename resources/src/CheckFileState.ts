import { minify } from "terser";
import { ScanClassFile } from "./utils/ScanClassFile";

export class CheckFileState {

    constructor(file: string) {
        // These methods aren't allowed to be present in any codes as it can be used for bypasses and unwanted runtime executions
        const blackListed = [
            "eval", // Eval on its own isn't that scary, but because I won't be scanning strings I'm not risking it
            "constructor" // Constructor can implement codes during the menu startup which can cause harmful and forced injections
        ];

        // Minify the code
        minify(file).then(({ code }) => {
            // Makes it easier to check without invalid catches
            const codeOnlyFile = code?.replace(/(["'`]).*?\1|\/.*?(?<!\\)\//g, "");

            // What???? no really, WHAT???????????
            if (!codeOnlyFile) {
                return console.error("IDK how you managed this but your code wasn't in the minify output");
            }

            // Just a simple scan which will check if a blacklisted method is used
            if (blackListed.some((word) => new RegExp(word + "\\s{0,}\\(").test(codeOnlyFile))) {
                return console.error("a blacklisted method implementation or usage was used. Read the documentations for more info");
            }

            // Scan the class file to make sure that it's actually a class and only a class
            const { containsClass, isClassOnly } = new ScanClassFile(codeOnlyFile);

            if (!containsClass) {
                return console.error("The code doesn't contain a valid class");
            }

            // Check if the codes only consist of a class and no additional codes
            if (!isClassOnly) {
                return console.error("The code contains more than just a class");
            }

            try {
                // Yes, you see this right, you can eval frontend js in node. why? idfk. am I going to complain about it? no.
                const classObject = eval("new " + code?.replace(/(static\s)?\w+=.*?;/g, ""));

                // Check if the code implements both an enable and disable method
                if (typeof classObject.enable != "function" || typeof classObject.disable != "function") {
                    return console.error("One of the base methods is missing");
                }

                // Check if the base methods don't request too much
                if (classObject.enable.length > 2 || classObject.disable.length > 2) {
                    return console.error("The base methods are requesting too many arguments");
                }
            } catch (error) {
                return console.error(error.message);
            }
        }).catch(console.error);
    }
}