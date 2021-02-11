# devEnv

This is a custom environment designed to be optimal for developing mods for the Discord Mod Menu. It comes with a packing system and a file verification system.

## Requirements

- NodeJS v14+
- TypeScript v4+

## How to prepare the environment

Before you can use this environment you first have to compile the resources. You'll need the [requirements](#Requirements) before doing this. All commands are designed to be ran once your terminal is targeting the environment directory.

### Linux

1. Make the script runnable: `chmod +x compile.sh`.
2. Execute the compile script: `sh compile.sh`.

### Windows CMD

1. Enable `Windows Subsystem for Linux` on your Windows OS.
2. Execute the compile script: `bash compile.sh`.

### Windows Powershell

1. Execute the compile script: `./compile.sh`.

## How to make a mod

Make a new directory called `mod`. In this directory make a file called `ModClass.js` and paste the following code into it:

```js
class ModClass {

    enable(uuid, authKey) {

    }

    disable(uuid, authKey) {

    }
}
```

The class name can be changed but it's recommended to use the programming standard of having the same class name as the file itself.

After you've made this you can start writing mods in the provided methods using frontend javascript. It's recommended to refer to the [docs](discord.me/docs) for more info about using the provided utilities and getting your mod verified.

## How to pack and verify your mod

After you've finished writing your mod you can bundle all the imports into a singular class and verify if the mod is compatible. This is possible by using the same method as [compiling](#How-to-prepare-the-environment) but instead of using `compile.sh` use `pack.sh`. It's highly recommend that you verify your mod even if you don't need to pack it, just to make sure that it won't be instantly denied by the API or the moderation team.

### Verify process

The mod verifier will make sure that your mod is compatible with the menu. Note that this verify process is not a 1:1 replica of the server side due to security reasons. The server has a few extra checks which shouldn't affect you unless you try to bypass certain checks. It will check:

- That the code can be minified by [terser](https://www.npmjs.com/package/terser)
- That the code doesn't implement or use any of the blacklisted methods
- That the codes only contains a mod class
- That the mod class implements `enable(uuid, authKey)` and `disable(uuid, authKey)`
- That the enable and disable methods don't attempt requesting more than 2 arguments

### Debugging

After running the packing script shell will automatically dump the logs to the `pack-log.txt` file. This file will hold info regarding any problems within your script. If the error seems to originate from within the pack code it's highly encouraged to make an issue on the [GitHub](https://github.com/Discord-Mod-Loader/devEnv/issues) repository.

### Options

The packing process comes with a few options to make sure that you can use the environment as you wish. You can add this file by making a file called `options.json` in the main directory. You can add the following entries to this file:

- `path` (string): The input path
- `mainFile` (string): The base mod class file
- `outPath` (string): The output path for your packed project
- `outFile` (string): The file your packed project has to be written to
- `warnings` (boolean): If the packing process should output any warnings to the logs
- `optimize` (boolean): If the output should be run through [terser](https://www.npmjs.com/package/terser)
