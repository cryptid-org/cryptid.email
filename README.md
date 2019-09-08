# CryptID.email

Identity-based File Encryption using WebAssembly.

## Try it out!

Visit [cryptid.email](http://cryptid.email) if you want to take it for a quick spin!

**IMPORTANT**: As of now, we haven't setup HTTPS yet, therefore, cryptid.email is not suitable for secure use. Also, opening it up in Chrome will result in errors, since Chrome disables the SubtleCrypto API in unsecure environments. Thus, we recommend using Firefox. At the same time, we are actively working on a resolution for this issue.

## Running locally

### 1. Installing the dependencies

First of all, make sure, that you have [Node.js](https://nodejs.org) installed. 

After cloning this repository, simply install the dependencies using npm:

~~~~
npm i
~~~~

### 2. Setting up the server

Before starting up the server, you should set the `NODE_ENV` environment variable to `local`.

Spinning a local instance is now as easy as executing the following command:

~~~~
npm start
~~~~

You may now access the application at the address displayed in the console.
