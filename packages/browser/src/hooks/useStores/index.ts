import { useContext } from 'react';
import RootStoreContext from 'stores/RootStore';

const useStores = () => useContext(RootStoreContext);

export default useStores;
