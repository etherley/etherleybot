require('module-alias/register')
require('dotenv').config()

import WalletCommandTest from '@test/command/WalletCommandTest';
import VaultContractTest from '@test/contract/VaultContractTest';

(new WalletCommandTest()).run();
(new VaultContractTest()).run();
