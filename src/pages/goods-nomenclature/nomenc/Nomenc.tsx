import { useState, useEffect } from "react";
import TreeView from "./TreeView";
import axios from "axios";
import styles from "./styles.module.css";
import { useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

type ContextType = {
  setTitle?: Dispatch<SetStateAction<string>>;
};

type TreeNode = {
  id: number;
  code: string | null;
  name: string;
  parentId: number;
  children?: TreeNode[];
};

const fetchChildren = async (key: string, id: number) => {
  const response = await axios.get(`/api/v1/goods?key=${key}&id=${id}`);
  return response.data.data;
};

const fetchInitialData = async () => {
  const response = await axios.get("/api/v1/goods?pageNumber=1&pageSize=15");
  return response.data.data;
};

type NomencProps = {
  onSelect?: (data: string) => void;
};

export default function Nomenc({ onSelect }: NomencProps) {
  const [initialData, setInitialData] = useState<TreeNode[]>([]);

  const context = useOutletContext<ContextType>();
  useEffect(() => {
    context?.setTitle?.("");
  }, [context]);

  useEffect(() => {
    fetchInitialData().then(setInitialData);
  }, []);


  return (
    <div className={styles.wrapper}>
      <TreeView
        data={initialData}
        fetchChildren={fetchChildren}
        onSelect={onSelect}
      />
    </div>
  );
}
