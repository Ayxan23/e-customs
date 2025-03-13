import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

type ContextType = {
  setTitle: Dispatch<SetStateAction<string>>;
};

const ValueClass: React.FC = () => {
  const { setTitle } = useOutletContext<ContextType>();
  useEffect(() => setTitle("Rəqəmsal dəyər təsnifatı"), [setTitle]);

  return <div>ValueClass</div>;
};

export default ValueClass;
