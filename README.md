# Google Apps Script template for Habitica
The **GAS Template** is a broadly usable template to create scripts, that are to be used in connection with [Habitica](https://habitica.com/).

It provides users with a simple interface to install, update and deinstall their script - without the need to provide the Web App URL manually or to keep track of the installation status.
On the other hand, it provides various helper functions to script authors and takes care of the most common tasks around Habitica webhooks.
This also ensures reliable and consistent execution among all scripts using this template, since utility functions aren't implemented again and again, but updated on all scripts as soon a issue arises.

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
The installation instructions are given on the [Wiki page](https://habitica.fandom.com/wiki/Habitica_GAS_Template#Installation).

## Usage (as script author)
Assuming you have some experience with scripting within [Google Apps Script](https://script.google.com/), the following steps are way less detailed than the instructions for users.

To start authoring your own script based on the GAS Template, the rough steps are as follows:
* Get a copy of the template
  * either by making a copy via [Google Apps Script](https://script.google.com/d/1iArIctZsLj8IJ5rkKknGn_HaebIXxRPI7nVwQWLgNc2-k50a_L1dwAip/edit?usp=sharing)
  * or by forking the [GitHub](https://github.com/ramotar/habitica-gas-template) repository *(my personal recommendation)*
* Prepare everything for configuration and  installation of your script in `setup.gs`
  * Enter your User ID under `AUTHOR_ID` and enter the name of your script in `SCRIPT_NAME` for the X-Client header
  * Add options and customizations to the top of the script - accompanied by corresponding validations in `validateOptions()`
  * Modify `createTriggers` and `createWebhooks`, adding everything your script will need
* Implement all your functionality in `code.gs`
  * There is an example function `processTrigger()`, that may be used for regularly recurring tasks
  * Webhooks are handled by the `processWebhook()` functions - one for immediate reactions and one for heavy work, that is not time critical

For most applications, this should be more than enough to fulfill all your needs. But feel free to also look under the hood and modify the template, if something special is needed.

## Contributions
Users and authors alike can contribute to this template and a hassle-free script experience for everyone:

|  |  |  |
| :---: | :---: | --- |
| :lady_beetle: | [Issues](https://github.com/ramotar/habitica-gas-template/issues) | If you detect an issue, feel free to raise it |
| :grey_question: | [Questions](https://github.com/ramotar/habitica-gas-template/discussions/categories/q-a) | Any questions you have, are welcome |
| :bulb: | [Suggestions](https://github.com/ramotar/habitica-gas-template/discussions/categories/suggestions) | I will be happy to discuss your suggestions |

## Acknowledgement
* This template wildly extends the capabilities of the [Streamlined Event-Driven (Webhook) Script Template](https://habitica.fandom.com/wiki/Streamlined_Event-Driven_(Webhook)_Script_Template)
* Most of the code was inspired by [bumbleshoot](https://github.com/bumbleshoot)'s [Automate Habitica](https://github.com/bumbleshoot/automate-habitica), thank you for paving the way :heart:
