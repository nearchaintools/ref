import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from "react";

const ChainContext = createContext(null);

export const useChainStatus = () => useContext(ChainContext);

const ChainProvider = ({ children, dataProvider }) => {
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      // const { data } = await dataProvider.getOne("staking", {
      //   id: "status",
      // });
      const data = [
        { token: "REF", price: 0.45 },
        { token: "NEAR", price: 5.2 },
      ];
      setLoading(false);
      setState((state) => ({
        ...state,
        data,
      }));
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }, [dataProvider]);

  useEffect(() => {
    fetchStatus();
  }, []);

  const chainStatus = useMemo(() => state && state.data, [state, setState]);

  return (
    <ChainContext.Provider value={{ chainStatus }}>
      {children}
    </ChainContext.Provider>
  );
};

export default ChainProvider;
