import Auth from './authAPI';
import Core from './coreAPI';
import Content from './contentAPI';

// Defines a single library that contains all API methods
const Lumi = { ...Auth, ...Core, ...Content };
export default Lumi;