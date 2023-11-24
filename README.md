near-blank-project
==================

This app was initialized with [create-near-app]


Quick Start
===========

If you haven't installed dependencies during setup:

    npm install


Build and deploy your contract to TestNet with a temporary dev account:

    npm run deploy

Test your contract:

    npm test

If you have a frontend, run `npm start`. This will run a dev server.


Exploring The Code
==================

1. The smart-contract code lives in the `/contract` folder. See the README there for
   more info. In blockchain apps the smart contract is the "backend" of your app.
2. The frontend code lives in the `/frontend` folder. `/frontend/index.html` is a great
   place to start exploring. Note that it loads in `/frontend/index.js`,
   this is your entrypoint to learn how the frontend connects to the NEAR blockchain.
3. Test your contract: `npm test`, this will run the tests in `integration-tests` directory.


Deploy
======

Every smart contract in NEAR has its [own associated account][NEAR accounts]. 
When you run `npm run deploy`, your smart contract gets deployed to the live NEAR TestNet with a temporary dev account.
When you're ready to make it permanent, here's how:


Step 0: Install near-cli (optional)
-------------------------------------

[near-cli] is a command line interface (CLI) for interacting with the NEAR blockchain. It was installed to the local `node_modules` folder when you ran `npm install`, but for best ergonomics you may want to install it globally:

    npm install --global near-cli

Or, if you'd rather use the locally-installed version, you can prefix all `near` commands with `npx`

Ensure that it's installed with `near --version` (or `npx near --version`)


Step 1: Create an account for the contract
------------------------------------------

Each account on NEAR can have at most one contract deployed to it. If you've already created an account such as `your-name.testnet`, you can deploy your contract to `near-blank-project.your-name.testnet`. Assuming you've already created an account on [NEAR Wallet], here's how to create `near-blank-project.your-name.testnet`:

1. Authorize NEAR CLI, following the commands it gives you:

      near login

2. Create a subaccount (replace `YOUR-NAME` below with your actual account name):

      near create-account near-blank-project.YOUR-NAME.testnet --masterAccount YOUR-NAME.testnet

Step 2: deploy the contract
---------------------------

Use the CLI to deploy the contract to TestNet with your account ID.
Replace `PATH_TO_WASM_FILE` with the `wasm` that was generated in `contract` build directory.

    near deploy --accountId near-blank-project.YOUR-NAME.testnet --wasmFile PATH_TO_WASM_FILE


Step 3: set contract name in your frontend code
-----------------------------------------------

Modify the line in `src/config.js` that sets the account name of the contract. Set it to the account id you used above.

    const CONTRACT_NAME = process.env.CONTRACT_NAME || 'near-blank-project.YOUR-NAME.testnet'



Troubleshooting
===============

On Windows, if you're seeing an error containing `EPERM` it may be related to spaces in your path. Please see [this issue](https://github.com/zkat/npx/issues/209) for more details.


  [create-near-app]: https://github.com/near/create-near-app
  [Node.js]: https://nodejs.org/en/download/package-manager/
  [jest]: https://jestjs.io/
  [NEAR accounts]: https://docs.near.org/concepts/basics/account
  [NEAR Wallet]: https://wallet.testnet.near.org/
  [near-cli]: https://github.com/near/near-cli
  [gh-pages]: https://github.com/tschaub/gh-pages
  
My idea:
=======

This project is a platform that allows people to ask and answer using near accounts. There are many similar projects running.

But the special thing about this project is that we have a reward system. The system works like this: when you answer a question, your answer can be liked and disliked by others. For each like, 1 point is added to your account. You can use these points to exchange for Near tokens. 100 points for 1 near. This will encourage replies and make users more active.

So what to do when a person uses multiple accounts to spam likes to make money from the project as well as avoid useless answers? I thought about this and I thought it would be great if this was decided by other users. If you see any suspicious signs from the answer, other users can dislike it and cause the spammer to be deducted 10 points. So that's all about my project.

Future:
=======
Error Handling:

    Enhance error handling and provide meaningful error messages. This helps users understand issues when they arise.

Gas Efficiency:

    Optimize gas efficiency. Reducing the computational and storage costs of your contract can lead to lower transaction fees for users.

Security:

    Conduct thorough security audits. Consider potential vulnerabilities and attack vectors, especially in functions that involve transferring tokens.

Data Structures:

    Evaluate the efficiency of data structures. Depending on the access patterns, you might want to choose different data structures or explore ways to minimize storage costs.

Functionality:

    Consider additional functionalities that could enhance the user experience.
    Implement moderation features to handle inappropriate content or abuse.

Versioning:

    Plan for future updates with versioning. This ensures a smooth transition for users when deploying new versions of the contract.

Testing:

    Expand your test coverage. Unit tests and integration tests are crucial to catch potential bugs and ensure that your contract behaves as expected.

Frontend Integration:

    If applicable, improve the integration with the frontend. Ensure a seamless user experience and provide clear feedback.

Community Engagement:

    Foster community engagement. Encourage feedback from users and other developers to identify areas for improvement.

Scalability:

    Assess the scalability of your contract. Consider potential bottlenecks and how your contract might handle increased usage.

Upgradeability:

    Explore upgradeability patterns. While immutability is a principle of many blockchain contracts, there are patterns that allow for certain upgrades.
