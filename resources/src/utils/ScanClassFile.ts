export class ScanClassFile {

    public readonly containsClass;

    public readonly isClassOnly;

    constructor(file: string) {
        const regex = /[{}]/;
        let parse: RegExpExecArray | null;
        let open = 0;
        let hasOpened = false;

        this.containsClass = /^class\s+\w+\s{0,}{.*}/.test(file);

        while (parse = regex.exec(file)) {
            if (parse[0] == "{") {
                open++;
            } else {
                open--;
            }

            file = file.substring(parse.index + 1);

            if (hasOpened && !open) {
                this.isClassOnly = file.length == 0;

                break;
            } else if (!hasOpened) {
                hasOpened = true;
            }
        }
    }
}