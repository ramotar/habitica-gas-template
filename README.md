# Google Apps Script template for Habitica
The **GAS Template** is a broadly usable template to create scripts, that are to be used in connection with [Habitica](https://habitica.com/).

It provides users with a simple interface to install, update and deinstall their script - without the need to provide the Web App URL manually or to keep track of the installation status. On the other hand, it provides various helper functions to script authors and takes care of the most common tasks around Habitica webhooks. This also ensures reliable and consistent execution among all scripts using this template, since utility functions aren't implemented again and again, but updated on all scripts as soon a issue arises. 

## Features
**For users:**
* simplified installation procedure
* visual interface for script maintenance (installation, updating, deinstallation)

**For script authors:**
* pre-written section for user options and customizations
* pre-formed functions for option validation and installation of triggers / webhooks
* ready-to-use functions for webhook and trigger processing
* API functions handling caching, rate limiting and error detection
* numerous utility functions for common actions
* improved logging capabilities 

## Installation
The following installation instructions are valid for all scripts using the GAS Template

### Getting the script
The first step is to get the source code of the script into your personal account:

1. Go to the site of the script you want to install on [Google Apps Script](https://script.google.com/). The author will provide you with the corresponding link.
2. If you're not already signed in to your Google Account, you will be asked to sign in.
3. In the main menu on the left, click on "Overview" (looks like  :information_source:  in a circle).
4. On the upper right hand side, click on "Make a copy" (looks like two sheets of paper).
5. At the top of the following screen, remove "Copy of ..." from the name of your script.

### Configuring the script
Congratulations, you made is this far. Next we configure your script:

1. Open the file *setup.gs* on the left of your script.
2. Go to the [Site Data](https://habitica.com/user/settings/siteData) in your Habitica settings.
3. Copy your User ID and replace `PasteYourUserIdHere` in *setup.gs* with your User ID. It should now look something like this: `const USER_ID = "12345678-90ab-cdef-1234-567890abcdef";`.
4. Back on [Site Data](https://habitica.com/user/settings/siteData) in your Habitica settings, reveal your API Token by clicking `Learn more` behind it.
5. Copy your personal API Token and replace `PasteYourApiTokenHere` in *setup.gs* with your API Token. It should now look something like this: `const API_TOKEN = "12345678-90ab-cdef-1234-567890abcdef";`.
6. Look at all the other customizations and options provided by the script author in *setup.gs*. Feel free to change them according to your needs. But take care, that you only edit in between `=` and `;` and make sure to keep all quotations `"`.
7. In the toolbar on the top, click "Save project" (looks like :floppy_disk:) or simply hit `Strg+S`.

### Deploying the script
Your script now has all the necessary code and options to fulfill your wishes. Now to the final step, deploying it:

1. In the upper right corner, click the blue "Deploy" button and select "New deployment".
2. Make sure, the type "Web App" is selected via the "Select type" (looks like :gear:).
3. Check that "Execute as" is set to "Me" and "Anyone" is selected in "Who has access", than hit the "Deploy" button.
5. In the following screen, click the URL listed under "Web app". You should see your script interface.
6. Finally click on "Install" and wait for the action to finish.

If your script status shows as "INSTALLED", you made it and your script is active :tada:

### Resolving errors in the configuration
You made it to the last step, but your script doesn't switch to "INSTALLED"? Than maybe there was as mistake while editing the configuration, let's see:

1. Go back to your script code in Google Apps Script (the tab should still be open next to your script interface).
2. In the main menu on the left, click on "Executions" (looks like three lines with a play button).
3. Search for a line with function name "install" and click it. It should be within the first five lines.
4. You are now provided with the event log of your most recent installation attempt. Check for any errors or warnings and resolve them.
5. After resolving, follow the steps in [Updating options](#updating-options), but click "Install" in the last step.

Assuming you resolved all mistakes, your script status should now be "INSTALLED". If not, repeat this step or ask for help as stated in [Unsolved errors](#unsolved-errors-questions-or-advice).

### Unsolved errors, questions or advice
You can't finish your script installation, have questions regarding the behavior of the script or want some simple advice? Then there are multiple options:

* If the script has a corresponding [GitHub](https://github.com/) page, you can open an Issue or a Discussion on your topic.
* Contact the [Aspiring Comrades](https://discord.com/channels/1136011016682098778/1137120990044897440) on the official Discord channel of Habitica.
* Write an ingame message to the author.

## Updating options
If you want to modify some options of the script, it is a few easy steps:

1. Change the options to your liking in *setup.gs*. Take care, that you only edit in between `=` and `;` and make sure to keep all quotations `"`.
2. In the toolbar on the top, click "Save project" (looks like :floppy_disk:) or simply hit `Strg+S`.
3. In the upper right corner, click the blue "Deploy" button and select "Manage deployments".
4. There should be only one active deployment under "Active". Select it and click the "Edit" button in the upper right corner (looks like a :pen:).
5. Select "New version" under "Version" and hit the "Deploy" button. This will update your existing installation with the new code.
6. Finally open the link under "Web app" and click on the "Update" button. This will recreate all webhooks and triggers (in case any option has an effect on those).

Your script will now run according to your new options!

## Deinstallation
If you don't need the script anymore, follow those easy steps to remove it:

1. Go to your script on [Google Apps Script](https://script.google.com/).
2. In the upper right corner, click the blue "Deploy" button and select "Manage deployments".
3. There should be only one active deployment under "Active". Select it and open the link under "Web app".
4. You should now see your script interface. Click on "Uninstall" and wait for the action to finish.
5. Close the script interface and go back to the "Manage deployments" window (the tab should still be open).
6. Click the "Archive" button in the upper right corner (looks like :inbox_tray:) and confirm by clicking "Archive".

Your script is now inactive and will no longer be executed. For a complete removal from your account, also execute the following steps.

7. Close the "Manage deployments" window by clicking "Done" to get back to your script code.
8. In the main menu on the left, click on "Overview" (looks like  :information_source:  in a circle).
9. On the upper right hand side, click on "Remove project" (looks like :wastebasket:).

## Updating the script
In case the author of the script published a new version of the script and you want to update, the best way is to reinstall your script:

1. Go to your script on [Google Apps Script](https://script.google.com/) and open *setup.gs*.
2. Copy all your options and customizations into a text file for later reference.
3. Follow all the instructions under [Deinstallation](#deinstallation) for a complete removal.
4. Reinstall the script using the instructions under [Installation](#installation).
5. During the [configuration](#configuring-the-script), you can take your options from step 2 as reference.

## Usage (as script author)

## Contributions
