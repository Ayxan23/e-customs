import styles from "./styles.module.css";
type Props = { title: string; linkTitle: string; url: string };

const Title = ({ title, linkTitle, url }: Props) => {
  return (
    <div className={styles.title}>
      <h2>{title}</h2>
      <p>
        <a href={url} target="_blank">
          {linkTitle}
        </a>
        <span>/</span>
        {title}
      </p>
    </div>
  );
};

export default Title;
