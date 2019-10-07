import * as Auth from './authAPI';
import * as Core from './coreAPI';
import * as Content from './contentAPI';

// Defines a single library that contains all API methods
const Lumi = { ...Auth, ...Core, ...Content };
export default Lumi;